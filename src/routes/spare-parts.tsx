import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { mockSpareRequests, mockDevices, mockEngineers } from "@/lib/mock-data";
import { SpareRequest } from "@/lib/types";
import { CheckCircle, XCircle, Package } from "lucide-react";

export const Route = createFileRoute("/spare-parts")({
  head: () => ({ meta: [{ title: "Spare Parts — Oxypc Admin" }] }),
  component: () => <AdminLayout><SparePartsPage /></AdminLayout>,
});

function SparePartsPage() {
  const [spareRequests, setSpareRequests] = useState<SpareRequest[]>(mockSpareRequests);

  const approveRequest = (requestId: string) => {
    setSpareRequests(spareRequests.map(r =>
      r.id === requestId
        ? { ...r, status: "Approved" as const }
        : r
    ));
  };

  const rejectRequest = (requestId: string) => {
    setSpareRequests(spareRequests.map(r =>
      r.id === requestId
        ? { ...r, status: "Rejected" as const }
        : r
    ));
  };

  const issuePart = (requestId: string) => {
    setSpareRequests(spareRequests.map(r =>
      r.id === requestId
        ? { ...r, status: "Issued" as const }
        : r
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Spare Parts Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Approve and issue spare part requests</p>
        </div>
      </div>

      <Card className="rounded-2xl glass shadow-card border border-border/40">
        <CardHeader>
          <CardTitle>Spare Part Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Part Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {spareRequests.map((request) => {
                const device = mockDevices.find(d => d.id === request.deviceId);
                const engineer = mockEngineers.find(e => e.id === request.requestedBy);
                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{device?.serialNumber || "Unknown"}</TableCell>
                    <TableCell>{request.partName}</TableCell>
                    <TableCell>{request.quantity}</TableCell>
                    <TableCell>{engineer?.name || "Unknown"}</TableCell>
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
                            <Button size="sm" onClick={() => approveRequest(request.id)}>
                              <CheckCircle className="h-4 w-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => rejectRequest(request.id)}>
                              <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {request.status === "Approved" && (
                          <Button size="sm" onClick={() => issuePart(request.id)}>
                            <Package className="h-4 w-4 mr-1" /> Issue
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
