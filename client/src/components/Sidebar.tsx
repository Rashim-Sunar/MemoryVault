"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  CalendarDays,
  Image,
  Zap,
  List,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

interface SidebarProps {
  active: string;
  setActive: (v: string) => void;
}

const Sidebar = ({ active, setActive }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: Home },
    { name: "Memories", icon: Image },
    { name: "Calendar", icon: CalendarDays },
    { name: "Quick Actions", icon: Zap },
    { name: "Activity", icon: List },
    { name: "Settings", icon: Settings },
  ];

  const handleSelect = (name: string) => {
    setActive(name);
    setIsOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="hidden md:flex w-64 min-h-screen bg-gradient-to-b from-indigo-600 via-violet-600 to-indigo-800 shadow-lg p-5 flex-col justify-between rounded-r-2xl"
      >
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-8">
            📔 Memory Vault
          </h1>
          <nav className="space-y-2">
            {menu.map((item) => (
              <button
                key={item.name}
                onClick={() => handleSelect(item.name)}
                className={`flex items-center space-x-3 w-full text-left p-3 rounded-xl transition-all duration-200 ${
                  active === item.name
                    ? "bg-violet-500 text-white shadow-md"
                    : "hover:bg-indigo-500 hover:text-white text-indigo-100"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-indigo-400 pt-4 flex justify-center">
          <UserButton afterSignOutUrl="/" />
        </div>
      </motion.aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden w-full sticky top-0 z-40">
        <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 shadow-md">
          <h1 className="text-lg font-bold text-white">📔 Memory Vault</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md bg-indigo-500/30 hover:bg-indigo-500/50 transition"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-0 right-0 w-4/5 max-w-xs h-full bg-gradient-to-b from-indigo-600 via-violet-600 to-indigo-800 shadow-2xl p-6 flex flex-col rounded-l-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <nav className="space-y-3 flex-1 overflow-y-auto">
                {menu.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleSelect(item.name)}
                    className={`flex items-center space-x-3 w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      active === item.name
                        ? "bg-violet-500 text-white shadow-md"
                        : "hover:bg-indigo-500 hover:text-white text-indigo-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>

              <div className="border-t border-indigo-400 pt-4 flex justify-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
