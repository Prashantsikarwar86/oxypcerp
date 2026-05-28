export type DeviceStatus = 
  | "Available"
  | "AssignedToHeadEngineer"
  | "AssignedToL1L2"
  | "InRepair"
  | "AwaitingSpare"
  | "EscalatedToL3L4"
  | "InAdvancedRepair"
  | "AwaitingQC"
  | "Closed"
  | "NotRepairable";

export type GRNType = "GRN" | "Spare Part GRN" | "Consumable GRN";

export interface PO {
  id: string;
  poNumber: string;
  poDate: Date;
  vendorName: string;
  sgst: number;
  cgst: number;
  igst: number;
  taxableAmount: number;
  taxAmount: number;
  invoiceValue: number;
  items: POItem[];
}

export interface POItem {
  id: string;
  itemName: string;
  subCategory: string;
  lotNumber: string;
  customerName: string;
  purchaseOrder: string;
  quantity: number;
  make: string;
  model: string;
  unitPriceWithoutTax: number;
  unitPriceWithTax: number;
  itemValue: number;
  location: string;
  taxPercentage: number;
  totalItemPrice: number;
  cpu?: string;
  generation?: string;
  ram?: string;
  hdd?: string;
  ssdCapacity?: string;
  screenSize?: string;
}

export interface Device {
  id: string;
  inventoryAddedTime: Date;
  userName: string;
  poNumber: string;
  grnNumber: string;
  grnDate: Date;
  tagNumber: string;
  serialNumber: string;
  make: string;
  model: string;
  cpu?: string;
  generation?: string;
  ram?: string;
  hdd?: string;
  ssdCapacity?: string;
  screenSize?: string;
  productStage: string;
  productStatus: string;
  masterCategory: string;
  subCategory: string;
  category: string;
  location: string;
  lotNumber: string;
  totalInvoiceValue: number;
  invoiceNumber: string;
  customerName: string;
  physicalQuantity: number;
  vendorName: string;
  inventoryId: string;
  unitPriceWithTax: number;
  itemName?: string;
  status: DeviceStatus;
  owner: "Inventory" | "HeadEngineer" | "L1L2" | "L3L4" | "QC" | "IQC";
  assignedTo?: string;
  grnId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GRNItem {
  id: string;
  itemName: string;
  subCategory: string;
  lotNumber: string;
  customerName: string;
  purchaseOrder: string;
  quantityInInvoice: number;
  physicalQuantity: number;
  tagNumbers: string[];
  serialNumber?: string;
  make: string;
  model: string;
  cpu?: string;
  generation?: string;
  ram?: string;
  hdd?: string;
  ssdCapacity?: string;
  screenSize?: string;
  unitPriceWithoutTax: number;
  unitPriceWithTax: number;
  itemValue: number;
  location: string;
  taxPercentage: number;
  totalItemPrice: number;
  productDescription?: string;
  crateTagNumber?: string;
  sparePart?: string;
  masterCategory?: string;
  category?: string;
  vehicleNumber?: string;
  partNumber?: string;
  warrantyPeriod?: string;
  remark?: string;
  taxAmount?: number;
}

export interface GRN {
  id: string;
  grnNumber: string;
  grnType: GRNType;
  poNumber: string;
  poDate: Date;
  dateOfMaterialReceived: Date;
  vendorNamePO: string;
  productStage?: string;
  productStatus?: string;
  invoiceNumber: string;
  invoiceDate: Date;
  invoiceImage?: string;
  eWayBillNumber?: string;
  eWayBillDate?: Date;
  eWayBillImage?: string;
  vehicleNumber?: string;
  vehicleSealImage?: string;
  vehicleImage?: string;
  sgst: number;
  cgst: number;
  igst: number;
  taxableAmount: number;
  taxAmount: number;
  invoiceValue: number;
  items: GRNItem[];
  totalPOQuantity: number;
  totalInvoiceQuantity: number;
  totalPhysicalQuantity: number;
  variance: number;
  taxableAmountInvoice: number;
  totalInvoiceValue: number;
  sgstInvoice: number;
  cgstInvoice: number;
  igstInvoice: number;
  finalCheck: boolean;
  assignToHeadEngineer?: string;
  status: "Draft" | "Submitted";
  createdAt: Date;
  freightCost?: number;
  customerName?: string;
  pickupCost?: number;
}

export type SpareRequestStatus = 
  | "PendingApproval"
  | "Approved"
  | "Rejected"
  | "Issued";

export interface SpareRequest {
  id: string;
  deviceId: string;
  partName: string;
  quantity: number;
  requestedBy: string;
  status: SpareRequestStatus;
  createdAt: Date;
}

export interface Engineer {
  id: string;
  name: string;
  level: "L1" | "L2" | "L3" | "L4" | "IQC";
}

export interface DropdownData {
  grnTypes: GRNType[];
  poNumbers: string[];
  customerNames: string[];
  makes: string[];
  models: string[];
  locations: string[];
  headEngineers: string[];
  ramStatuses: string[];
  spareParts: string[];
  statuses: string[];
  finalStatuses: string[];
  problemsObserved: string[];
  actionsTaken: string[];
  customerInternal: string[];
  scrapReasons: string[];
  hddSsdOptions: string[];
  productStages: string[];
  productStatuses: string[];
}

export interface IQCData {
  id: string;
  tagNumber: string;
  userName: string;
  iqcEngineer: string;
  iqcCompletionDate: Date;
  startedDateTime: Date;
  lotNumber: string;
  serialNumber: string;
  subCategory: string;
  make: string;
  updateMake: boolean;
  newMakeValue?: string;
  model: string;
  updateModel: boolean;
  newModelValue?: string;
  cpu: string;
  updateCpu: boolean;
  newCpuValue?: string;
  generation: string;
  updateGeneration: boolean;
  newGenerationValue?: string;
  ram: string;
  ramStatus: string;
  hddSsdCapacity: string;
  updateHddSsd: boolean;
  removedHddSsdCapacity?: string;
  addedHddSsdCapacity?: string;
  faults: IQCFault[];
  dustCleaning: "Done" | "Not Done";
  cMosBatteryChange: "Done" | "Not Done";
  cpuThermalPaste: "Done" | "Not Done";
  finalStatus: string;
  remark: string;
}

export interface IQCFault {
  id: string;
  sparePart: string;
  quantity: number;
  status: string;
  partNumber: string;
}

export interface L3L4Data {
  id: string;
  userName: string;
  tagNumber: string;
  dateTime: Date;
  lotNumber: string;
  subCategory: string;
  make: string;
  model: string;
  cpu: string;
  generation: string;
  problemReported: string;
  receivedFrom: string;
  faults: L3L4Fault[];
  problemObserved: string;
  actionTaken: string;
  finalStatus: string;
  customerInternal: string;
  scrapReason?: string;
}

export interface L3L4Fault {
  id: string;
  sparePart: string;
  quantity: number;
  status: string;
  partNumber: string;
}

export interface SparePartInventory {
  id: string;
  inventoryAddedTime: Date;
  poNumber: string;
  grnDateAndTime: Date;
  grnNumber: string;
  vendorName: string;
  invoiceNumber: string;
  lotNumber: string;
  productDescription: string;
  itemName: string;
  crateTagNumber: string;
  make: string;
  model: string;
  sparePart: string;
  invoiceQuantity: number;
  physicalQuantity: number;
  price: number;
  location: string;
  masterCategory: string;
  category: string;
  subCategory: string;
  vehicleNumber: string;
  totalInvoiceValue: number;
}

export interface Product {
  id: string;
  productOwner: string;
  productName: string;
  productType: string;
  productDescription: string;
  hsnCode?: string;
  taxPreference: string;
  status: string;
  productNature: string;
  masterCategory: string;
  category: string;
  subCategory: string;
  make?: string;
  model?: string;
  mrp: number;
  sellingPrice: number;
  costPrice?: number;
  gstPercentage: number;
  cgst: number;
  sgst: number;
  warehouse: string;
  openingStock: number;
  reorderLevel?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpareRequest {
  id: string;
  deviceId: string;
  partName: string;
  quantity: number;
  requestedBy: string;
  requestedByLevel: "L1" | "L2" | "L3" | "L4";
  status: "PendingApproval" | "Approved" | "Rejected" | "Issued";
  approvedBy?: string;
  assignedByStoreManager?: string;
  assignedAt?: Date;
  createdAt: Date;
}
