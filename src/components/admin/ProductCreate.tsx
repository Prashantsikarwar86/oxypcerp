import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Save, FileEdit, X, Sparkles, Upload } from "lucide-react";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mock-data";
import { useNavigate } from "@tanstack/react-router";

type Section = { id: string; title: string };
const sections: Section[] = [
  { id: "info", title: "Product Information" },
  { id: "pricing", title: "Pricing & Tax" },
  { id: "stock", title: "Stock & Warehouse" },
  { id: "media", title: "Media & Documents" },
  { id: "spare", title: "Spare Part Item Details" },
  { id: "tax", title: "Purchase Order Tax Details" },
  { id: "invoice", title: "Invoice Quantity / Tax Details" },
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-lg border border-border bg-card text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 hover:border-primary/40";

function Select({ children = "Select", placeholder }: { children?: React.ReactNode; placeholder?: string }) {
  return (
    <button type="button" className={`${inputCls} flex items-center justify-between text-left text-muted-foreground`}>
      <span>{placeholder ?? children}</span>
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

function Accordion({ section, children, defaultOpen = false }: { section: Section; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl glass border border-border/40 shadow-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-primary/5 transition"
      >
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-gradient-primary" />
          <span className="font-semibold text-sm uppercase tracking-wider text-foreground/90">{section.title}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-5 pt-0">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductCreate() {
  const [showRequired, setShowRequired] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({
    productOwner: "Oxypc Admin",
    taxPreference: "Taxable",
    status: "Active",
    productNature: "Physical",
    gstPercentage: 18,
    cgst: 9,
    sgst: 9,
  });
  const navigate = useNavigate();

  return (
    <div className="space-y-5 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hover:text-primary cursor-pointer">Warehouse</span>
        <ChevronDown className="h-3 w-3 -rotate-90" />
        <span className="hover:text-primary cursor-pointer">Products</span>
        <ChevronDown className="h-3 w-3 -rotate-90" />
        <span className="text-foreground font-medium">Create</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl p-5 bg-gradient-primary text-primary-foreground shadow-glow"
      >
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 backdrop-blur">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Add Product</h1>
            <p className="text-sm text-white/80">Smart, fast onboarding — fields auto-validate as you type.</p>
          </div>
        </div>
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <span className="text-sm">Show Required & Important Fields</span>
          <button
            type="button"
            onClick={() => setShowRequired(!showRequired)}
            className={`relative h-6 w-11 rounded-full transition ${showRequired ? "bg-white" : "bg-white/30"}`}
          >
            <motion.span
              className={`absolute top-0.5 h-5 w-5 rounded-full shadow ${showRequired ? "bg-primary" : "bg-white"}`}
              animate={{ left: showRequired ? "1.4rem" : "0.1rem" }}
            />
          </button>
        </label>
      </motion.div>

      <Accordion section={sections[0]} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Field label="Product Owner" required>
            <div className={`${inputCls} flex items-center justify-between`}>
              <span>Oxypc Admin</span>
              <X className="h-4 w-4 text-muted-foreground" />
            </div>
          </Field>
          <Field label="Product Name" required><input className={inputCls} placeholder="e.g. iPhone 15 Pro" /></Field>
          <Field label="Product Type"><Select placeholder="Select" /></Field>
          <Field label="Product Description" required><textarea className={`${inputCls} h-10 py-2 resize-none`} /></Field>
          <Field label="HSN Code"><input className={inputCls} /></Field>
          <Field label="Tax Preference"><Select placeholder="Taxable" /></Field>
          <Field label="Status"><Select /></Field>
          <Field label="Product Nature"><Select /></Field>
          <Field label="Master Category" required><Select /></Field>
          <Field label="Category" required><Select /></Field>
          <Field label="Sub Category" required><Select /></Field>
          <Field label="Make"><Select /></Field>
          <Field label="Model"><Select /></Field>
          <Field label="Waste Category"><Select /></Field>
          <Field label="WEEE Category"><Select /></Field>
          <Field label="Weight (Kg)"><input type="number" className={inputCls} /></Field>
          <Field label="UOM"><Select /></Field>
          <Field label="Remarks"><input className={inputCls} /></Field>
          <Field label="Online Selling" required><Select /></Field>
          <Field label="Length"><input type="number" className={inputCls} /></Field>
        </div>
      </Accordion>

      <Accordion section={sections[1]} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="MRP" required><input type="number" className={inputCls} /></Field>
          <Field label="Selling Price" required><input type="number" className={inputCls} /></Field>
          <Field label="Cost Price"><input type="number" className={inputCls} /></Field>
          <Field label="GST %"><Select /></Field>
          <Field label="CGST"><input type="number" className={inputCls} /></Field>
          <Field label="SGST"><input type="number" className={inputCls} /></Field>
        </div>
      </Accordion>

      <Accordion section={sections[2]} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Warehouse"><Select /></Field>
          <Field label="Opening Stock"><input type="number" className={inputCls} /></Field>
          <Field label="Reorder Level"><input type="number" className={inputCls} /></Field>
        </div>
      </Accordion>

      <Accordion section={sections[3]} defaultOpen={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["Product Image","E-Way Bill Image","Vehicle Seal Image","Vehicle Image"].map((l) => (
            <Field key={l} label={l}>
              <div className="flex items-center gap-3 p-3 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition cursor-pointer">
                <Upload className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground">Drop file or click to upload</span>
              </div>
            </Field>
          ))}
        </div>
      </Accordion>

      <Accordion section={sections[4]} defaultOpen={true}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground">
                {["Item Name","Category","Lot Number","CGST","SGST","IGST","Quantity","Qty Invoice","Physical Qty","Tag #","Make","Model"].map(h => (
                  <th key={h} className="px-3 py-2 font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-border">
                {Array.from({length:12}).map((_,i)=>(
                  <td key={i} className="px-2 py-2"><input className="w-24 h-8 rounded-md border border-border px-2 text-xs" /></td>
                ))}
              </tr>
            </tbody>
          </table>
          <div className="h-1 mt-3 rounded-full bg-muted overflow-hidden">
            <motion.div className="h-full bg-gradient-primary" initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ duration: 1.2 }} />
          </div>
        </div>
      </Accordion>

      <Accordion section={sections[5]} defaultOpen={true}>
        <div className="text-sm text-muted-foreground">PO tax breakdown auto-computes from line items above.</div>
      </Accordion>

      <Accordion section={sections[6]} defaultOpen={true}>
        <div className="text-sm text-muted-foreground">Invoice quantities reconciled with received stock.</div>
      </Accordion>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky bottom-4 z-20 flex gap-3 p-4 rounded-2xl glass shadow-glow border border-border/40"
      >
        <button
          onClick={() => {
            const newProduct: Product = {
              id: `prod-${Date.now()}`,
              productOwner: formData.productOwner || "Oxypc Admin",
              productName: formData.productName || "New Product",
              productType: formData.productType || "Electronics",
              productDescription: formData.productDescription || "",
              hsnCode: formData.hsnCode,
              taxPreference: formData.taxPreference || "Taxable",
              status: formData.status || "Active",
              productNature: formData.productNature || "Physical",
              masterCategory: formData.masterCategory || "Electronics",
              category: formData.category || "Laptop",
              subCategory: formData.subCategory || "Business Laptops",
              make: formData.make,
              model: formData.model,
              mrp: formData.mrp || 0,
              sellingPrice: formData.sellingPrice || 0,
              costPrice: formData.costPrice,
              gstPercentage: formData.gstPercentage || 18,
              cgst: formData.cgst || 9,
              sgst: formData.sgst || 9,
              warehouse: formData.warehouse || "Warehouse A",
              openingStock: formData.openingStock || 0,
              reorderLevel: formData.reorderLevel,
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            mockProducts.unshift(newProduct);
            navigate({ to: "/product-master" });
          }}
          className="flex items-center gap-2 px-5 h-11 rounded-xl bg-gradient-primary text-primary-foreground font-medium shadow-soft hover:shadow-glow transition"
        >
          <Save className="h-4 w-4" /> Save Product
        </button>
        <button className="flex items-center gap-2 px-5 h-11 rounded-xl bg-destructive text-destructive-foreground font-medium hover:opacity-90 transition">
          <FileEdit className="h-4 w-4" /> Save as Draft
        </button>
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-2 px-5 h-11 rounded-xl border border-border hover:bg-muted transition"
        >
          <X className="h-4 w-4" /> Cancel
        </button>
      </motion.div>
    </div>
  );
}
