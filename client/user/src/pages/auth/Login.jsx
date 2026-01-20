// import { useEffect, useRef, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { Loader2, ArrowLeft } from "lucide-react";

// import {
//   auth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
//   GoogleAuthProvider,
//   GithubAuthProvider,
//   signInWithPopup,
// } from "../../utils/firebase";

// import { useAuth } from "../../context/auth.context";
// import Loading from "../../components/Loading";

// export default function Login() {
//   const { isAuthenticated, loading, login } = useAuth(); // login comes from context
//   const navigate = useNavigate();
//   const location = useLocation();

//   const from = location.state?.from?.pathname || "/";

//   const [phone, setPhone] = useState("");
//   const [otp, setOtp] = useState(Array(6).fill(""));
//   const [step, setStep] = useState("phone");
//   const [confirmation, setConfirmation] = useState(null);
//   const [sending, setSending] = useState(false);

//   const recaptchaRef = useRef(null);
//   const otpRefs = useRef([]);

//   useEffect(() => {
//     if (!loading && isAuthenticated) {
//       navigate(from, { replace: true });
//     }
//   }, [loading, isAuthenticated, navigate, from]);

//   useEffect(() => {
//     if (recaptchaRef.current) return;

//     try {
//       // ✅ FIXED: Argument order is (auth, elementId, options)
//       recaptchaRef.current = new RecaptchaVerifier(
//         auth, 
//         "recaptcha-container", 
//         { size: "invisible" }
//       );
//     } catch (err) {
//       console.error("Recaptcha init error:", err);
//     }
//   }, []);

//   const loginToBackend = async (firebaseUser) => {
//     try {
//       setSending(true);
//       const idToken = await firebaseUser.getIdToken(true);
      
//       // ✅ Use the login function from context (which calls API internally)
//       const success = await login(idToken); 
      
//       if (success) {
//         navigate(from, { replace: true });
//       }
//     } catch (err) {
//       toast.error("Backend sync failed");
//     } finally {
//       setSending(false);
//     }
//   };

//   const sendOTP = async () => {
//     if (phone.length < 10) return toast.error("Enter a valid phone number");
//     try {
//       setSending(true);
//       const appVerifier = recaptchaRef.current;
//       const result = await signInWithPhoneNumber(auth, "+91" + phone, appVerifier);
//       setConfirmation(result);
//       setStep("otp");
//       toast.success("OTP sent");
//     } catch (e) {
//       console.error(e);
//       toast.error(e.message);
//       // Reset recaptcha if it fails
//       if (recaptchaRef.current) recaptchaRef.current.clear();
//       recaptchaRef.current = null;
//     } finally {
//       setSending(false);
//     }
//   };

//   const verifyOTP = async () => {
//     try {
//       setSending(true);
//       const result = await confirmation.confirm(otp.join(""));
//       await loginToBackend(result.user);
//     } catch {
//       toast.error("Invalid OTP");
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleSocial = async (Provider) => {
//     try {
//       setSending(true);
//       const result = await signInWithPopup(auth, new Provider());
//       await loginToBackend(result.user);
//     } catch (e) {
//       toast.error(e.message);
//     } finally {
//       setSending(false);
//     }
//   };

//   if (loading) return <Loading />;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       {/* Container for invisible recaptcha */}
//       <div id="recaptcha-container"></div>

//       <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
//         {step === "phone" ? (
//           <div className="space-y-4">
//             <h2 className="text-2xl font-bold">Login</h2>
//             <input
//               className="w-full border p-2 rounded"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
//               placeholder="Phone number"
//             />
//             <button 
//               className="w-full bg-blue-600 text-white p-2 rounded flex justify-center" 
//               onClick={sendOTP} 
//               disabled={sending}
//             >
//               {sending ? <Loader2 className="animate-spin" /> : "Send OTP"}
//             </button>

//             <div className="flex gap-2">
//               <button className="flex-1 border p-2 rounded" onClick={() => handleSocial(GoogleAuthProvider)}>Google</button>
//               <button className="flex-1 border p-2 rounded" onClick={() => handleSocial(GithubAuthProvider)}>GitHub</button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <button className="flex items-center text-sm" onClick={() => setStep("phone")}>
//               <ArrowLeft size={16} /> Change number
//             </button>
//             <div className="flex justify-between">
//               {otp.map((v, i) => (
//                 <input
//                   key={i}
//                   ref={(el) => (otpRefs.current[i] = el)}
//                   className="w-10 border-b-2 text-center text-xl outline-none focus:border-blue-500"
//                   value={v}
//                   maxLength={1}
//                   onChange={(e) => {
//                     const val = e.target.value.replace(/\D/g, "");
//                     const next = [...otp];
//                     next[i] = val;
//                     setOtp(next);
//                     if (val && i < 5) otpRefs.current[i + 1]?.focus();
//                   }}
//                 />
//               ))}
//             </div>
//             <button 
//               className="w-full bg-green-600 text-white p-2 rounded" 
//               onClick={verifyOTP} 
//               disabled={sending}
//             >
//               {sending ? "Verifying..." : "Verify OTP"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowLeft,
  Phone,
  Shield,
  CheckCircle2,
  Sparkles,
  Mail,
  Lock,
  Check,
} from "lucide-react";

