import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, XCircle, Shield, Mail, Building2 } from "lucide-react";
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Loading organisers...</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      {/* Header */}
      <motion.div className="mb-8" variants={itemVariants}>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg">
            <Building2 className="text-white" size={24} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Organisers
          </h1>
        </div>
        <p className="text-gray-600 mt-2">Manage and verify organiser accounts</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid md:grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Total Organisers</p>
          <p className="text-2xl font-bold text-gray-900">{organisers.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Verified</p>
          <p className="text-2xl font-bold text-green-600">
            {organisers.filter((o) => o.isVerified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-blue-600">
            {organisers.filter((o) => o.isActive).length}
          </p>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Organisation
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Verified
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {organisers.map((o, idx) => (
                <motion.tr
                  key={o._id}
                  variants={itemVariants}
                  className="hover:bg-slate-50 transition duration-300"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {o.organisationName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {o.organisationName}
                        </p>
                        <p className="text-xs text-gray-500">ID: {o._id?.slice(-5)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm">{o.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-sm">
                      {o.totalEventsCreated || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {o.isVerified ? (
                      <CheckCircle className="text-green-500" size={20} />
                    ) : (
                      <XCircle className="text-gray-300" size={20} />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {o.isActive ? (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleVerify(o._id)}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 transition duration-300"
                      >
                        <Shield size={14} />
                        {o.isVerified ? "Unverify" : "Verify"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatus(o._id)}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition duration-300 ${
                          o.isActive
                            ? "bg-red-100 hover:bg-red-200 text-red-700"
                            : "bg-green-100 hover:bg-green-200 text-green-700"
                        }`}
                      >
                        {o.isActive ? "Deactivate" : "Activate"}
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminOrganisers;
