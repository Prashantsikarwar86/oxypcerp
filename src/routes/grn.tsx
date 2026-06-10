import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Plus, Save, Send, RefreshCcw } from "lucide-react";
import { mockGRNs, mockDropdownData, mockPOs } from "@/lib/mock-data";
import { GRN, GRNType, GRNItem } from "@/lib/types";

export const Route = createFileRoute("/grn")({
  head: () => ({
    meta: [
      { title: "GRN Creation — Oxypc ERP" },
    ],
  }),
  component: () => <AdminLayout><GRNPage /></AdminLayout>,
});

function GRNPage() {
  const [grns, setGrns] = useState<GRN[]>(mockGRNs);
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");
  const [grnType, setGrnType] = useState<GRNType>("GRN");
  const [formData, setFormData] = useState<Partial<GRN>>({
    grnType: "GRN",
    sgst: 0,
    cgst: 0,
    igst: 0,
    taxableAmount: 0,
    taxAmount: 0,
    invoiceValue: 0,
    items: [],
    totalPOQuantity: 0,
    totalInvoiceQuantity: 0,
    totalPhysicalQuantity: 0,
    variance: 0,
    taxableAmountInvoice: 0,
    totalInvoiceValue: 0,
    sgstInvoice: 0,
    cgstInvoice: 0,
    igstInvoice: 0,
    finalCheck: false,
    status: "Draft",
  });
  const [items, setItems] = useState<GRNItem[]>([]);
  const [productStages, setProductStages] = useState<string[]>(mockDropdownData.productStages);
  const [productStatuses, setProductStatuses] = useState<string[]>(mockDropdownData.productStatuses);
  const [newProductStage, setNewProductStage] = useState<string>("");
  const [newProductStatus, setNewProductStatus] = useState<string>("");
  const [showProductStageDialog, setShowProductStageDialog] = useState<boolean>(false);
  const [showProductStatusDialog, setShowProductStatusDialog] = useState<boolean>(false);

  const handlePONumberChange = (poNumber: string) => {
    const po = mockPOs.find(p => p.poNumber === poNumber);
    if (po) {
      const newItems: GRNItem[] = po.items.map((poItem, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        itemName: poItem.itemName,
        subCategory: poItem.subCategory,
        lotNumber: poItem.lotNumber,
        customerName: poItem.customerName,
        purchaseOrder: poItem.purchaseOrder,
        quantityInInvoice: poItem.quantity,
        physicalQuantity: poItem.quantity,
        tagNumbers: [],
        make: poItem.make,
        model: poItem.model,
        unitPriceWithoutTax: poItem.unitPriceWithoutTax,
        unitPriceWithTax: poItem.unitPriceWithTax,
        itemValue: poItem.itemValue,
        location: poItem.location,
        taxPercentage: poItem.taxPercentage,
        totalItemPrice: poItem.totalItemPrice,
        cpu: poItem.cpu,
        generation: poItem.generation,
        ram: poItem.ram,
        hdd: poItem.hdd,
        ssdCapacity: poItem.ssdCapacity,
        screenSize: poItem.screenSize,
      }));
      
      const totalPOQty = po.items.reduce((sum, item) => sum + item.quantity, 0);
      const totalInvoiceQty = totalPOQty;
      const totalPhysicalQty = totalPOQty;
      
      setFormData({
        ...formData,
        poNumber,
        poDate: po.poDate,
        dateOfMaterialReceived: new Date(),
        vendorNamePO: po.vendorName,
        sgst: po.sgst,
        cgst: po.cgst,
        igst: po.igst,
        taxableAmount: po.taxableAmount,
        taxAmount: po.taxAmount,
        invoiceValue: po.invoiceValue,
        items: newItems,
        totalPOQuantity: totalPOQty,
        totalInvoiceQuantity: totalInvoiceQty,
        totalPhysicalQuantity: totalPhysicalQty,
        variance: 0,
        taxableAmountInvoice: po.taxableAmount,
        totalInvoiceValue: po.invoiceValue,
        sgstInvoice: po.taxableAmount * (po.sgst / 100),
        cgstInvoice: po.taxableAmount * (po.cgst / 100),
        igstInvoice: po.taxableAmount * (po.igst / 100),
      });
      setItems(newItems);
    }
  };

  const handleQuantityChange = (index: number, field: keyof GRNItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
    
    const totalInvoiceQty = updatedItems.reduce((sum, item) => sum + (item.quantityInInvoice || 0), 0);
    const totalPhysicalQty = updatedItems.reduce((sum, item) => sum + (item.physicalQuantity || 0), 0);
    const variance = totalInvoiceQty - totalPhysicalQty;
    
    setFormData({
      ...formData,
      items: updatedItems,
      totalInvoiceQuantity: totalInvoiceQty,
      totalPhysicalQuantity: totalPhysicalQty,
      variance,
    });
  };

  const addNewItem = () => {
    const newItem: GRNItem = {
      id: `item-${Date.now()}`,
      itemName: "",
      subCategory: "",
      lotNumber: "",
      customerName: "",
      purchaseOrder: formData.poNumber || "",
      quantityInInvoice: 0,
      physicalQuantity: 0,
      tagNumbers: [],
      make: "",
      model: "",
      unitPriceWithoutTax: 0,
      unitPriceWithTax: 0,
      itemValue: 0,
      location: "",
      taxPercentage: 0,
      totalItemPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const saveAsDraft = () => {
    const newGRN: GRN = {
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-2026-${String(grns.length + 1).padStart(3, "0")}`,
      ...formData,
      items,
      status: "Draft",
      createdAt: new Date(),
    } as GRN;
    setGrns([newGRN, ...grns]);
    setActiveTab("list");
    resetForm();
  };

  const submitGRN = () => {
    const newGRN: GRN = {
      id: `grn-${Date.now()}`,
      grnNumber: `GRN-2026-${String(grns.length + 1).padStart(3, "0")}`,
      ...formData,
      items,
      status: "Submitted",
      createdAt: new Date(),
    } as GRN;
    setGrns([newGRN, ...grns]);
    setActiveTab("list");
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      grnType: "GRN",
      sgst: 0,
      cgst: 0,
      igst: 0,
      taxableAmount: 0,
      taxAmount: 0,
      invoiceValue: 0,
      items: [],
      totalPOQuantity: 0,
      totalInvoiceQuantity: 0,
      totalPhysicalQuantity: 0,
      variance: 0,
      taxableAmountInvoice: 0,
      totalInvoiceValue: 0,
      sgstInvoice: 0,
      cgstInvoice: 0,
      igstInvoice: 0,
      finalCheck: false,
      status: "Draft",
    });
    setItems([]);
  };

  const addProductStage = () => {
    if (newProductStage.trim()) {
      setProductStages([...productStages, newProductStage.trim()]);
      setNewProductStage("");
      setShowProductStageDialog(false);
    }
  };

  const addProductStatus = () => {
    if (newProductStatus.trim()) {
      setProductStatuses([...productStatuses, newProductStatus.trim()]);
      setNewProductStatus("");
      setShowProductStatusDialog(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient">GRN Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Create and manage Goods Receipt Notes</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "list" | "create")}>
        <TabsList>
          <TabsTrigger value="list">GRN List</TabsTrigger>
          <TabsTrigger value="create">Create GRN</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4">
          <Card className="rounded-2xl glass shadow-card border border-border/40">
            <CardHeader>
              <CardTitle>GRN List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GRN Number</TableHead>
                    <TableHead>GRN Type</TableHead>
                    <TableHead>PO Number</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grns.map((grn) => (
                    <TableRow key={grn.id}>
                      <TableCell className="font-medium">{grn.grnNumber}</TableCell>
                      <TableCell>{grn.grnType}</TableCell>
                      <TableCell>{grn.poNumber}</TableCell>
                      <TableCell>{grn.vendorNamePO}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          grn.status === "Draft" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                        }`}>
                          {grn.status}
                        </span>
                      </TableCell>
                      <TableCell>{grn.createdAt.toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-4 space-y-6">
          <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
            <h3 className="text-lg font-semibold mb-4">GRN Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>GRN Type *</Label>
                <Select value={grnType} onValueChange={(v: GRNType) => { setGrnType(v); setFormData({ ...formData, grnType: v }); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select GRN Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDropdownData.grnTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>PO Number *</Label>
                <Select onValueChange={handlePONumberChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select PO Number" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDropdownData.poNumbers.map((po) => (
                      <SelectItem key={po} value={po}>{po}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>PO Date</Label>
                <Input type="date" value={formData.poDate?.toISOString().split("T")[0]} disabled />
              </div>
              <div className="space-y-2">
                <Label>Date of Material Received</Label>
                <Input type="date" value={formData.dateOfMaterialReceived?.toISOString().split("T")[0]} disabled />
              </div>
              <div className="space-y-2">
                <Label>Vendor Name (PO)</Label>
                <Input value={formData.vendorNamePO} disabled />
              </div>
              <div className="space-y-2">
                <Label>Product Stage</Label>
                <div className="flex gap-2">
                  <Select value={formData.productStage} onValueChange={(v) => setFormData({ ...formData, productStage: v })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Product Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {productStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={showProductStageDialog} onOpenChange={setShowProductStageDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product Stage</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input 
                          placeholder="Enter Product Stage Name" 
                          value={newProductStage} 
                          onChange={(e) => setNewProductStage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addProductStage()}
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowProductStageDialog(false)}>Cancel</Button>
                          <Button onClick={addProductStage} disabled={!newProductStage.trim()}>Add</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Product Status</Label>
                <div className="flex gap-2">
                  <Select value={formData.productStatus} onValueChange={(v) => setFormData({ ...formData, productStatus: v })}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select Product Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {productStatuses.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={showProductStatusDialog} onOpenChange={setShowProductStatusDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Product Status</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Input 
                          placeholder="Enter Product Status Name" 
                          value={newProductStatus} 
                          onChange={(e) => setNewProductStatus(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addProductStatus()}
                        />
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setShowProductStatusDialog(false)}>Cancel</Button>
                          <Button onClick={addProductStatus} disabled={!newProductStatus.trim()}>Add</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Invoice Number *</Label>
                <Input value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Invoice Date *</Label>
                <Input type="date" value={formData.invoiceDate?.toISOString().split("T")[0]} onChange={(e) => setFormData({ ...formData, invoiceDate: new Date(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Invoice Image {grnType === "Consumable GRN" ? "*" : ""}</Label>
                <Input type="file" />
              </div>
              <div className="space-y-2">
                <Label>E-Way Bill Number</Label>
                <Input value={formData.eWayBillNumber} onChange={(e) => setFormData({ ...formData, eWayBillNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>E-Way Bill Date</Label>
                <Input type="date" value={formData.eWayBillDate?.toISOString().split("T")[0]} onChange={(e) => setFormData({ ...formData, eWayBillDate: new Date(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>E-Way Bill Image</Label>
                <Input type="file" />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Number {grnType === "Spare Part GRN" ? "*" : ""}</Label>
                <Input value={formData.vehicleNumber} onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Seal Image</Label>
                <Input type="file" />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Image</Label>
                <Input type="file" />
              </div>
              {grnType === "Spare Part GRN" && (
                <>
                  <div className="space-y-2">
                    <Label>Freight Cost</Label>
                    <Input type="number" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Name *</Label>
                    <Select onValueChange={(v) => setFormData({ ...formData, customerName: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Customer Name" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDropdownData.customerNames.map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pickup Cost</Label>
                    <Input type="number" disabled />
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
            <h3 className="text-lg font-semibold mb-4">Purchase Order Tax Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>SGST</Label>
                <Input type="number" value={formData.sgst} disabled />
              </div>
              <div className="space-y-2">
                <Label>CGST</Label>
                <Input type="number" value={formData.cgst} disabled />
              </div>
              <div className="space-y-2">
                <Label>IGST</Label>
                <Input type="number" value={formData.igst} disabled />
              </div>
              <div className="space-y-2">
                <Label>Taxable Amount</Label>
                <Input type="number" value={formData.taxableAmount} disabled />
              </div>
              <div className="space-y-2">
                <Label>Tax Amount</Label>
                <Input type="number" value={formData.taxAmount} disabled />
              </div>
              <div className="space-y-2">
                <Label>Invoice Value</Label>
                <Input type="number" value={formData.invoiceValue} disabled />
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Items</h3>
              <Button size="sm" onClick={addNewItem}>
                <Plus className="h-4 w-4 mr-2" /> Add New Item
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {grnType === "GRN" && (
                      <>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Sub Category</TableHead>
                        <TableHead>Lot Number *</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Purchase Order</TableHead>
                        <TableHead>Quantity Invoice *</TableHead>
                        <TableHead>Physical Qty *</TableHead>
                        <TableHead>Tag Numbers</TableHead>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Make</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>CPU</TableHead>
                        <TableHead>Generation</TableHead>
                        <TableHead>RAM</TableHead>
                        <TableHead>HDD</TableHead>
                        <TableHead>SSD Capacity</TableHead>
                        <TableHead>Screen Size</TableHead>
                        <TableHead>Unit Price (w/o Tax)</TableHead>
                        <TableHead>Unit Price (w/ Tax)</TableHead>
                        <TableHead>Item Value</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Tax %</TableHead>
                        <TableHead>Total Item Price</TableHead>
                      </>
                    )}
                    {grnType === "Spare Part GRN" && (
                      <>
                        <TableHead>Lot Number *</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Purchase Order No</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Make</TableHead>
                        <TableHead>Model</TableHead>
                        <TableHead>Spare Part</TableHead>
                        <TableHead>PO Quantity</TableHead>
                        <TableHead>Quantity Invoice</TableHead>
                        <TableHead>Physical Quantity</TableHead>
                        <TableHead>Tag No.</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Tax Percentage</TableHead>
                        <TableHead>Total Item Price</TableHead>
                        <TableHead>Tax Amount</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Main Category</TableHead>
                        <TableHead>Part Number</TableHead>
                        <TableHead>Warranty Period</TableHead>
                        <TableHead>Remark</TableHead>
                        <TableHead>Product Description</TableHead>
                      </>
                    )}
                    {grnType === "Consumable GRN" && (
                      <>
                        <TableHead>Lot No.</TableHead>
                        <TableHead>Location *</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Sub-Category</TableHead>
                        <TableHead>Quantity *</TableHead>
                        <TableHead>Quantity in Invoice</TableHead>
                        <TableHead>Tag No.</TableHead>
                        <TableHead>Physical Quantity</TableHead>
                        <TableHead>Price *</TableHead>
                        <TableHead>Product Description</TableHead>
                        <TableHead>Tax Percentage</TableHead>
                        <TableHead>Total Item Price</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      {grnType === "GRN" && (
                        <>
                          <TableCell>
                            <Input value={item.itemName} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.subCategory} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.lotNumber} disabled />
                          </TableCell>
                          <TableCell>
                            <Select value={item.customerName} onValueChange={(v) => handleQuantityChange(index, 'customerName', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Customer Name" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.customerNames.map((name) => (
                                  <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input value={item.purchaseOrder} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.quantityInInvoice} onChange={(e) => handleQuantityChange(index, 'quantityInInvoice', parseInt(e.target.value || '0'))} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.physicalQuantity} onChange={(e) => handleQuantityChange(index, 'physicalQuantity', parseInt(e.target.value || '0'))} />
                          </TableCell>
                          <TableCell>
                            <Input value={(item.tagNumbers || []).join(', ')} onChange={(e) => {
                              const tags = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              handleQuantityChange(index, 'tagNumbers', tags);
                            }} />
                          </TableCell>
                          <TableCell>
                            <Input value={item.serialNumber || ''} onChange={(e) => handleQuantityChange(index, 'serialNumber', e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <Select value={item.make} onValueChange={(v) => handleQuantityChange(index, 'make', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Make" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.makes.map((m) => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={item.model} onValueChange={(v) => handleQuantityChange(index, 'model', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Model" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.models.map((m) => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input value={item.cpu || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.generation || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.ram || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.hdd || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.ssdCapacity || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.screenSize || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.unitPriceWithoutTax} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.unitPriceWithTax} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.itemValue} disabled />
                          </TableCell>
                          <TableCell>
                            <Select value={item.location} onValueChange={(v) => handleQuantityChange(index, 'location', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Location" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.locations.map((loc) => (
                                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.taxPercentage} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.totalItemPrice} disabled />
                          </TableCell>
                        </>
                      )}
                      {grnType === "Spare Part GRN" && (
                        <>
                          <TableCell>
                            <Input value={item.lotNumber} onChange={(e) => handleQuantityChange(index, 'lotNumber', e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <Input value={item.itemName} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.purchaseOrder} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.category || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Select value={item.make} onValueChange={(v) => handleQuantityChange(index, 'make', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Make" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.makes.map((m) => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={item.model} onValueChange={(v) => handleQuantityChange(index, 'model', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Model" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.models.map((m) => (
                                  <SelectItem key={m} value={m}>{m}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select value={item.sparePart || ''} onValueChange={(v) => handleQuantityChange(index, 'sparePart', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Spare Part" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.spareParts.map((s) => (
                                  <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.quantityInInvoice} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.quantityInInvoice} onChange={(e) => handleQuantityChange(index, 'quantityInInvoice', parseInt(e.target.value || '0'))} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.physicalQuantity} onChange={(e) => handleQuantityChange(index, 'physicalQuantity', parseInt(e.target.value || '0'))} />
                          </TableCell>
                          <TableCell>
                            <Input value={(item.tagNumbers || []).join(', ')} onChange={(e) => {
                              const tags = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              handleQuantityChange(index, 'tagNumbers', tags);
                            }} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.unitPriceWithTax} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.taxPercentage} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.totalItemPrice} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.taxAmount || 0} onChange={(e) => handleQuantityChange(index, 'taxAmount', parseFloat(e.target.value || '0'))} />
                          </TableCell>
                          <TableCell>
                            <Select value={item.location} onValueChange={(v) => handleQuantityChange(index, 'location', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Location" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.locations.map((loc) => (
                                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input value={item.masterCategory || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.partNumber || ''} onChange={(e) => handleQuantityChange(index, 'partNumber', e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <Select value={item.warrantyPeriod || ''} onValueChange={(v) => handleQuantityChange(index, 'warrantyPeriod', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Warranty Period" />
                              </SelectTrigger>
                              <SelectContent>
                                {['-Select-', '1 Month', '3 Months', '6 Months', '1 year', '1.5 year', '2 year', '2.5 year'].map((wp) => (
                                  <SelectItem key={wp} value={wp}>{wp}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input value={item.remark || ''} onChange={(e) => handleQuantityChange(index, 'remark', e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <Input value={item.productDescription || ''} disabled />
                          </TableCell>
                        </>
                      )}
                      {grnType === "Consumable GRN" && (
                        <>
                          <TableCell>
                            <Input value={item.lotNumber} onChange={(e) => handleQuantityChange(index, 'lotNumber', e.target.value)} />
                          </TableCell>
                          <TableCell>
                            <Select value={item.location} onValueChange={(v) => handleQuantityChange(index, 'location', v)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Location" />
                              </SelectTrigger>
                              <SelectContent>
                                {mockDropdownData.locations.map((loc) => (
                                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input value={item.itemName} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.category || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.subCategory} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.quantityInInvoice} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.quantityInInvoice} onChange={(e) => handleQuantityChange(index, 'quantityInInvoice', parseInt(e.target.value || '0'))} />
                          </TableCell>
                          <TableCell>
                            <Input value={(item.tagNumbers || []).join(', ')} onChange={(e) => {
                              const tags = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                              handleQuantityChange(index, 'tagNumbers', tags);
                            }} />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.physicalQuantity} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.unitPriceWithTax} disabled />
                          </TableCell>
                          <TableCell>
                            <Input value={item.productDescription || ''} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.taxPercentage} disabled />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={item.totalItemPrice} disabled />
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="rounded-2xl glass shadow-card border border-border/40 p-6">
            <h3 className="text-lg font-semibold mb-4">Invoice Quantity/Tax Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Total PO Quantity</Label>
                <Input type="number" value={formData.totalPOQuantity} disabled />
              </div>
              <div className="space-y-2">
                <Label>Total Invoice Quantity</Label>
                <Input type="number" value={formData.totalInvoiceQuantity} disabled />
              </div>
              <div className="space-y-2">
                <Label>Total Physical Quantity</Label>
                <Input type="number" value={formData.totalPhysicalQuantity} disabled />
              </div>
              <div className="space-y-2">
                <Label>Variance</Label>
                <Input type="number" value={formData.variance} disabled />
              </div>
              <div className="space-y-2">
                <Label>Taxable Amount Invoice</Label>
                <Input type="number" value={formData.taxableAmountInvoice} disabled />
              </div>
              <div className="space-y-2">
                <Label>Total Invoice Value</Label>
                <Input type="number" value={formData.totalInvoiceValue} disabled />
              </div>
              <div className="space-y-2">
                <Label>SGST Invoice</Label>
                <Input type="number" value={formData.sgstInvoice} disabled />
              </div>
              <div className="space-y-2">
                <Label>CGST Invoice</Label>
                <Input type="number" value={formData.cgstInvoice} disabled />
              </div>
              <div className="space-y-2">
                <Label>IGST Invoice</Label>
                <Input type="number" value={formData.igstInvoice} disabled />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={formData.finalCheck}
                  onCheckedChange={(checked) => setFormData({ ...formData, finalCheck: checked as boolean })}
                />
                <Label>Final Check</Label>
              </div>
              {grnType === "Consumable GRN" && (
                <div className="space-y-2">
                  <Label>Assign To Head Engineer</Label>
                  <Select onValueChange={(v) => setFormData({ ...formData, assignToHeadEngineer: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Head Engineer" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockDropdownData.headEngineers.map((eng) => (
                        <SelectItem key={eng} value={eng}>{eng}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-6">
              <Button onClick={resetForm} variant="outline">
                <RefreshCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
              <Button onClick={saveAsDraft}>
                <Save className="h-4 w-4 mr-2" /> Save as Draft
              </Button>
              <Button onClick={submitGRN} disabled={!formData.finalCheck}>
                <Send className="h-4 w-4 mr-2" /> Submit
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}