import React from 'react';

export default function PhoneMockup({ children }) {
  return (
    <div className="relative mx-auto w-[360px] sm:w-[380px] h-[740px] bg-[#1a1b22] rounded-[52px] p-3 shadow-[0_25px_60px_-15px_rgba(255,107,0,0.25)] border-[6px] border-[#2c2d3a] ring-1 ring-white/10">
      {/* Side volume and power button impressions */}
      <div className="absolute -left-[9px] top-28 w-[3px] h-10 bg-[#353644] rounded-l-md" />
      <div className="absolute -left-[9px] top-42 w-[3px] h-12 bg-[#353644] rounded-l-md" />
      <div className="absolute -right-[9px] top-36 w-[3px] h-16 bg-[#353644] rounded-r-md" />

      {/* Screen Container */}
      <div className="relative w-full h-full bg-[#0d0e14] rounded-[42px] overflow-hidden flex flex-col border border-white/5 shadow-inner">
        {/* Dynamic Island Header */}
        <div className="absolute top-0 left-0 right-0 h-10 z-50 flex items-center justify-between px-6 pointer-events-none select-none">
          <span className="text-[11px] font-semibold tracking-tight text-white/90">9:41</span>
          
          {/* Dynamic Island Notch */}
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500/80" />
          </div>

          <div className="flex items-center gap-1.5 text-white/80">
            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
            <div className="w-5 h-2.5 border border-white/60 rounded-xs p-0.5 flex items-center">
              <div className="w-3 h-1.5 bg-white rounded-xs" />
            </div>
          </div>
        </div>

        {/* Inner Phone Screen App Content */}
        <div className="w-full h-full pt-10 overflow-y-auto overflow-x-hidden flex flex-col relative select-text">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
