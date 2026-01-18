import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// ✅ ALL ICONS INCLUDED HERE
import { 
  PlusCircle, Users, Wallet, Eye, Sparkles, Megaphone, Send, X, 
  MapPin, Clock, Globe, ShieldCheck, ArrowUpRight, TrendingUp,
  Edit3, ToggleLeft, ToggleRight 
} from "lucide-react";
import { organiserAPI } from "../api/api";
import { useOrganiserAuth } from "../context/organiser.auth.context";
import { toast } from "react-hot-toast";
import Loading from "../components/Loading";

const Dashboard = () => {
  const { organiser } = useOrganiserAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalRevenue: 0, totalRegistrations: 0, activeEvents: 0 });
  const [loading, setLoading] = useState(true);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");

  useEffect(() => {
    const syncDashboard = async () => {
      try {
        const [resEvents, resStats] = await Promise.all([
          organiserAPI.getMyEvents(),
          organiserAPI.getDashboardStats() 
        ]);
        setEvents(resEvents.data.data || []);
        // Backend now sends pre-calculated revenue and participants
        setStats(resStats.data.data || { totalRevenue: 0, totalRegistrations: 0, activeEvents: 0 });
      } catch (err) {
        toast.error("Data sync failed");
      } finally {
        setLoading(false);
      }
    };
    syncDashboard();
  }, []);

  const derivedData = useMemo(() => {
    const totalCapacity = events.reduce((sum, e) => sum + (e.maxParticipants || 0), 0);
    // Uses your schema's participantsCount field
    const totalJoined = events.reduce((sum, e) => sum + (e.participantsCount || 0), 0);
    return { totalCapacity, totalJoined };
  }, [events]);

  const handleSendBroadcast = async () => {
    if (!broadcastMsg.trim()) return toast.error("Message empty");
    try {
      await organiserAPI.postBroadcast(broadcastMsg);
      toast.success("Broadcast deployed!");
      setIsBroadcastOpen(false);
      setBroadcastMsg("");
    } catch { toast.error("Broadcast failed"); }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#fafafa] pb-32 relative overflow-hidden">
      {/* 🌈 Aura Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-violet-100/40 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-pink-100/30 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em]">
              <Sparkles size={14} />
              <span>{organiser?.organisationName} Console</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter">Overview</h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setIsBroadcastOpen(true)} className="flex items-center gap-2 bg-white border-2 border-indigo-100 text-indigo-600 px-6 py-3.5 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-sm">
              <Megaphone size={18} /> Broadcast
            </button>
            <button onClick={() => navigate("/events/create")} className="flex items-center gap-2 bg-gray-900 text-white px-8 py-3.5 rounded-2xl font-bold hover:shadow-2xl transition-all">
              <PlusCircle size={18} /> Create
            </button>
          </div>
        </div>

        {/* 📊 Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="Total Earnings" value={`₹${stats.totalRevenue}`} sub="Real-time Revenue" icon={Wallet} color="violet" />
          <StatCard label="Joined Users" value={derivedData.totalJoined} sub={`of ${derivedData.totalCapacity} capacity`} icon={Users} color="pink" />
          <StatCard label="Active Events" value={stats.activeEvents} sub="Live on Platform" icon={Eye} color="indigo" />
          <StatCard label="Success" value="94%" sub="Completion Rate" icon={ShieldCheck} color="yellow" />
        </div>

        {/* 📈 Chart & Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl shadow-gray-200/40 border border-white">
            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-2">
              Revenue Flow <TrendingUp size={20} className="text-emerald-500" />
            </h3>
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="auraGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={5} fill="url(#auraGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl shadow-gray-200/40 border border-white">
            <h3 className="text-2xl font-black text-gray-900 mb-8">Booking Aura</h3>
            <div className="grid grid-cols-5 gap-3">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-violet-50 border border-violet-100/50 hover:bg-violet-200 transition-colors" />
              ))}
            </div>
          </div>
        </div>

        {/* 📋 Event Table */}
        <section className="bg-white rounded-[3rem] border border-gray-50 shadow-2xl shadow-gray-200/40 overflow-hidden">
          <div className="px-10 py-8 border-b border-gray-50 bg-gray-50/20">
            <h3 className="text-xl font-black text-gray-900">Event Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-10">
                  <th className="px-10 py-6">Identity</th>
                  <th className="px-10 py-6">Joined</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map((event) => (
                  <tr key={event._id} className="group hover:bg-indigo-50/30 transition-all">
                    <td className="px-10 py-6">
                      <p className="font-black text-gray-900">{event.title}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">{event.eventType} • {event.mode}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900">{event.participantsCount || 0}</span>
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${(event.participantsCount / event.maxParticipants) * 100}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button onClick={() => navigate(`/events/edit/${event._id}`)} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:border-indigo-200 transition-all">
                        <Edit3 size={18} className="text-gray-400 hover:text-indigo-600" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* 📣 Broadcast Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setIsBroadcastOpen(false)} />
          <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl relative z-10 border border-white">
            <h3 className="text-3xl font-black text-gray-900 mb-4">Mass Broadcast</h3>
            <textarea 
              value={broadcastMsg}
              onChange={(e) => setBroadcastMsg(e.target.value)}
              placeholder="Send a global announcement..."
              className="w-full h-40 p-6 bg-gray-50 rounded-[2rem] border-none focus:ring-4 focus:ring-indigo-500/10 outline-none resize-none mb-8"
            />
            <button onClick={handleSendBroadcast} className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all">
              <Send size={20} /> Deploy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, sub, icon: Icon, color }) => {
  const themes = {
    violet: "text-violet-600 bg-violet-100",
    pink: "text-pink-600 bg-pink-100",
    indigo: "text-indigo-600 bg-indigo-100",
    yellow: "text-amber-600 bg-amber-100"
  };
  return (
    <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-white shadow-xl shadow-gray-200/30">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${themes[color]} bg-opacity-40`}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">{value}</h3>
      <p className="text-[10px] font-bold text-emerald-500">{sub}</p>
    </div>
  );
};

const chartData = [
  { name: 'P1', revenue: 4000 }, { name: 'P2', revenue: 3000 }, { name: 'P3', revenue: 5000 },
  { name: 'P4', revenue: 8000 }, { name: 'P5', revenue: 6000 }, { name: 'P6', revenue: 9500 }
];

export default Dashboard;
