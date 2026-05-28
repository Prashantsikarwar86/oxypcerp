import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useState } from "react";
import { mockSparePartInventory, mockDropdownData } from "@/lib/mock-data";
import { SparePartInventory } from "@/lib/types";

export const Route = createFileRoute("/spare-inventory")({
  head: () => ({ meta: [{ title: "Spare Part Inventory — Oxypc Admin" }] }),
  component: () => <AdminLayout><SpareInventoryPage /></AdminLayout>,
});

function SpareInventoryPage() {
  const [inventory, setInventory] = useState<SparePartInventory[]>(mockSparePartInventory);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInventory = inventory.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.crateTagNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Spare Part Inventory</h1>
          <p className="text-sm text-muted-foreground mt-1">Search and manage spare part inventory</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by Product Name or Crate Tag..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card className="rounded-2xl glass shadow-card border border-border/40">
        <CardHeader>
          <CardTitle>Spare Part Inventory List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Inventory Added Time</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>GRN Date & Time</TableHead>
                  <TableHead>GRN Number</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Lot No.</TableHead>
                  <TableHead>Product Description</TableHead>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Crate Tag Number</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Spare Part</TableHead>
                  <TableHead>Invoice Quantity</TableHead>
                  <TableHead>Physical Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Master Category</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Vehicle Number</TableHead>
                  <TableHead>Total Invoice Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.inventoryAddedTime.toLocaleString()}</TableCell>
                    <TableCell>{item.poNumber}</TableCell>
                    <TableCell>{item.grnDateAndTime.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">{item.grnNumber}</TableCell>
                    <TableCell>{item.vendorName}</TableCell>
                    <TableCell>{item.invoiceNumber}</TableCell>
                    <TableCell>{item.lotNumber}</TableCell>
                    <TableCell>{item.productDescription}</TableCell>
                    <TableCell>{item.itemName}</TableCell>
                    <TableCell className="font-medium">{item.crateTagNumber}</TableCell>
                    <TableCell>{item.make}</TableCell>
                    <TableCell>{item.model}</TableCell>
                    <TableCell>{item.sparePart}</TableCell>
                    <TableCell>{item.invoiceQuantity}</TableCell>
                    <TableCell className="font-medium">{item.physicalQuantity}</TableCell>
                    <TableCell>₹{item.price.toLocaleString()}</TableCell>
                    <TableCell>{item.location}</TableCell>
                    <TableCell>{item.masterCategory}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.subCategory}</TableCell>
                    <TableCell>{item.vehicleNumber}</TableCell>
                    <TableCell>₹{item.totalInvoiceValue.toLocaleString()}</TableCell>
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
