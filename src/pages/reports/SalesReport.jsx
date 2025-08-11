import { useEffect, useMemo, useState } from "react";
import { MdSearch, MdFileDownload } from "react-icons/md";

const LS_SALES = "mvp-sales"; // localStorage key

export default function SalesReport() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LS_SALES) || "[]");
    setRows(saved);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.invoice, r.customerName, r.vehiclePlate].some((v) =>
        String(v || "").toLowerCase().includes(s)
      )
    );
  }, [q, rows]);

  const exportCSV = () => {
    const headers = ["Invoice", "Date", "Customer", "Plate", "Total"];
    const csvRows = [headers.join(",")];
    filtered.forEach((r) => {
      csvRows.push([
        r.invoice,
        r.date,
        r.customerName,
        r.vehiclePlate,
        r.total
      ].join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-xl font-semibold text-textmain">Sales Report</h1>

        <div className="flex w-full sm:w-auto gap-2 sm:ml-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-80">
            <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search invoice, customer, plate…"
              className="pl-8 pr-3 py-2 w-full rounded border border-bordercol bg-background outline-none focus:ring-2 focus:ring-accent"
            />
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

      {/* Table */}
      <div className="bg-surface border border-bordercol rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-bordercol bg-background">
                <Th>Invoice</Th>
                <Th>Date</Th>
                <Th>Customer</Th>
                <Th>Plate</Th>
                <Th className="text-right">Total</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-textmain/70">
                    No sales found.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.invoice} className="hover:bg-background/60">
                    <Td>{r.invoice}</Td>
                    <Td>{r.date}</Td>
                    <Td>{r.customerName}</Td>
                    <Td>{r.vehiclePlate}</Td>
                    <Td className="text-right">{r.total}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-textmain/60">
        MVP: Report is generated from recorded sales. Use Export to download CSV.
      </p>
    </div>
  );
}

function Th({ children, className = "" }) {
  return <th className={`px-3 py-2 text-textmain/80 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
