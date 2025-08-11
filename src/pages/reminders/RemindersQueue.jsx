import { useEffect, useMemo, useState } from "react";
import { MdSearch, MdSend, MdDelete, MdRefresh } from "react-icons/md";
import { LS_REM_RULES } from "./RemindersRules";

const LS_VEHICLES = "mvp-vehicles";
const LS_QUEUE = "mvp-reminders-queue";

export default function RemindersQueue() {
  const role = (localStorage.getItem("role") || "admin").toLowerCase();
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);     // queued reminders
  const [rules, setRules] = useState(null); // current rules

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(LS_QUEUE) || "[]");
    setRows(saved);
    const r = JSON.parse(localStorage.getItem(LS_REM_RULES) || "null");
    setRules(r);
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.plate, r.ownerName, r.message, r.status].some((v) =>
        String(v || "").toLowerCase().includes(s)
      )
    );
  }, [q, rows]);

  const generate = () => {
    const today = new Date();
    const cfg = {
      oilChangeKm: 5000,
      oilChangeDays: 180,
      leadDays: 7,
      discount: "5%",
      template:
        "Dear customer, your vehicle {plate} is due for an oil change. Last at {lastOdo} km on {lastDate}. Visit us and get {discount} off.",
      ...(rules || {}),
    };

    const vehicles = JSON.parse(localStorage.getItem(LS_VEHICLES) || "[]");
    const queue = JSON.parse(localStorage.getItem(LS_QUEUE) || "[]");

    // avoid duplicates by (plate|dueKey)
    const exists = new Set(queue.map((x) => `${x.plate}|${x.dueKey}`));
    const toAdd = [];

    for (const v of vehicles) {
      const lastOdo = Number(v.lastOdo || 0);
      const lastDate = v.lastServiceDate ? new Date(v.lastServiceDate) : null;

      const dueByKm = lastOdo ? lastOdo + Number(cfg.oilChangeKm || 0) : null;
      const dueByDate = lastDate ? addDays(lastDate, Number(cfg.oilChangeDays || 0)) : null;

      // NEW: queue when remaining days until due <= lead (or overdue)
      let shouldQueue = false;
      let dueKey = null;

      if (dueByDate) {
        const daysSince = daysBetween(lastDate, today); // elapsed since last service
        const remaining = Number(cfg.oilChangeDays || 0) - daysSince; // <= lead -> queue
        if (remaining <= Number(cfg.leadDays || 0)) {
          shouldQueue = true;
          dueKey = `date:${fmtDate(dueByDate)}`;
        }
      }

      if (shouldQueue) {
        const key = `${v.plate}|${dueKey}`;
        if (!exists.has(key)) {
          const msg = (cfg.template || "")
            .replace("{plate}", v.plate || "")
            .replace("{lastOdo}", v.lastOdo != null ? String(v.lastOdo) : "—")
            .replace("{lastDate}", v.lastServiceDate || "—")
            .replace("{discount}", cfg.discount || "");
          toAdd.push({
            id: Date.now() + Math.random(),
            plate: v.plate,
            ownerName: v.ownerName || "",
            phone: v.phone || "",
            dueKey,
            dueDate: fmtDate(dueByDate),
            dueKm: dueByKm, // info only in MVP
            status: "pending", // pending | sent | dismissed
            message: msg,
            createdAt: Date.now(),
          });
        }
      }
    }

    if (toAdd.length) {
      const next = [...queue, ...toAdd].sort((a, b) =>
        (a.dueDate || "").localeCompare(b.dueDate || "")
      );
      localStorage.setItem(LS_QUEUE, JSON.stringify(next));
      setRows(next);
    }
  };

  const setStatus = (id, status) => {
    const next = rows.map((r) => (r.id === id ? { ...r, status } : r));
    localStorage.setItem(LS_QUEUE, JSON.stringify(next));
    setRows(next);
  };

  const clearDismissed = () => {
    const next = rows.filter((r) => r.status !== "dismissed");
    localStorage.setItem(LS_QUEUE, JSON.stringify(next));
    setRows(next);
  };

  return (
    <div className="space-y-4">
      {/* Header + actions */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <h1 className="text-xl font-semibold text-textmain">Reminders Queue</h1>

        <div className="flex w-full sm:w-auto gap-2 sm:ml-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-80">
            <MdSearch className="absolute left-2 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search plate, owner, text…"
              className="pl-8 pr-3 py-2 w-full rounded border border-bordercol bg-background outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button
            onClick={generate}
            className="inline-flex items-center gap-1 px-3 py-2 rounded border border-bordercol hover:bg-background"
            title="Generate reminders based on rules"
          >
            <MdRefresh /> Generate
          </button>
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
                <Th className="text-right">Due Date</Th>
                <Th className="text-right">Due KM</Th>
                <Th>Message</Th>
                <Th className="text-right">Status</Th>
                <Th className="w-40 text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bordercol/70">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-textmain/70">
                    No reminders. Click <strong>Generate</strong> to create upcoming reminders.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-background/60">
                    <Td className="font-medium">{r.plate}</Td>
                    <Td>{r.ownerName || "—"}</Td>
                    <Td className="text-right">{r.dueDate || "—"}</Td>
                    <Td className="text-right">
                      {r.dueKm != null ? r.dueKm.toLocaleString() : "—"}
                    </Td>
                    <Td className="max-w-[40ch] truncate" title={r.message}>
                      {r.message}
                    </Td>
                    <Td className="text-right">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          r.status === "pending"
                            ? "bg-warning/10 text-warning"
                            : r.status === "sent"
                            ? "bg-success/10 text-success"
                            : "bg-error/10 text-error"
                        }`}
                      >
                        {r.status}
                      </span>
                    </Td>
                    <Td className="text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setStatus(r.id, "sent")}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded border border-bordercol hover:bg-background"
                          title="Mark as sent"
                          disabled={r.status === "sent"}
                        >
                          <MdSend size={16} /> Sent
                        </button>
                        <button
                          onClick={() => setStatus(r.id, "dismissed")}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded border border-bordercol hover:bg-background"
                          title="Dismiss"
                          disabled={r.status === "dismissed"}
                        >
                          <MdDelete size={16} /> Dismiss
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={clearDismissed}
          className="text-xs px-3 py-1 rounded border border-bordercol hover:bg-background"
        >
          Clear dismissed
        </button>
      </div>

      <p className="text-xs text-textmain/60">
        MVP: reminders are generated from last service date/odo vs rules. Admin can mark as Sent or Dismissed.
      </p>
    </div>
  );
}

/* helpers */
function Th({ children, className = "" }) {
  return <th className={`px-3 py-2 text-textmain/80 ${className}`}>{children}</th>;
}
function Td({ children, className = "" }) {
  return <td className={`px-3 py-2 ${className}`}>{children}</td>;
}
function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + Number(days || 0));
  return x;
}
function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function daysBetween(a, b) {
  if (!a || !b) return 0;
  const ms = startOfDay(b) - startOfDay(a);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
function fmtDate(d) {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
