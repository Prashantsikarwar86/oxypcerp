import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mock-data";

export const Route = createFileRoute("/product-master")({
  head: () => ({ meta: [{ title: "Product Master — Oxypc Admin" }] }),
  component: () => <AdminLayout><ProductMasterPage /></AdminLayout>,
});

function ProductMasterPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p =>
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.model?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Product Master</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all products in the system</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="rounded-2xl glass shadow-card border border-border/40">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Product Type</TableHead>
                  <TableHead>Master Category</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>MRP</TableHead>
                  <TableHead>Selling Price</TableHead>
                  <TableHead>Cost Price</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Opening Stock</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell>{product.productType}</TableCell>
                    <TableCell>{product.masterCategory}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.subCategory}</TableCell>
                    <TableCell>{product.make}</TableCell>
                    <TableCell>{product.model}</TableCell>
                    <TableCell>₹{product.mrp.toLocaleString()}</TableCell>
                    <TableCell>₹{product.sellingPrice.toLocaleString()}</TableCell>
                    <TableCell>₹{product.costPrice?.toLocaleString() || "-"}</TableCell>
                    <TableCell>{product.warehouse}</TableCell>
                    <TableCell>{product.openingStock}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {product.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
