import { motion } from "framer-motion";
import {
  Activity, ClipboardList, Users, Package, Wrench, CheckCircle, AlertCircle, Eye,
} from "lucide-react";
import { Card as UICard, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { mockDevices } from "@/lib/mock-data";
import { Device } from "@/lib/types";

function AnimatedCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`rounded-2xl glass shadow-card border border-border/40 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function Dashboard() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Total Devices", value: devices.length, icon: Package, color: "from-violet-500 to-indigo-500" },
    { label: "In Inventory", value: devices.filter(d => d.owner === "Inventory").length, icon: Package, color: "from-emerald-500 to-teal-500" },
    { label: "With Head Eng.", value: devices.filter(d => d.owner === "HeadEngineer").length, icon: ClipboardList, color: "from-cyan-500 to-blue-500" },
    { label: "In L1/L2 Repair", value: devices.filter(d => d.owner === "L1L2").length, icon: Wrench, color: "from-amber-500 to-orange-500" },
    { label: "In L3/L4 Repair", value: devices.filter(d => d.owner === "L3L4").length, icon: Wrench, color: "from-red-500 to-pink-500" },
    { label: "In QC", value: devices.filter(d => d.owner === "QC").length, icon: CheckCircle, color: "from-purple-500 to-violet-500" },
    { label: "Closed", value: devices.filter(d => d.status === "Closed").length, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Live Tracking Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor device status in real-time. Last updated: {lastUpdated.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-success animate-pulse" />
          <span className="text-sm text-success font-medium">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <AnimatedCard key={s.label} delay={i * 0.05} className="p-5 overflow-hidden relative group">
            <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${s.color} opacity-20 group-hover:opacity-30 transition`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white shadow-soft`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      <UICard className="p-5">
        <CardHeader>
          <CardTitle>Device Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tag No.</TableHead>
                  <TableHead>Serial No.</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.tagNumber}</TableCell>
                    <TableCell>{device.serialNumber}</TableCell>
                    <TableCell>{device.make}</TableCell>
                    <TableCell>{device.model}</TableCell>
                    <TableCell>{device.owner}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        device.status === "Available" ? "bg-green-100 text-green-800" :
                        device.status === "AssignedToHeadEngineer" ? "bg-blue-100 text-blue-800" :
                        device.status === "AssignedToL1L2" ? "bg-cyan-100 text-cyan-800" :
                        device.status === "InRepair" ? "bg-yellow-100 text-yellow-800" :
                        device.status === "EscalatedToL3L4" ? "bg-orange-100 text-orange-800" :
                        device.status === "InAdvancedRepair" ? "bg-red-100 text-red-800" :
                        device.status === "AwaitingQC" ? "bg-purple-100 text-purple-800" :
                        device.status === "Closed" ? "bg-emerald-100 text-emerald-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {device.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </UICard>
    </div>
  );
}