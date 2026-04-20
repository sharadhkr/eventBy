import { useAdminDashboard } from "../context/dashboard";
import StatCard from "../components/StatCard";
import LineChart from "../components/LineChart";
import { Users, Building2, Calendar, TrendingUp, ArrowUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { overview, growth, revenue, loading } = useAdminDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-flex animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "Total Users", value: overview.totalUsers, icon: Users, color: "from-blue-500 to-cyan-500", bgColor: "bg-blue-50" },
    { title: "Organisers", value: overview.totalOrganisers, icon: Building2, color: "from-purple-500 to-pink-500", bgColor: "bg-purple-50" },
    { title: "Total Events", value: overview.totalEvents, icon: Calendar, color: "from-orange-500 to-red-500", bgColor: "bg-orange-50" },
    { title: "Revenue", value: `₹${(overview.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: "from-green-500 to-emerald-500", bgColor: "bg-green-50" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div className="mb-8" variants={itemVariants}>
        <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 flex items-center gap-2">
          <Zap className="text-yellow-500" size={20} />
          Welcome back, Administrator
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" variants={itemVariants}>
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`${stat.bgColor} rounded-2xl p-6 backdrop-blur-xl border border-white/30 hover:border-white/60 transition-all duration-300 shadow-lg hover:shadow-2xl`}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-700 text-sm font-semibold mb-2">{stat.title}</p>
                <p className="text-3xl md:text-4xl font-black text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
              </div>
              <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            User Growth
          </h3>
          <LineChart data={growth.users} dataKey="count" color="#3b82f6" />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            Revenue Trend
          </h3>
          <LineChart data={revenue} dataKey="total" color="#10b981" />
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={itemVariants}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg p-4 text-left transition-all transform hover:scale-105">
            <p className="font-semibold mb-1">Manage Organisers</p>
            <p className="text-sm text-white/80">View and approve new organisers</p>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg p-4 text-left transition-all transform hover:scale-105">
            <p className="font-semibold mb-1">View Top Events</p>
            <p className="text-sm text-white/80">Monitor trending events</p>
          </button>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg p-4 text-left transition-all transform hover:scale-105">
            <p className="font-semibold mb-1">System Analytics</p>
            <p className="text-sm text-white/80">Deep dive analytics report</p>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
