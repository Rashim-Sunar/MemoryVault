"use client";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useMediaStore } from "@/context/MediaStore";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardStats = () => {
  const { dashboardStats, fetchDashboardStats, loading } = useMediaStore();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading || !dashboardStats) return <p>Loading dashboard...</p>;

  const barData = {
    labels: dashboardStats.dailyStats?.map((d) => d._id) || [],
    datasets: [
      {
        label: "Memories per day",
        data: dashboardStats.dailyStats?.map((d) => d.count) || [],
        backgroundColor: "rgba(99, 102, 241, 0.7)",
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mx-4"
    >
      {/* Total Cards */}
      <Card className="p-4 rounded-xl bg-indigo-500 text-white shadow-md">
        <h3 className="text-lg font-semibold">Total Memories</h3>
        <p className="text-2xl font-bold">{dashboardStats.totalMemories}</p>
      </Card>

      <Card className="p-4 rounded-xl bg-violet-500 text-white shadow-md">
        <h3 className="text-lg font-semibold">Total Photos</h3>
        <p className="text-2xl font-bold">{dashboardStats.totalPhotos}</p>
      </Card>

      <Card className="p-4 rounded-xl bg-sky-500 text-white shadow-md">
        <h3 className="text-lg font-semibold">Total Videos</h3>
        <p className="text-2xl font-bold">{dashboardStats.totalVideos}</p>
      </Card>

      {/* Bar Chart */}
      <Card className="col-span-1 md:col-span-3 p-4 rounded-xl shadow-md bg-white mb-4">
        <h3 className="font-semibold mb-2">Memories Timeline</h3>
        <Bar data={barData} />
      </Card>
    </motion.div>
  );
};

export default DashboardStats;
