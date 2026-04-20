import {
  LineChart as LC,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

const LineChart = ({ data, dataKey, color, title }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
  >
    {title && (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">Trend analysis over time</p>
      </div>
    )}
    <ResponsiveContainer width="100%" height={300}>
      <LC data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="_id" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color || "#4f46e5"}
          strokeWidth={3}
          dot={{ fill: color || "#4f46e5", r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LC>
    </ResponsiveContainer>
  </motion.div>
);

export default LineChart;
