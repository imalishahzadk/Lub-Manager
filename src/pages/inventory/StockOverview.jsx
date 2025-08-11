import { useEffect, useMemo, useState } from "react";
import { MdInventory2, MdAttachMoney, MdWarningAmber } from "react-icons/md";
import { LS_PRODUCTS } from "./Products";

export default function StockOverview() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LS_PRODUCTS) || "[]");
    setRows(data);
  }, []);

  const metrics = useMemo(() => {
    const totalProducts = rows.length;
    const totalLiters = rows.reduce((s, r) => s + Number(r.onHandLiters || 0), 0);
    const totalValuation = rows.reduce(
      (s, r) => s + Number(r.onHandLiters || 0) * Number(r.pricePerLiter || 0),
      0
    );
    const lowStock = rows.filter(
      (r) => Number(r.onHandLiters || 0) <= Number(r.reorderLevelLiters || 0)
    );
    return { totalProducts, totalLiters, totalValuation, lowStock };
  }, [rows]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-textmain">Stock Overview</h1>

      {/* KPI cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi
          icon={<MdInventory2 />}
          label="Total Products"
          value={metrics.totalProducts.toLocaleString()}
          tint="rgba(31, 59, 115, 0.08)" /* navy tint */
        />
        <Kpi
          icon={<MdInventory2 />}
          label="On Hand (Liters)"
          value={fmtNum(metrics.totalLiters)}
          tint="rgba(0, 191, 165, 0.08)" /* teal tint */
        />
        <Kpi
          icon={<MdAttachMoney />}
          label="Stock Valuation"
          value={`₨ ${fmtNum(metrics.totalValuation)}`}
          tint="rgba(60, 169, 120, 0.08)" /* green tint */
        />
        <Kpi
          icon={<MdWarningAmber />}
          label="Low-Stock Items"
          value={metrics.lowStock.length.toLocaleString()}
          tint="rgba(242, 157, 53, 0.10)" /* amber tint */
        />
      </section>

      {/* Low stock table */}
      <section className="bg-surface border border-bordercol rounded-lg">
        <div className="px-4 py-3 border-b border-bordercol flex items-center gap-2">
          <MdWarningAmber />
          <h3 className="font-semibold text-textmain">Low-Stock Alerts</h3>
          <span className="ml-auto text-sm text-textmain/70">
            {metrics.lowStock.length} item(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-bordercol bg-background">
                <Th>Product</Th>
                <Th>Brand</Th>
                <Th>Grade</Th>
                <Th className="text-right">On Hand (L)</Th>
                <Th className="text-right">Reorder @ (L)</Th>
                <Th className="text-right">Price / L</Th>
                <Th className="text-right">Valuation</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {metrics.lowStock.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-textmain/70">
                    No items at or below threshold. 🎉
                  </td>
                </tr>
              ) : (
                metrics.lowStock.map((p) => {
                  const val =
                    Number(p.onHandLiters || 0) * Number(p.pricePerLiter || 0);
                  return (
                    <tr key={p.id} className="hover:bg-background/60">
                      <Td className="font-medium">{p.name}</Td>
                      <Td>{p.brand || "—"}</Td>
                      <Td>{p.grade || "—"}</Td>
                      <Td className="text-right">{fmtNum(p.onHandLiters)}</Td>
                      <Td className="text-right">{fmtNum(p.reorderLevelLiters)}</Td>
                      <Td className="text-right">₨ {fmtNum(p.pricePerLiter)}</Td>
                      <Td className="text-right">₨ {fmtNum(val)}</Td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tiny legend / note */}
      <p className="text-xs text-textmain/60">
        Inventory is tracked in liters. Valuation = On Hand (L) × Price/L.
      </p>
    </div>
  );
}

/* helpers */
function Kpi({ icon, label, value, tint }) {
  return (
    <div
      className="border border-bordercol rounded-lg p-4 flex items-start gap-3"
      style={{ backgroundColor: tint }}
    >
      <div className="text-accent text-xl shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-textmain/80">{label}</div>
        <div className="text-2xl font-semibold text-textmain mt-1">{value}</div>
      </div>
    </div>
  );
}

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
