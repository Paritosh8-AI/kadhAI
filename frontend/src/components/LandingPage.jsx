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
  Download,
  Play,
  Apple,
  ChevronDown,
  Layers,
  Leaf,
  Zap,
  Timer,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import PhoneMockup from './PhoneMockup';
import MobileApp from './MobileApp';

export default function LandingPage() {
  const [activeJugaadTab, setActiveJugaadTab] = useState('dal'); // 'dal', 'rice', 'roti'
  const [openFaq, setOpenFaq] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Live Cloudflare / App link
  const liveUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const jugaadDemos = {
    dal: {
      leftover: "Yesterday's Cold Toor Dal (1 Katori)",
      pantry: "Atta, Green Chillies, Ginger, Desi Ghee",
      result: "Crispy Dal Missi Paratha with Tadka Curd",
      protein: "14.5g Protein",
      time: "15 mins",
      story: "Zero water added—kneaded directly with spiced dal to unlock flaky layered parathas."
    },
    rice: {
      leftover: "Cold Boiled Basmati Rice (1 Plate)",
      pantry: "Mustard Seeds, Curry Leaves, Peanuts, Haldi",
      result: "Phodnicha Bhaat / South Indian Tadka Chawal",
      protein: "8.2g Protein",
      time: "8 mins",
      story: "Transformed cold dry rice into a fragrant golden tempering with crunchy peanuts and lemon."
    },
    roti: {
      leftover: "Stale Dry Rotis (3 Pieces)",
      pantry: "Curd (Dahi), Mustard seeds, Garlic, Amchur",
      result: "Authentic Gujarati Vaghareli Roti",
      protein: "11.0g Protein",
      time: "10 mins",
      story: "Torn stale rotis simmered in spiced tempering with whisked dahi for a comforting warm breakfast."
    }
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white selection:bg-orange-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* Glow Ambient Lights */}
      <div className="fixed top-0 left-1/3 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-orange-600/15 via-amber-500/10 to-transparent blur-[160px] pointer-events-none rounded-full" />
      <div className="fixed top-1/2 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-amber-600/10 via-purple-600/5 to-transparent blur-[170px] pointer-events-none rounded-full" />

      {/* Subtle Mesh Grid Background */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* NAVIGATION HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#07080b]/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-amber-300 flex items-center justify-center text-xl shadow-lg shadow-orange-600/30 ring-1 ring-white/20">
              🍲
            </div>
            <div>
              <span className="text-xl font-black tracking-tight font-display bg-gradient-to-r from-orange-400 via-amber-300 to-white bg-clip-text text-transparent">
                kadhAI
              </span>
              <span className="text-[10px] font-bold tracking-widest text-orange-400 block uppercase -mt-1">
                Indian Kitchen OS
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#jugaad" className="hover:text-orange-400 transition-colors">Jugaad AI</a>
            <a href="#bento" className="hover:text-orange-400 transition-colors">Proprietary Tech</a>
            <a href="#playstore" className="hover:text-orange-400 transition-colors">Play Store App</a>
            <a href="#simulator" className="hover:text-orange-400 transition-colors">Interactive Phone</a>
            <a href="#faq" className="hover:text-orange-400 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a 
              href="#playstore"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-xl shadow-orange-600/30 transition-all flex items-center gap-2 group active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Get Android App</span>
            </a>
          </div>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-7 text-left">
            
            {/* Play Store Rating Pill */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#12131d] border border-orange-500/30 shadow-inner"
            >
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-200">
                4.9 on Google Play
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-xs font-medium text-orange-400">
                50,000+ Zero-Waste Meals
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-6xl font-black font-display tracking-tight leading-[1.06] text-white"
            >
              Point your phone at your fridge.{' '}
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500 bg-clip-text text-transparent">
                Gourmet Indian meals in 15 mins.
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed max-w-xl"
            >
              Never throw away cold dal, stale rotis, or wilting coriander again. <b>kadhAI</b> is the full-fledged mobile kitchen copilot with phone OTP login, native camera scanning, and 10-minute Blinkit unlock links.
            </motion.p>

            {/* Play Store Download Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <a 
                href="/kadhAI.apk"
                download="kadhAI.apk"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs flex items-center gap-3 transition-all shadow-xl shadow-orange-600/30 active:scale-95"
              >
                <Play className="w-5 h-5 fill-current text-white" />
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-wider text-orange-200">Download for Android</div>
                  <div className="text-sm font-black leading-none">Install APK Directly</div>
                </div>
              </a>

              <a 
                href="#simulator"
                className="px-6 py-3.5 rounded-2xl bg-[#14151f] hover:bg-[#1a1b28] border border-white/10 text-white font-semibold text-xs flex items-center gap-2.5 transition-all active:scale-95 shadow-md"
              >
                <Smartphone className="w-4 h-4 text-orange-400" />
                <span>Test Live Simulator</span>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
              </a>
            </motion.div>

            {/* Live QR Code & Wi-Fi Pairing Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-3xl bg-[#0f1018]/90 border border-white/10 flex items-center gap-5 shadow-2xl max-w-md relative overflow-hidden group"
            >
              <div className="p-2.5 bg-white rounded-2xl shadow-md shrink-0 relative">
                <QRCodeSVG value={liveUrl} size={90} level="M" />
                {/* Laser scan line effect */}
                <div className="absolute inset-x-2 top-2 h-0.5 bg-orange-500 shadow-[0_0_8px_#ff6b00] animate-pulse" />
              </div>
              
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <QrCode className="w-4 h-4 text-orange-400" />
                  <span>Scan to Open on Phone Camera</span>
                </div>
                <p className="text-xs text-gray-300 leading-snug">
                  Point your mobile camera at this code to test the live native app on your phone right now.
                </p>
                <button 
                  onClick={handleCopyLink}
                  className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 pt-1"
                >
                  <span>{copiedLink ? '✓ Link copied!' : 'Copy mobile URL'}</span>
                </button>
              </div>
            </motion.div>

            {/* Key Trust Checkmarks */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Strict Jain & Vrat Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-amber-400" />
                <span>2.5s Ultra-Fast Groq LPUs</span>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <span>Blinkit & Zepto Ready</span>
              </div>
            </div>

          </div>

          {/* Right Hero Column: Interactive Phone Mockup with OTP & Kitchen Scanner */}
          <div id="simulator" className="lg:col-span-5 relative flex justify-center">
            
            {/* Ambient Radial Halo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-[650px] bg-gradient-to-tr from-orange-600/30 via-amber-500/20 to-transparent blur-3xl pointer-events-none rounded-full" />
            
            {/* Interactive Phone */}
            <PhoneMockup>
              <MobileApp isInsideMockup={true} />
            </PhoneMockup>

          </div>

        </div>
      </section>

      {/* JUGAAD COOKING SHOWCASE: BEFORE & AFTER TRANSFORMATION */}
      <section id="jugaad" className="py-24 border-t border-white/[0.06] bg-[#08090f] px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-orange-400 block">
              The Jugaad AI Engine
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Zero Food Waste. Maximum Flavor.
            </h2>
            <p className="text-sm text-gray-400">
              Indian cooking was built on clever repurposing. See how kadhAI converts everyday kitchen leftovers into gourmet breakfast and dinner.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex justify-center gap-3">
            {[
              { id: 'dal', label: '🍛 Leftover Yellow Dal' },
              { id: 'rice', label: '🍚 Cold Boiled Rice' },
              { id: 'roti', label: '🫓 Stale Rotis' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveJugaadTab(tab.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeJugaadTab === tab.id
                    ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-600/30 scale-105'
                    : 'bg-[#12131d] border border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Before & After Interactive Card */}
          {(() => {
            const data = jugaadDemos[activeJugaadTab];
            return (
              <div className="p-8 rounded-3xl bg-[#0e0f17] border border-white/10 shadow-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* BEFORE: Leftover & Fridge State */}
                <div className="p-6 rounded-2xl bg-[#141520] border border-red-500/20 space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    ❌ BEFORE: Will Get Thrown Away
                  </div>
                  <h3 className="text-lg font-bold text-white">{data.leftover}</h3>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div><b>Staples in Kadhai:</b> {data.pantry}</div>
                    <div className="text-red-400/80 font-medium pt-1">Risk: Will spoil within 24 hours if unused.</div>
                  </div>
                </div>

                {/* AFTER: kadhAI Transformation */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-950/40 to-emerald-950/30 border border-emerald-500/30 space-y-4 relative">
                  <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    ✅ AFTER: kadhAI Transformation
                  </div>
                  <h3 className="text-lg font-black text-white font-display">{data.result}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed italic">"{data.story}"</p>
                  
                  <div className="flex items-center gap-4 text-xs font-bold pt-2 border-t border-white/10">
                    <span className="text-amber-400">⚡ {data.time}</span>
                    <span className="text-emerald-400">💪 {data.protein}</span>
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      </section>

      {/* BENTO GRID: PROPRIETARY KITCHEN INTELLIGENCE */}
      <section id="bento" className="py-24 border-t border-white/[0.06] bg-[#050608] px-6">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-orange-400 block">
              Built for Indian Culinary Physics
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Why kadhAI is in a league of its own
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento 1: Large Span */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-[#0d0e16] border border-white/10 hover:border-orange-500/40 transition-all space-y-4 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white font-display">The Sacred Tadka Sequence</h3>
              <p className="text-sm text-gray-300 leading-relaxed max-w-lg">
                In Indian cuisine, cooking order determines whether spices release aromatic essential oils or turn bitter and burned. kadhAI specifies exact tempering chains:
              </p>
              
              <div className="p-4 rounded-2xl bg-[#141522] border border-white/5 flex flex-wrap items-center gap-2 text-xs font-bold text-amber-300">
                <span>Mustard Oil at Smoking Point</span>
                <span className="text-gray-500">➔</span>
                <span>Crackle Rai & Jeera</span>
                <span className="text-gray-500">➔</span>
                <span>Hing Release</span>
                <span className="text-gray-500">➔</span>
                <span>Curry Leaves & Ginger</span>
              </div>
            </div>

            {/* Bento 2: Quick-Commerce Arbitrage */}
            <div className="p-8 rounded-3xl bg-[#0d0e16] border border-white/10 hover:border-orange-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-2">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">10-Min Quick Commerce Arbitrage</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Missing 1 ingredient? kadhAI calculates the <b>Unlock Potential</b>: spending ₹28 on Kasuri Methi or Lemon from Blinkit/Zepto unlocks 3 distinct restaurant-style dishes from existing staples.
              </p>
            </div>

            {/* Bento 3: Strict Dietary Guardrails */}
            <div className="p-8 rounded-3xl bg-[#0d0e16] border border-white/10 hover:border-orange-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">100% Cryptographic Jain & Vrat Safety</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Deterministic pre-filtering programmatically strips onion, garlic, potatoes, and root vegetables before the LLM reasons. Zero dietary hallucinations.
              </p>
            </div>

            {/* Bento 4: Multi-Modal Vision */}
            <div className="md:col-span-2 p-8 rounded-3xl bg-[#0d0e16] border border-white/10 hover:border-orange-500/40 transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-2">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white font-display">Multi-Modal Vision for Cluttered Indian Fridges</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Powered by Gemini 3.5 Flash, kadhAI differentiates between serrated coriander vs fenugreek (methi) vs palak leaves, and spots stainless steel katoris of cooked dal even in low kitchen lighting.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* PLAY STORE APP LAUNCH SECTION */}
      <section id="playstore" className="py-24 border-t border-white/[0.06] bg-gradient-to-b from-[#090a12] to-[#050608] px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 p-10 rounded-3xl bg-[#11121d] border border-orange-500/30 shadow-2xl relative overflow-hidden">
          
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-400 flex items-center justify-center text-3xl shadow-xl shadow-orange-600/30">
            🍲
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
              Android Play Store Release
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-white">
              Get kadhAI on Google Play Store
            </h2>
            <p className="text-sm text-gray-300 max-w-lg mx-auto">
              Built with native Android camera access, instant phone OTP verification, offline recipe storage, and seamless Blinkit integration.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a 
              href="/kadhAI.apk"
              download="kadhAI.apk"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-orange-600/30 flex items-center gap-3 transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              <span>Download kadhAI (Android APK)</span>
            </a>

            <button 
              onClick={() => alert("On iOS, open the link in Safari, tap the Share icon at the bottom, and select 'Add to Home Screen' for the full app experience!")}
              className="px-8 py-4 rounded-2xl bg-[#181926] hover:bg-[#202232] border border-white/10 text-white font-bold text-sm flex items-center gap-3 transition-all active:scale-95"
            >
              <Apple className="w-5 h-5" />
              <span>Install for Apple iOS (PWA)</span>
            </button>
          </div>

          <div className="pt-4 text-xs text-gray-500 flex items-center justify-center gap-4">
            <span>Package ID: com.kadhai.app</span>
            <span>•</span>
            <span>Version: 2.1.0</span>
            <span>•</span>
            <span>100% Free & Open Source</span>
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 border-t border-white/[0.06] bg-[#050608] px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold tracking-widest uppercase text-orange-400">
              Questions & Answers
            </h2>
            <h3 className="text-3xl font-extrabold font-display text-white">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How does kadhAI detect Indian kitchen items?",
                a: "kadhAI leverages Google Gemini 3.5 Flash fine-tuned with visual prompting specifically for Indian groceries, distinguishing between whole spices, dals, leafy greens, and cooked leftovers in steel katoris."
              },
              {
                q: "Why is the recipe generation so fast?",
                a: "We architected a hybrid pipeline: Gemini handles visual perception, while Groq LPUs run the 120-Billion parameter Llama reasoning engine at 300+ tokens per second. Total wait time is just 2.5 seconds."
              },
              {
                q: "Does it support strict Jain or Navratri fasting food?",
                a: "Yes! When you select Jain in diet settings, our deterministic guardrails programmatically strip onions, garlic, ginger, and root vegetables before recipes are formulated."
              },
              {
                q: "How do the Blinkit and Zepto buttons work?",
                a: "kadhAI identifies missing flavor enhancers (like Kasuri methi or fresh mint) and generates direct pre-encoded quick commerce search links so you can get them delivered in 10 minutes."
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-2xl bg-[#0d0e16] border border-white/5 cursor-pointer"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between font-bold text-sm text-white">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-orange-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </div>
                {openFaq === idx && (
                  <p className="text-xs text-gray-300 mt-3 pt-3 border-t border-white/5 leading-relaxed">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 px-6 bg-[#040507] text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍲</span>
            <span className="font-extrabold text-white font-display text-sm">kadhAI</span>
            <span>— The Operating System for Indian Kitchens</span>
          </div>
          <div className="text-gray-400">Powered by Gemini 3.5 Flash & Groq LPUs</div>
          <div>© 2026 kadhAI Inc. Built for home chefs & AI engineers.</div>
        </div>
      </footer>

    </div>
  );
}
