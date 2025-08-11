import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LS_PRODUCTS } from "./Products";

export default function ProductForm() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const editingId = params.get("id"); // if present => edit

  const role = (localStorage.getItem("role") || "admin").toLowerCase();
  const [rows, setRows] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    id: "",
    name: "",
    brand: "",
    grade: "",
    packLiters: "",
    pricePerLiter: "",
    onHandLiters: "",
    reorderLevelLiters: "",
    barcode: "",
  });

  // Load existing products
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    setRows(data);
  }, []);

  // If editing, hydrate the form
  useEffect(() => {
    if (!editingId) return;
    const p = rows.find((r) => r.id === editingId);
    if (p) {
      setForm({
        id: p.id,
        name: p.name || "",
        brand: p.brand || "",
        grade: p.grade || "",
        packLiters: String(p.packLiters ?? ""),
        pricePerLiter: String(p.pricePerLiter ?? ""),
        onHandLiters: String(p.onHandLiters ?? ""),
        reorderLevelLiters: String(p.reorderLevelLiters ?? ""),
        barcode: p.barcode || "",
      });
    }
  }, [editingId, rows]);

  const isEdit = Boolean(editingId);
  const title = isEdit ? "Edit Product" : "Add Product";

  // Guard: only superadmin can use this screen in MVP
  if (role !== "superadmin") {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-textmain">{title}</h1>
        <div className="bg-surface border border-bordercol rounded p-4">
          <p className="text-error font-medium">
            Access denied: only Super Admin can add or edit products in the MVP.
          </p>
          <button
            onClick={() => nav("/inventory/products")}
            className="mt-3 px-4 py-2 rounded border border-bordercol hover:bg-background"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.packLiters || Number(form.packLiters) <= 0)
      e.packLiters = "Pack size (L) must be > 0";
    if (!form.pricePerLiter || Number(form.pricePerLiter) <= 0)
      e.pricePerLiter = "Price per liter must be > 0";
    if (form.onHandLiters !== "" && Number(form.onHandLiters) < 0)
      e.onHandLiters = "On hand (L) can’t be negative";
    if (form.reorderLevelLiters !== "" && Number(form.reorderLevelLiters) < 0)
      e.reorderLevelLiters = "Reorder level can’t be negative";

    // unique ID for new product (brand-name-grade)
    if (!isEdit) {
      const newId = makeId(form);
      if (!newId) e.name = e.name || "Enter product name";
      if (rows.some((r) => r.id === newId)) e.name = "A product with similar id already exists";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const next = [...rows];
    const payload = {
      id: isEdit ? form.id : makeId(form),
      name: form.name.trim(),
      brand: form.brand.trim(),
      grade: form.grade.trim(),
      packLiters: Number(form.packLiters),
      pricePerLiter: Number(form.pricePerLiter),
      onHandLiters: form.onHandLiters === "" ? 0 : Number(form.onHandLiters),
      reorderLevelLiters:
        form.reorderLevelLiters === "" ? 0 : Number(form.reorderLevelLiters),
      barcode: form.barcode.trim(),
    };

    if (isEdit) {
      const idx = next.findIndex((r) => r.id === editingId);
      if (idx >= 0) next[idx] = payload;
    } else {
      next.push(payload);
    }

    localStorage.setItem(LS_PRODUCTS, JSON.stringify(next));
    nav("/inventory/products?saved=1", { replace: true });
  };

  const valuation = useMemo(() => {
    const on = Number(form.onHandLiters || 0);
    const price = Number(form.pricePerLiter || 0);
    if (!on || !price) return 0;
    return on * price;
  }, [form.onHandLiters, form.pricePerLiter]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-textmain">{title}</h1>

      <form onSubmit={handleSubmit} className="bg-surface border border-bordercol rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Name *" error={errors.name}>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Shell Helix"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Brand">
            <input
              name="brand"
              value={form.brand}
              onChange={onChange}
              placeholder="Shell"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Grade (e.g., 5W-30)">
            <input
              name="grade"
              value={form.grade}
              onChange={onChange}
              placeholder="5W-30"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Pack size (L) *" error={errors.packLiters}>
            <input
              name="packLiters"
              value={form.packLiters}
              onChange={onChange}
              inputMode="decimal"
              placeholder="1"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Price per liter (₨) *" error={errors.pricePerLiter}>
            <input
              name="pricePerLiter"
              value={form.pricePerLiter}
              onChange={onChange}
              inputMode="decimal"
              placeholder="1800"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Barcode / SKU">
            <input
              name="barcode"
              value={form.barcode}
              onChange={onChange}
              placeholder="SH-5W30-1L"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="On hand (L)">
            <input
              name="onHandLiters"
              value={form.onHandLiters}
              onChange={onChange}
              inputMode="decimal"
              placeholder="0"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Reorder level (L)">
            <input
              name="reorderLevelLiters"
              value={form.reorderLevelLiters}
              onChange={onChange}
              inputMode="decimal"
              placeholder="10"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Valuation (computed)">
            <div className="w-full rounded border border-bordercol bg-background px-3 py-2">
              ₨ {valuation.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </Field>
        </div>

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-accent text-white hover:opacity-90">
            {isEdit ? "Save Changes" : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => nav("/inventory/products")}
            className="px-4 py-2 rounded border border-bordercol hover:bg-background"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* helpers */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-textmain mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

function makeId({ name = "", brand = "", grade = "" }) {
  const slug = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const base = [brand || "", name || "", grade || ""].map(slug).filter(Boolean).join("-");
  return base || null;
}
