import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/Navigation';
import AICaddieAdvice from '@/components/AICaddieAdvice';
import AISwingAnalysis from '@/components/AISwingAnalysis';
import AIPlayerMatching from '@/components/AIPlayerMatching';
import GolfChatbot from '@/components/GolfChatbot';

export default function AIDashboard() {
  const [activeSection, setActiveSection] = useState<'caddie' | 'swing' | 'matching' | 'chatbot'>('caddie');

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navigation />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 max-w-2xl">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">AI Golf Assistant</h2>
            <p className="text-gray-600 text-center mb-6">
              Get personalized golf advice, swing analysis, and connect with other golfers using our AI-powered tools.
            </p>
            
            {/* AI Tools Navigation */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
              <Button
                variant={activeSection === 'caddie' ? 'default' : 'outline'}
                className={`p-3 sm:p-4 h-auto ${
                  activeSection === 'caddie' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'text-gray-700 hover:bg-green-50'
                }`}
                onClick={() => setActiveSection('caddie')}
              >
                <div className="text-center">
                  <svg className="h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  <div className="text-sm font-medium">AI Caddie</div>
                </div>
              </Button>

              <Button
                variant={activeSection === 'swing' ? 'default' : 'outline'}
                className={`p-3 sm:p-4 h-auto ${
                  activeSection === 'swing' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'text-gray-700 hover:bg-green-50'
                }`}
                onClick={() => setActiveSection('swing')}
              >
                <div className="text-center">
                  <svg className="h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18"/>
                    <path d="m19 9-5 5-4-4-3 3"/>
                  </svg>
                  <div className="text-sm font-medium">Swing Analysis</div>
                </div>
              </Button>

              <Button
                variant={activeSection === 'matching' ? 'default' : 'outline'}
                className={`p-3 sm:p-4 h-auto ${
                  activeSection === 'matching' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'text-gray-700 hover:bg-green-50'
                }`}
                onClick={() => setActiveSection('matching')}
              >
                <div className="text-center">
                  <svg className="h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <div className="text-sm font-medium">Player Match</div>
                </div>
              </Button>

              <Button
                variant={activeSection === 'chatbot' ? 'default' : 'outline'}
                className={`p-3 sm:p-4 h-auto ${
                  activeSection === 'chatbot' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'text-gray-700 hover:bg-green-50'
                }`}
                onClick={() => setActiveSection('chatbot')}
              >
                <div className="text-center">
                  <svg className="h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <path d="M12 17h.01"/>
                  </svg>
                  <div className="text-sm font-medium">Golf Chat</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Content Sections */}
          {activeSection === 'caddie' && <AICaddieAdvice />}
          {activeSection === 'swing' && <AISwingAnalysis />}
          {activeSection === 'matching' && <AIPlayerMatching />}
          {activeSection === 'chatbot' && <GolfChatbot />}
        </div>
      </main>
    </div>
  );
}