'use client';

import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  ChartBarIcon, 
  LightBulbIcon,
  PresentationChartLineIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function QuickActions({ onQuickAction, isLoading }) {
  const quickActions = [
    {
      id: 'business',
      icon: BriefcaseIcon,
      title: 'Business Pitch',
      description: 'Create a compelling business presentation',
      prompt: 'Create a professional business pitch presentation with market analysis, product overview, competitive advantages, and financial projections. Include compelling visuals and clear call-to-action slides.'
    },
    {
      id: 'educational',
      icon: AcademicCapIcon,
      title: 'Educational Content',
      description: 'Design an engaging learning presentation',
      prompt: 'Design an educational presentation that explains complex concepts in a simple, engaging way. Include interactive elements, examples, and knowledge check slides to enhance learning.'
    },
    {
      id: 'data',
      icon: ChartBarIcon,
      title: 'Data Analysis',
      description: 'Present data insights and analytics',
      prompt: 'Create a data-driven presentation that tells a story with charts, graphs, and key insights. Include executive summary, methodology, findings, and actionable recommendations.'
    },
    {
      id: 'creative',
      icon: LightBulbIcon,
      title: 'Creative Project',
      description: 'Showcase creative work and ideas',
      prompt: 'Design a creative presentation that showcases innovative ideas, creative processes, and visual storytelling. Include inspiration, concept development, and final outcomes.'
    },
    {
      id: 'sales',
      icon: PresentationChartLineIcon,
      title: 'Sales Presentation',
      description: 'Convert prospects with persuasive slides',
      prompt: 'Create a persuasive sales presentation that addresses customer pain points, presents solutions, demonstrates value proposition, and includes social proof and pricing options.'
    },
    {
      id: 'team',
      icon: UserGroupIcon,
      title: 'Team Meeting',
      description: 'Organize effective team presentations',
      prompt: 'Create a team meeting presentation with agenda, project updates, key metrics, challenges and solutions, next steps, and action items for team alignment.'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-neutral-50 to-primary-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-primary mb-2">Quick Start Templates</h3>
          <p className="text-secondary">Choose a template to get started quickly, or describe your own presentation idea below</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onQuickAction(action.prompt)}
                disabled={isLoading}
                className={`group p-6 bg-white rounded-2xl border-2 border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 text-left transform hover:scale-105 min-h-[120px] ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gradient-to-br hover:from-white hover:to-primary-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-xl group-hover:bg-primary-200 transition-colors duration-300">
                    <IconComponent className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-primary mb-2 group-hover:text-primary-700 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-secondary group-hover:text-primary-600 transition-colors">
                      {action.description}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-xs text-primary-500 font-medium">
                    Click to use template
                  </div>
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <svg className="w-3 h-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}