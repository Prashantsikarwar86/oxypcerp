import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { mockDevices, mockEngineers, mockSpareRequests } from "@/lib/mock-data";
import { Device, SpareRequest } from "@/lib/types";
import { ClipboardList, Users, Wrench, Package, CheckCircle2, XCircle } from "lucide-react";

export const Route = createFileRoute("/head-engineer")({
  head: () => ({ meta: [{ title: "Head Engineer — Oxypc Admin" }] }),
  component: () => <AdminLayout><HeadEngineerPage /></AdminLayout>,
});

function HeadEngineerPage() {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [spareRequests, setSpareRequests] = useState<SpareRequest[]>(mockSpareRequests);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedEngineer, setSelectedEngineer] = useState<string>("");

  const toggleDeviceSelection = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const assignToEngineer = () => {
    if (!selectedEngineer) return;
    const engineer = mockEngineers.find(e => e.id === selectedEngineer);
    if (!engineer) return;

    const updatedDevices = devices.map(device =>
      selectedDevices.includes(device.id)
        ? {
            ...device,
            status: "AssignedToL1L2" as const,
            owner: "L1L2" as const,
            assignedTo: selectedEngineer,
            updatedAt: new Date(),
          }
        : device
    );
    setDevices(updatedDevices);
    setSelectedDevices([]);
    setSelectedEngineer("");
  };

  const approveSpareRequest = (requestId: string) => {
    setSpareRequests(spareRequests.map(req =>
      req.id === requestId ? { ...req, status: "Approved" as const } : req
    ));
  };

  const rejectSpareRequest = (requestId: string) => {
    setSpareRequests(spareRequests.map(req =>
      req.id === requestId ? { ...req, status: "Rejected" as const } : req
    ));
  };

  const stats = [
    { label: "Assigned to Me", value: devices.filter(d => d.owner === "HeadEngineer").length, icon: ClipboardList, color: "from-violet-500 to-indigo-500" },
    { label: "L1/L2 Assigned", value: devices.filter(d => d.owner === "L1L2").length, icon: Wrench, color: "from-emerald-500 to-teal-500" },
    { label: "Total Devices", value: devices.length, icon: Users, color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Head Engineer Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Assign devices and manage spare requests</p>
        </div>
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

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="spare-requests">Spare Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="devices" className="mt-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
            {selectedDevices.length > 0 && (
              <div className="flex items-center gap-2">
                <Select value={selectedEngineer} onValueChange={setSelectedEngineer}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Engineer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEngineers.filter(e => e.level === "L1" || e.level === "L2").map(eng => (
                      <SelectItem key={eng.id} value={eng.id}>
                        {eng.name} ({eng.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={assignToEngineer} disabled={!selectedEngineer}>
                  Assign {selectedDevices.length} Device(s)
                </Button>
              </div>
            )}
          </div>
          <Card className="rounded-2xl glass shadow-card border border-border/40">
            <CardHeader>
              <CardTitle>Devices Assigned to Me</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedDevices.length === devices.filter(d => d.owner === "HeadEngineer").length && devices.filter(d => d.owner === "HeadEngineer").length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedDevices(devices.filter(d => d.owner === "HeadEngineer").map(d => d.id));
                          } else {
                            setSelectedDevices([]);
                          }
                        }}
                      />
                    </TableHead>
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
                  {devices.filter(d => d.owner === "HeadEngineer").map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedDevices.includes(device.id)}
                          onCheckedChange={() => toggleDeviceSelection(device.id)}
                        />
                      </TableCell>
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
        </TabsContent>

        <TabsContent value="spare-requests" className="mt-6">
          <Card className="rounded-2xl glass shadow-card border border-border/40">
            <CardHeader>
              <CardTitle>Spare Part Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Part Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spareRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.partName}</TableCell>
                      <TableCell>{request.quantity}</TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === "PendingApproval" ? "bg-yellow-100 text-yellow-800" :
                          request.status === "Approved" ? "bg-blue-100 text-blue-800" :
                          request.status === "Rejected" ? "bg-red-100 text-red-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {request.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {request.status === "PendingApproval" && (
                            <>
                              <Button size="sm" onClick={() => approveSpareRequest(request.id)}>
                                <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => rejectSpareRequest(request.id)}>
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
