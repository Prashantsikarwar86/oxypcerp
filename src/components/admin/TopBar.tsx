import { Search, Bell, Megaphone, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 px-6 glass border-b border-border/50">
      <div className="flex-1 max-w-2xl mx-auto flex items-center gap-3">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex-1 group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            placeholder="Search anything…"
            className="w-full h-11 pl-11 pr-32 rounded-full border border-border bg-card/80 text-sm outline-none transition-all focus:border-primary focus:shadow-glow"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-3 h-8 rounded-full bg-gradient-primary text-primary-foreground text-xs font-medium">
            All Module <ChevronDown className="h-3 w-3" />
          </button>
        </motion.div>
      </div>
      <button className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition">
        <Megaphone className="h-5 w-5 text-primary" />
      </button>
      <button className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition">
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
      </button>
      <div className="flex items-center gap-3 pl-4 border-l border-border">
        <div className="text-right">
          <div className="text-xs font-semibold">Oxypc Admin</div>
          <div className="text-[10px] text-muted-foreground">Sales Profile</div>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold shadow-soft">
          OA
        </div>
      </div>
    </header>
  );
}
