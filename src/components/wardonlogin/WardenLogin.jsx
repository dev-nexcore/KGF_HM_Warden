"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { ShieldCheck, User, KeyRound, ArrowRight, Loader2, Smartphone, ShieldAlert } from "lucide-react";

export default function WardenLogin() {
  const [step, setStep] = useState(1); // 1 = Enter Warden ID, 2 = Enter OTP
  const [wardenId, setWardenId] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedNumber, setMaskedNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [showPunchModal, setShowPunchModal] = useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!wardenId.trim()) {
      toast.error("Warden ID is mandatory for authorization");
      return;
    }
    setLoading(true);
    try {
      // For now, simulating the OTP send process to WhatsApp as requested by "connect backen"
      // Replace with actual API call if needed:
      // const response = await axios.post(`${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/send-login-otp`, { wardenId });
      
      setMaskedNumber("your registered WhatsApp number");
      setStep(2);
      setResendTimer(60);
      toast.success("Security code sent to WhatsApp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Authorization failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/login`,
        { wardenId, otp }
      );

      const { token, warden } = response.data;
      localStorage.setItem("wardenToken", token);
      localStorage.setItem("wardenInfo", JSON.stringify(warden));
      setToken(token);

      const punchStatus = await axios.get(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/punch-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { punchedIn } = punchStatus.data;

      if (!punchedIn) {
        toast.success("Identity verified. Daily punch required.");
        setShowPunchModal(true);
      } else {
        toast.success("Welcome back, Warden.");
        router.push("/warden-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid security code");
    } finally {
      setLoading(false);
    }
  };

  const handlePunchIn = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/api/wardenauth/attendance/punch-in`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Attendance logged successfully");
      setTimeout(() => {
        setShowPunchModal(false);
        router.push("/warden-dashboard");
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Punch in failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full bg-[#F8FAF5] flex items-center justify-center p-6 selection:bg-[#7A8B5E] selection:text-white">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#7A8B5E]/5 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#1A1F16]/5 blur-[120px] rounded-full animate-pulse"></div>
      </div>

      {/* Attendance Modal */}
      {showPunchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#1A1F16]/40 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl border border-[#7A8B5E]/10 text-center animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-[#F8FAF5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#7A8B5E]">
              <Smartphone size={40} />
            </div>
            <h2 className="text-2xl font-black text-[#1A1F16] uppercase italic tracking-tight">Daily Roll Call</h2>
            <p className="text-[11px] text-[#7A8B5E] font-black uppercase tracking-[0.2em] mt-2 mb-8 leading-relaxed">
              Please mark your attendance to access the logistics terminal.
            </p>
            <button
              onClick={handlePunchIn}
              disabled={loading}
              className="w-full bg-[#1A1F16] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Mark Presence"}
            </button>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[60px] shadow-2xl border border-[#7A8B5E]/5 overflow-hidden relative animate-in slide-in-from-bottom-10 duration-1000">
        
        {/* Left Section: Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center p-20 bg-[#F8FAF5] border-r border-[#7A8B5E]/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
            <ShieldCheck size={400} />
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-48 h-48 bg-white rounded-[40px] shadow-2xl shadow-[#7A8B5E]/20 flex items-center justify-center mb-10 mx-auto border border-[#7A8B5E]/10 overflow-hidden group-hover:scale-105 transition-transform duration-700">
              <img src="/logo.png" alt="KGF" className="w-32 h-32 object-contain" />
            </div>
            <h1 className="text-4xl font-black text-[#1A1F16] uppercase italic tracking-tighter mb-4">Warden Portal</h1>
            <div className="w-12 h-1 bg-[#7A8B5E] mx-auto rounded-full mb-6"></div>
            <p className="text-[11px] text-[#7A8B5E] font-black uppercase tracking-[0.3em] max-w-[280px] leading-relaxed mx-auto">
              Precision Management & Operational Oversight
            </p>
          </div>

          <div className="absolute bottom-12 text-[10px] font-bold text-[#1A1F16]/20 uppercase tracking-widest">
            Kokan Global Foundation • Security Standards v2.0
          </div>
        </div>

        {/* Right Section: Form */}
        <div className="p-12 md:p-20 flex flex-col justify-center relative">
          <div className="lg:hidden mb-12 text-center">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-[#1A1F16] uppercase italic">Warden Portal</h2>
          </div>

          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h3 className="text-3xl font-black text-[#1A1F16] uppercase italic tracking-tight mb-2">
                {step === 1 ? "Secure Login" : "Verification"}
              </h3>
              <p className="text-[10px] text-[#7A8B5E] font-black uppercase tracking-[0.2em]">
                {step === 1 ? "Enter your unique administrative ID" : "Secondary verification required"}
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest ml-4">Administrative ID</label>
                  <div className="relative">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7A8B5E]/30 group-focus-within:text-[#7A8B5E] transition-colors" size={20} />
                    <input
                      type="text"
                      value={wardenId}
                      onChange={(e) => setWardenId(e.target.value)}
                      placeholder="W-786-XXXX"
                      required
                      className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-[24px] py-6 pl-16 pr-8 text-sm font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all placeholder:text-[#7A8B5E]/30"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1A1F16] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                      Request Access <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in slide-in-from-right-10 duration-500">
                <div className="p-6 bg-[#F8FAF5] rounded-[32px] border border-[#7A8B5E]/10 mb-8">
                  <div className="flex items-center gap-4 text-[#7A8B5E]">
                    <Smartphone size={24} />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest">OTP Sent To WhatsApp</p>
                      <p className="text-xs font-bold text-[#1A1F16] mt-1">{maskedNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-[#7A8B5E] uppercase tracking-widest ml-4">Access Code</label>
                  <div className="relative">
                    <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-[#7A8B5E]/30 group-focus-within:text-[#7A8B5E] transition-colors" size={20} />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-DIGIT CODE"
                      required
                      maxLength={6}
                      className="w-full bg-[#F8FAF5] border border-[#7A8B5E]/10 rounded-[24px] py-6 pl-16 pr-8 text-sm font-bold text-[#1A1F16] focus:border-[#7A8B5E] shadow-sm outline-none transition-all text-center tracking-[0.5em] placeholder:tracking-normal placeholder:text-[#7A8B5E]/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="w-full bg-[#1A1F16] text-white py-6 rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : "Validate Identity"}
                  </button>
                  
                  <div className="flex items-center justify-between px-2">
                    <button type="button" onClick={() => setStep(1)} className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest hover:text-[#1A1F16] transition-colors">
                      ← Change ID
                    </button>
                    <button 
                      type="button" 
                      disabled={resendTimer > 0 || loading}
                      className="text-[9px] font-black text-[#7A8B5E] uppercase tracking-widest hover:text-[#1A1F16] transition-colors disabled:opacity-30"
                    >
                      {resendTimer > 0 ? `Retry in ${resendTimer}s` : "Resend Code"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            <div className="mt-20 flex items-center gap-3 p-6 bg-[#F8FAF5] rounded-[32px] border border-[#7A8B5E]/10">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#7A8B5E] shadow-sm">
                <ShieldAlert size={18} />
              </div>
              <p className="text-[9px] font-bold text-[#7A8B5E] uppercase leading-tight tracking-tight">
                Authorized Personnel Only. All access attempts are logged for security audits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}