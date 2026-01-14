import { useOrganiserAuth } from "../context/organiser.auth.context";
import {
  Calendar,
  PlusCircle,
  Users,
  Ticket,
  LogOut,
  LayoutDashboard,
  Settings,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { organiser, logout } = useOrganiserAuth();
  const navigate = useNavigate();

  // In a real app, these would come from an API call in a useEffect
  const stats = [
    { label: "Total Events", value: organiser?.totalEventsCreated || 0, icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Followers", value: organiser?.followerCount || 0, icon: Users, icon: Ticket, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Community Rating", value: `${organiser?.rating?.average || 0}/5`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      
      {/* ─── SIDEBAR (Desktop) ────────────────────── */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col p-6 space-y-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-black text-slate-800 tracking-tight text-xl">Eventrix</span>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarLink icon={LayoutDashboard} label="Overview" active onClick={() => navigate("/")} />
          <SidebarLink icon={Calendar} label="My Events" onClick={() => navigate("/events/manage")} />
          <SidebarLink icon={PlusCircle} label="Create New" onClick={() => navigate("/events/create")} />
          <SidebarLink icon={Settings} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─────────────────────────── */}
      <div className="flex-1 flex flex-col">
        
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b p-4 flex justify-between items-center">
          <span className="font-black text-indigo-600">Eventrix</span>
          <button onClick={logout} className="text-red-500"><LogOut size={20}/></button>
        </header>

        <main className="p-6 md:p-12 max-w-6xl w-full mx-auto space-y-10">
          
          {/* Welcome Header */}
          <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                Hey, {organiser?.ownerName || 'Organiser'} 👋
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                Currently managing <span className="text-indigo-600 font-bold">{organiser?.organisationName}</span>
              </p>
            </div>
            <button 
              onClick={() => navigate("/events/create")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              <PlusCircle size={18} /> Create Event
            </button>
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="bg-white rounded-[2rem] border border-slate-100 p-8 flex items-center gap-5 shadow-sm"
              >
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800">{stat.value}</p>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Quick Actions */}
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionCard 
                title="Manage Event Catalog"
                desc="Update, delete or view status of your published events."
                icon={Calendar}
                onClick={() => navigate("/events/manage")}
              />
              <ActionCard 
                title="Community Analytics"
                desc="See who is following your organization and event reach."
                icon={Users}
                onClick={() => navigate("/organiser/analytics")}
              />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

/* ─── HELPER COMPONENTS ───────────────────── */

const SidebarLink = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl transition-all font-bold text-sm
    ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
  >
    <Icon size={18} /> {label}
  </button>
);

const ActionCard = ({ title, desc, icon: Icon, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white border border-slate-100 p-6 rounded-[2rem] text-left flex items-center justify-between group hover:border-indigo-200 transition-all shadow-sm"
  >
    <div className="flex items-center gap-5">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{title}</h4>
        <p className="text-xs text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
    <ChevronRight className="text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
  </button>
);

export default Dashboard;