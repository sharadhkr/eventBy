import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchOrganisers,
  toggleStatus,
  toggleVerification,
} from "../api/organizer";

const AdminOrganisers = () => {
  const [organisers, setOrganisers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetchOrganisers();
      setOrganisers(res.data.data);
    } catch {
      toast.error("Failed to load organisers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (id) => {
    await toggleStatus(id);
    toast.success("Status updated");
    load();
  };

  const handleVerify = async (id) => {
    await toggleVerification(id);
    toast.success("Verification updated");
    load();
  };

  if (loading) return <div>Loading organisers...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Organisers</h1>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Events</th>
              <th>Verified</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {organisers.map((o) => (
              <tr key={o._id} className="border-t">
                <td>{o.organisationName}</td>
                <td>{o.email}</td>
                <td>{o.totalEventsCreated}</td>
                <td>{o.isVerified ? "✅" : "❌"}</td>
                <td>{o.isActive ? "🟢" : "🔴"}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleVerify(o._id)}
                    className="px-2 py-1 text-sm bg-blue-500 text-white"
                  >
                    Toggle Verify
                  </button>
                  <button
                    onClick={() => handleStatus(o._id)}
                    className="px-2 py-1 text-sm bg-red-500 text-white"
                  >
                    Toggle Active
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrganisers;
