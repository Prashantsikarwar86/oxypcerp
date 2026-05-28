import { ReactNode } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { motion } from "framer-motion";

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Sidebar />
      <div className="pl-20">
        <TopBar />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
