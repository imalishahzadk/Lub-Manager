import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LS_KEY_SALES = "mvp-sales";

export default function SalesReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sale, setSale] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LS_KEY_SALES) || "[]");
    const found = stored.find((s) => String(s.id) === String(id));
    if (!found) {
      navigate("/sales"); // redirect if not found
    } else {
      setSale(found);
    }
  }, [id, navigate]);

  if (!sale) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 border border-bordercol rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Receipt</h1>
      <div className="mb-4">
        <p><strong>Sale ID:</strong> {sale.id}</p>
        <p><strong>Date:</strong> {sale.date}</p>
        <p><strong>Plate:</strong> {sale.plate}</p>
        <p><strong>Owner:</strong> {sale.ownerName}</p>
        <p><strong>Phone:</strong> {sale.phone}</p>
      </div>

      <table className="w-full text-sm border-collapse border border-bordercol mb-4">
        <thead>
          <tr className="bg-gray-100 border-b border-bordercol">
            <th className="p-2 border border-bordercol text-left">Item</th>
            <th className="p-2 border border-bordercol text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, idx) => (
            <tr key={idx} className="border-b border-bordercol">
              <td className="p-2 border border-bordercol">{item.name}</td>
              <td className="p-2 border border-bordercol text-right">
                {item.price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-semibold">
        Total: {sale.total.toFixed(2)}
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate("/sales")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-accent text-white rounded hover:opacity-90"
        >
          Print
        </button>
      </div>
    </div>
  );
}
