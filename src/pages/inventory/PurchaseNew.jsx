import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LS_PRODUCTS } from "./Products";
import { LS_PURCHASES } from "./PurchasesList";
import { MdAdd, MdDelete, MdSave, MdArrowBack } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

export default function PurchaseNew() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    supplierName: "",
    invoiceNo: "",
    note: "",
  });
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [params] = useSearchParams();
  const prePid = params.get("productId");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    setProducts(data);
  }, []);

  const addRow = () => {
    setItems((arr) => [
      ...arr,
      {
        id: cryptoRandom(),          // row id
        productId: "",
        name: "",
        packLiters: 0,
        packs: "",
        liters: "",
        costPerLiter: "",
      },
    ]);
  };

  const removeRow = (id) => setItems((arr) => arr.filter((r) => r.id !== id));

  const onChangeHeader = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  /** When product changes, seed row with pack size & default cost/L */
  const onChangeProduct = (rowId, productId) => {
    const p = products.find((x) => x.id === productId);
    setItems((arr) =>
      arr.map((r) =>
        r.id === rowId
          ? {
              ...r,
              productId,
              name: p ? `${p.name} ${p.grade || ""}`.trim() : "",
              packLiters: p?.packLiters ?? 0,
              costPerLiter: p?.pricePerLiter ?? "",
              // keep quantities as-is
            }
          : r
      )
    );
  };

  /** If user edits packs, recompute liters */
  const onChangePacks = (rowId, packs) => {
    setItems((arr) =>
      arr.map((r) =>
        r.id === rowId
          ? {
              ...r,
              packs,
              liters:
                packs === "" || !r.packLiters
                  ? ""
                  : round2(Number(packs) * Number(r.packLiters)),
            }
          : r
      )
    );
  };

  /** If user edits liters, recompute packs (optional) */
  const onChangeLiters = (rowId, liters) => {
    setItems((arr) =>
      arr.map((r) =>
        r.id === rowId
          ? {
              ...r,
              liters,
              packs:
                liters === "" || !r.packLiters
                  ? ""
                  : round2(Number(liters) / Number(r.packLiters)),
            }
          : r
      )
    );
  };

  const onChangeCost = (rowId, costPerLiter) => {
    setItems((arr) => arr.map((r) => (r.id === rowId ? { ...r, costPerLiter } : r)));
  };

  const totals = useMemo(() => {
    const liters = items.reduce(
      (s, r) => s + (r.liters ? Number(r.liters) : 0),
      0
    );
    const cost = items.reduce(
      (s, r) => s + (r.liters && r.costPerLiter ? Number(r.liters) * Number(r.costPerLiter) : 0),
      0
    );
    return { liters: round2(liters), cost: round2(cost) };
  }, [items]);

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Date required";
    if (items.length === 0) e.items = "Add at least one line";
    items.forEach((r, idx) => {
      if (!r.productId) e[`row${idx}`] = "Choose a product";
      else if (!r.liters || Number(r.liters) <= 0)
        e[`row${idx}`] = "Enter liters > 0";
      else if (!r.costPerLiter || Number(r.costPerLiter) < 0)
        e[`row${idx}`] = "Enter cost/L ≥ 0";
    });
    return e;
    };

  const onSave = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    // Build purchase object
    const id = Date.now();
    const purchase = {
      id,
      date: form.date,
      supplierName: form.supplierName.trim(),
      invoiceNo: form.invoiceNo.trim(),
      note: form.note.trim(),
      items: items.map((r) => ({
        productId: r.productId,
        name: r.name,
        packLiters: Number(r.packLiters || 0),
        packs: r.packs === "" ? null : Number(r.packs),
        liters: Number(r.liters),
        costPerLiter: Number(r.costPerLiter || 0),
        lineCost: round2(Number(r.liters) * Number(r.costPerLiter || 0)),
      })),
      totalLiters: totals.liters,
      totalCost: totals.cost,
      createdAt: Date.now(),
    };

    // Save purchase list
    const existing = JSON.parse(localStorage.getItem(LS_PURCHASES) || "[]");
    localStorage.setItem(LS_PURCHASES, JSON.stringify([...existing, purchase]));

    // Update product on-hand liters
    const prods = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    const byId = Object.fromEntries(prods.map((p) => [p.id, p]));
    purchase.items.forEach((line) => {
      const p = byId[line.productId];
      if (p) p.onHandLiters = round2(Number(p.onHandLiters || 0) + Number(line.liters || 0));
    });
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(Object.values(byId)));

    // Done → back to list
    nav("/inventory/purchase");
  };

  useEffect(() => {
    if (products.length && prePid) {
      // auto-add one line with this product selected
      const p = products.find(x => x.id === prePid);
      if (p) {
        setItems([{
          id: cryptoRandom(),
          productId: p.id,
          name: `${p.name} ${p.grade || ""}`.trim(),
          packLiters: p.packLiters ?? 0,
          packs: "",
          liters: "",
          costPerLiter: p.pricePerLiter ?? "",
        }]);
      }
    }
  }, [products, prePid]);
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-textmain">New Purchase (Intake)</h1>
        <div className="flex gap-2">
          <button
            onClick={() => nav(-1)}
            className="inline-flex items-center gap-1 px-3 py-2 rounded border border-bordercol hover:bg-background"
          >
            <MdArrowBack /> Back
          </button>
          <button
            onClick={onSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-accent text-white hover:opacity-90"
          >
            <MdSave /> Save Purchase
          </button>
        </div>
      </div>

      {/* Header fields */}
      <div className="bg-surface border border-bordercol rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="Date" error={errors.date}>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={onChangeHeader}
            className="w-full rounded border border-bordercol bg-background px-3 py-2"
          />
        </Field>
        <Field label="Supplier">
          <input
            name="supplierName"
            value={form.supplierName}
            onChange={onChangeHeader}
            placeholder="Supplier name"
            className="w-full rounded border border-bordercol bg-background px-3 py-2"
          />
        </Field>
        <Field label="Invoice #">
          <input
            name="invoiceNo"
            value={form.invoiceNo}
            onChange={onChangeHeader}
            placeholder="INV-001"
            className="w-full rounded border border-bordercol bg-background px-3 py-2"
          />
        </Field>
        <Field label="Note">
          <input
            name="note"
            value={form.note}
            onChange={onChangeHeader}
            placeholder="Optional notes"
            className="w-full rounded border border-bordercol bg-background px-3 py-2"
          />
        </Field>
      </div>

      {/* Lines */}
      <div className="bg-surface border border-bordercol rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-bordercol flex items-center justify-between">
          <div className="font-semibold text-textmain">Items</div>
          <button
            onClick={addRow}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-bordercol hover:bg-background"
          >
            <MdAdd /> Add Line
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-bordercol bg-background">
                <Th style={{ minWidth: 220 }}>Product</Th>
                <Th className="text-right">Pack (L)</Th>
                <Th className="text-right">Packs</Th>
                <Th className="text-right">Liters</Th>
                <Th className="text-right">Cost / L</Th>
                <Th className="text-right">Line Cost</Th>
                <Th className="w-14"></Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-textmain/70">
                    No lines yet. Click <strong>Add Line</strong>.
                  </td>
                </tr>
              ) : (
                items.map((r, idx) => {
                  const lineCost =
                    r.liters && r.costPerLiter
                      ? round2(Number(r.liters) * Number(r.costPerLiter))
                      : 0;
                  const rowErr = errors[`row${idx}`];
                  return (
                    <tr key={r.id} className={`hover:bg-background/60 ${rowErr ? "bg-error/5" : ""}`}>
                      <Td>
                        <select
                          value={r.productId}
                          onChange={(e) => onChangeProduct(r.id, e.target.value)}
                          className="w-full rounded border border-bordercol bg-background px-2 py-1.5"
                        >
                          <option value="">Select product…</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} {p.grade ? `(${p.grade})` : ""} — {p.brand || ""}
                            </option>
                          ))}
                        </select>
                        {rowErr && <div className="text-xs text-error mt-1">{rowErr}</div>}
                      </Td>
                      <Td className="text-right">{fmt(r.packLiters)}</Td>
                      <Td className="text-right">
                        <input
                          value={r.packs}
                          onChange={(e) => onChangePacks(r.id, e.target.value)}
                          inputMode="decimal"
                          placeholder="0"
                          className="w-24 rounded border border-bordercol bg-background px-2 py-1.5 text-right"
                        />
                      </Td>
                      <Td className="text-right">
                        <input
                          value={r.liters}
                          onChange={(e) => onChangeLiters(r.id, e.target.value)}
                          inputMode="decimal"
                          placeholder="0"
                          className="w-28 rounded border border-bordercol bg-background px-2 py-1.5 text-right"
                        />
                      </Td>
                      <Td className="text-right">
                        <input
                          value={r.costPerLiter}
                          onChange={(e) => onChangeCost(r.id, e.target.value)}
                          inputMode="decimal"
                          placeholder="0"
                          className="w-28 rounded border border-bordercol bg-background px-2 py-1.5 text-right"
                        />
                      </Td>
                      <Td className="text-right">₨ {fmt(lineCost)}</Td>
                      <Td className="text-right">
                        <button
                          onClick={() => removeRow(r.id)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded border border-bordercol hover:bg-background"
                          title="Remove line"
                        >
                          <MdDelete />
                        </button>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer totals */}
        <div className="px-4 py-3 border-t border-bordercol flex flex-wrap gap-4 justify-end text-sm">
          <div><span className="opacity-70">Total Liters:</span> <strong>{fmt(totals.liters)} L</strong></div>
          <div><span className="opacity-70">Total Cost:</span> <strong>₨ {fmt(totals.cost)}</strong></div>
        </div>
      </div>
    </div>
  );
}

/* ui bits */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-textmain mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
function Th({ children, className = "", ...rest }) {
  return <th className={`px-3 py-2 text-textmain/80 ${className}`} {...rest}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 align-top ${className}`}>{children}</td>;
}
function fmt(n) {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
function round2(n) {
  return Math.round(Number(n) * 100) / 100;
}
function cryptoRandom() {
  // simple unique id for row
  try { return crypto.randomUUID(); } catch { return String(Date.now() + Math.random()); }
}
