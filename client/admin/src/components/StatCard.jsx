import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    transition={{ duration: 0.3 }}
    className={`${bgColor || "bg-gradient-to-br from-slate-50 to-slate-100"} rounded-2xl p-6 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl transition-all duration-300`}
  >
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl md:text-4xl font-black text-gray-900">{value}</p>
      </div>
      {Icon && (
        <div className={`${color || "bg-blue-100"} p-3 rounded-xl`}>
          {typeof Icon === "function" ? (
            <Icon className="text-white" size={24} />
          ) : (
            Icon
          )}
        </div>
      )}
    </div>
    <div className="pt-3 border-t border-gray-200">
      <p className="text-xs text-gray-500">Last 30 days</p>
    </div>
  </motion.div>
);

export default StatCard;
