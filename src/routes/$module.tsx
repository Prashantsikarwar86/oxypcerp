import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ModuleListPage } from "@/components/admin/ModuleListPage";

export const Route = createFileRoute("/$module")({
  head: () => ({ meta: [{ title: "Module — Oxypc Admin" }] }),
  component: ModulePage,
});

function ModulePage() {
  const { module } = Route.useParams();
  const labels: Record<string, string> = {
    purchase: "Purchase",
    "po-process": "PO Process",
    pickup: "Pickup Process",
    factory: "Factory Process",
    rnd: "R&D Process",
    plastic: "Plastic Process",
    refurbish: "Refurbishment",
    leads: "Leads",
    reports: "Reports",
    settings: "Settings",
  };
  const title = labels[module] ?? module;
  return <AdminLayout><ModuleListPage title={title} /></AdminLayout>;
}
