import { useEffect, useMemo, useState } from "react";
import { MdSearch, MdFileDownload, MdFilterList } from "react-icons/md";
import { LS_PURCHASES } from "../../pages/inventory/PurchasesList";

/**
 * Optional extra source for future OUT/ADJ lines.
 * If your POS later writes to this with:
 *   { id, date, type: "OUT"|"ADJ", productId, productName, liters, note, ref }
 * this report will include them automatically.
 */
export const LS_STOCK_MOVES = "mvp-stock-moves";

export default function StockMovements() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("ALL"); // ALL | IN | OUT | ADJ
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // 1) Build IN movements from Purchases
    const purchases = JSON.parse(localStorage.getItem(LS_PURCHASES) || "[]");
    const fromPurchases = purchases.flatMap((p) =>
      (p.items || []).map((line) => ({
        id: `${p.id}-${line.productId}`,
        date: p.date || new Date(p.createdAt || Date.now()).toISOString().slice(0, 10),
        type: "IN",
        productId: line.productId,
        productName: line.name || "—",
        liters: Number(line.liters || 0),
        costPerLiter: Number(line.costPerLiter || 0),
        lineCost: Number(line.lineCost || 0),
        note: p.note || "",
        ref: p.invoiceNo ? `PO #${p.invoiceNo}` : `PO ${p.id}`,
        createdAt: p.createdAt || 0,
      }))
    );

    // 2) Optional OUT/ADJ lines (e.g., POS/adjustments in future)
    const extra = JSON.parse(localStorage.getItem(LS_STOCK_MOVES) || "[]");

    // Combine & sort (newest first)
    const all = [...fromPurchases, ...extra].sort(
      (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
    );
    setRows(all);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    let list = rows;
    if (type !== "ALL") list = list.filter((r) => r.type === type);
    if (!s) return list;
    return list.filter((r) =>
      [r.productName, r.ref, r.note].some((v) =>
        String(v || "").toLowerCase().includes(s)
      )
    );
  }, [q, type, rows]);

  const totals = useMemo(() => {
    const inL = filtered
      .filter((r) => r.type === "IN")
      .reduce((s, r) => s + Number(r.liters || 0), 0);
    const outL = filtered
      .filter((r) => r.type === "OUT")
      .reduce((s, r) => s + Number(r.liters || 0), 0);
    return { inL, outL, net: inL - outL };
  }, [filtered]);

  const exportCSV = () => {
    const headers = [
      "Date",
      "Type",
      "Product",
      "Liters",
      "CostPerL",
      "LineCost",
      "Ref",
      "Note",
    ];
    const csvRows = [headers.join(",")];
    filtered.forEach((r) => {
      csvRows.push(
        [
          r.date,
          r.type,
          r.productName,
          num(r.liters),
          num(r.costPerLiter),
          num(r.lineCost),
          r.ref || "",
          (r.note || "").replace(/[\r\n]+/g, " "),
        ].join(",")
      );
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_movements.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-xl font-semibold text-textmain">Stock Movements</h1>

        <div className="flex w-full sm:w-auto gap-2 sm:ml-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-72">
            <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search product, ref, note…"
              className="pl-8 pr-3 py-2 w-full rounded border border-bordercol bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60">
              <MdFilterList />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="pl-8 pr-3 py-2 rounded border border-bordercol bg-background"
              title="Filter type"
            >
              <option value="ALL">All</option>
              <option value="IN">IN (Purchases)</option>
              <option value="OUT">OUT (Sales)</option>
              <option value="ADJ">ADJ (Adjustments)</option>
            </select>
          </div>

          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-1 px-3 py-2 rounded border border-bordercol hover:bg-background"
            title="Export CSV"
          >
            <MdFileDownload /> Export
          </button>
        </div>
      </div>

      {/* Totals strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Metric label="IN (L)" value={`${fmt(totals.inL)} L`} />
        <Metric label="OUT (L)" value={`${fmt(totals.outL)} L`} />
        <Metric
          label="Net Change (L)"
          value={`${fmt(totals.net)} L`}
        />
      </div>

      {/* Table */}
      <div className="bg-surface border border-bordercol rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-bordercol bg-background">
                <Th>Date</Th>
                <Th>Type</Th>
                <Th>Product</Th>
                <Th className="text-right">Liters</Th>
                <Th className="text-right">Cost / L</Th>
                <Th className="text-right">Line Cost</Th>
                <Th>Ref</Th>
                <Th>Note</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-textmain/70">
                    No stock movements.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={`${r.id}-${i}`} className="hover:bg-background/60">
                    <Td>{r.date || "—"}</Td>
                    <Td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          r.type === "IN"
                            ? "bg-success/10 text-success"
                            : r.type === "OUT"
                            ? "bg-error/10 text-error"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {r.type}
                      </span>
                    </Td>
                    <Td>{r.productName || "—"}</Td>
                    <Td className="text-right">{fmt(r.liters)}</Td>
                    <Td className="text-right">
                      {r.type === "IN" ? `₨ ${fmt(r.costPerLiter)}` : "—"}
                    </Td>
                    <Td className="text-right">
                      {r.type === "IN" ? `₨ ${fmt(r.lineCost)}` : "—"}
                    </Td>
                    <Td>{r.ref || "—"}</Td>
                    <Td className="truncate max-w-[26ch]" title={r.note || ""}>
                      {r.note || "—"}
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-textmain/60">
        IN rows come from Purchases. OUT/ADJ rows will appear once POS/Adjustments write to <code>mvp-stock-moves</code>.
      </p>
    </div>
  );
}

/* UI bits */
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
function num(n) {
  const x = Number(n || 0);
  return x.toString();
}
