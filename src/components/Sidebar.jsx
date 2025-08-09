import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MdClose, MdDashboard, MdNotifications, MdPointOfSale, MdListAlt, MdDrafts, MdReceiptLong,
  MdReplay, MdLockOpen, MdPeopleAlt, MdPersonAdd, MdSearch, MdInventory,
  MdAddShoppingCart, MdAssessment, MdMoveToInbox, MdShoppingCart, MdAdd, MdBuild,
  MdWarningAmber, MdQrCode, MdAlarm, MdRule, MdOutlineMessage, MdCampaign,
  MdLocalShipping, MdAddBusiness, MdAttachMoney, MdLocalOffer, MdGavel,
  MdAccountBalanceWallet, MdMoneyOff, MdCalculate, MdReorder, MdBarChart,
  MdAdminPanelSettings, MdGroup, MdSecurity, MdList, MdSettings, MdBusiness,
  MdLocationCity, MdMessage, MdPrint, MdTune, MdLanguage, MdImportExport, MdToggleOn,
  MdHelpOutline, MdInfo
} from "react-icons/md";

// Pass `mobileOpen` and `onClose` from AppLayout
export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState({}); // expand/collapse for groups (desktop and mobile)
  const containerRef = useRef(null);

  const NAV = [
    {
      label: "Dashboard", icon: <MdDashboard size={18} />, base: "/dashboard",
      items: [{ label: "Overview", to: "/dashboard", icon: <MdDashboard size={16} /> }],
    },
    {
      label: "Notifications", icon: <MdNotifications size={18} />, base: "/notifications",
      items: [{ label: "Center", to: "/notifications", icon: <MdNotifications size={16} /> }],
    },
    {
      label: "Sales", icon: <MdPointOfSale size={18} />, base: "/sales",
      items: [
        { label: "New Sale (POS)", to: "/sales/new", icon: <MdPointOfSale size={16} /> },
        { label: "Sales List", to: "/sales", icon: <MdListAlt size={16} /> },
        { label: "Drafts", to: "/sales/drafts", icon: <MdDrafts size={16} /> },
        { label: "Return / Refund", to: "/sales/return", icon: <MdReplay size={16} /> },
        { label: "Cash Register (Open/Close)", to: "/sales/register", icon: <MdLockOpen size={16} /> },
        { label: "Shift Report", to: "/sales/shift-report", icon: <MdListAlt size={16} /> },
        { label: "Receipt Lookup", to: "/sales/lookup", icon: <MdReceiptLong size={16} /> },
      ],
    },
    {
      label: "Customers & Vehicles", icon: <MdPeopleAlt size={18} />, base: "/customers",
      items: [
        { label: "Vehicles", to: "/customers/vehicles", icon: <MdPeopleAlt size={16} /> },
        { label: "Add Vehicle", to: "/customers/vehicles/new", icon: <MdPersonAdd size={16} /> },
        { label: "Owners", to: "/customers/owners", icon: <MdPeopleAlt size={16} /> },
        { label: "Search", to: "/crm/search", icon: <MdSearch size={16} /> },
      ],
    },
    {
      label: "Inventory", icon: <MdInventory size={18} />, base: "/inventory",
      items: [
        { label: "Products", to: "/inventory/products", icon: <MdInventory size={16} /> },
        { label: "Add / Edit Product", to: "/inventory/products/new", icon: <MdAddShoppingCart size={16} /> },
        { label: "Stock Overview", to: "/inventory/stock", icon: <MdAssessment size={16} /> },
        { label: "Stock Movements", to: "/inventory/movements", icon: <MdMoveToInbox size={16} /> },
        { label: "Purchases (Stock Intake)", to: "/inventory/purchase", icon: <MdShoppingCart size={16} /> },
        { label: "New Purchase", to: "/inventory/purchase/new", icon: <MdAdd size={16} /> },
        { label: "Adjustments", to: "/inventory/adjustments", icon: <MdBuild size={16} /> },
        { label: "New Adjustment", to: "/inventory/adjustments/new", icon: <MdAdd size={16} /> },
        { label: "Low-Stock Alerts", to: "/inventory/alerts", icon: <MdWarningAmber size={16} /> },
        { label: "Batches / Lots", to: "/inventory/batches", icon: <MdReorder size={16} /> },
        { label: "Barcode / Labels", to: "/inventory/labels", icon: <MdQrCode size={16} /> },
      ],
    },
    {
      label: "Reminders", icon: <MdAlarm size={18} />, base: "/reminders",
      items: [
        { label: "Queue", to: "/reminders", icon: <MdAlarm size={16} /> },
        { label: "Rules (KM / Days)", to: "/reminders/rules", icon: <MdRule size={16} /> },
        { label: "Templates", to: "/reminders/templates", icon: <MdOutlineMessage size={16} /> },
        { label: "Delivery Logs", to: "/reminders/logs", icon: <MdList size={16} /> },
        { label: "Campaign Blast", to: "/reminders/campaigns/new", icon: <MdCampaign size={16} /> },
      ],
    },
    {
      label: "Suppliers", icon: <MdLocalShipping size={18} />, base: "/suppliers",
      items: [
        { label: "Suppliers", to: "/suppliers", icon: <MdLocalShipping size={16} /> },
        { label: "Add Supplier", to: "/suppliers/new", icon: <MdAddBusiness size={16} /> },
      ],
    },
    {
      label: "Pricing", icon: <MdAttachMoney size={18} />, base: "/pricing",
      items: [
        { label: "Price Tiers", to: "/pricing/tiers", icon: <MdAttachMoney size={16} /> },
        { label: "Discount Rules", to: "/pricing/discounts", icon: <MdLocalOffer size={16} /> },
        { label: "Tax Settings", to: "/pricing/taxes", icon: <MdGavel size={16} /> },
      ],
    },
    {
      label: "Finance", icon: <MdAccountBalanceWallet size={18} />, base: "/finance",
      items: [
        { label: "Payments Ledger", to: "/finance/payments", icon: <MdAccountBalanceWallet size={16} /> },
        { label: "Expenses", to: "/finance/expenses", icon: <MdMoneyOff size={16} /> },
        { label: "Daily P&L", to: "/finance/daily-pl", icon: <MdCalculate size={16} /> },
        { label: "Reconciliation", to: "/finance/recon", icon: <MdReorder size={16} /> },
      ],
    },
    {
      label: "Reports", icon: <MdBarChart size={18} />, base: "/reports",
      items: [
        { label: "Sales Report", to: "/reports/sales", icon: <MdBarChart size={16} /> },
        { label: "Profit Report", to: "/reports/profit", icon: <MdAttachMoney size={16} /> },
        { label: "Stock Valuation", to: "/reports/stock-valuation", icon: <MdAssessment size={16} /> },
        { label: "Stock Movements", to: "/reports/stock-movements", icon: <MdMoveToInbox size={16} /> },
        { label: "Stock Alerts", to: "/reports/stock-alerts", icon: <MdWarningAmber size={16} /> },
        { label: "Vehicle History", to: "/reports/vehicle-history", icon: <MdPeopleAlt size={16} /> },
        { label: "Reminders Effectiveness", to: "/reports/reminders", icon: <MdAlarm size={16} /> },
        { label: "Top Products / Brands", to: "/reports/top-products", icon: <MdInventory size={16} /> },
        { label: "Payment Methods Mix", to: "/reports/payments", icon: <MdAttachMoney size={16} /> },
      ],
    },
    {
      label: "Admin", icon: <MdAdminPanelSettings size={18} />, base: "/admin",
      items: [
        { label: "Users", to: "/admin/users", icon: <MdGroup size={16} /> },
        { label: "Roles & Permissions", to: "/admin/roles", icon: <MdSecurity size={16} /> },
        { label: "Audit Logs", to: "/admin/audit-logs", icon: <MdList size={16} /> },
      ],
    },
    {
      label: "Settings", icon: <MdSettings size={18} />, base: "/settings",
      items: [
        { label: "Business Profile", to: "/settings/business", icon: <MdBusiness size={16} /> },
        { label: "Branches / Locations", to: "/settings/branches", icon: <MdLocationCity size={16} /> },
        { label: "Messaging Integrations", to: "/settings/messaging", icon: <MdMessage size={16} /> },
        { label: "Numbering & Print", to: "/settings/print", icon: <MdPrint size={16} /> },
        { label: "Service Defaults", to: "/settings/service", icon: <MdTune size={16} /> },
        { label: "Currency / Locale", to: "/settings/locale", icon: <MdLanguage size={16} /> },
        { label: "Data Import / Export", to: "/settings/data", icon: <MdImportExport size={16} /> },
        { label: "Feature Toggles", to: "/settings/features", icon: <MdToggleOn size={16} /> },
      ],
    },
    {
      label: "Help", icon: <MdHelpOutline size={18} />, base: "/help",
      items: [
        { label: "Docs", to: "/help", icon: <MdHelpOutline size={16} /> },
        { label: "About / Version", to: "/about", icon: <MdInfo size={16} /> },
      ],
    },
  ];

  // auto-open group for current route
  useMemo(() => {
    const next = {};
    NAV.forEach((g) => { next[g.label] = pathname.startsWith(g.base); });
    setOpen(next);
  }, [pathname]);

  // close on route change (mobile)
  useEffect(() => {
    if (mobileOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // close on Esc (mobile)
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

      {/* Sidebar container: mobile drawer + desktop static */}
      <aside
        ref={containerRef}
        className={`
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 md:static md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          w-72 bg-primary text-white flex flex-col
        `}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-primary h-14 border-b border-bordercol/30 flex items-center justify-between px-4 font-semibold">
  <span>LubeManager</span>
  {/* Close button on mobile */}
  <button
    onClick={onClose}
    className="md:hidden inline-flex items-center justify-center w-8 h-8 rounded hover:bg-accent/20"
    title="Close"
  >
    <MdClose size={18} />
  </button>
</div>


        {/* Nav */}
        <nav className="sidebar-scroll flex-1 overflow-y-auto px-2 py-3 space-y-2">
          {NAV.map((group) => (
            <div key={group.label} className="text-sm">
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
                        end={item.to === group.base || item.to === "/dashboard"}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-bordercol/30 p-3 text-xs text-background/90">
          v1.0 • © 2025
        </div>
      </aside>
    </>
  );
}
