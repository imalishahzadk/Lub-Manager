import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch, MdAdd, MdOpenInNew } from "react-icons/md";

/** Local storage key for MVP mock data */
const LS_KEY = "mvp-vehicles";

/** Seed a few demo rows on first load (only if none exist) */
function seedIfEmpty() {
  const existing = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  if (existing.length) return;
  const demo = [
    {
      plate: "AEL-123",
      ownerName: "Usman Ali",
      phone: "+92 300 0000001",
      make: "Toyota",
      model: "Corolla",
      year: "2018",
      engine: "1.6L",
      oilGrade: "5W-30",
      lastOdo: 42000,
      lastServiceDate: "2025-07-18",
      notes: "",
    },
    {
      plate: "ABC-321",
      ownerName: "Hassan Raza",
      phone: "+92 300 0000002",
      make: "Honda",
      model: "Civic",
      year: "2020",
      engine: "1.5T",
      oilGrade: "0W-20",
      lastOdo: 27500,
      lastServiceDate: "2025-07-25",
      notes: "",
    },
    {
      plate: "LEA-909",
      ownerName: "Ayesha Khan",
      phone: "+92 300 0000003",
      make: "Suzuki",
      model: "Cultus",
      year: "2017",
      engine: "1.0L",
      oilGrade: "10W-40",
      lastOdo: 63000,
      lastServiceDate: "2025-08-01",
      notes: "",
    },
  ];
  localStorage.setItem(LS_KEY, JSON.stringify(demo));
}

export default function VehiclesList() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    seedIfEmpty();
    const data = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    setRows(data);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.plate, r.ownerName, r.phone, r.make, r.model].some((v) =>
        String(v || "").toLowerCase().includes(s)
      )
    );
  }, [q, rows]);

  return (
    <div className="space-y-4">
      {/* Header */}
{/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center gap-3">
  <h1 className="text-xl font-semibold text-textmain">Vehicles</h1>

  {/* Actions */}
  <div className="flex w-full sm:w-auto sm:ml-auto flex-col sm:flex-row gap-2">
    <div className="relative w-full sm:w-72">
      <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search plate, owner, phone, make, model..."
        className="pl-8 pr-3 py-2 w-full rounded border border-bordercol bg-background outline-none focus:ring-2 focus:ring-accent"
      />
    </div>

    {/* On mobile: full-width under search; on desktop: same inline button */}
    <Link
      to="/customers/vehicles/new"
      className="inline-flex items-center gap-2 px-3 py-2 rounded bg-accent text-white hover:opacity-90 w-full justify-center sm:w-auto"
    >
      <MdAdd /> Add Vehicle
    </Link>
  </div>
</div>


      {/* Table */}
      <div className="bg-surface border border-bordercol rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-bordercol bg-background">
                <Th>Plate</Th>
                <Th>Owner</Th>
                <Th>Phone</Th>
                <Th>Make / Model</Th>
                <Th className="text-right">Last Odo</Th>
                <Th>Last Service</Th>
                <Th className="w-32">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-textmain/70">
                    No vehicles found.
                  </td>
                </tr>
              )}

              {filtered.map((r) => (
                <tr key={r.plate} className="hover:bg-background/60">
                  <Td className="font-medium">{r.plate}</Td>
                  <Td>{r.ownerName}</Td>
                  <Td>{r.phone}</Td>
                  <Td>{r.make} {r.model} {r.year ? `(${r.year})` : ""}</Td>
                  <Td className="text-right">{r.lastOdo ? `${r.lastOdo.toLocaleString()} km` : "—"}</Td>
                  <Td>{r.lastServiceDate || "—"}</Td>
                  <Td>
  <div className="flex items-center gap-2">
    {/* View Button */}
    <Link
      to={`/customers/vehicles/${encodeURIComponent(r.plate)}`}
      className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded border border-bordercol text-textmain hover:bg-background transition-colors"
      title="View details"
    >
      <MdOpenInNew size={14} /> View
    </Link>

    {/* POS Button */}
    <button
      onClick={() => nav(`/sales/new?plate=${encodeURIComponent(r.plate)}`)}
      className="inline-flex items-center gap-1 px-2 py-1 text-sm rounded bg-accent text-white hover:opacity-90 transition-opacity"
      title="Start sale (POS)"
    >
      <MdAdd size={14} /> POS
    </button>
  </div>
</Td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* small hint */}
      <p className="text-xs text-textmain/60">
        Tip: Add vehicles as they arrive. Sales will automatically attach to the vehicle (by plate).
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
