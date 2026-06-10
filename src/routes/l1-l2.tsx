import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { mockDevices, mockEngineers, mockSpareRequests } from "@/lib/mock-data";
import { Device, SpareRequest } from "@/lib/types";
import { Wrench, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/l1-l2")({
  head: () => ({ meta: [{ title: "L1/L2 Engineer — Oxypc Admin" }] }),
  component: () => <AdminLayout><L1L2Page /></AdminLayout>,
});

function L1L2Page() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [spareRequests, setSpareRequests] = useState<SpareRequest[]>(mockSpareRequests);
  const [selectedEngineer, setSelectedEngineer] = useState<string>(mockEngineers[0].id);
  const [spareDialogOpen, setSpareDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [sparePartName, setSparePartName] = useState("");
  const [spareQuantity, setSpareQuantity] = useState("1");

  const currentEngineerDevices = devices.filter(d => d.owner === "L1L2" && d.assignedTo === selectedEngineer);

  const startRepair = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: "InRepair" as const, updatedAt: new Date() }
        : d
    ));
  };

  const escalateToL3L4 = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: "EscalatedToL3L4" as const, owner: "L3L4" as const, updatedAt: new Date() }
        : d
    ));
  };

  const completeRepair = (deviceId: string) => {
    setDevices(devices.map(d =>
      d.id === deviceId
        ? { ...d, status: "AwaitingQC" as const, owner: "QC" as const, updatedAt: new Date() }
        : d
    ));
  };

  const requestSparePart = () => {
    if (!selectedDevice) return;
    const engineer = mockEngineers.find(e => e.id === selectedEngineer);
    const newRequest: SpareRequest = {
      id: `spare${Date.now()}`,
      deviceId: selectedDevice.id,
      partName: sparePartName,
      quantity: parseInt(spareQuantity),
      requestedBy: engineer?.name || selectedEngineer,
      requestedByLevel: engineer?.level as "L1" | "L2",
      status: "PendingApproval",
      createdAt: new Date(),
    };
    setSpareRequests([...spareRequests, newRequest]);
    setDevices(devices.map(d =>
      d.id === selectedDevice.id
        ? { ...d, status: "AwaitingSpare" as const, updatedAt: new Date() }
        : d
    ));
    setSpareDialogOpen(false);
    setSelectedDevice(null);
    setSparePartName("");
    setSpareQuantity("1");
  };

  const stats = [
    { label: "Assigned", value: currentEngineerDevices.length, icon: Wrench, color: "from-violet-500 to-indigo-500" },
    { label: "In Repair", value: currentEngineerDevices.filter(d => d.status === "InRepair").length, icon: TrendingUp, color: "from-emerald-500 to-teal-500" },
    { label: "Completed", value: devices.filter(d => d.status === "AwaitingQC" || d.status === "Closed").length, icon: CheckCircle, color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">L1/L2 Engineer Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Repair devices or escalate to L3/L4</p>
        </div>
        <select
          className="h-10 rounded-lg border border-border bg-card px-3 text-sm shadow-card focus:border-primary outline-none"
          value={selectedEngineer}
          onChange={(e) => setSelectedEngineer(e.target.value)}
        >
          {mockEngineers.filter(e => e.level === "L1" || e.level === "L2").map(eng => (
            <option key={eng.id} value={eng.id}>
              {eng.name} ({eng.level})
            </option>
          ))}
        </select>
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
          <CardTitle>My Devices</CardTitle>
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
                        {device.status === "AssignedToL1L2" && (
                          <Button size="sm" onClick={() => startRepair(device.id)}>
                            Start Repair
                          </Button>
                        )}
                        {device.status === "InRepair" && (
                          <>
                            <Button size="sm" onClick={() => completeRepair(device.id)}>
                              Complete
                            </Button>
                            <Dialog open={spareDialogOpen && selectedDevice?.id === device.id} onOpenChange={(open) => {
                              setSpareDialogOpen(open);
                              if (!open) { setSelectedDevice(null); }
                            }}>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="secondary" onClick={() => setSelectedDevice(device)}>
                                  Request Spare
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Request Spare Part</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Part Name</Label>
                                    <Input value={sparePartName} onChange={(e) => setSparePartName(e.target.value)} />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <Input type="number" value={spareQuantity} onChange={(e) => setSpareQuantity(e.target.value)} />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="secondary" onClick={() => setSpareDialogOpen(false)}>Cancel</Button>
                                    <Button onClick={requestSparePart}>Submit Request</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="destructive" onClick={() => escalateToL3L4(device.id)}>
                              <AlertTriangle className="h-4 w-4 mr-1" /> Escalate
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