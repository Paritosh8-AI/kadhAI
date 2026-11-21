import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Smartphone, 
  QrCode, 
  ArrowRight, 
  Flame, 
  RefreshCw, 
  ShieldCheck, 
  ShoppingBag, 
  Check, 
  Star,
  ChevronRight,
  Apple,
  Play
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import PhoneMockup from './PhoneMockup';
import MobileApp from './MobileApp';

const API_BASE = 'http://localhost:8000/api';

export default function LandingPage() {
  const [mobileUrl, setMobileUrl] = useState('http://localhost:5173');
  const [localIp, setLocalIp] = useState('localhost');

  useEffect(() => {
    // Fetch local network IP from backend so QR code points to phone-accessible address
    axios.get(`${API_BASE}/network-info`)
      .then(res => {
        if (res.data?.mobile_app_url) {
          setMobileUrl(res.data.mobile_app_url);
          setLocalIp(res.data.local_ip);
        }
      })
      .catch(() => {
        // Fallback to window host
        setMobileUrl(window.location.origin);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#07080c] text-white selection:bg-orange-500 selection:text-white">
      
      {/* Glow Ambient Blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed bottom-1/4 right-1/4 w-[450px] h-[450px] bg-amber-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0b10]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-xl shadow-lg shadow-orange-600/25">
              🍲
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight font-display bg-gradient-to-r from-orange-400 via-amber-300 to-amber-100 bg-clip-text text-transparent">
                kadhAI
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-orange-400 block uppercase -mt-0.5">
                Indian Kitchen Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Why kadhAI</a>
            <a href="#jugaad" className="hover:text-white transition-colors">Jugaad Cooking</a>
            <a href="#quick-commerce" className="hover:text-white transition-colors">Blinkit Integration</a>
            <a href="#simulator" className="hover:text-white transition-colors">Live App Demo</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="#simulator"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-orange-600/25 transition-all flex items-center gap-2 group active:scale-95"
            >
              <span>Try Live in Phone</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Compelling Marketing Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>The Multi-Modal Agentic Chef for Indian Homes</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight leading-[1.08] text-white">
              Point your phone at your fridge.{' '}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Get authentic ghar ka khana in seconds.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl">
              Stop wondering <i>"Aaj kya banau?"</i>. <b>kadhAI</b> analyzes your messy vegetable basket, detects wilting herbs and cooked leftovers, and formulates authentic regional recipes with 10-minute Blinkit unlock links.
            </p>

            {/* App Store & Google Play Download CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button 
                onClick={() => alert("kadhAI PWA can be installed directly by tapping 'Add to Home Screen' on your smartphone!")}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs flex items-center gap-3 transition-all active:scale-95 shadow-lg"
              >
                <Apple className="w-5 h-5 text-white" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400">Download for</div>
                  <div className="text-xs font-bold leading-none">Apple iOS</div>
                </div>
              </button>

              <button 
                onClick={() => alert("kadhAI PWA can be installed directly by tapping 'Add to Home Screen' on your smartphone!")}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs flex items-center gap-3 transition-all active:scale-95 shadow-lg"
              >
                <Play className="w-5 h-5 fill-current text-white" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-gray-400">Get it on</div>
                  <div className="text-xs font-bold leading-none">Google Play</div>
                </div>
              </button>
            </div>

            {/* Live QR Code Card: Test on your real phone! */}
            <div className="p-4 rounded-3xl bg-[#11121a]/90 border border-white/10 flex items-center gap-5 shadow-2xl max-w-md">
              <div className="p-2.5 bg-white rounded-2xl shadow-md shrink-0">
                <QRCodeSVG value={mobileUrl} size={92} level="M" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <QrCode className="w-4 h-4 text-orange-400" />
                  <span>Scan to Test on Your Smartphone</span>
                </div>
                <p className="text-xs text-gray-300 leading-snug">
                  Open your phone camera and point at this QR code to try kadhAI live in your kitchen over Wi-Fi!
                </p>
                <div className="text-[10px] text-gray-400 font-mono pt-1">
                  URL: {mobileUrl}
                </div>
              </div>
            </div>

            {/* Trust Metrics */}
            <div className="flex items-center gap-6 pt-2 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Jain & Vrat Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-purple-400" />
                <span>Zero-Waste Jugaad AI</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive iPhone 16 Pro Simulator */}
          <div id="simulator" className="lg:col-span-5 relative flex justify-center">
            
            {/* Glow Backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-[600px] bg-gradient-to-tr from-orange-600/30 via-amber-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />
            
            {/* The Live Interactive Phone */}
            <PhoneMockup>
              <MobileApp isInsideMockup={true} />
            </PhoneMockup>

          </div>

        </div>
      </section>

      {/* THREE PILLARS OF KADHAI */}
      <section id="features" className="py-20 border-t border-white/5 bg-[#0a0b10] px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-xs font-bold tracking-widest uppercase text-orange-400">
              Designed for Real Indian Kitchens
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Why generic cooking apps fail in India
            </h3>
            <p className="text-sm text-gray-400">
              Western AI chatbots don't understand the nuance of mustard oil smoking points, difference between jeera and saunf, or how to turn stale rotis into gourmet snacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-[#11121a] border border-white/5 hover:border-orange-500/30 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">1. Jugaad Leftover Magic</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                kadhAI spots stainless steel dabbas with cold dal, cooked chawal, or dry rotis, and immediately provides recipes to transform them into crispy Dal Parathas, Phodnicha Bhaat, or Vaghareli Roti.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-[#11121a] border border-white/5 hover:border-orange-500/30 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">2. The Sacred Tadka Sequence</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Tempering is sacred in Indian food. kadhAI specifies the exact fat (Mustard oil vs Desi ghee) and spice crackle sequence (<i>Hing ➔ Jeera ➔ Rai ➔ Kadi Patta</i>) so you never burn your spices.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-[#11121a] border border-white/5 hover:border-orange-500/30 transition-all space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-display">3. 10-Min Quick-Commerce Arbitrage</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Missing 1 crucial spice? kadhAI computes the "Unlock Potential": spending ₹25 on Kasuri Methi or Lemon from Blinkit/Zepto unlocks 3 restaurant-quality dishes from existing staples.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-10 px-6 bg-[#07080c] text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍲</span>
            <span className="font-extrabold text-white font-display">kadhAI</span>
            <span>— Ghar Ka Smart Chef</span>
          </div>
          <div>Built for home chefs and powered by Gemini 3.5 Flash & Groq LPUs</div>
          <div>© 2026 kadhAI Inc. All rights reserved.</div>
        </div>
      </footer>

    </div>
  );
}
