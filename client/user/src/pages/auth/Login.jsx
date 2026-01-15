import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft, Phone, Shield, CheckCircle2 } from "lucide-react";
import bg from "../../assets/bg.jpg";

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

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState("phone"); // phone | otp
  const [confirmation, setConfirmation] = useState(null);
  const [sending, setSending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const recaptchaRef = useRef(null);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (recaptchaRef.current) return;

    recaptchaRef.current = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );

    recaptchaRef.current.render();
  }, []);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const sendOTP = async () => {
    const fullPhone = "+91" + phone;
    if (!fullPhone.match(/^\+91\d{10}$/)) {
      return toast.error("Enter a valid 10-digit phone number");
    }

    try {
      setSending(true);
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaRef.current
      );
      setConfirmation(result);
      setStep("otp");
      setResendTimer(60);
      toast.success("OTP sent successfully!");

      // Focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return toast.error("Enter complete 6-digit OTP");

    try {
      setSending(true);
      await confirmation.confirm(otpCode);
      toast.success("Login successful!");
    } catch {
      toast.error("Invalid OTP. Please try again.");
      setOtp(Array(6).fill(""));
      otpInputRefs.current[0]?.focus();
    } finally {
      setSending(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        otpInputRefs.current[Math.min(digits.length, 5)]?.focus();
      });
    }
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      toast.success("Logged in with Google");
    } catch (err) {
      toast.error(err.message || "Google login failed");
    }
  };

  const loginGithub = async () => {
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
      toast.success("Logged in with GitHub");
    } catch (err) {
      toast.error(err.message || "GitHub login failed");
    }
  };

  const resetToPhone = () => {
    setStep("phone");
    setOtp(Array(6).fill(""));
    setConfirmation(null);
    setResendTimer(0);
  };

  if (loading) {
    return (
      <Loading/>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8 :px-0 md:py-0 relative overflow-hidden">
      <div id="recaptcha-container"></div>

      {/* DECORATIVE BLOBS */}
      <div className="absolute w-96 h-96 -top-48 -left-48 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* AUTH CARD */}
      <div className="relative w-full max-w-md z-10 flex items-center">


        {/* MAIN CARD */}
        <div className="rounded-3xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden">

          {/* HEADER IMAGE */}
          <div className="h-48 relative overflow-hidden bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
            <img 
              src={bg} 
              alt="Background" 
              className="w-full h-full object-cover opacity-80"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
            
            {/* Logo on image */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                {/* <div className="w-20 h-20 rounded-2xl bg-white/90 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-lg"> */}
                  {/* <span className="text-4xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">E</span> */}
                {/* </div> */}
                {/* <h1 className="text-3xl font-bold text-white drop-shadow-lg">Eventrix</h1> */}
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-8 space-y-4">

            {/* PHONE STEP */}
            {step === "phone" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone size={16} />
                    Phone Number
                  </label>
                  <div className="flex gap-3 w-full">
                    {/* COUNTRY CODE */}
                    <div className="w-20 text-center border-2 border-gray-200 rounded-xl p-3 bg-gray-50 font-semibold text-gray-700">
                      +91
                    </div>

                    {/* PHONE NUMBER */}
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setPhone(digits);
                      }}
                      placeholder="xxxxxxxxx"
                      maxLength={10}
                      className="flex-1 border-2 border-gray-200 rounded-xl p-3 text-lg tracking-wide focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition"
                    />
                  </div>
                </div>

                <button
                  onClick={sendOTP}
                  disabled={sending || phone.length !== 10}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-3.5 rounded-xl font-semibold transition shadow-lg shadow-indigo-200 disabled:shadow-none"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin w-5 h-5" />
                      Sending...
                    </span>
                  ) : (
                    "Send OTP"
                  )}
                </button>

                {/* DIVIDER */}
                <div className="flex items-center gap-3 text-gray-400 text-xs font-medium">
                  <div className="flex-1 h-px bg-gray-200" />
                  OR CONTINUE WITH
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* OAUTH BUTTONS */}
                <div className="space-y-3">
                  <button
                    onClick={loginGoogle}
                    className="w-full flex items-center justify-center gap-3 border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 p-3 rounded-xl font-medium transition"
                  >
                    <img
                      src="https://www.svgrepo.com/show/475656/google-color.svg"
                      alt="Google"
                      className="w-5 h-5"
                    />
                    Continue with Google
                  </button>

                  <button
                    onClick={loginGithub}
                    className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white hover:bg-black p-3 rounded-xl font-medium transition"
                  >
                    <img
                      src="https://www.svgrepo.com/show/512317/github-142.svg"
                      alt="GitHub"
                      className="w-5 h-5 invert"
                    />
                    Continue with GitHub
                  </button>
                </div>
              </>
            )}

            {/* OTP STEP */}
            {step === "otp" && (
              <>
                {/* BACK BUTTON */}
                <button
                  onClick={resetToPhone}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
                >
                  <ArrowLeft size={18} />
                  Change number
                </button>

                {/* INFO */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                  <Shield className="text-indigo-600 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm">
                    <p className="font-medium text-indigo-900">OTP sent to +91 {phone}</p>
                    <p className="text-indigo-700 mt-1">Enter the 6-digit code to continue</p>
                  </div>
                </div>

                {/* OTP INPUTS */}
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (otpInputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl outline-none transition ${
                        digit
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                      }`}
                    />
                  ))}
                </div>

                {/* VERIFY BUTTON */}
                <button
                  onClick={verifyOTP}
                  disabled={sending || otp.join("").length !== 6}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-3.5 rounded-xl font-semibold transition shadow-lg shadow-green-200 disabled:shadow-none"
                >
                  {sending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin w-5 h-5" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle2 size={20} />
                      Verify & Continue
                    </span>
                  )}
                </button>

                {/* RESEND */}
                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in <span className="font-semibold text-indigo-600">{resendTimer}s</span>
                    </p>
                  ) : (
                    <button
                      onClick={sendOTP}
                      disabled={sending}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-8 pb-6">
            <p className="text-center text-xs text-gray-500">
              By continuing, you agree to our{" "}
              <a href="#" className="text-indigo-600 hover:underline font-medium">Terms</a>
              {" "}and{" "}
              <a href="#" className="text-indigo-600 hover:underline font-medium">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
      {/* SOFT TOP SHADOW STRIP */}
<div className="absolute w-full z-0 opacity-25 top-0 left-0 flex items-center justify-center blur-3xl pointer-events-none">
  <div className="w-[30%] h-24 bg-purple-400 rounded-full" />
  <div className="w-[40%] h-24 bg-pink-400 skew-x-12 rounded-full" />
  <div className="w-[30%] h-24 bg-yellow-300 skew-x-12 rounded-full" />
</div>

    </div>
  );
}