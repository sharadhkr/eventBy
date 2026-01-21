// components/LineChart.jsx
import {
  LineChart as LC,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LineChart = ({ data, dataKey, color }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LC data={data}>
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Line
        type="monotone"
        dataKey={dataKey}
        stroke={color}
        strokeWidth={2}
      />
    </LC>
  </ResponsiveContainer>
);

export default LineChart;
