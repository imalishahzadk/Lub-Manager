import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch, MdAdd, MdEdit } from "react-icons/md";

/** LocalStorage keys (MVP) */
export const LS_PRODUCTS = "mvp-products";

/** Seed a few demo products (only if none exist) */
function seedProductsIfEmpty() {
  const existing = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
  if (existing.length) return;

  const demo = [
    {
      id: "p-shell-5w30",
      name: "Shell Helix",
      grade: "5W-30",
      brand: "Shell",
      packLiters: 1,                 // display pack size
      pricePerLiter: 1800,           // PKR per liter
      onHandLiters: 26.5,            // current stock in liters
      reorderLevelLiters: 10,        // low-stock threshold
      barcode: "SH-5W30-1L",
    },
    {
      id: "p-zic-0w20",
      name: "ZIC X7",
      grade: "0W-20",
      brand: "ZIC",
      packLiters: 3.5,
      pricePerLiter: 2200,
      onHandLiters: 14,
      reorderLevelLiters: 8,
      barcode: "ZIC-0W20-3_5L",
    },
    {
      id: "p-total-10w40",
      name: "Total Quartz",
      grade: "10W-40",
      brand: "Total",
      packLiters: 4,
      pricePerLiter: 1500,
      onHandLiters: 9.2,
      reorderLevelLiters: 12,
      barcode: "TQ-10W40-4L",
    },
  ];
  localStorage.setItem(LS_PRODUCTS, JSON.stringify(demo));
}

export default function Products() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);

  // simple front-end role check (matches our demo login)
  const role = (localStorage.getItem("role") || "admin").toLowerCase();

  useEffect(() => {
    seedProductsIfEmpty();
    const data = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    setRows(data);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [
        r.name,
        r.brand,
        r.grade,
        r.barcode,
        String(r.packLiters),
        String(r.pricePerLiter),
      ]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [q, rows]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-xl font-semibold text-textmain">Products</h1>

        <div className="flex w-full sm:w-auto sm:ml-auto flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-80">
            <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, brand, grade, barcode…"
              className="pl-8 pr-3 py-2 w-full rounded border border-bordercol bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Only superadmin can add product in MVP */}
          {role === "superadmin" && (
            <Link
              to="/inventory/products/new"
              className="inline-flex items-center gap-2 px-3 py-2 rounded bg-accent text-white hover:opacity-90 w-full justify-center sm:w-auto"
            >
              <MdAdd /> Add Product
            </Link>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface border border-bordercol rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-bordercol bg-background">
                <Th>Product</Th>
                <Th>Brand</Th>
                <Th>Grade</Th>
                <Th className="text-right">Pack (L)</Th>
                <Th className="text-right">Price / L</Th>
                <Th className="text-right">On Hand (L)</Th>
                <Th className="text-right">Valuation</Th>
                <Th className="text-right">Reorder @ (L)</Th>
                <Th className="w-28">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-textmain/70">
                    No products found.
                  </td>
                </tr>
              )}

              {filtered.map((p) => {
                const valuation = (Number(p.onHandLiters || 0) * Number(p.pricePerLiter || 0));
                const low = Number(p.onHandLiters || 0) <= Number(p.reorderLevelLiters || 0);

                return (
                  <tr key={p.id} className={`hover:bg-background/60 ${low ? "bg-warning/5" : ""}`}>
                    <Td className="font-medium">{p.name}</Td>
                    <Td>{p.brand || "—"}</Td>
                    <Td>{p.grade || "—"}</Td>
                    <Td className="text-right">{fmtNum(p.packLiters)}</Td>
                    <Td className="text-right">₨ {fmtNum(p.pricePerLiter)}</Td>
                    <Td className="text-right">{fmtNum(p.onHandLiters)}</Td>
                    <Td className="text-right">₨ {fmtNum(valuation)}</Td>
                    <Td className="text-right">{fmtNum(p.reorderLevelLiters)}</Td>
                    <Td>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => nav(`/inventory/products/new?id=${encodeURIComponent(p.id)}`)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded border border-bordercol hover:bg-background"
                          title="Edit"
                          disabled={role !== "superadmin"}
                        >
                          <MdEdit size={14} /> Edit
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-textmain/60">
        Note: Inventory is tracked in <strong>liters</strong>. Price is stored as <strong>per liter</strong>. Valuation = On Hand (L) × Price/L.
      </p>
    </div>
  );
}

/* Small helpers */
function Th({ children, className = "" }) {
  return <th className={`px-3 py-2 text-textmain/80 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function fmtNum(n) {
  if (n === null || n === undefined || n === "") return "—";
  const x = Number(n);
  if (Number.isNaN(x)) return String(n);
  return x.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
