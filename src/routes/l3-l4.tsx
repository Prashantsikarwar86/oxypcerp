import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { mockDevices, mockEngineers } from "@/lib/mock-data";
import { Device } from "@/lib/types";
import { Wrench as Tool, CheckCircle, XCircle } from "lucide-react";

export const Route = createFileRoute("/l3-l4")({
  head: () => ({ meta: [{ title: "L3/L4 Engineer — Oxypc Admin" }] }),
  component: () => <AdminLayout><L3L4Page /></AdminLayout>,
});

function L3L4Page() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [selectedEngineer, setSelectedEngineer] = useState<string>(mockEngineers.find(e => e.level === "L3" || e.level === "L4")?.id || mockEngineers[0].id);

  const currentEngineerDevices = devices.filter(d => d.owner === "L3L4");

  const startAdvancedRepair = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: "InAdvancedRepair" as const, updatedAt: new Date() }
        : d
    ));
  };

  const markRepairable = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: "AwaitingQC" as const, owner: "QC" as const, updatedAt: new Date() }
        : d
    ));
  };

  const markNotRepairable = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: "NotRepairable" as const, updatedAt: new Date() }
        : d
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">L3/L4 Advanced Repair</h1>
          <p className="text-sm text-muted-foreground mt-1">Handle advanced repairs for escalated devices</p>
        </div>
        <select
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm shadow-card focus:border-primary outline-none"
          value={selectedEngineer}
          onChange={(e) => setSelectedEngineer(e.target.value)}
        >
          {mockEngineers.filter(e => e.level === "L3" || e.level === "L4").map(eng => (
            <option key={eng.id} value={eng.id}>
              {eng.name} ({eng.level})
            </option>
          ))}
        </select>
      </div>

      <Card className="rounded-2xl glass shadow-card border border-border/40">
        <CardHeader>
          <CardTitle>Escalated Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEngineerDevices.map((device) => (
                  <TableRow key={device.id}>
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
                    <TableCell>
                      <div className="flex gap-2">
                        {device.status === "EscalatedToL3L4" && (
                          <Button size="sm" onClick={() => startAdvancedRepair(device.id)}>
                            Start Repair
                          </Button>
                        )}
                        {device.status === "InAdvancedRepair" && (
                          <>
                            <Button size="sm" onClick={() => markRepairable(device.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" /> Repairable
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => markNotRepairable(device.id)}>
                              <XCircle className="h-4 w-4 mr-1" /> Not Repairable
                            </Button>
                          </>
                        )}
                      </div>
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