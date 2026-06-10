import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Dashboard } from "@/components/admin/Dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oxypc Admin — Dashboard" },
      { name: "description", content: "Sales & operations command center for Oxypc Admin." },
    ],
  }),
  component: () => <AdminLayout><Dashboard /></AdminLayout>,
});
