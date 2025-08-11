import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  MdClose, MdDashboard, MdPointOfSale, MdListAlt, MdReceiptLong,
  MdPeopleAlt, MdPersonAdd, MdInventory, MdAddShoppingCart, MdAssessment,
  MdMoveToInbox, MdShoppingCart, MdWarningAmber, MdAlarm,
  MdRule, MdBarChart, MdSettings, MdBusiness, MdMessage, MdTune
} from "react-icons/md";

/**
 * Props:
 * - role: "superadmin" | "admin"
 * - mobileOpen: boolean
 * - onClose: () => void
 */
export default function Sidebar({ role = "admin", mobileOpen = false, onClose = () => {} }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState({});
  const containerRef = useRef(null);

  // MVP NAV ONLY + role visibility
  const NAV = [
    // Dashboard as DIRECT LINK
    {
      label: "Dashboard",
      icon: <MdDashboard size={18} />,
      base: "/dashboard",
      to: "/dashboard",
      allow: ["admin", "superadmin"],
      items: [],
    },

    // Sales
    {
      label: "Sales",
      icon: <MdPointOfSale size={18} />,
      base: "/sales",
      allow: ["admin", "superadmin"],
      items: [
        { label: "New Sale (POS)", to: "/sales/new", icon: <MdPointOfSale size={16} />, allow: ["admin", "superadmin"] },
        { label: "Sales List", to: "/sales", exact: true, icon: <MdListAlt size={16} />, allow: ["admin", "superadmin"] },
        // template link (kept for completeness)
        { label: "Receipt (Print)", to: "/sales/:id/receipt", icon: <MdReceiptLong size={16} />, allow: ["admin", "superadmin"] },
      ],
    },

    // Customers & Vehicles
    {
      label: "Customers & Vehicles",
      icon: <MdPeopleAlt size={18} />,
      base: "/customers",
      allow: ["admin", "superadmin"],
      items: [
        { label: "Vehicles", to: "/customers/vehicles", exact: true, icon: <MdPeopleAlt size={16} />, allow: ["admin", "superadmin"] },
        { label: "Add Vehicle", to: "/customers/vehicles/new", icon: <MdPersonAdd size={16} />, allow: ["admin", "superadmin"] },
        // detail route is contextual: /customers/vehicles/:plate
      ],
    },

    // Inventory
    {
      label: "Inventory",
      icon: <MdInventory size={18} />,
      base: "/inventory",
      allow: ["admin", "superadmin"],
      items: [
        { label: "Products", to: "/inventory/products", exact: true, icon: <MdInventory size={16} />, allow: ["admin", "superadmin"] },
        { label: "Add / Edit Product", to: "/inventory/products/new", icon: <MdAddShoppingCart size={16} />, allow: ["superadmin"] },
        { label: "Stock Overview", to: "/inventory/stock", exact: true, icon: <MdAssessment size={16} />, allow: ["admin", "superadmin"] },
        { label: "Purchases (List)", to: "/inventory/purchase", exact: true, icon: <MdMoveToInbox size={16} />, allow: ["admin", "superadmin"] },
        { label: "New Purchase (Intake)", to: "/inventory/purchase/new", icon: <MdShoppingCart size={16} />, allow: ["admin", "superadmin"] },
        { label: "Low-Stock Alerts", to: "/inventory/alerts", exact: true, icon: <MdWarningAmber size={16} />, allow: ["admin", "superadmin"] },
      ],
    },

    // Reminders
    {
      label: "Reminders",
      icon: <MdAlarm size={18} />,
      base: "/reminders",
      allow: ["admin", "superadmin"],
      items: [
        { label: "Rules (KM/Days)", to: "/reminders/rules", icon: <MdRule size={16} />, allow: ["superadmin"] },
        { label: "Queue", to: "/reminders", exact: true, icon: <MdAlarm size={16} />, allow: ["admin", "superadmin"] },
      ],
    },

    // Reports (lite)
    {
      label: "Reports",
      icon: <MdBarChart size={18} />,
      base: "/reports",
      allow: ["admin", "superadmin"],
      items: [
        { label: "Sales Report", to: "/reports/sales", exact: true, icon: <MdBarChart size={16} />, allow: ["admin", "superadmin"] },
        { label: "Stock Movements", to: "/reports/stock-movements", exact: true, icon: <MdMoveToInbox size={16} />, allow: ["admin", "superadmin"] },
      ],
    },

    // Settings (lite) — superadmin only
    {
      label: "Settings",
      icon: <MdSettings size={18} />,
      base: "/settings",
      allow: ["superadmin"],
      items: [
        { label: "Business Profile", to: "/settings/business", exact: true, icon: <MdBusiness size={16} />, allow: ["superadmin"] },
        { label: "Messaging Integrations", to: "/settings/messaging", exact: true, icon: <MdMessage size={16} />, allow: ["superadmin"] },
        { label: "Service Defaults", to: "/settings/service", exact: true, icon: <MdTune size={16} />, allow: ["superadmin"] },
      ],
    },
  ];

  // Filter by role
  const VISIBLE_NAV = NAV
    .filter(g => !g.allow || g.allow.includes(role))
    .map(g => ({
      ...g,
      items: (g.items || []).filter(i => !i.allow || i.allow.includes(role)),
    }))
    .filter(g => (g.to ? true : (g.items?.length > 0)));

  // Auto-open collapsible groups on route change
  useEffect(() => {
    const next = {};
    VISIBLE_NAV.forEach((g) => {
      if (!g.to) next[g.label] = pathname.startsWith(g.base);
    });
    setOpen(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close drawer on route change (mobile)
  useEffect(() => {
    if (mobileOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Esc (mobile)
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && mobileOpen) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, onClose]);

  return (
    <>
      {/* Overlay (mobile only) */}
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar container: mobile drawer + desktop sticky */}
      <aside
        ref={containerRef}
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 md:static md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          w-72 bg-primary text-white flex flex-col h-screen md:sticky md:top-0 md:shrink-0
        `}
      >
        {/* Header (sticky in sidebar) */}
        <div className="sticky top-0 z-20 bg-primary h-14 border-b border-bordercol/30 flex items-center justify-between px-4 font-semibold">
          <span>LubeManager</span>
          <button
            onClick={onClose}
            className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded hover:bg-accent/20"
            title="Close"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Nav (scrollable area) */}
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-3 space-y-2">
          {VISIBLE_NAV.map((group) => {
            const isDirect = !!group.to; // Dashboard
            return (
              <div key={group.label} className="text-sm">
                {isDirect ? (
                  <NavLink
                    to={group.to}
                    className={({ isActive }) =>
                      `w-full flex items-center justify-between px-3 py-2 rounded transition ${
                        isActive ? "bg-accent text-white" : "hover:bg-accent/20 text-white"
                      }`
                    }
                    end   // exact match for the Dashboard link
                  >
                    <span className="flex items-center gap-2">
                      {group.icon}
                      <span className="font-medium">{group.label}</span>
                    </span>
                  </NavLink>
                ) : (
                  <>
                    <button
                      onClick={() => setOpen((o) => ({ ...o, [group.label]: !o[group.label] }))}
                      className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-accent/20 transition"
                    >
                      <span className="flex items-center gap-2">
                        {group.icon}
                        <span className="font-medium">{group.label}</span>
                      </span>
                      <span className="text-surface">{open[group.label] ? "−" : "+"}</span>
                    </button>

                    <div className={`${open[group.label] ? "max-h-96" : "max-h-0"} overflow-hidden transition-all`}>
                      <ul className="mt-1 space-y-1">
                        {group.items.map((item) => (
                          <li key={item.to}>
                            <NavLink
                              to={item.to}
                              className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded ${
                                  isActive ? "bg-accent text-white" : "text-background hover:bg-accent/20 hover:text-white"
                                }`
                              }
                              end={Boolean(item.exact)}  // exact-active for list/index pages
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-bordercol/30 p-3 text-xs text-background/90">
          v1.0 • © 2025
        </div>
      </aside>
    </>
  );
}
