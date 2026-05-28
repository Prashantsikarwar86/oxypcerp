import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import { mockGRNs, mockDevices } from "@/lib/mock-data";

export const Route = createFileRoute("/grn-report")({
  head: () => ({ meta: [{ title: "GRN Report — Oxypc Admin" }] }),
  component: () => <AdminLayout><GRNReportPage /></AdminLayout>,
});

function GRNReportPage() {
  const [activeTab, setActiveTab] = useState<"normal" | "spare" | "consumable">("normal");
  const [searchTerm, setSearchTerm] = useState("");

  const normalReportData = mockDevices.map(device => {
    const grn = mockGRNs.find(g => g.id === device.grnId);
    return {
      addedTime: device.inventoryAddedTime,
      modifiedUser: "Admin",
      modifiedTime: device.updatedAt,
      grnNumber: grn?.grnNumber || "-",
      grnDate: grn?.createdAt.toLocaleDateString() || "-",
      invoiceNumber: grn?.invoiceNumber || "-",
      invoiceValue: grn?.invoiceValue || 0,
      vehicleNumber: grn?.vehicleNumber || "-",
      vendorName: grn?.vendorNamePO || "-",
      poNumber: grn?.poNumber || "-",
      poDate: grn?.poDate?.toLocaleDateString() || "-",
      dateOfMaterialReceived: grn?.dateOfMaterialReceived?.toLocaleDateString() || "-",
      tagNumber: device.tagNumber,
      serialNumber: device.serialNumber,
      make: device.make,
      model: device.model,
      cpu: device.cpu || "-",
      generation: device.generation || "-",
      ram: device.ram || "-",
      hdd: device.hdd || "-",
      ssdCapacity: device.ssdCapacity || "-",
      screenSize: device.screenSize || "-",
      productStage: device.productStage,
      productStatus: device.productStatus,
      productCategory: device.category,
      productSubCategory: device.subCategory,
      physicalQuantity: device.physicalQuantity,
      unitPriceWithoutTax: 0,
      unitPriceWithTax: device.unitPriceWithTax,
      totalItemPrice: 0,
      location: device.location,
      customerName: device.customerName,
      lotNumber: device.lotNumber,
      totalPOQuantity: grn?.totalPOQuantity || 0,
      totalInvoiceQuantity: grn?.totalInvoiceQuantity || 0,
      totalPhysicalQuantity: grn?.totalPhysicalQuantity || 0,
      sgstInvoice: grn?.sgstInvoice || 0,
      cgstInvoice: grn?.cgstInvoice || 0,
      igstInvoice: grn?.igstInvoice || 0,
      taxableAmountInvoice: grn?.taxableAmountInvoice || 0,
      totalInvoiceValue: grn?.totalInvoiceValue || 0,
      variance: grn?.variance || 0,
    };
  });

  const filteredNormalReportData = normalReportData.filter(item =>
    item.grnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadPDF = () => {
    alert("PDF download functionality would be implemented here using the PDF template");
  };

  const exportAll = () => {
    alert("Export all functionality would be implemented here");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">GRN Report</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete GRN reports with all details</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by GRN, Tag, Invoice..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={exportAll} variant="outline">
            Export All
          </Button>
          <Button onClick={downloadPDF}>
            <Download className="h-4 w-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="normal">Normal GRN Report</TabsTrigger>
          <TabsTrigger value="spare">Spare Part GRN Report</TabsTrigger>
          <TabsTrigger value="consumable">Consumable GRN Report</TabsTrigger>
        </TabsList>

        <TabsContent value="normal" className="mt-4 space-y-4">
          <Card className="rounded-2xl glass shadow-card border border-border/40">
            <CardHeader>
              <CardTitle>Normal GRN Items Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
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
                      <TableHead>Product Category</TableHead>
                      <TableHead>Physical Quantity</TableHead>
                      <TableHead>Unit Price (w/o Tax)</TableHead>
                      <TableHead>Unit Price (w/ Tax)</TableHead>
                      <TableHead>Total Item Price</TableHead>
                      <TableHead>Invoice Value</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Customer Name</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNormalReportData.map((row, idx) => (
                      <TableRow key={idx} className="cursor-pointer hover:bg-muted/50" onClick={downloadPDF}>
                        <TableCell className="font-medium">{row.grnNumber}</TableCell>
                        <TableCell>{row.grnDate}</TableCell>
                        <TableCell className="font-medium">{row.tagNumber}</TableCell>
                        <TableCell>{row.serialNumber}</TableCell>
                        <TableCell>{row.make}</TableCell>
                        <TableCell>{row.model}</TableCell>
                        <TableCell>{row.cpu}</TableCell>
                        <TableCell>{row.generation}</TableCell>
                        <TableCell>{row.ram}</TableCell>
                        <TableCell>{row.hdd}</TableCell>
                        <TableCell>{row.ssdCapacity}</TableCell>
                        <TableCell>{row.screenSize}</TableCell>
                        <TableCell>{row.productStage}</TableCell>
                        <TableCell>{row.productStatus}</TableCell>
                        <TableCell>{row.productCategory}</TableCell>
                        <TableCell>{row.physicalQuantity}</TableCell>
                        <TableCell>₹{row.unitPriceWithoutTax.toLocaleString()}</TableCell>
                        <TableCell>₹{row.unitPriceWithTax.toLocaleString()}</TableCell>
                        <TableCell>₹{row.totalItemPrice.toLocaleString()}</TableCell>
                        <TableCell>₹{row.invoiceValue.toLocaleString()}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>{row.customerName}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spare" className="mt-4">
          <Card className="rounded-2xl glass shadow-card border border-border/40">
            <CardHeader>
              <CardTitle>Spare Part GRN Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Spare part GRN report will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consumable" className="mt-4">
          <Card className="rounded-2xl glass shadow-card border border-border/40">
            <CardHeader>
              <CardTitle>Consumable GRN Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Consumable GRN report will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
