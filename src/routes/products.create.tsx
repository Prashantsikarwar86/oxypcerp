import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductCreate } from "@/components/admin/ProductCreate";

export const Route = createFileRoute("/products/create")({
  head: () => ({ meta: [{ title: "Add Product — Oxypc Admin" }] }),
  component: () => <AdminLayout><ProductCreate /></AdminLayout>,
});
