import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Users, CreditCard, CheckCircle, ArrowRight, Ticket, Plus, Loader2 } from "lucide-react";
import { userAPI, eventAPI } from "../lib/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/auth.context";
import CreateTeamWizard from "../components/CreateTeamWizard"; // Path to your wizard

export default function JoinEventPage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [event, setEvent] = useState(null);
  const [step, setStep] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  useEffect(() => {
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

  /* ================= HELPERS ================= */
  // Filters user's teams to match event's required format (2 for duo, 4 for squad)
  const getCompatibleTeams = () => {
    if (!user?.teams || !event) return [];
    const requiredSize = event.participationType === "duo" ? 2 : 4;
    return user.teams.filter(t => t.size === requiredSize);
  };

  const handleFinalJoin = async () => {
    // 1. Validation
    if (event.participationType !== "solo" && !selectedTeam) {
      return toast.error("Please select or create a team first");
    }

    setLoading(true);
    try {
      let paymentData = {};

      // 2. Razorpay Logic for Paid Events
      if (event.price > 0) {
        const orderRes = await userAPI.createOrder(eventId);
        const { id: orderId, amount, currency } = orderRes.data;

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount,
          currency,
          name: "Eventrix",
          description: `Register for ${event.title}`,
          order_id: orderId,
          handler: async (response) => {
            await finalizeRegistration({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
          },
          modal: { onDismiss: () => setLoading(false) },
          prefill: { name: user.displayName, email: user.email },
          theme: { color: "#4f46e5" },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // 3. Directly Join for Free Events
        await finalizeRegistration({});
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment initiation failed");
      setLoading(false);
    }
  };

  const finalizeRegistration = async (paymentData) => {
    try {
      await userAPI.joinEvent(eventId, { 
        teamId: selectedTeam || null, 
        ...paymentData 
      });
      await refreshUser();
      setStep(3);
      toast.success("Registration Complete! 🚀");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (!event) return <div className="p-20 text-center font-black animate-pulse">SYNCING EVENT...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* PROGRESS BAR */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* STEP 1: GUIDELINES */}
        {step === 1 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">Event Rules</h1>
            <div className="space-y-4 text-slate-600">
               {event.rules?.map((rule, i) => (
                 <div key={i} className="flex gap-3 items-start">
                    <CheckCircle className="text-emerald-500 mt-1 shrink-0" size={18}/>
                    <p className="font-medium">{rule}</p>
                 </div>
               ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
              I Accept & Continue <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* STEP 2: TEAM & PAYMENT */}
        {step === 2 && (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl space-y-6">
            <h1 className="text-3xl font-black text-slate-900">Registration</h1>
            
            {event.participationType !== "solo" && (
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Select Your {event.participationType} Team
                  </label>
                  <button 
                    onClick={() => setShowCreateTeam(true)}
                    className="text-indigo-600 text-[10px] font-black uppercase flex items-center gap-1 hover:underline"
                  >
                    <Plus size={12}/> Create New
                  </button>
                </div>
                
                <div className="grid gap-3">
                  {getCompatibleTeams().map(team => (
                    <button
                      key={team._id}
                      onClick={() => setSelectedTeam(team._id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${selectedTeam === team._id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <div>
                        <p className="font-bold text-slate-800">{team.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{team.size} Members</p>
                      </div>
                      {selectedTeam === team._id && <CheckCircle className="text-indigo-600" size={20}/>}
                    </button>
                  ))}
                  {getCompatibleTeams().length === 0 && (
                    <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                      <p className="text-slate-400 text-xs font-bold">No {event.participationType} teams found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500 text-sm">Amount to Pay</span>
                <span className="text-2xl font-black text-slate-900">
                  {event.price === 0 ? "FREE" : `₹${event.price}`}
                </span>
              </div>
            </div>

            <button 
              onClick={handleFinalJoin}
              disabled={loading || (event.participationType !== 'solo' && !selectedTeam)}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (event.price > 0 ? "Pay & Register" : "Complete Registration")}
            </button>
          </div>
        )}

        {/* STEP 3: SUCCESS PASS */}
        {step === 3 && (
          <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border-4 border-white">
            <div className="bg-emerald-500 p-10 text-white text-center">
              <CheckCircle size={48} className="mx-auto mb-4" />
              <h1 className="text-3xl font-black uppercase tracking-tight">Entry Pass</h1>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex justify-between border-b border-slate-100 pb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Participant</p>
                  <p className="font-bold text-lg">{user.displayName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Status</p>
                  <p className="font-bold text-emerald-600 uppercase text-sm">Confirmed</p>
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-900">{event.title}</h2>
              <div className="bg-slate-50 p-6 rounded-3xl flex justify-center border-2 border-slate-100">
                 <Ticket size={64} className="text-slate-200" />
              </div>
              <button onClick={() => navigate('/profile')} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black">
                Go to My Events
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE TEAM MODAL */}
      {showCreateTeam && (
        <CreateTeamWizard 
          onClose={() => setShowCreateTeam(false)} 
          onCreated={() => {
            refreshUser(); // Re-syncs user.teams
            setShowCreateTeam(false);
          }}
        />
      )}
    </div>
  );
}
