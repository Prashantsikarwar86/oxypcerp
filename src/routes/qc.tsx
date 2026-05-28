import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { mockDevices } from "@/lib/mock-data";
import { Device } from "@/lib/types";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/qc")({
  head: () => ({ meta: [{ title: "Quality Check — Oxypc Admin" }] }),
  component: () => <AdminLayout><QCPage /></AdminLayout>,
});

function QCPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const qcDevices = devices.filter(d => d.owner === "QC" || d.status === "Closed");

  const approveDevice = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: "Closed" as const, updatedAt: new Date() }
        : d
    ));
  };

  const rejectDevice = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: "EscalatedToL3L4" as const, owner: "L3L4" as const, updatedAt: new Date() }
        : d
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Final Quality Check</h1>
          <p className="text-sm text-muted-foreground mt-1">Approve or reject repaired devices</p>
        </div>
      </div>

      <Card className="rounded-2xl glass shadow-card border border-border/40">
        <CardHeader>
          <CardTitle>Devices for QC</CardTitle>
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
                {qcDevices.map((device) => (
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
                        {device.status === "AwaitingQC" && (
                          <>
                            <Button size="sm" onClick={() => approveDevice(device.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectDevice(device.id)}>
                              <RotateCcw className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {device.status === "Closed" && (
                          <span className="text-sm text-muted-foreground">Completed</span>
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