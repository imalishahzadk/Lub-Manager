import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdArrowBack, MdSave } from "react-icons/md";

const LS_KEY_VEHICLES = "mvp-vehicles";
const LS_KEY_SALES = "mvp-sales";

export default function NewSale() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const plate = params.get("plate");

  const [vehicle, setVehicle] = useState(null);
  const [items, setItems] = useState([]);
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (plate) {
      const data = JSON.parse(localStorage.getItem(LS_KEY_VEHICLES) || "[]");
      setVehicle(data.find(v => v.plate === plate) || null);
    }
  }, [plate]);

  const addItem = () => {
    if (!service || !price) return;
    setItems([...items, { service, price: parseFloat(price) }]);
    setService("");
    setPrice("");
  };

  const total = items.reduce((sum, i) => sum + i.price, 0);

  const saveSale = () => {
    if (items.length === 0) return alert("Add at least one item");
    const sales = JSON.parse(localStorage.getItem(LS_KEY_SALES) || "[]");
    const id = Date.now();
    const newSale = {
      id,
      plate: vehicle?.plate || "",
      ownerName: vehicle?.ownerName || "",
      items,
      total,
      date: new Date().toISOString().slice(0, 10)
    };
    localStorage.setItem(LS_KEY_SALES, JSON.stringify([...sales, newSale]));
    nav(`/sales/${id}/receipt`);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => nav(-1)}
        className="inline-flex items-center gap-1 border border-bordercol px-3 py-1 rounded hover:bg-background"
      >
        <MdArrowBack /> Back
      </button>

      <h1 className="text-xl font-semibold">New Sale (POS)</h1>

      {vehicle && (
        <div className="bg-surface p-4 rounded border border-bordercol space-y-1">
          <p><strong>Plate:</strong> {vehicle.plate}</p>
          <p><strong>Owner:</strong> {vehicle.ownerName}</p>
          <p><strong>Vehicle:</strong> {vehicle.make} {vehicle.model}</p>
        </div>
      )}

      {/* Add Item */}
      <div className="flex gap-2">
        <input
          value={service}
          onChange={(e) => setService(e.target.value)}
          placeholder="Service / Item"
          className="flex-1 border border-bordercol rounded px-3 py-2"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-32 border border-bordercol rounded px-3 py-2"
        />
        <button
          type="button"
          onClick={addItem}
          className="bg-accent text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Items Table */}
      {items.length > 0 && (
        <table className="w-full text-sm border border-bordercol rounded">
          <thead>
            <tr className="bg-background border-b border-bordercol">
              <th className="p-2 text-left">Service</th>
              <th className="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i, idx) => (
              <tr key={idx} className="border-b border-bordercol">
                <td className="p-2">{i.service}</td>
                <td className="p-2 text-right">{i.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td className="p-2 text-right">Total</td>
              <td className="p-2 text-right">{total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      )}

      <button
        onClick={saveSale}
        className="bg-accent text-white px-4 py-2 rounded inline-flex items-center gap-2"
      >
        <MdSave /> Save & Print
      </button>
    </div>
  );
}
