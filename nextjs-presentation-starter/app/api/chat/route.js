import OpenAI from 'openai';
import { NextResponse } from 'next/server';

// Primary OpenRouter client
const openrouter = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
});

// Fallback OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_FALLBACK_API_KEY,
  baseURL: "https://api.openai.com/v1",
});

const SYSTEM_PROMPT = `You are an expert presentation assistant. Help users create compelling presentations by:

1. Understanding their topic, audience, and goals
2. Suggesting structure, content, and key points
3. Refining ideas through conversation
4. When they're satisfied, provide a JSON structure

When the user is ready to generate their presentation, respond with JSON in this EXACT format:

{
  "title": "Main Presentation Title",
  "subtitle": "Subtitle or tagline",
  "slides": [
    {
      "title": "Slide 1 Title",
      "content": ["Key point 1", "Key point 2", "Key point 3"]
    },
    {
      "title": "Slide 2 Title", 
      "content": ["Another point", "Supporting detail", "Call to action"]
    }
  ],
  "theme": "professional",
  "ready": true
}

Theme options: "professional", "creative", "academic", "minimal"

Only include the JSON when the user explicitly agrees to generate the presentation. Before that, have a natural conversation to understand their needs.`;

async function tryCompletion(client, model, messages) {
  return await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages
    ],
    temperature: 0.7,
    max_tokens: 500,
  });
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    let completion;
    let usedFallback = false;
    
    try {
      // Try OpenRouter first
      completion = await tryCompletion(openrouter, "gpt-4", messages);
    } catch (openrouterError) {
      console.log('OpenRouter failed, trying OpenAI fallback:', openrouterError.message);
      
      // Fallback to OpenAI
      try {
        completion = await tryCompletion(openai, "gpt-4", messages);
        usedFallback = true;
      } catch (openaiError) {
        console.error('Both OpenRouter and OpenAI failed:', {
          openrouter: openrouterError.message,
          openai: openaiError.message
        });
        throw openaiError; // Throw the OpenAI error for handling below
      }
    }

    const response = completion.choices[0].message.content;
    
    // Try to extract JSON if present
    let presentationData = null;
    try {
      // Look for JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*?\}/g);
      if (jsonMatch) {
        // Try to parse the last JSON object found
        const lastJson = jsonMatch[jsonMatch.length - 1];
        const parsed = JSON.parse(lastJson);
        
        // Validate that it has the required structure
        if (parsed.ready && parsed.title && parsed.slides && Array.isArray(parsed.slides)) {
          presentationData = parsed;
        }
      }
    } catch (e) {
      // JSON parsing failed, continue without presentation data
      console.log('No valid JSON found in response');
    }
    
    return NextResponse.json({ 
      message: response, 
      presentationData,
      apiUsed: usedFallback ? 'OpenAI' : 'OpenRouter'
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json(
        { error: 'API quota exceeded. Please check your billing for both OpenRouter and OpenAI.' },
        { status: 429 }
      );
    }
    
    if (error.code === 'invalid_api_key') {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your OpenRouter and OpenAI API key configuration.' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process chat request. Both OpenRouter and OpenAI APIs are unavailable.' },
      { status: 500 }
    );
  }
}
