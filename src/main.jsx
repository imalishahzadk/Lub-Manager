// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";

import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/auth/SignUp";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import VehiclesList from "./pages/customers/VehiclesList";
import VehicleNew from "./pages/customers/VehicleNew";
import VehicleDetail from "./pages/customers/VehicleDetail";
import NewSale from "./pages/sales/NewSale";
import SalesReceipt from "./pages/sales/SalesReceipt";
import SalesList from "./pages/sales/SalesList";
import Products from "./pages/inventory/Products";
import ProductForm from "./pages/inventory/ProductForm";
import StockOverview from "./pages/inventory/StockOverview";
import PurchasesList from "./pages/inventory/PurchasesList";
import PurchaseNew from "./pages/inventory/PurchaseNew";
import LowStockAlerts from "./pages/inventory/LowStockAlerts";
import RemindersQueue from "./pages/reminders/RemindersQueue";
import RemindersRules from "./pages/reminders/RemindersRules";
import StockMovements from "./pages/reports/StockMovements";
import SalesReport from "./pages/reports/SalesReport";




ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Auth routes (no sidebar) */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* App routes (with sidebar) */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="customers/vehicles" element={<VehiclesList />} />
          <Route path="customers/vehicles/new" element={<VehicleNew />} />
          <Route path="/customers/vehicles/:plate" element={<VehicleDetail />} />
          <Route path="/sales/new" element={<NewSale />} />
          <Route path="/sales" element={<SalesList />} />
          <Route path="/sales/:id/receipt" element={<SalesReceipt />} />
          <Route path="/inventory/products" element={<Products />} />
          <Route path="/inventory/products/new" element={<ProductForm />} />
          <Route path="/inventory/stock" element={<StockOverview />} />
          <Route path="/inventory/purchase" element={<PurchasesList />} />
          <Route path="/inventory/purchase/new" element={<PurchaseNew />} />
          <Route path="/inventory/alerts" element={<LowStockAlerts />} />
          <Route path="/reminders" element={<RemindersQueue />} />
          <Route path="/reminders/rules" element={<RemindersRules />} />
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/stock-movements" element={<StockMovements />} />

        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
