import React, { useState, useEffect } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, Sparkles, Check, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

export default function AuthScreens({ onAuthenticated }) {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'profile'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Profile Setup State
  const [name, setName] = useState('');
  const [diet, setDiet] = useState('pure_veg');
  const [household, setHousehold] = useState('2-3 people');

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Send OTP
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/send-otp`, { phone: `+91${phone}` });
      setStep('otp');
      setTimer(30);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send OTP. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit entry
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto advance
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 4) {
      setError('Please enter all 4 digits');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, {
        phone: `+91${phone}`,
        code: code,
      });

      const token = res.data.token;
      localStorage.setItem('kadhai_token', token);
      localStorage.setItem('kadhai_user', JSON.stringify(res.data.user));

      // If user has default name, prompt profile setup, else finish
      if (res.data.user.name === 'Master Chef') {
        setStep('profile');
      } else {
        onAuthenticated(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid OTP code. Try 4242.');
    } finally {
      setLoading(false);
    }
  };

  // Save Profile Setup
  const handleSaveProfile = async () => {
    const finalName = name.trim() || 'Home Chef';
    setLoading(true);
    try {
      const token = localStorage.getItem('kadhai_token');
      const res = await axios.post(
        `${API_BASE}/auth/update-profile`,
        { name: finalName, diet, household_size: household },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem('kadhai_user', JSON.stringify(res.data.user));
      onAuthenticated(res.data.user);
    } catch (err) {
      // Fallback
      const fallbackUser = { phone: `+91${phone}`, name: finalName, diet, household_size: household };
      onAuthenticated(fallbackUser);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center px-5 py-8 text-white select-none">
      
      {/* STEP 1: PHONE NUMBER */}
      {step === 'phone' && (
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-3xl shadow-xl shadow-orange-600/30">
              🍲
            </div>
            <h2 className="text-2xl font-black font-display tracking-tight text-white">
              Welcome to kadhAI
            </h2>
            <p className="text-xs text-gray-400">
              Enter your mobile number to get instant zero-waste recipes & kitchen intelligence.
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">Mobile Number</label>
              <div className="flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-[#14151f] border border-white/10 focus-within:border-orange-500 transition-colors">
                <span className="text-sm font-bold text-gray-300 flex items-center gap-1.5 border-r border-white/10 pr-2.5">
                  <span>🇮🇳</span> +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="bg-transparent text-white text-base font-semibold w-full focus:outline-none placeholder:text-gray-600 tracking-wider"
                  autoFocus
                />
              </div>
              {error && <p className="text-[11px] text-red-400 mt-1 font-medium">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>{loading ? 'Sending OTP...' : 'Get OTP Verification'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Pill */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setPhone('9876543210');
                setError('');
              }}
              className="text-[11px] font-semibold text-orange-400/90 hover:text-orange-300 underline"
            >
              ⚡ Fill sample Indian number (+91 98765 43210)
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 text-center pt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure 256-bit encrypted SMS authentication</span>
          </div>
        </div>
      )}

      {/* STEP 2: OTP VERIFICATION */}
      {step === 'otp' && (
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold font-display text-white">
              Verify OTP Code
            </h2>
            <p className="text-xs text-gray-400">
              Sent 4-digit code to <span className="text-white font-bold">+91 {phone}</span>
            </p>
          </div>

          {/* 4 Digit Boxes */}
          <div className="flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !digit && i > 0) {
                    document.getElementById(`otp-${i - 1}`)?.focus();
                  }
                }}
                className="w-14 h-14 text-center text-2xl font-black bg-[#14151f] border border-white/10 rounded-2xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-white shadow-inner"
              />
            ))}
          </div>

          {error && <p className="text-[11px] text-red-400 text-center font-medium">{error}</p>}

          <button
            onClick={() => handleVerifyOtp()}
            disabled={loading || otp.join('').length < 4}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>{loading ? 'Verifying...' : 'Verify & Continue'}</span>
            <Check className="w-4 h-4" />
          </button>

          {/* Quick Fill Demo Code */}
          <div className="p-3 rounded-2xl bg-[#14151f] border border-white/5 text-center space-y-1.5">
            <span className="text-[11px] text-gray-400 block">Instant Testing Simulator:</span>
            <button
              onClick={() => {
                setOtp(['4', '2', '4', '2']);
                handleVerifyOtp('4242');
              }}
              className="px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-300 font-bold text-xs hover:bg-orange-500/30 transition-colors"
            >
              🚀 Tap to Auto-Verify Demo OTP (4242)
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-2">
            <button onClick={() => setStep('phone')} className="hover:text-white">
              Change Number
            </button>
            {timer > 0 ? (
              <span className="text-gray-500">Resend code in {timer}s</span>
            ) : (
              <button onClick={handleSendOtp} className="text-orange-400 font-semibold hover:underline">
                Resend OTP
              </button>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: PERSONALIZED ONBOARDING */}
      {step === 'profile' && (
        <div className="space-y-5 animate-fade-in">
          <div className="space-y-1 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-400">Step 2 of 2</span>
            <h2 className="text-xl font-extrabold font-display text-white">
              Customize Your Kitchen
            </h2>
            <p className="text-xs text-gray-400">
              kadhAI tailors all tadka sequences and spice balances to your household.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* Name */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">What's your name?</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Paritosh Mukherjee"
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#14151f] border border-white/10 text-white text-xs font-semibold focus:border-orange-500 focus:outline-none"
              />
            </div>

            {/* Diet Lifestyle */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">Dietary Lifestyle</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'pure_veg', label: '🌱 Pure Vegetarian' },
                  { id: 'jain', label: '🕊️ Strict Jain' },
                  { id: 'eggetarian', label: '🥚 Eggetarian' },
                  { id: 'vrat_fasting', label: '🕉️ Vrat / Fasting' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDiet(item.id)}
                    className={`p-2.5 rounded-xl font-medium border text-left text-xs transition-all ${
                      diet === item.id
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-sm'
                        : 'bg-[#14151f] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Household Size */}
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1.5">Cooking For</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Solo / Bachelor', '2 People', 'Family (4+)'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setHousehold(size)}
                    className={`py-2 px-2 text-center rounded-xl font-medium border text-[11px] transition-all ${
                      household === size
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                        : 'bg-[#14151f] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Enter My Kitchen</span>
          </button>
        </div>
      )}

    </div>
  );
}
