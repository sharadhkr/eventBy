import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "../../utils/firebase";

import { useAuth } from "../../context/auth.context";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("+91");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp
  const [confirmation, setConfirmation] = useState(null);
  const [sending, setSending] = useState(false);

  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  useEffect(() => {
    if (recaptchaRef.current) return;

    recaptchaRef.current = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      },
      auth
    );

    recaptchaRef.current.render();
  }, []);

  const sendOTP = async () => {
    if (!phone.match(/^\+[1-9]\d{9,14}$/)) {
      return toast.error("Use format +919876543210");
    }

    try {
      setSending(true);
      const result = await signInWithPhoneNumber(
        auth,
        phone,
        recaptchaRef.current
      );
      setConfirmation(result);
      setStep("otp");
      toast.success("OTP sent");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setSending(false);
    }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");

    try {
      setSending(true);
      await confirmation.confirm(otp);
      toast.success("Login successful");
    } catch {
      toast.error("Invalid OTP");
    } finally {
      setSending(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div id="recaptcha-container"></div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-5">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          Eventrix
        </h1>

        <button
          onClick={loginGoogle}
          className="w-full border p-3 rounded-lg flex justify-center gap-2"
        >
          Google Login
        </button>

        <button
          onClick={loginGithub}
          className="w-full border p-3 rounded-lg flex justify-center gap-2"
        >
          GitHub Login
        </button>

        <div className="text-center text-gray-400 text-sm">OR</div>

        {step === "phone" ? (
          <>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-3 rounded-lg"
              placeholder="+91XXXXXXXXXX"
            />

            <button
              onClick={sendOTP}
              disabled={sending}
              className="w-full bg-indigo-600 text-white p-3 rounded-lg"
            >
              {sending ? "Sending..." : "Send OTP"}
            </button>
          </>
        ) : (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="w-full border p-3 rounded-lg text-center text-xl"
              placeholder="123456"
            />

            <button
              onClick={verifyOTP}
              disabled={sending}
              className="w-full bg-green-600 text-white p-3 rounded-lg"
            >
              {sending ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
