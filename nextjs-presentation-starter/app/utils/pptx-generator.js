/**
 * Generate a PowerPoint presentation from chat data using the backend API
 * @param {Object} chatData - The chat data containing messages and presentation info
 * @param {string} title - The presentation title
 * @returns {Promise<Blob>} - The generated PPTX file as a blob
 */
export async function generatePPTX(chatData, title = 'Generated Presentation') {
  try {
    // Extract slides from chat data
    const slides = extractSlidesFromChat(chatData);
    
    // Create presentation data structure
    const presentationData = {
      title,
      subtitle: 'Generated from AI Chat',
      slides,
      theme: 'professional'
    };
    
    // Call the backend API
    const response = await fetch('/api/generate-pptx', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(presentationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate presentation');
    }
    
    // Return the blob directly from the response
    return await response.blob();
    
  } catch (error) {
    console.error('Error generating PPTX:', error);
    throw new Error(`Failed to generate presentation: ${error.message}`);
  }
}

/**
 * Generate a demo presentation with default content
 * @returns {Promise<Blob>} - The generated PPTX file as a blob
 */
export async function generateDemoPresentation() {
  const demoData = {
    messages: [
      {
        role: 'user',
        content: 'Create a presentation about renewable energy'
      },
      {
        role: 'assistant',
        content: 'Here\'s a presentation about renewable energy:\n\n**Slide 1: Introduction**\n- What is renewable energy?\n- Why it matters\n- Types of renewable sources\n\n**Slide 2: Solar Energy**\n- How solar panels work\n- Benefits and applications\n- Current market trends'
      }
    ]
  };
  
  return generatePPTX(demoData, 'Renewable Energy Overview');
}

/**
 * Extract slide content from chat messages
 * @param {Object} chatData - The chat data
 * @returns {Array} - Array of slide objects
 */
function extractSlidesFromChat(chatData) {
  const slides = [];
  
  if (!chatData.messages || !Array.isArray(chatData.messages)) {
    return slides;
  }
  
  // Process assistant messages for slide content
  chatData.messages.forEach(message => {
    if (message.role === 'assistant' && message.content) {
      const slideMatches = message.content.match(/\*\*Slide \d+:([^*]+)\*\*([^*]*)/g);
      
      if (slideMatches) {
        slideMatches.forEach(match => {
          const titleMatch = match.match(/\*\*Slide \d+:([^*]+)\*\*/);
          const contentMatch = match.match(/\*\*[^*]+\*\*([^*]*)/);;
          
          if (titleMatch) {
            const title = titleMatch[1].trim();
            const content = contentMatch ? contentMatch[1].trim().split('\n').filter(line => line.trim()) : [];
            
            slides.push({
              title,
              content
            });
          }
        });
      }
    }
  });
  
  return slides;
}