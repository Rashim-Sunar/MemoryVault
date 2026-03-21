"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from "@/components/ui/card";
import WelcomeCard from "@/components/WelcomeCard";
import MemoryCarousel from "@/components/MemoryCarousel";
import MiniCalendar from "@/components/MiniCalendar";
import QuickActions from "@/components/QuickActions";
import ActivityFeed from "@/components/ActivityFeed";
import Sidebar from "@/components/Sidebar";
import DashboardStats from "@/components/DashboardStats";
import RecentMemoriesCarousel from "@/components/RecentMemoriesCorousel";
import { useHomeStore } from "@/store/useHomeStore";
export default function Home() {
    // const [active, setActive] = useState("Dashboard");
    const { active, setActive } = useHomeStore();
    return (_jsxs("div", { className: "flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-indigo-500 via-indigo-800 to-sky-500", children: [_jsx(Sidebar, { active: active, setActive: setActive }), _jsxs("main", { className: "flex-1 w-full h-full relative", children: [_jsx("div", { className: active === "Dashboard" ? "block" : "hidden", children: _jsxs("div", { className: "h-screen overflow-y-auto", children: [_jsx(WelcomeCard, {}), _jsx(DashboardStats, {}), " ", _jsx(RecentMemoriesCarousel, {})] }) }), _jsx("div", { className: active === "Memories" ? "block" : "hidden", children: _jsx(MemoryCarousel, {}) }), _jsx("div", { className: active === "Calendar" ? "block" : "hidden", children: _jsx(MiniCalendar, {}) }), _jsx("div", { className: active === "Quick Actions" ? "block" : "hidden", children: _jsx(QuickActions, {}) }), _jsx("div", { className: active === "Activity" ? "block" : "hidden", children: _jsx(ActivityFeed, {}) }), _jsx("div", { className: active === "Settings" ? "block" : "hidden", children: _jsxs(Card, { className: "p-6 rounded-2xl shadow-md bg-gradient-to-r from-indigo-100 to-sky-200", children: [_jsx("h3", { className: "font-semibold mb-2 text-indigo-700", children: "\u2699\uFE0F Settings" }), _jsx("p", { className: "text-sm text-indigo-600", children: "Coming soon..." })] }) })] })] }));
}
