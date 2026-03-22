"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useMediaStore } from "@/context/MediaStore";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const DashboardStats = () => {
    const { dashboardStats, fetchDashboardStats, loading } = useMediaStore();
    useEffect(() => {
        fetchDashboardStats();
    }, []);
    if (loading || !dashboardStats)
        return _jsx("p", { children: "Loading dashboard..." });
    const dailyStats = Array.isArray(dashboardStats.dailyStats)
        ? dashboardStats.dailyStats
        : [];
    const barData = {
        labels: dailyStats.map((d) => d._id),
        datasets: [
            {
                label: "Memories per day",
                data: dailyStats.map((d) => d.count),
                backgroundColor: "rgba(99, 102, 241, 0.7)",
            },
        ],
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, className: "grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mx-4", children: [_jsxs(Card, { className: "p-4 rounded-xl bg-indigo-500 text-white shadow-md", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Total Memories" }), _jsx("p", { className: "text-2xl font-bold", children: dashboardStats.totalMemories })] }), _jsxs(Card, { className: "p-4 rounded-xl bg-violet-500 text-white shadow-md", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Total Photos" }), _jsx("p", { className: "text-2xl font-bold", children: dashboardStats.totalPhotos })] }), _jsxs(Card, { className: "p-4 rounded-xl bg-sky-500 text-white shadow-md", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Total Videos" }), _jsx("p", { className: "text-2xl font-bold", children: dashboardStats.totalVideos })] }), _jsxs(Card, { className: "col-span-1 md:col-span-3 p-4 rounded-xl shadow-md bg-slate-200 mb-4", children: [_jsx("h3", { className: "font-semibold mb-2 text-orange-400 text-xl", children: "Memories Timeline" }), _jsx(Bar, { data: barData })] })] }));
};
export default DashboardStats;
