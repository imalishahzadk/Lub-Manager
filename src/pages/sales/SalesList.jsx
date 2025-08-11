import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdOpenInNew } from "react-icons/md";

const LS_KEY_SALES = "mvp-sales";

export default function SalesList() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LS_KEY_SALES) || "[]");
    setSales(stored);
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-textmain">Sales List</h1>

      <div className="bg-surface border border-bordercol rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-bordercol bg-background">
                <Th>ID</Th>
                <Th>Plate</Th>
                <Th>Owner</Th>
                <Th>Date</Th>
                <Th className="text-right">Total</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-textmain/70">
                    No sales recorded yet.
                  </td>
                </tr>
              )}

              {sales.map((s) => (
                <tr key={s.id} className="hover:bg-background/60">
                  <Td>{s.id}</Td>
                  <Td>{s.plate}</Td>
                  <Td>{s.ownerName}</Td>
                  <Td>{s.date}</Td>
                  <Td className="text-right">{s.total.toFixed(2)}</Td>
                  <Td>
                    <Link
                      to={`/sales/${s.id}/receipt`}
                      className="px-2 py-1 rounded border border-bordercol hover:bg-background inline-flex items-center gap-1"
                    >
                      <MdOpenInNew /> Receipt
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
