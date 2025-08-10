import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LS_KEY = "mvp-vehicles";

const GRADE_OPTIONS = ["0W-16", "0W-20", "5W-20", "5W-30", "10W-30", "10W-40", "15W-40"];

export default function VehicleNew() {
  const nav = useNavigate();
  const [params] = useSearchParams();

  const [form, setForm] = useState({
    plate: (params.get("plate") || "").toUpperCase(),
    ownerName: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    engine: "",
    oilGrade: "",
    lastOdo: "",
    lastServiceDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});

  const vehicles = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
    catch { return []; }
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === "plate" ? value.toUpperCase() : value,
    }));
  };

  const validate = () => {
    const e = {};
    const plate = form.plate.trim().toUpperCase();
    if (!plate) e.plate = "Plate is required";
    else if (!/^[A-Z0-9\- ]{3,12}$/.test(plate)) e.plate = "Use letters, numbers, dash (3–12 chars)";
    else if (vehicles.some((v) => String(v.plate).toUpperCase() === plate)) e.plate = "This plate already exists";

    if (!form.ownerName.trim()) e.ownerName = "Owner name is required";
    if (form.phone && !/^[+]?[\d\s\-()]{7,20}$/.test(form.phone)) e.phone = "Enter a valid phone";
    if (form.year && (Number(form.year) < 1980 || Number(form.year) > new Date().getFullYear() + 1))
      e.year = "Year looks invalid";
    if (form.lastOdo && Number(form.lastOdo) < 0) e.lastOdo = "Odometer must be ≥ 0";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    const next = [
      ...vehicles,
      {
        ...form,
        plate: form.plate.trim().toUpperCase(),
        year: form.year?.trim(),
        lastOdo: form.lastOdo ? Number(form.lastOdo) : null,
      },
    ];
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    nav("/customers/vehicles?added=1", { replace: true });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-textmain">Add Vehicle</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface border border-bordercol rounded-lg p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Plate *" error={errors.plate}>
            <input
              name="plate"
              value={form.plate}
              onChange={onChange}
              placeholder="ABC-123"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Owner name *" error={errors.ownerName}>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={onChange}
              placeholder="Ali Shahzad"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Phone" error={errors.phone}>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="+92 300 1234567"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Make">
            <input
              name="make"
              value={form.make}
              onChange={onChange}
              placeholder="Toyota"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Model">
            <input
              name="model"
              value={form.model}
              onChange={onChange}
              placeholder="Corolla"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Year" error={errors.year}>
            <input
              name="year"
              value={form.year}
              onChange={onChange}
              placeholder="2019"
              inputMode="numeric"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Engine">
            <input
              name="engine"
              value={form.engine}
              onChange={onChange}
              placeholder="1.6L"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Preferred oil grade">
            <select
              name="oilGrade"
              value={form.oilGrade}
              onChange={onChange}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Select grade (optional)</option>
              {GRADE_OPTIONS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>

          <Field label="Last odometer (km)" error={errors.lastOdo}>
            <input
              name="lastOdo"
              value={form.lastOdo}
              onChange={onChange}
              placeholder="42000"
              inputMode="numeric"
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>

          <Field label="Last service date">
            <input
              type="date"
              name="lastServiceDate"
              value={form.lastServiceDate}
              onChange={onChange}
              className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
            />
          </Field>
        </div>

        <Field label="Notes">
          <textarea
            name="notes"
            value={form.notes}
            onChange={onChange}
            rows={3}
            placeholder="Anything important to remember for this vehicle…"
            className="w-full rounded border border-bordercol bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
          />
        </Field>

        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-accent text-white hover:opacity-90">
            Save vehicle
          </button>
          <button
            type="button"
            onClick={() => nav("/customers/vehicles")}
            className="px-4 py-2 rounded border border-bordercol hover:bg-background"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* small helper */
function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-textmain mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
