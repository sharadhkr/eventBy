import { useAdminDashboard } from "../context/dashboard";
import StatCard from "../components/StatCard";
import LineChart from "../components/LineChart";

const AdminDashboard = () => {
  const { overview, growth, revenue, loading } =
    useAdminDashboard();

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Users" value={overview.totalUsers} />
        <StatCard title="Organisers" value={overview.totalOrganisers} />
        <StatCard title="Events" value={overview.totalEvents} />
        <StatCard title="Revenue" value={`₹${overview.totalRevenue}`} />
      </div>

      <LineChart data={growth.users} dataKey="count" color="#6366f1" />
      <LineChart data={revenue} dataKey="total" color="#f59e0b" />
    </div>
  );
};

export default AdminDashboard;
