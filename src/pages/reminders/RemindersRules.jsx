import { useEffect, useState } from "react";

export const LS_REM_RULES = "mvp-reminder-rules";

/** Default rules for MVP */
const DEFAULT_RULES = {
  oilChangeKm: 5000,      // remind after this many km since last service
  oilChangeDays: 180,     // OR after this many days (whichever comes first)
  leadDays: 7,            // generate reminders this many days before due
  template: "Dear customer, your vehicle {plate} is due for an oil change. Last at {lastOdo} km on {lastDate}. Visit us and get {discount} off.",
  discount: "5%",         // plain text used in template
};

export default function RemindersRules() {
  const role = (localStorage.getItem("role") || "admin").toLowerCase();
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(LS_REM_RULES) || "null");
    if (stored) setRules({ ...DEFAULT_RULES, ...stored });
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setRules((r) => ({
      ...r,
      [name]: name.includes("Km") || name.includes("Days") ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const save = () => {
    const payload = { ...rules };
    // guard numbers
    ["oilChangeKm", "oilChangeDays", "leadDays"].forEach((k) => {
      payload[k] = Number(payload[k] || 0);
    });
    localStorage.setItem(LS_REM_RULES, JSON.stringify(payload));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const readOnly = role !== "superadmin";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-textmain">Reminder Rules (KM / Days)</h1>
        {readOnly ? (
          <span className="text-xs px-2 py-1 rounded border border-bordercol">Read-only (Admin)</span>
        ) : (
          <button
            onClick={save}
            className="px-4 py-2 rounded bg-accent text-white hover:opacity-90"
          >
            Save Rules
          </button>
        )}
      </div>

      {saved && (
        <div className="text-sm text-success">Saved!</div>
      )}

      <div className="bg-surface border border-bordercol rounded-lg p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Oil Change Interval – KM">
          <input
            name="oilChangeKm"
            value={rules.oilChangeKm}
            onChange={onChange}
            disabled={readOnly}
            inputMode="numeric"
            className="w-full rounded border border-bordercol bg-background px-3 py-2"
          />
        </Field>
        <Field label="Oil Change Interval – Days">
          <input
            name="oilChangeDays"
            value={rules.oilChangeDays}
            onChange={onChange}
            disabled={readOnly}
            inputMode="numeric"
            className="w-full rounded border border-bordercol bg-background px-3 py-2"
          />
        </Field>
        <Field label="Lead Time – Days (generate reminders this many days before due)">
          <input
            name="leadDays"
            value={rules.leadDays}
            onChange={onChange}
            disabled={readOnly}
            inputMode="numeric"
            className="w-full rounded border border-bordercol bg-background px-3 py-2"
          />
        </Field>
        <Field label="Default Discount Text">
          <input
            name="discount"
            value={rules.discount}
            onChange={onChange}
            disabled={readOnly}
            className="w-full rounded border border-bordercol bg-background px-3 py-2"
          />
        </Field>
        <div className="md:col-span-2">
          <Field label="Message Template">
            <textarea
              name="template"
              value={rules.template}
              onChange={onChange}
              disabled={readOnly}
              rows={3}
              className="w-full rounded border border-bordercol bg-background px-3 py-2"
            />
            <p className="text-xs text-textmain/70 mt-1">
              Placeholders: {"{plate}"}, {"{lastOdo}"}, {"{lastDate}"}, {"{discount}"}.
            </p>
          </Field>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-textmain mb-1">{label}</label>
      {children}
    </div>
  );
}
