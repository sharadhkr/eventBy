import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Analytics() {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Page Views',
        data: [6500, 7200, 6800, 8100, 7800, 9200, 8600],
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Weekly Page Views' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Visitors</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">24.7K</p>
            <span className="text-green-500 text-sm">+49% ↑</span>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Pageviews</h2>
            <p className="text-2xl font-bold text-indigo-600 mt-2">56.9K</p>
            <span className="text-green-500 text-sm">+7% ↑</span>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Bounce Rate</h2>
            <p className="text-2xl font-bold text-red-600 mt-2">54%</p>
            <span className="text-red-500 text-sm">-7% ↓</span>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold text-gray-700">Avg. Time</h2>
            <p className="text-2xl font-bold text-purple-600 mt-2">2m 56s</p>
            <span className="text-green-500 text-sm">+7% ↑</span>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;   