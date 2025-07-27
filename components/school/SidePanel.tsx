"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { LogOut, User, FileText, Settings, Shield, School } from "lucide-react";
import Image from "next/image";

type NavItem = {
  label: string;
  key: string;
  icon: React.ReactElement;
};

type Props = {
  subscriptionActive: boolean;
  selectedNav: string;
  setSelectedNav: (key: string) => void;
  schoolName?: string;
  logoUrl?: string;
};

const navItems: NavItem[] = [
  { label: "Subscription", key: "subscription", icon: <Settings size={16} /> },
  { label: "Profile", key: "profile", icon: <User size={16} /> },
  { label: "Create Admins", key: "admins", icon: <Shield size={16} /> },
  { label: "Invoices", key: "invoices", icon: <FileText size={16} /> },
  { label: "Logout", key: "logout", icon: <LogOut size={16} /> },
];

export const SidePanel: FC<Props> = ({
  subscriptionActive,
  selectedNav,
  setSelectedNav,
  schoolName,
  logoUrl,
}) => {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-sm p-6 flex flex-col justify-between">
      <motion.div
        className="flex items-center gap-3 mb-10 cursor-pointer"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {logoUrl ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Image
              src={logoUrl}
              alt="School Logo"
              width={40}
              height={40}
              className="rounded-full object-cover border"
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full"
          >
            <School size={20} className="text-gray-500" />
          </motion.div>
        )}
        <motion.span
          className="text-indigo-600 font-bold text-sm truncate max-w-[130px]"
          title={schoolName || "School Panel"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {schoolName?.toUpperCase() || "School Panel"}
        </motion.span>
      </motion.div>

      <div className="text-xs text-gray-400 font-semibold uppercase mb-3 pl-1">
        Navigation
      </div>

      <ul className="space-y-2 flex-1">
        {navItems.map(({ label, key, icon }) => {
          const isDisabled =
            !subscriptionActive && key !== "logout" && key !== "subscription";
          const isActive = selectedNav === key;

          return (
            <motion.li
              key={key}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer transition-all duration-150
                ${
                  isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-indigo-50 hover:text-indigo-600 text-gray-700"
                }
                ${
                  isActive
                    ? "bg-indigo-100 font-medium border-l-4 border-indigo-500"
                    : ""
                }
              `}
              onClick={() => (!isDisabled ? setSelectedNav(key) : null)}
            >
              {icon} <span>{label}</span>
            </motion.li>
          );
        })}
      </ul>
    </aside>
  );
};
