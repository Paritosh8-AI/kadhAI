import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Flame, 
  Clock, 
  Users, 
  Share2, 
  Sliders, 
  ChefHat, 
  Package, 
  RefreshCw,
  ShoppingBag,
  Leaf,
  LogOut,
  User as UserIcon,
  Heart,
  Download
} from 'lucide-react';
import axios from 'axios';
import AuthScreens from './AuthScreens';

const API_BASE = '/api';

export default function MobileApp({ isInsideMockup = false }) {
  // Auth State
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kadhai_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState('scan'); // 'scan', 'pantry', 'recipes', 'profile'
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Kitchen State
  const [dietaryPref, setDietaryPref] = useState(user?.diet || 'pure_veg');
  const [cuisinePref, setCuisinePref] = useState('pan_indian');
  const [spiceLevel, setSpiceLevel] = useState('Medium Desi');
  const [maxCookTime, setMaxCookTime] = useState(30);

  // Synchronize dietary preference when user changes
  useEffect(() => {
    if (user?.diet) {
      setDietaryPref(user.diet);
    }
  }, [user]);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('kadhai_token');
    localStorage.removeItem('kadhai_user');
    setUser(null);
  };

  // API State
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [pantryScan, setPantryScan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0);

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Trigger Demo Sample Scan
  const handleLoadDemo = async () => {
    setLoading(true);
    setLoadingMessage('Scanning Indian fridge demo...');
    try {
      const scanRes = await axios.post(`${API_BASE}/sample-scan`);
      setPantryScan(scanRes.data);
      setActiveTab('pantry');

      // Now auto-generate recipes via Groq LPU
      setLoadingMessage('kadhAI Chef formulating recipes with Groq LPU...');
      const recipeRes = await axios.post(`${API_BASE}/recipes`, {
        scan_result: scanRes.data,
        dietary_preference: dietaryPref,
        cuisine_preference: cuisinePref,
        max_cooking_time_minutes: maxCookTime,
        spice_level: spiceLevel,
      });

      setRecipes(recipeRes.data.recipes || []);
      setSelectedRecipeIndex(0);
    } catch (err) {
      console.error(err);
      alert('Could not connect to kadhAI backend on localhost:8000. Is server running?');
    } finally {
      setLoading(false);
    }
  };

  // Upload or Camera File Handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setLoadingMessage('Gemini 3.5 Flash inspecting your fridge photo...');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const scanRes = await axios.post(`${API_BASE}/scan`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setPantryScan(scanRes.data);
      setActiveTab('pantry');

      setLoadingMessage('Groq LPUs crafting authentic Indian recipes...');
      const recipeRes = await axios.post(`${API_BASE}/recipes`, {
        scan_result: scanRes.data,
        dietary_preference: dietaryPref,
        cuisine_preference: cuisinePref,
        max_cooking_time_minutes: maxCookTime,
        spice_level: spiceLevel,
      });

      setRecipes(recipeRes.data.recipes || []);
      setSelectedRecipeIndex(0);
    } catch (err) {
      console.error(err);
      alert('Scan error: Please ensure backend server is running on localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  const getDietLabel = (diet) => {
    switch (diet) {
      case 'jain': return '🕊️ Jain';
      case 'pure_veg': return '🌱 Pure Veg';
      case 'eggetarian': return '🥚 Eggetarian';
      case 'non_veg': return '🍗 Non-Veg';
      case 'vrat_fasting': return '🕉️ Vrat';
      default: return '🌱 Veg';
    }
  };

  return (
    <div className={`w-full h-full flex flex-col bg-[#0c0d12] text-white select-none ${isInsideMockup ? 'font-sans' : 'min-h-screen max-w-md mx-auto shadow-2xl'}`}>
      
      {/* If Not Authenticated, show sleek Phone OTP Login flow */}
      {!user ? (
        <AuthScreens onAuthenticated={(u) => setUser(u)} />
      ) : (
        <>
          {/* App Top Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#12131a]/80 backdrop-blur-md sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-lg shadow-md shadow-orange-600/30">
                🍲
              </div>
              <div>
                <h1 className="text-sm font-extrabold tracking-tight font-display bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                  Namaste, {user.name?.split(' ')[0]}! 🙏
                </h1>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live Smart Kitchen</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tap to Reload / Live Sync Button */}
              <button
                onClick={() => window.location.reload()}
                title="Tap to sync latest changes"
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all active:rotate-180 duration-300 flex items-center justify-center"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              <button 
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-orange-300 transition-colors"
              >
                {getDietLabel(dietaryPref)}
                <Sliders className="w-3 h-3 text-gray-400 ml-0.5" />
              </button>
            </div>
          </div>

      {/* Main Screen Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        
        {/* Loading Overlay */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
            <div className="relative w-16 h-16 mb-4">
              <div className="absolute inset-0 rounded-full border-2 border-orange-500/20 animate-ping" />
              <div className="w-16 h-16 rounded-full border-2 border-t-orange-500 border-r-amber-500 border-b-transparent border-l-transparent animate-spin flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-semibold text-orange-300">{loadingMessage}</p>
            <p className="text-xs text-gray-400 mt-1">Multi-Modal Vision & LPU Reasoning</p>
          </div>
        )}

        {/* VIEW 1: SCANNER */}
        {!loading && activeTab === 'scan' && (
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center px-2">
            
            <div className="relative group cursor-pointer mb-6" onClick={() => cameraInputRef.current?.click()}>
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 opacity-75 blur group-hover:opacity-100 transition duration-300 animate-pulse" />
              <div className="relative w-36 h-36 rounded-full bg-[#181924] border-2 border-orange-500/40 flex flex-col items-center justify-center shadow-2xl">
                <Camera className="w-12 h-12 text-orange-400 mb-1" />
                <span className="text-xs font-bold text-white tracking-wide">SNAP FRIDGE</span>
                <span className="text-[10px] text-gray-400">or Veg Basket</span>
              </div>
            </div>

            <input 
              ref={cameraInputRef} 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            <input 
              ref={fileInputRef} 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />

            <div className="w-full flex flex-col gap-2.5 mt-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 rounded-2xl bg-[#181924] hover:bg-[#202230] border border-white/10 text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
              >
                <Upload className="w-4 h-4 text-orange-400" />
                Upload Photo from Gallery
              </button>

              <button 
                onClick={handleLoadDemo}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600/20 to-amber-600/20 hover:from-orange-600/30 hover:to-amber-600/30 border border-orange-500/30 text-orange-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                ✨ Test with Sample Indian Fridge
              </button>
            </div>

            <div className="mt-8 p-3.5 rounded-2xl bg-[#14151e] border border-white/5 text-left text-xs text-gray-400 w-full">
              <div className="flex items-center gap-1.5 font-semibold text-gray-300 mb-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Waste Jugaad Tip
              </div>
              Point at steel dabbas or vegetable baskets. kadhAI auto-prioritizes wilting dhaniya and yesterday's leftover dal!
            </div>
          </div>
        )}

        {/* VIEW 2: PANTRY & LEFTOVERS */}
        {!loading && activeTab === 'pantry' && (
          <div>
            {pantryScan ? (
              <div className="space-y-4">
                
                {/* Chef Observation Card */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-950/40 to-amber-950/20 border border-orange-500/20 text-xs">
                  <span className="font-bold text-orange-300 block mb-1">👨‍🍳 Chef's Observation:</span>
                  <p className="text-gray-300 italic leading-relaxed">"{pantryScan.summary}"</p>
                </div>

                {/* Leftovers Warning / Jugaad Banner */}
                {pantryScan.leftovers_detected?.length > 0 && (
                  <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 mb-2">
                      <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                      Cooked Leftovers Spotted (Jugaad Time!)
                    </div>
                    {pantryScan.leftovers_detected.map((l, i) => (
                      <div key={i} className="text-xs bg-purple-900/20 p-2 rounded-xl mb-1.5 border border-purple-500/10">
                        <span className="font-semibold text-white">{l.hindi_name}</span> ({l.name})
                        <div className="text-[11px] text-gray-400 mt-0.5">{l.estimated_quantity} • {l.notes}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw Ingredients Pills */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2.5">
                    Fresh Pantry Inventory ({pantryScan.ingredients?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {pantryScan.ingredients?.map((item, i) => (
                      <span 
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded-xl font-medium flex items-center gap-1.5 ${
                          item.freshness === 'wilting' 
                            ? 'bg-amber-950/50 text-amber-300 border border-amber-500/30'
                            : 'bg-[#181924] text-gray-200 border border-white/5'
                        }`}
                      >
                        {item.hindi_name} ({item.name})
                        <span className="text-[10px] text-gray-400 opacity-80">{item.estimated_quantity}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Button to proceed to Recipes */}
                <button
                  onClick={() => setActiveTab('recipes')}
                  className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-orange-600/25 flex items-center justify-center gap-2"
                >
                  <ChefHat className="w-4 h-4" />
                  View Chef Recipes ({recipes.length})
                </button>

              </div>
            ) : (
              <div className="text-center py-20 text-gray-400 text-xs">
                No items scanned yet. Head to the camera tab to scan your kitchen!
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: RECIPES */}
        {!loading && activeTab === 'recipes' && (
          <div>
            {recipes.length > 0 ? (
              <div className="space-y-4">
                
                {/* Horizontal Recipe Selector Pills */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {recipes.map((rec, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedRecipeIndex(i)}
                      className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selectedRecipeIndex === i
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                          : 'bg-[#181924] text-gray-400 border border-white/5'
                      }`}
                    >
                      {rec.is_leftover_repurposed ? '♻️ ' : '🍲 '}
                      {rec.title}
                    </button>
                  ))}
                </div>

                {/* Active Recipe Detail Card */}
                {recipes[selectedRecipeIndex] && (() => {
                  const r = recipes[selectedRecipeIndex];
                  return (
                    <div className="p-4 rounded-3xl bg-[#14151e] border border-white/10 shadow-xl space-y-3.5">
                      
                      {/* Recipe Header */}
                      <div>
                        {r.is_leftover_repurposed && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-1.5">
                            ♻️ ZERO-WASTE JUGAAD TRANSFORMATION
                          </span>
                        )}
                        <h2 className="text-lg font-extrabold text-white font-display leading-tight">{r.title}</h2>
                        <h3 className="text-xs font-medium text-orange-400">{r.hindi_title}</h3>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">{r.description}</p>
                      </div>

                      {/* Metrics Row */}
                      <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-2xl bg-[#1a1b26] border border-white/5 text-center text-xs">
                        <div>
                          <Clock className="w-3.5 h-3.5 mx-auto text-amber-400 mb-0.5" />
                          <div className="font-bold text-white">{r.prep_time_minutes + r.cook_time_minutes}m</div>
                          <div className="text-[9px] text-gray-400 uppercase">Total</div>
                        </div>
                        <div>
                          <Flame className="w-3.5 h-3.5 mx-auto text-orange-400 mb-0.5" />
                          <div className="font-bold text-white">{r.estimated_protein_g}g</div>
                          <div className="text-[9px] text-gray-400 uppercase">Protein</div>
                        </div>
                        <div>
                          <Users className="w-3.5 h-3.5 mx-auto text-emerald-400 mb-0.5" />
                          <div className="font-bold text-white">{r.servings}</div>
                          <div className="text-[9px] text-gray-400 uppercase">Servings</div>
                        </div>
                      </div>

                      {/* The Sacred Tadka Box */}
                      {r.tadka && (
                        <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-1">
                          <span className="font-bold text-amber-300 flex items-center gap-1 text-[11px]">
                            <Flame className="w-3 h-3 text-orange-400" />
                            THE SACRED TADKA SEQUENCE
                          </span>
                          <div className="text-gray-300 text-[11px]"><b>Fat:</b> {r.tadka.oil_or_ghee}</div>
                          <div className="text-orange-200 text-[11px] font-semibold">
                            {r.tadka.spices_in_sequence?.join(' ➔ ')}
                          </div>
                          <p className="text-[10px] text-gray-400 italic pt-1">{r.tadka.instructions}</p>
                        </div>
                      )}

                      {/* Quick-Commerce Missing Items */}
                      {r.missing_ingredients?.length > 0 && (
                        <div className="p-3 rounded-2xl bg-[#1c1d29] border border-white/5 space-y-2">
                          <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />
                            10-Min Delivery Add-Ons (₹{r.missing_ingredients.reduce((a, b) => a + (b.estimated_cost_inr || 20), 0)})
                          </span>
                          {r.missing_ingredients.map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-none">
                              <div>
                                <span className="font-semibold text-white">{m.name}</span>
                                <span className="text-[10px] text-gray-400 ml-1.5">~₹{m.estimated_cost_inr}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <a 
                                  href={m.blinkit_link} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 font-bold hover:bg-yellow-500/30"
                                >
                                  Blinkit
                                </a>
                                <a 
                                  href={m.zepto_link} 
                                  target="_blank" 
                                  rel="noreferrer"
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold hover:bg-purple-500/30"
                                >
                                  Zepto
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Cooking Steps */}
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Cooking Instructions</h4>
                        <ol className="space-y-2 text-xs text-gray-300 pl-4 list-decimal">
                          {r.steps?.map((step, sIdx) => (
                            <li key={sIdx} className="leading-relaxed pl-1">{step}</li>
                          ))}
                        </ol>
                      </div>

                      {/* Grandmother Secret Tip */}
                      {r.chef_secret_tip && (
                        <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                          <span className="font-bold block mb-0.5">💡 Bawarchi / Dadi Secret Tip:</span>
                          <span className="text-gray-300 text-[11px]">{r.chef_secret_tip}</span>
                        </div>
                      )}

                      {/* WhatsApp Share Button */}
                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(`Hey! Making ${r.title} tonight using kadhAI 🍲.\nPrep time: ${r.cook_time_minutes} mins.\nCan you pick up ingredients from Blinkit?`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Share Grocery Needs on WhatsApp
                      </a>

                    </div>
                  );
                })()}

              </div>
            ) : (
              <div className="text-center py-20 text-gray-400 text-xs">
                No recipes generated yet. Scan your kitchen to start cooking!
              </div>
            )}
          </div>
        )}

      </div>

      {/* Floating Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#12131a]/95 backdrop-blur-lg border-t border-white/5 flex items-center justify-around px-4 z-40">
        <button 
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'scan' ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Camera className="w-5 h-5" />
          <span className="text-[10px] font-bold">Scanner</span>
        </button>

        <button 
          onClick={() => setActiveTab('pantry')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'pantry' ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-bold">Pantry</span>
        </button>

        <button 
          onClick={() => setActiveTab('recipes')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'recipes' ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <ChefHat className="w-5 h-5" />
          <span className="text-[10px] font-bold">Recipes</span>
        </button>

        <button 
          onClick={() => setShowSettingsModal(true)}
          className={`flex flex-col items-center gap-1 transition-colors ${showSettingsModal ? 'text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] font-bold">Diet</span>
        </button>
      </div>

      {/* Settings Modal Drawer */}
      {showSettingsModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col justify-end">
          <div className="bg-[#181924] border-t border-white/10 rounded-t-3xl p-5 space-y-4 max-h-[85%] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-bold text-white text-sm font-display">Indian Kitchen Diet Settings</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-xs text-orange-400 font-bold px-3 py-1 rounded-full bg-white/5"
              >
                Done
              </button>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">Dietary Restriction</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'pure_veg', label: '🌱 Pure Veg' },
                  { id: 'jain', label: '🕊️ Jain (No Onion/Garlic)' },
                  { id: 'eggetarian', label: '🥚 Eggetarian' },
                  { id: 'vrat_fasting', label: '🕉️ Vrat Fasting' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setDietaryPref(item.id)}
                    className={`py-2 px-3 rounded-xl font-medium border text-left ${
                      dietaryPref === item.id 
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300' 
                        : 'bg-[#12131a] border-white/5 text-gray-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Regional Profile */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-2">Regional Flavour Profile</label>
              <select
                value={cuisinePref}
                onChange={(e) => setCuisinePref(e.target.value)}
                className="w-full bg-[#12131a] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="pan_indian">🇮🇳 Pan-Indian (Ghar Ka Khana)</option>
                <option value="north_indian">🥘 North Indian (Punjabi / Rich Tadka)</option>
                <option value="south_indian">🥥 South Indian (Coconut & Curry Leaves)</option>
                <option value="maharashtrian">🥜 Maharashtrian (Goda Masala)</option>
                <option value="bengali">🐟 Bengali (Panch Phoron & Mustard Oil)</option>
                <option value="gujarati">🍋 Gujarati (Sweet-Tangy)</option>
              </select>
            </div>

            {/* Max Cook Time */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-gray-300">Max Cooking Time</span>
                <span className="text-orange-400 font-bold">{maxCookTime} mins</span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="60" 
                step="5" 
                value={maxCookTime} 
                onChange={(e) => setMaxCookTime(Number(e.target.value))}
                className="w-full accent-orange-500" 
              />
            </div>

            {/* Logout button */}
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  handleLogout();
                }}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out (+91 {user?.phone?.replace('+91', '')})</span>
              </button>
            </div>

          </div>
        </div>
      )}

      </>
      )}

    </div>
  );
}
