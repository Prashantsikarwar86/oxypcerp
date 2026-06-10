import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Search, TrendingUp, Users, Package } from "lucide-react";
import { mockDevices } from "@/lib/mock-data";
import { Device } from "@/lib/types";

export const Route = createFileRoute("/inventory")({
  head: () => ({ meta: [{ title: "Inventory — Oxypc Admin" }] }),
  component: () => <AdminLayout><InventoryPage /></AdminLayout>,
});

function InventoryPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDevices = devices.filter(device =>
    device.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const assignToHeadEngineer = () => {
    const updatedDevices = devices.map(device =>
      selectedDevices.includes(device.id)
        ? {
            ...device,
            status: "AssignedToHeadEngineer" as const,
            owner: "HeadEngineer" as const,
            productStatus: "Assigned",
            updatedAt: new Date(),
          }
        : device
    );
    setDevices(updatedDevices);
    setSelectedDevices([]);
  };

  const stats = [
    { label: "Available", value: devices.filter(d => d.status === "Available").length, icon: Package, color: "from-emerald-500 to-teal-500" },
    { label: "Assigned", value: devices.filter(d => d.status !== "Available" && d.status !== "Closed").length, icon: Users, color: "from-violet-500 to-indigo-500" },
    { label: "Total Devices", value: devices.length, icon: TrendingUp, color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Inventory Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and assign devices from inventory</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by Tag, Serial, Make, Model..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {selectedDevices.length > 0 && (
          <Button onClick={assignToHeadEngineer}>
            Assign {selectedDevices.length} Device(s) to Head Engineer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <Card key={s.label} className="rounded-2xl glass shadow-card border border-border/40 p-5">
            <div className="flex items-center justify-between">
              <div className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-4 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card className="rounded-2xl glass shadow-card border border-border/40">
        <CardHeader>
          <CardTitle>Devices in Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedDevices.length === filteredDevices.filter(d => d.status === "Available").length && filteredDevices.filter(d => d.status === "Available").length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedDevices(filteredDevices.filter(d => d.status === "Available").map(d => d.id));
                        } else {
                          setSelectedDevices([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Inventory Added Time</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>GRN Number</TableHead>
                  <TableHead>GRN Date</TableHead>
                  <TableHead>Tag No.</TableHead>
                  <TableHead>Serial No.</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>CPU</TableHead>
                  <TableHead>Generation</TableHead>
                  <TableHead>RAM</TableHead>
                  <TableHead>HDD</TableHead>
                  <TableHead>SSD Capacity</TableHead>
                  <TableHead>Screen Size</TableHead>
                  <TableHead>Product Stage</TableHead>
                  <TableHead>Product Status</TableHead>
                  <TableHead>Master Category</TableHead>
                  <TableHead>Sub Category</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Lot No.</TableHead>
                  <TableHead>Total Invoice Value</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Physical Quantity</TableHead>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Inventory ID</TableHead>
                  <TableHead>Unit Price (w/ Tax)</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      {device.status === "Available" && (
                        <Checkbox
                          checked={selectedDevices.includes(device.id)}
                          onCheckedChange={() => toggleDeviceSelection(device.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell>{device.inventoryAddedTime.toLocaleString()}</TableCell>
                    <TableCell>{device.userName}</TableCell>
                    <TableCell>{device.poNumber}</TableCell>
                    <TableCell className="font-medium">{device.grnNumber}</TableCell>
                    <TableCell>{device.grnDate.toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{device.tagNumber}</TableCell>
                    <TableCell>{device.serialNumber}</TableCell>
                    <TableCell>{device.make}</TableCell>
                    <TableCell>{device.model}</TableCell>
                    <TableCell>{device.cpu || "-"}</TableCell>
                    <TableCell>{device.generation || "-"}</TableCell>
                    <TableCell>{device.ram || "-"}</TableCell>
                    <TableCell>{device.hdd || "-"}</TableCell>
                    <TableCell>{device.ssdCapacity || "-"}</TableCell>
                    <TableCell>{device.screenSize || "-"}</TableCell>
                    <TableCell>{device.productStage}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        device.productStatus === "Available" ? "bg-green-100 text-green-800" :
                        device.productStatus === "Assigned" ? "bg-blue-100 text-blue-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {device.productStatus}
                      </span>
                    </TableCell>
                    <TableCell>{device.masterCategory}</TableCell>
                    <TableCell>{device.subCategory}</TableCell>
                    <TableCell>{device.category}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>{device.lotNumber}</TableCell>
                    <TableCell>₹{device.totalInvoiceValue.toLocaleString()}</TableCell>
                    <TableCell>{device.invoiceNumber}</TableCell>
                    <TableCell>{device.customerName}</TableCell>
                    <TableCell>{device.physicalQuantity}</TableCell>
                    <TableCell>{device.vendorName}</TableCell>
                    <TableCell>{device.inventoryId}</TableCell>
                    <TableCell>₹{device.unitPriceWithTax.toLocaleString()}</TableCell>
                    <TableCell>{device.owner}</TableCell>
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
