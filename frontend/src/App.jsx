import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MobileApp from './components/MobileApp';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [forcedView, setForcedView] = useState(null); // 'mobile' | 'landing' | null

  useEffect(() => {
    const checkScreen = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const shouldRenderMobile = forcedView === 'mobile' || (forcedView === null && isMobileScreen);

  return (
    <div className="relative min-h-screen bg-[#07080c]">
      
      {/* View Switcher Pill for Testing / Desktop Demo */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center bg-[#1a1b26]/90 border border-white/10 rounded-full p-1 shadow-2xl backdrop-blur-md">
        <button
          onClick={() => setForcedView('landing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !shouldRenderMobile 
              ? 'bg-orange-500 text-white shadow-md' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Landing Page</span>
        </button>

        <button
          onClick={() => setForcedView('mobile')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            shouldRenderMobile 
              ? 'bg-orange-500 text-white shadow-md' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Native Mobile View</span>
        </button>
      </div>

      {/* Render selected view */}
      {shouldRenderMobile ? (
        <div className="min-h-screen bg-[#0c0d12]">
          <MobileApp isInsideMockup={false} />
        </div>
      ) : (
        <LandingPage />
      )}

    </div>
  );
}
