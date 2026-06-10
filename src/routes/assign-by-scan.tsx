import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Send } from "lucide-react";
import { useState } from "react";
import { mockDevices, mockDropdownData } from "@/lib/mock-data";

export const Route = createFileRoute("/assign-by-scan")({
  head: () => ({ meta: [{ title: "Assign by Scan — Oxypc Admin" }] }),
  component: () => <AdminLayout><AssignByScanPage /></AdminLayout>,
});

function AssignByScanPage() {
  const [tagNumber, setTagNumber] = useState("");
  const [device, setDevice] = useState<any>(null);
  const [message, setMessage] = useState("");

  const searchDevice = () => {
    const found = mockDevices.find(d => d.tagNumber === tagNumber);
    if (found) {
      setDevice(found);
      setMessage("Device found!");
    } else {
      setDevice(null);
      setMessage("Device not found!");
    }
  };

  const assignToHeadEngineer = () => {
    if (!device) return;
    setMessage(`Device ${device.tagNumber} assigned to Head Engineer successfully!`);
    setTagNumber("");
    setDevice(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Assign by Scan</h1>
          <p className="text-sm text-muted-foreground mt-1">Scan tag number to assign device to Head Engineer</p>
        </div>
      </div>

      <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
        <h3 className="text-lg font-semibold mb-4">Scan Tag Number</h3>
        <div className="flex gap-3 items-end">
          <div className="space-y-2 flex-1">
            <Label>Tag Number</Label>
            <Input
              placeholder="Enter or scan tag number..."
              value={tagNumber}
              onChange={(e) => setTagNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchDevice()}
            />
          </div>
          <Button onClick={searchDevice}>
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </div>
      </Card>

      {device && (
        <Card className="rounded-2xl glass shadow-card border border-border/40">
          <CardHeader>
            <CardTitle>Device Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Tag No.</Label>
                <p className="font-medium">{device.tagNumber}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Serial No.</Label>
                <p className="font-medium">{device.serialNumber}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Make</Label>
                <p>{device.make}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Model</Label>
                <p>{device.model}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Product Stage</Label>
                <p>{device.productStage}</p>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Owner</Label>
                <p>{device.owner}</p>
              </div>
            </div>
            <Button onClick={assignToHeadEngineer} className="w-full md:w-auto">
              <Send className="h-4 w-4 mr-2" /> Assign to Head Engineer
            </Button>
          </CardContent>
        </Card>
      )}

      {message && (
        <div className={`p-4 rounded-xl ${message.includes("successfully") ? "bg-green-100 text-green-800" : message.includes("not found") ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}>
          {message}
        </div>
      )}
    </div>
  );
}
