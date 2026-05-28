import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home, ShoppingCart, FileText, Truck, Factory, FlaskConical,
  Package, Recycle, Boxes, Users, BarChart3, Settings,
  Plus, ClipboardList, Wrench, Wrench as Tool, CheckCircle, AlertCircle,
  Search, Eye, Layers
} from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "GRN", url: "/grn", icon: Plus },
  { title: "GRN Report", url: "/grn-report", icon: BarChart3 },
  { title: "Inventory", url: "/inventory", icon: Boxes },
  { title: "Spare Inventory", url: "/spare-inventory", icon: Layers },
  { title: "IQC", url: "/iqc", icon: Eye },
  { title: "Head Eng.", url: "/head-engineer", icon: ClipboardList },
  { title: "L1/L2", url: "/l1-l2", icon: Wrench },
  { title: "L3/L4", url: "/l3-l4", icon: Tool },
  { title: "QC", url: "/qc", icon: CheckCircle },
  { title: "Spare Parts", url: "/spare-parts", icon: AlertCircle },
  { title: "Add Product", url: "/products/create", icon: Plus },
  { title: "Product Master", url: "/product-master", icon: Package },
  { title: "Assign by Scan", url: "/assign-by-scan", icon: Search },
  { title: "Store Manager", url: "/store-manager", icon: Users },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 bg-gradient-sidebar shadow-2xl">
      <div className="flex h-16 items-center justify-center border-b border-white/10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur text-white font-display font-bold shadow-glow"
        >
          O
        </motion.div>
      </div>
      <nav className="flex flex-col gap-1 p-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {items.map((it, i) => {
          const active = path === it.url || (it.url !== "/" && path.startsWith(it.url));
          const Icon = it.icon;
          return (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                to={it.url}
                className="group relative flex flex-col items-center gap-1 rounded-xl px-2 py-3 text-[10px] font-medium text-white/70 transition-all hover:bg-white/10 hover:text-white"
              >
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-xl bg-white/20 shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative h-5 w-5" />
                <span className="relative leading-tight text-center">{it.title}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </aside>
  );
}
