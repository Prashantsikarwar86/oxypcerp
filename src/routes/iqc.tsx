import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, Send, RefreshCcw, Search } from "lucide-react";
import { useState } from "react";
import { mockDevices, mockDropdownData, mockEngineers } from "@/lib/mock-data";
import { Device, IQCData, IQCFault } from "@/lib/types";

export const Route = createFileRoute("/iqc")({
  head: () => ({ meta: [{ title: "IQC — Oxypc Admin" }] }),
  component: () => <AdminLayout><IQCPage /></AdminLayout>,
});

function IQCPage() {
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [tagNumber, setTagNumber] = useState("");
  const [device, setDevice] = useState<Device | null>(null);
  const [iqcForm, setIqcForm] = useState<Partial<IQCData>>({
    faults: [],
    dustCleaning: "Not Done",
    cMosBatteryChange: "Not Done",
    cpuThermalPaste: "Not Done",
  });
  const [faults, setFaults] = useState<IQCFault[]>([]);

  const searchDeviceByTag = () => {
    const found = mockDevices.find(d => d.tagNumber === tagNumber);
    if (found) {
      setDevice(found);
      setIqcForm({
        tagNumber: found.tagNumber,
        userName: found.userName,
        iqcEngineer: mockEngineers.find(e => e.level === "IQC")?.name || "",
        iqcCompletionDate: new Date(),
        startedDateTime: new Date(),
        lotNumber: found.lotNumber,
        serialNumber: found.serialNumber,
        subCategory: found.subCategory,
        make: found.make,
        updateMake: false,
        model: found.model,
        updateModel: false,
        cpu: found.cpu || "",
        updateCpu: false,
        generation: found.generation || "",
        updateGeneration: false,
        ram: found.ram || "",
        ramStatus: "",
        hddSsdCapacity: found.ssdCapacity || found.hdd || "",
        updateHddSsd: false,
        faults: [],
        dustCleaning: "Not Done",
        cMosBatteryChange: "Not Done",
        cpuThermalPaste: "Not Done",
        finalStatus: "",
        remark: "",
      });
    }
  };

  const addFault = () => {
    setFaults([
      ...faults,
      { id: `fault-${Date.now()}`, sparePart: "", quantity: 1, status: "", partNumber: "" },
    ]);
  };

  const removeFault = (id: string) => {
    setFaults(faults.filter(f => f.id !== id));
  };

  const updateFault = (id: string, field: keyof IQCFault, value: any) => {
    setFaults(faults.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  const saveDraft = () => {
    console.log("Saving IQC draft:", iqcForm, faults);
    setActiveTab("list");
  };

  const endIQC = () => {
    console.log("Ending IQC:", iqcForm, faults);
    setActiveTab("list");
    resetForm();
  };

  const resetForm = () => {
    setTagNumber("");
    setDevice(null);
    setIqcForm({
      faults: [],
      dustCleaning: "Not Done",
      cMosBatteryChange: "Not Done",
      cpuThermalPaste: "Not Done",
    });
    setFaults([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">IQC Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Incoming Quality Control</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "list" | "create")}>
        <TabsList>
          <TabsTrigger value="list">IQC List</TabsTrigger>
          <TabsTrigger value="create">Create IQC</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <Card className="rounded-2xl glass shadow-card border border-border/40">
            <CardHeader>
              <CardTitle>IQC Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No IQC records yet. Create your first one!</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-4 space-y-6">
          <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
            <h3 className="text-lg font-semibold mb-4">Scan Tag Number</h3>
            <div className="flex gap-3 items-end">
              <div className="space-y-2 flex-1">
                <Label>Tag Number *</Label>
                <Input
                  placeholder="Enter or scan tag number..."
                  value={tagNumber}
                  onChange={(e) => setTagNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchDeviceByTag()}
                />
              </div>
              <Button onClick={searchDeviceByTag}>
                <Search className="h-4 w-4 mr-2" /> Search
              </Button>
            </div>
          </Card>

          {device && (
            <>
              <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <Button size="sm" onClick={() => {}}>
                    Start
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>User Name</Label>
                    <Input value={iqcForm.userName} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Tag No.</Label>
                    <Input value={iqcForm.tagNumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>IQC Engineer</Label>
                    <Input value={iqcForm.iqcEngineer} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>IQC Completion Date</Label>
                    <Input type="date" value={iqcForm.iqcCompletionDate?.toISOString().split("T")[0]} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Repair Started Date & Time</Label>
                    <Input value={iqcForm.startedDateTime?.toLocaleString()} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Lot No.</Label>
                    <Input value={iqcForm.lotNumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Serial Number</Label>
                    <Input value={iqcForm.serialNumber} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Sub Category</Label>
                    <Input value={iqcForm.subCategory} disabled />
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
                <h3 className="text-lg font-semibold mb-4">Basic Information & Updation</h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Make</Label>
                      <Input value={iqcForm.make} disabled={!iqcForm.updateMake} />
                    </div>
                    <div className="space-y-2 pt-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={iqcForm.updateMake}
                          onCheckedChange={(checked) => setIqcForm({ ...iqcForm, updateMake: !!checked })}
                        />
                        <Label>Update Make</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Make Value</Label>
                      <Input
                        value={iqcForm.newMakeValue || ""}
                        onChange={(e) => setIqcForm({ ...iqcForm, newMakeValue: e.target.value })}
                        disabled={!iqcForm.updateMake}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input value={iqcForm.model} disabled={!iqcForm.updateModel} />
                    </div>
                    <div className="space-y-2 pt-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={iqcForm.updateModel}
                          onCheckedChange={(checked) => setIqcForm({ ...iqcForm, updateModel: !!checked })}
                        />
                        <Label>Update Model</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Model Value</Label>
                      <Input
                        value={iqcForm.newModelValue || ""}
                        onChange={(e) => setIqcForm({ ...iqcForm, newModelValue: e.target.value })}
                        disabled={!iqcForm.updateModel}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>CPU</Label>
                      <Input value={iqcForm.cpu} disabled={!iqcForm.updateCpu} />
                    </div>
                    <div className="space-y-2 pt-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={iqcForm.updateCpu}
                          onCheckedChange={(checked) => setIqcForm({ ...iqcForm, updateCpu: !!checked })}
                        />
                        <Label>Update CPU</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New CPU Value</Label>
                      <Input
                        value={iqcForm.newCpuValue || ""}
                        onChange={(e) => setIqcForm({ ...iqcForm, newCpuValue: e.target.value })}
                        disabled={!iqcForm.updateCpu}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Generation</Label>
                      <Input value={iqcForm.generation} disabled={!iqcForm.updateGeneration} />
                    </div>
                    <div className="space-y-2 pt-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={iqcForm.updateGeneration}
                          onCheckedChange={(checked) => setIqcForm({ ...iqcForm, updateGeneration: !!checked })}
                        />
                        <Label>Update Generation</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>New Generation Value</Label>
                      <Input
                        value={iqcForm.newGenerationValue || ""}
                        onChange={(e) => setIqcForm({ ...iqcForm, newGenerationValue: e.target.value })}
                        disabled={!iqcForm.updateGeneration}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>RAM</Label>
                      <Input value={iqcForm.ram} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>RAM Status</Label>
                      <Select
                        value={iqcForm.ramStatus}
                        onValueChange={(v) => setIqcForm({ ...iqcForm, ramStatus: v })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select RAM Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDropdownData.ramStatuses.map((status) => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>HDD/SSD Capacity</Label>
                      <Input value={iqcForm.hddSsdCapacity} disabled={!iqcForm.updateHddSsd} />
                    </div>
                    <div className="space-y-2 pt-6">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={iqcForm.updateHddSsd}
                          onCheckedChange={(checked) => setIqcForm({ ...iqcForm, updateHddSsd: !!checked })}
                        />
                        <Label>Update HDD/SSD</Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Removed HDD/SSD Capacity</Label>
                      <Select
                        value={iqcForm.removedHddSsdCapacity}
                        onValueChange={(v) => setIqcForm({ ...iqcForm, removedHddSsdCapacity: v })}
                        disabled={!iqcForm.updateHddSsd}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDropdownData.hddSsdOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Added HDD/SSD Capacity</Label>
                      <Select
                        value={iqcForm.addedHddSsdCapacity}
                        onValueChange={(v) => setIqcForm({ ...iqcForm, addedHddSsdCapacity: v })}
                        disabled={!iqcForm.updateHddSsd}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockDropdownData.hddSsdOptions.map((opt) => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Faults</h3>
                  <Button size="sm" onClick={addFault}>
                    <Plus className="h-4 w-4 mr-2" /> Add New +
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Spare part - laptop</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Part Number</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faults.map((fault) => (
                        <TableRow key={fault.id}>
                          <TableCell>
                            <Select
                              value={fault.sparePart}
                              onValueChange={(v) => updateFault(fault.id, "sparePart", v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Spare Part" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.spareParts.map((part) => (
                                  <SelectItem key={part} value={part}>{part}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={fault.quantity}
                              onChange={(e) => updateFault(fault.id, "quantity", parseInt(e.target.value || "1"))}
                            />
                          </TableCell>
                          <TableCell>
                            <Select
                              value={fault.status}
                              onValueChange={(v) => updateFault(fault.id, "status", v)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.statuses.map((status) => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              value={fault.partNumber}
                              onChange={(e) => updateFault(fault.id, "partNumber", e.target.value)}
                            />
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="destructive" onClick={() => removeFault(fault.id)}>
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
                <h3 className="text-lg font-semibold mb-4">Checklist</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Dust Cleaning</Label>
                    <Select
                      value={iqcForm.dustCleaning}
                      onValueChange={(v: "Done" | "Not Done") => setIqcForm({ ...iqcForm, dustCleaning: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Done">Done</SelectItem>
                        <SelectItem value="Not Done">Not Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>C-MOS Battery Change</Label>
                    <Select
                      value={iqcForm.cMosBatteryChange}
                      onValueChange={(v: "Done" | "Not Done") => setIqcForm({ ...iqcForm, cMosBatteryChange: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Done">Done</SelectItem>
                        <SelectItem value="Not Done">Not Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>CPU Thermal Paste</Label>
                    <Select
                      value={iqcForm.cpuThermalPaste}
                      onValueChange={(v: "Done" | "Not Done") => setIqcForm({ ...iqcForm, cpuThermalPaste: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Done">Done</SelectItem>
                        <SelectItem value="Not Done">Not Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
                <h3 className="text-lg font-semibold mb-4">Final Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Final Status</Label>
                    <Select
                      value={iqcForm.finalStatus}
                      onValueChange={(v) => setIqcForm({ ...iqcForm, finalStatus: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Final Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDropdownData.finalStatuses.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Remark</Label>
                    <Input
                      value={iqcForm.remark}
                      onChange={(e) => setIqcForm({ ...iqcForm, remark: e.target.value })}
                    />
                  </div>
                </div>
              </Card>

              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={resetForm}>
                  <RefreshCcw className="h-4 w-4 mr-2" /> Reset
                </Button>
                <Button variant="secondary" onClick={saveDraft}>
                  <Save className="h-4 w-4 mr-2" /> Draft
                </Button>
                <Button onClick={endIQC}>
                  <Send className="h-4 w-4 mr-2" /> End
                </Button>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}