import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";

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
  const { isAuthenticated, loading, login } = useAuth(); // login comes from context
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [step, setStep] = useState("phone");
  const [confirmation, setConfirmation] = useState(null);
  const [sending, setSending] = useState(false);

  const recaptchaRef = useRef(null);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, from]);

  useEffect(() => {
    if (recaptchaRef.current) return;

    try {
      // ✅ FIXED: Argument order is (auth, elementId, options)
      recaptchaRef.current = new RecaptchaVerifier(
        auth, 
        "recaptcha-container", 
        { size: "invisible" }
      );
    } catch (err) {
      console.error("Recaptcha init error:", err);
    }
  }, []);

  const loginToBackend = async (firebaseUser) => {
    try {
      setSending(true);
      const idToken = await firebaseUser.getIdToken(true);
      
      // ✅ Use the login function from context (which calls API internally)
      const success = await login(idToken); 
      
      if (success) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      toast.error("Backend sync failed");
    } finally {
      setSending(false);
    }
  };

  const sendOTP = async () => {
    if (phone.length < 10) return toast.error("Enter a valid phone number");
    try {
      setSending(true);
      const appVerifier = recaptchaRef.current;
      const result = await signInWithPhoneNumber(auth, "+91" + phone, appVerifier);
      setConfirmation(result);
      setStep("otp");
      toast.success("OTP sent");
    } catch (e) {
      console.error(e);
      toast.error(e.message);
      // Reset recaptcha if it fails
      if (recaptchaRef.current) recaptchaRef.current.clear();
      recaptchaRef.current = null;
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setSending(true);
      const result = await confirmation.confirm(otp.join(""));
      await loginToBackend(result.user);
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setSending(false);
    }
  };

  const handleSocial = async (Provider) => {
    try {
      setSending(true);
      const result = await signInWithPopup(auth, new Provider());
      await loginToBackend(result.user);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Container for invisible recaptcha */}
      <div id="recaptcha-container"></div>

      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        {step === "phone" ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Login</h2>
            <input
              className="w-full border p-2 rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="Phone number"
            />
            <button 
              className="w-full bg-blue-600 text-white p-2 rounded flex justify-center" 
              onClick={sendOTP} 
              disabled={sending}
            >
              {sending ? <Loader2 className="animate-spin" /> : "Send OTP"}
            </button>

            <div className="flex gap-2">
              <button className="flex-1 border p-2 rounded" onClick={() => handleSocial(GoogleAuthProvider)}>Google</button>
              <button className="flex-1 border p-2 rounded" onClick={() => handleSocial(GithubAuthProvider)}>GitHub</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button className="flex items-center text-sm" onClick={() => setStep("phone")}>
              <ArrowLeft size={16} /> Change number
            </button>
            <div className="flex justify-between">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  className="w-10 border-b-2 text-center text-xl outline-none focus:border-blue-500"
                  value={v}
                  maxLength={1}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    const next = [...otp];
                    next[i] = val;
                    setOtp(next);
                    if (val && i < 5) otpRefs.current[i + 1]?.focus();
                  }}
                />
              ))}
            </div>
            <button 
              className="w-full bg-green-600 text-white p-2 rounded" 
              onClick={verifyOTP} 
              disabled={sending}
            >
              {sending ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
