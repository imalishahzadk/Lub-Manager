import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdTune, MdShoppingCart } from "react-icons/md";
import { LS_PRODUCTS } from "./Products";

export default function LowStockAlerts() {
  const nav = useNavigate();
  const role = (localStorage.getItem("role") || "admin").toLowerCase();

  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    setRows(data);
  }, []);

  // low-stock only
  const low = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = rows.filter(
      (r) => Number(r.onHandLiters || 0) <= Number(r.reorderLevelLiters || 0)
    );
    if (!s) return list;
    return list.filter((r) =>
      [r.name, r.brand, r.grade, r.barcode]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [q, rows]);

  const saveThreshold = (id, nextLvl) => {
    const data = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    const idx = data.findIndex((p) => p.id === id);
    if (idx >= 0) {
      data[idx].reorderLevelLiters = Number(nextLvl || 0);
      localStorage.setItem(LS_PRODUCTS, JSON.stringify(data));
      setRows(data);
    }
  };

  const toPurchase = (productId) => {
    // Pre-select this product in the purchase screen (MVP hint via query)
    nav(`/inventory/purchase/new?productId=${encodeURIComponent(productId)}`);
  };

  const totals = useMemo(() => {
    const count = low.length;
    const deficit = low.reduce(
      (s, r) => s + Math.max(0, Number(r.reorderLevelLiters || 0) - Number(r.onHandLiters || 0)),
      0
    );
    return { count, deficit };
  }, [low]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-xl font-semibold text-textmain">Low-Stock Alerts</h1>

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
        </div>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Metric label="Items at/below threshold" value={totals.count.toLocaleString()} />
        <Metric label="Total deficit vs threshold (L)" value={fmt(totals.deficit)} />
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
                <Th className="text-right">On Hand (L)</Th>
                <Th className="text-right">Reorder @ (L)</Th>
                <Th className="text-right">Deficit (L)</Th>
                <Th className="w-40 text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {low.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-textmain/70">
                    No items at or below threshold. 🎉
                  </td>
                </tr>
              ) : (
                low.map((p) => {
                  const on = Number(p.onHandLiters || 0);
                  const lvl = Number(p.reorderLevelLiters || 0);
                  const deficit = Math.max(0, lvl - on);

                  return (
                    <tr key={p.id} className="hover:bg-background/60">
                      <Td className="font-medium">{p.name}</Td>
                      <Td>{p.brand || "—"}</Td>
                      <Td>{p.grade || "—"}</Td>
                      <Td className="text-right">{fmt(on)}</Td>
                      <Td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <MdTune className="opacity-60" />
                          <input
                            defaultValue={lvl}
                            onBlur={(e) => saveThreshold(p.id, e.target.value)}
                            inputMode="decimal"
                            className="w-24 text-right rounded border border-bordercol bg-background px-2 py-1.5"
                            title="Edit threshold and click outside to save"
                            disabled={role !== "superadmin"} // MVP: only superadmin edits thresholds
                          />
                        </div>
                      </Td>
                      <Td className={`text-right ${deficit > 0 ? "text-warning" : ""}`}>
                        {fmt(deficit)}
                      </Td>
                      <Td className="text-right">
                        <button
                          onClick={() => toPurchase(p.id)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded border border-bordercol hover:bg-background"
                          title="Restock via Purchase"
                        >
                          <MdShoppingCart size={16} /> Restock
                        </button>
                      </Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-textmain/60">
        Threshold changes are saved immediately (superadmin only). Use <strong>Restock</strong> to open a new purchase and add liters.
      </p>
    </div>
  );
}

/* bits */
function Th({ children, className = "" }) {
  return <th className={`px-3 py-2 text-textmain/80 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function Metric({ label, value }) {
  return (
    <div className="border border-bordercol rounded-lg p-3 bg-background">
      <div className="text-xs text-textmain/70">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
function fmt(n) {
  const x = Number(n || 0);
  return x.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
