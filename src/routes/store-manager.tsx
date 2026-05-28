import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Package, CheckCircle2, XCircle, Send } from "lucide-react";
import { useState } from "react";
import { mockSparePartInventory, mockSpareRequests } from "@/lib/mock-data";

export const Route = createFileRoute("/store-manager")({
  head: () => ({ meta: [{ title: "Store Manager — Oxypc Admin" }] }),
  component: () => <AdminLayout><StoreManagerPage /></AdminLayout>,
});

function StoreManagerPage() {
  const [inventory, setInventory] = useState(mockSparePartInventory);
  const [spareRequests, setSpareRequests] = useState(mockSpareRequests);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = [
    { label: "Total Spare Requests", value: spareRequests.length, icon: Package, color: "from-blue-500 to-indigo-500" },
    { label: "Approved Requests", value: spareRequests.filter(r => r.status === "Approved").length, icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
    { label: "Pending Approval", value: spareRequests.filter(r => r.status === "PendingApproval").length, icon: TrendingUp, color: "from-yellow-500 to-orange-500" },
  ];

  const filteredInventory = inventory.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.crateTagNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const approveRequest = (requestId: string) => {
    setSpareRequests(spareRequests.map(req =>
      req.id === requestId ? { ...req, status: "Approved" } : req
    ));
  };

  const issuePart = (requestId: string) => {
    setSpareRequests(spareRequests.map(req =>
      req.id === requestId ? { ...req, status: "Issued" } : req
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Store Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage spare parts and issue requests</p>
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

      <Card className="rounded-2xl glass shadow-card border border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Spare Part Requests</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
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
                          <Button size="sm" onClick={() => approveRequest(request.id)}>
                            <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                          </Button>
                        )}
                        {request.status === "Approved" && (
                          <Button size="sm" onClick={() => issuePart(request.id)}>
                            <Send className="h-4 w-4 mr-2" /> Issue
                          </Button>
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

      <Card className="rounded-2xl glass shadow-card border border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Spare Part Inventory</CardTitle>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by Product Name or Crate Tag..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Crate Tag</TableHead>
                  <TableHead>Make</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Invoice Quantity</TableHead>
                  <TableHead>Physical Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.itemName}</TableCell>
                    <TableCell>{item.crateTagNumber}</TableCell>
                    <TableCell>{item.make}</TableCell>
                    <TableCell>{item.model}</TableCell>
                    <TableCell>{item.invoiceQuantity}</TableCell>
                    <TableCell className="font-medium">{item.physicalQuantity}</TableCell>
                    <TableCell>₹{item.price.toLocaleString()}</TableCell>
                    <TableCell>{item.location}</TableCell>
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
