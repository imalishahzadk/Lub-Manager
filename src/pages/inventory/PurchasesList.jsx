import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MdSearch, MdAddShoppingCart } from "react-icons/md";

export const LS_PURCHASES = "mvp-purchases"; // stored by New Purchase (Intake)

export default function PurchasesList() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LS_PURCHASES) || "[]");
    // newest first
    setRows([...data].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.supplierName, r.invoiceNo, r.note]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [q, rows]);

  const totals = useMemo(() => {
    const liters = filtered.reduce((sum, p) => sum + Number(p.totalLiters || 0), 0);
    const cost = filtered.reduce((sum, p) => sum + Number(p.totalCost || 0), 0);
    return { liters, cost };
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-xl font-semibold text-textmain">Purchases</h1>

        <div className="flex w-full sm:w-auto sm:ml-auto flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-80">
            <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search supplier, invoice no, note…"
              className="pl-8 pr-3 py-2 w-full rounded border border-bordercol bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <Link
            to="/inventory/purchase/new"
            className="inline-flex items-center gap-2 px-3 py-2 rounded bg-accent text-white hover:opacity-90 w-full justify-center sm:w-auto"
          >
            <MdAddShoppingCart /> New Purchase (Intake)
          </Link>
        </div>
      </div>

      {/* Totals strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Metric label="Total Liters (filtered)" value={`${fmt(filtered.length ? totals.liters : 0)} L`} />
        <Metric label="Total Cost (filtered)" value={`₨ ${fmt(filtered.length ? totals.cost : 0)}`} />
      </div>

      {/* Table */}
      <div className="bg-surface border border-bordercol rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-bordercol bg-background">
                <Th>Date</Th>
                <Th>Supplier</Th>
                <Th>Invoice #</Th>
                <Th className="text-right">Items</Th>
                <Th className="text-right">Liters</Th>
                <Th className="text-right">Total Cost</Th>
                <Th>Note</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-textmain/70">
                    No purchases yet. Click <strong>New Purchase (Intake)</strong> to add stock.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-background/60">
                    <Td>{p.date || "—"}</Td>
                    <Td>{p.supplierName || "—"}</Td>
                    <Td>{p.invoiceNo || "—"}</Td>
                    <Td className="text-right">{p.items?.length || 0}</Td>
                    <Td className="text-right">{fmt(p.totalLiters)} L</Td>
                    <Td className="text-right">₨ {fmt(p.totalCost)}</Td>
                    <Td className="truncate max-w-[24ch]" title={p.note || ""}>
                      {p.note || "—"}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-textmain/60">
        Purchases add to product stock in liters. Costs are for reporting only in the MVP.
      </p>
    </div>
  );
}

/* small bits */
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
