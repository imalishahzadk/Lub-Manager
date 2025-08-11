import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md";

const LS_KEY = "mvp-vehicles";

export default function VehicleDetail() {
  const { plate } = useParams();
  const nav = useNavigate();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    const found = data.find(v => v.plate === plate);
    setVehicle(found || null);
  }, [plate]);

  if (!vehicle) {
    return (
      <div>
        <p className="mb-4">Vehicle not found.</p>
        <button
          onClick={() => nav(-1)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded border border-bordercol hover:bg-background"
        >
          <MdArrowBack /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/customers/vehicles"
        className="inline-flex items-center gap-1 text-sm border border-bordercol px-3 py-1 rounded hover:bg-background"
      >
        <MdArrowBack /> Back to Vehicles
      </Link>

      <h1 className="text-xl font-semibold">Vehicle Details</h1>

      <div className="bg-surface p-4 rounded border border-bordercol space-y-3">
        <DetailRow label="Plate" value={vehicle.plate} />
        <DetailRow label="Owner" value={vehicle.ownerName} />
        <DetailRow label="Phone" value={vehicle.phone} />
        <DetailRow label="Make" value={vehicle.make} />
        <DetailRow label="Model" value={vehicle.model} />
        <DetailRow label="Year" value={vehicle.year} />
        <DetailRow label="Engine" value={vehicle.engine} />
        <DetailRow label="Preferred Oil" value={vehicle.oilGrade || "—"} />
        <DetailRow label="Last Odometer" value={vehicle.lastOdo ? `${vehicle.lastOdo} km` : "—"} />
        <DetailRow label="Last Service Date" value={vehicle.lastServiceDate || "—"} />
        <DetailRow label="Notes" value={vehicle.notes || "—"} />
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex">
      <div className="w-48 font-medium text-textmain/80">{label}</div>
      <div>{value}</div>
    </div>
  );
}