import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "../../utils/firebase";

import { useAuth } from "../../context/auth.context";
import Loading from "../../components/Loading";
import bg from "../../assets/bg.jpg";

export default function Login() {
  const { isAuthenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState("phone");
  const [confirmation, setConfirmation] = useState(null);
  const [sending, setSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [focusedOtpIndex, setFocusedOtpIndex] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const recaptchaRef = useRef(null);
  const otpRefs = useRef([]);

  /* ================= REDIRECT ================= */
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, from]);

  /* ================= RESEND TIMER ================= */
  useEffect(() => {
    if (!resendTimer) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  /* ================= CREATE RECAPTCHA ================= */
  const getRecaptcha = () => {
    if (recaptchaRef.current) return recaptchaRef.current;

    recaptchaRef.current = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );

    return recaptchaRef.current;
  };

  /* ================= BACKEND LOGIN ================= */
  const loginToBackend = async (firebaseUser) => {
    const token = await firebaseUser.getIdToken(true);
    const ok = await login(token);
    if (ok) {
      setShowSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 1500);
    }
  };

  /* ================= SEND OTP ================= */
  const sendOTP = async () => {
    if (phone.length !== 10) {
      return toast.error("Enter valid 10-digit phone number");
    }

    try {
      setSending(true);
      const verifier = getRecaptcha();

      const result = await signInWithPhoneNumber(
        auth,
        "+91" + phone,
        verifier
      );

      setConfirmation(result);
      setStep("otp");
      setResendTimer(60);
      toast.success("OTP sent successfully!");
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (e) {
      toast.error(e.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  /* ================= VERIFY OTP ================= */
  const verifyOTP = async () => {
    if (!confirmation) return;
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      return toast.error("Please enter complete OTP");
    }

    try {
      setSending(true);
      const res = await confirmation.confirm(otpValue);
      await loginToBackend(res.user);
    } catch {
      toast.error("Invalid OTP. Please try again.");
      setOtp(Array(6).fill(""));
      otpRefs.current[0]?.focus();
    } finally {
      setSending(false);
    }
  };

  /* ================= ENHANCED OTP HANDLING ================= */
  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "");
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-focus next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all filled
    if (index === 5 && digit && newOtp.every(d => d)) {
      setTimeout(() => verifyOTP(), 300);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = Array(6).fill("");
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    const nextEmptyIndex = newOtp.findIndex(d => !d);
    if (nextEmptyIndex !== -1) {
      otpRefs.current[nextEmptyIndex]?.focus();
    } else {
      otpRefs.current[5]?.focus();
      if (pastedData.length === 6) {
        setTimeout(() => verifyOTP(), 300);
      }
    }
  };

  /* ================= SOCIAL ================= */
  const handleSocial = async (Provider) => {
    try {
      setSending(true);
      const res = await signInWithPopup(auth, new Provider());
      await loginToBackend(res.user);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      
      <div id="recaptcha-container"></div>

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-purple-100/40 to-pink-100/40 animate-gradient bg-[length:400%_400%]" />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-300/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-500">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-500">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-600">Logging you in...</p>
          </div>
        </div>
      )}

      <div className="relative w-full max-w-md">
        
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] overflow-hidden border border-white/20 transition-all duration-500 hover:shadow-[0_12px_48px_rgba(0,0,0,0.12)]">
          
          {/* Header with gradient */}
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-90" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgb3BhY2l0eT0iLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
            
            <div className="relative h-full flex flex-col items-center justify-center text-white px-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 animate-in zoom-in duration-700">
                <Sparkles size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2 animate-in slide-in-from-bottom duration-700">
                Welcome Back
              </h1>
              <p className="text-white/80 text-sm animate-in slide-in-from-bottom duration-700 delay-100">
                Sign in to continue your journey
              </p>
            </div>
          </div>

          {/* Content area */}
          <div className="p-8 space-y-6">
            
            {/* Phone step */}
            {step === "phone" && (
              <div className="space-y-5 animate-in fade-in slide-in-from-right duration-500">
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone size={16} className="text-indigo-600" />
                    Phone Number
                  </label>
                  
                  <div className="flex gap-3">
                    <div className="w-20 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-3.5 text-center font-semibold text-gray-700 shadow-sm">
                      +91
                    </div>
                    <input
                      className="flex-1 bg-white border-2 border-gray-200 rounded-xl p-3.5 text-lg focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 shadow-sm hover:border-gray-300"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      onKeyDown={(e) => e.key === "Enter" && sendOTP()}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  
                  {phone.length > 0 && (
                    <div className="flex items-center gap-1.5 text-xs animate-in fade-in slide-in-from-left duration-300">
                      {phone.length === 10 ? (
                        <>
                          <Check size={14} className="text-green-600" />
                          <span className="text-green-600 font-medium">Valid number</span>
                        </>
                      ) : (
                        <span className="text-gray-500">{10 - phone.length} digits remaining</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={sendOTP}
                  disabled={sending || phone.length !== 10}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {sending ? (
                    <Loader2 className="animate-spin mx-auto" size={24} />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Lock size={20} />
                      Send OTP
                    </span>
                  )}
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleSocial(GoogleAuthProvider)}
                    disabled={sending}
                    className="flex items-center justify-center gap-2 border-2 border-gray-200 rounded-xl p-3.5 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium text-gray-700 shadow-sm hover:shadow transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </button>
                  <button
                    onClick={() => handleSocial(GithubAuthProvider)}
                    disabled={sending}
                    className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white rounded-xl p-3.5 transition-all duration-300 font-medium shadow-sm hover:shadow transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                    GitHub
                  </button>
                </div>
              </div>
            )}

            {/* OTP step */}
            {step === "otp" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right duration-500">
                
                <button
                  onClick={() => {
                    setStep("phone");
                    setOtp(Array(6).fill(""));
                    setConfirmation(null);
                  }}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  Change number
                </button>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100 shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Shield className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Verification code sent</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Enter the 6-digit code sent to <span className="font-semibold text-gray-800">+91 {phone}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-3 block">
                    Enter OTP
                  </label>
                  <div className="flex justify-center gap-2.5">
                    {otp.map((v, i) => (
                      <input
                        key={i}
                        ref={(el) => (otpRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={v}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={handleOtpPaste}
                        onFocus={() => setFocusedOtpIndex(i)}
                        onBlur={() => setFocusedOtpIndex(null)}
                        className={`w-12 h-14 text-center text-2xl font-semibold border-2 rounded-xl outline-none transition-all duration-300 shadow-sm ${
                          v
                            ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                            : focusedOtpIndex === i
                            ? "border-indigo-400 bg-white ring-4 ring-indigo-100 scale-105"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Paste your OTP or enter it manually
                  </p>
                </div>

                <button
                  onClick={verifyOTP}
                  disabled={sending || otp.some(d => !d)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white p-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <Loader2 className="animate-spin mx-auto" size={24} />
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} />
                      Verify & Continue
                    </span>
                  )}
                </button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                      Resend OTP in <span className="font-semibold text-indigo-600">{resendTimer}s</span>
                    </div>
                  ) : (
                    <button
                      onClick={sendOTP}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium underline underline-offset-2 hover:underline-offset-4 transition-all"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-sm text-gray-600 mt-6 animate-in fade-in duration-700 delay-300">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-gradient {
          animation: gradient 15s ease infinite;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}