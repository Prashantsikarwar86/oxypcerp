import { motion } from "framer-motion";
import { ChevronDown, Filter, RefreshCw, Search, Plus, Download } from "lucide-react";

const tabs = ["GRN","Inventory","IQC Laptop","IQC Desktop","IQC TFT","GATEINWARD","Segregation","Tagging","Sticker Removal","Cleaning"];

const rows = Array.from({length: 8}).map((_, i) => ({
  id: `INV-${1000 + i}`,
  name: ["MacBook Pro 14", "Dell Latitude 7420", "iPhone 14", "Samsung 27\" Monitor", "HP EliteBook"][i % 5],
  category: ["Laptop","Desktop","Mobile","Display"][i % 4],
  qty: Math.floor(Math.random() * 200) + 5,
  status: ["In Stock","Low","Pending QC","Reserved"][i % 4],
  warehouse: ["WH-01","WH-02","WH-03"][i % 3],
}));

export function ModuleListPage({ title, withTabs = true }: { title: string; withTabs?: boolean }) {
  return (
    <div className="space-y-5">
      {withTabs && (
        <div className="rounded-2xl glass border border-border/40 shadow-card p-2 overflow-x-auto">
          <div className="flex gap-1">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={`flex items-center gap-1 px-4 h-10 rounded-xl text-sm whitespace-nowrap transition ${
                  i === 1 ? "bg-gradient-primary text-primary-foreground shadow-soft" : "hover:bg-muted"
                }`}
              >
                {t} <ChevronDown className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl glass border border-border/40 shadow-card">
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div>
            <h1 className="text-2xl font-bold text-gradient">{title}</h1>
            <button className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              All {title} <ChevronDown className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-lg bg-card border border-border hover:bg-muted transition">
              <RefreshCw className="h-4 w-4" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Search" className="h-10 w-56 pl-9 pr-3 rounded-lg border border-border bg-card text-sm outline-none focus:border-primary" />
            </div>
            <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-accent text-accent-foreground font-medium hover:opacity-90 transition">
              <Download className="h-4 w-4" /> Bulk Update
            </button>
            <button className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gradient-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition">
              <Plus className="h-4 w-4" /> Export All
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-lg bg-card border border-border hover:bg-muted transition">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">ID</th>
                <th className="px-5 py-3 text-left">Item Name</th>
                <th className="px-5 py-3 text-left">Category</th>
                <th className="px-5 py-3 text-left">Quantity</th>
                <th className="px-5 py-3 text-left">Warehouse</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <motion.tr
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-t border-border/50 hover:bg-primary/5 transition"
                >
                  <td className="px-5 py-3 font-mono text-xs text-primary">{r.id}</td>
                  <td className="px-5 py-3 font-medium">{r.name}</td>
                  <td className="px-5 py-3">{r.category}</td>
                  <td className="px-5 py-3">{r.qty}</td>
                  <td className="px-5 py-3">{r.warehouse}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      r.status === "In Stock" ? "bg-success/15 text-success" :
                      r.status === "Low" ? "bg-warning/20 text-warning" :
                      r.status === "Pending QC" ? "bg-accent/15 text-accent" :
                      "bg-primary/15 text-primary"
                    }`}>{r.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
