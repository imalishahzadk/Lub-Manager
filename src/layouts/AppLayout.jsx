// src/layouts/AppLayout.jsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MdMenu } from "react-icons/md";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <div className="h-screen w-full bg-background text-textmain flex">
      {/* Sidebar is fixed width; it does NOT depend on main scroll */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content column: header + scrollable content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header stays on top of the scrollable content */}
        <header className="sticky top-0 z-30 bg-surface border-b border-bordercol px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border border-bordercol hover:bg-background"
            aria-label="Open sidebar"
          >
            <MdMenu />
          </button>
          <div className="text-sm">Home / Dashboard</div>
          <div className="ml-auto flex items-center gap-2">{/* actions */}</div>
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
