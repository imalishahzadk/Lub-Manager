// src/layouts/AppLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  // TEMP: switch role to preview sidebar permissions (replace with real auth later)
  const [role, setRole] = useState("admin"); // "admin" | "superadmin"

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="h-screen w-full bg-background text-textmain flex">
      {/* Sidebar is fixed width; it does NOT depend on main scroll */}
      <Sidebar
        role={role}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content column: header + scrollable content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header stays on top of the scrollable content */}
        <header className="sticky top-0 z-30 bg-surface border-b border-bordercol px-4 py-3 flex items-center gap-3">
  {/* Mobile hamburger */}
  <button
    onClick={() => setMobileOpen(true)}
    className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-bordercol hover:bg-background"
    aria-label="Open sidebar"
  >
    <MdMenu />
  </button>

  {/* Hide breadcrumbs on mobile */}
  <div className="hidden md:block">
    <Breadcrumbs />
  </div>

  <div className="ml-auto flex items-center gap-2">
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="text-sm border border-bordercol rounded px-2 py-1 bg-surface"
      title="Switch role (frontend only)"
    >
      <option value="admin">Admin</option>
      <option value="superadmin">Super Admin</option>
    </select>
  </div>
</header>


        {/* This is the ONLY vertical scroll container for the page */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
