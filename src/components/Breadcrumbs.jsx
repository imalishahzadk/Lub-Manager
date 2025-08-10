import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";

/**
 * Simple, route-pattern–based breadcrumbs for the MVP.
 * Add patterns as you add screens.
 */
export default function Breadcrumbs() {
  const { pathname } = useLocation();

  const crumbs = useMemo(() => {
    const patterns = [
      // Dashboard
      {
        match: /^\/dashboard$/,
        trail: [{ to: "/dashboard", label: "Dashboard" }],
      },

      // Sales
      {
        match: /^\/sales$/,
        trail: [{ to: "/sales", label: "Sales" }, { label: "List" }],
      },
      {
        match: /^\/sales\/new$/,
        trail: [{ to: "/sales", label: "Sales" }, { label: "New Sale (POS)" }],
      },
      {
        match: /^\/sales\/[^/]+\/receipt$/,
        trail: [{ to: "/sales", label: "Sales" }, { label: "Receipt" }],
      },

      // Customers & Vehicles
      {
        match: /^\/customers\/vehicles$/,
        trail: [
          { to: "/customers/vehicles", label: "Customers & Vehicles" },
          { label: "Vehicles" },
        ],
      },
      {
        match: /^\/customers\/vehicles\/new$/,
        trail: [
          { to: "/customers/vehicles", label: "Customers & Vehicles" },
          { to: "/customers/vehicles", label: "Vehicles" },
          { label: "Add Vehicle" },
        ],
      },
      {
        match: /^\/customers\/vehicles\/([^/]+)$/,
        trail: (m) => [
          { to: "/customers/vehicles", label: "Customers & Vehicles" },
          { to: "/customers/vehicles", label: "Vehicles" },
          { label: decodeURIComponent(m[1]).toUpperCase() }, // plate
        ],
      },

      // Inventory
      {
        match: /^\/inventory\/products$/,
        trail: [{ to: "/inventory/products", label: "Inventory" }, { label: "Products" }],
      },
      {
        match: /^\/inventory\/products\/new$/,
        trail: [{ to: "/inventory/products", label: "Inventory" }, { to: "/inventory/products", label: "Products" }, { label: "Add / Edit" }],
      },
      {
        match: /^\/inventory\/stock$/,
        trail: [{ to: "/inventory/stock", label: "Inventory" }, { label: "Stock Overview" }],
      },
      {
        match: /^\/inventory\/purchase$/,
        trail: [{ to: "/inventory/purchase", label: "Inventory" }, { label: "Purchases" }],
      },
      {
        match: /^\/inventory\/purchase\/new$/,
        trail: [{ to: "/inventory/purchase", label: "Inventory" }, { to: "/inventory/purchase", label: "Purchases" }, { label: "New Purchase" }],
      },
      {
        match: /^\/inventory\/alerts$/,
        trail: [{ to: "/inventory/alerts", label: "Inventory" }, { label: "Low-Stock Alerts" }],
      },

      // Reminders
      {
        match: /^\/reminders$/,
        trail: [{ to: "/reminders", label: "Reminders" }, { label: "Queue" }],
      },
      {
        match: /^\/reminders\/rules$/,
        trail: [{ to: "/reminders", label: "Reminders" }, { label: "Rules (KM/Days)" }],
      },

      // Reports
      {
        match: /^\/reports\/sales$/,
        trail: [{ to: "/reports/sales", label: "Reports" }, { label: "Sales Report" }],
      },
      {
        match: /^\/reports\/stock-movements$/,
        trail: [{ to: "/reports/stock-movements", label: "Reports" }, { label: "Stock Movements" }],
      },

      // Settings (Super Admin)
      {
        match: /^\/settings\/business$/,
        trail: [{ to: "/settings/business", label: "Settings" }, { label: "Business Profile" }],
      },
      {
        match: /^\/settings\/messaging$/,
        trail: [{ to: "/settings/messaging", label: "Settings" }, { label: "Messaging Integrations" }],
      },
      {
        match: /^\/settings\/service$/,
        trail: [{ to: "/settings/service", label: "Settings" }, { label: "Service Defaults" }],
      },
    ];

    for (const p of patterns) {
      const m = pathname.match(p.match);
      if (m) return typeof p.trail === "function" ? p.trail(m) : p.trail;
    }
    // Fallback: show only Dashboard when unknown route
    return [{ to: "/dashboard", label: "Dashboard" }];
  }, [pathname]);

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-1 text-textmain/80">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {c.to && !isLast ? (
                <Link to={c.to} className="hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span className={isLast ? "text-textmain font-medium" : ""}>{c.label}</span>
              )}
              {!isLast && <span className="opacity-60">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
