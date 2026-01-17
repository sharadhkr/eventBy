import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Users, CreditCard, CheckCircle, ArrowRight, Ticket } from "lucide-react";
import { userAPI, eventAPI } from "../lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/auth.context";

export default function JoinEventPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [event, setEvent] = useState(null);
  const [step, setStep] = useState(1); // 1: Guidelines, 2: Selection, 3: Success
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch event details to know price/type
    const fetchEvent = async () => {
      try {
        const res = await eventAPI.getEventDetails(eventId);
        setEvent(res.data.data);
      } catch (err) {
        toast.error("Event not found");
        navigate("/events");
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleFinalJoin = async () => {
    setLoading(true);
    try {
      // 1. Logic for Razorpay if price > 0 (as discussed before)
      let paymentData = {};
      if (event.price > 0) {
        const orderRes = await userAPI.createOrder(eventId);
        // ... Open Razorpay Modal here ...
        // paymentData = { razorpay_payment_id: "...", etc }
      }

      // 2. Join Event
      await userAPI.joinEvent(eventId, { teamId: selectedTeam, ...paymentData });
      
      await refreshUser();
      setStep(3); // Move to RSVP Pass
      toast.success("Registration Complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="p-20 text-center font-black">LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* STEP 1: GUIDELINES */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">Event Guidelines</h1>
            <div className="prose text-slate-600">
               <p>{event.guidelines || "Standard event rules apply. Please be on time."}</p>
            </div>
            <button 
              onClick={() => setStep(2)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all"
            >
              I Understand & Agree <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: TEAM & PAYMENT */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
            <h1 className="text-3xl font-black text-slate-900">Final Details</h1>
            
            {event.type === "team" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Team</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="">-- Select your team --</option>
                  {user?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                </select>
              </div>
            )}

            <div className="p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Registration Fee</span>
                <span className="text-2xl font-black text-slate-900">
                  {event.price === 0 ? "FREE" : `₹${event.price}`}
                </span>
              </div>
            </div>

            <button 
              onClick={handleFinalJoin}
              disabled={loading || (event.type === 'team' && !selectedTeam)}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {loading ? "Processing..." : (event.price > 0 ? "Proceed to Payment" : "Confirm Registration")}
            </button>
          </div>
        )}

        {/* STEP 3: ENTRY PASS (RSVP) */}
        {step === 3 && (
          <div className="bg-white p-2 rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white">
            <div className="bg-indigo-600 p-8 text-white text-center rounded-[2.5rem]">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h1 className="text-2xl font-black tracking-tight">Entry Pass</h1>
              <p className="text-indigo-100 text-xs font-bold uppercase mt-2 tracking-widest">Confirmed Participant</p>
            </div>
            
            <div className="p-8 space-y-6 relative">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Participant</p>
                  <p className="font-bold text-slate-800">{user.displayName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Event ID</p>
                  <p className="font-bold text-slate-800">#{eventId.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="border-t-2 border-dashed border-slate-100 pt-6">
                <h2 className="text-xl font-black text-slate-900">{event.title}</h2>
                <p className="text-slate-500 text-sm font-medium">{new Date(event.eventDate).toDateString()}</p>
              </div>

              {/* QR CODE PLACEHOLDER */}
              <div className="bg-slate-50 aspect-square rounded-3xl flex flex-col items-center justify-center border-2 border-slate-100">
                 <Ticket size={48} className="text-slate-200 mb-2" />
                 <p className="text-[10px] font-bold text-slate-300 uppercase">Scan at Venue</p>
              </div>

              <button 
                onClick={() => navigate('/profile')}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm"
              >
                Go to My Profile
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}