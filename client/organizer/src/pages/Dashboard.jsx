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
