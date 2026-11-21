import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import MobileApp from './components/MobileApp';

export default function App() {
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      // Treat screens under 768px, mobile devices, or Capacitor as mobile
      const isMobile = window.innerWidth < 768 || 
                       /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
                       Boolean(window.Capacitor?.isNativePlatform?.());
      setIsMobileScreen(isMobile);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  // On Mobile: Directly render the full Mobile App with NO floating pills or view switchers
  if (isMobileScreen) {
    return (
      <div className="min-h-screen bg-[#0c0d12]">
        <MobileApp isInsideMockup={false} />
      </div>
    );
  }

  // On Desktop: Render the landing page showcasing the live iPhone simulator
  return (
    <div className="min-h-screen bg-[#07080c]">
      <LandingPage />
    </div>
  );
}
