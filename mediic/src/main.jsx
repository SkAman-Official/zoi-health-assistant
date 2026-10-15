import React from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import Preloader from "./Shared/Preloader/Preloader";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./Router/router";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster

const helmetContext = {};
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<React.StrictMode>
  <AuthProvider>
    <HelmetProvider context={helmetContext}>
      <Preloader />
      <Toaster position="top-right" /> {/* ✅ Add Toaster here */}
      <RouterProvider router={router} />
    </HelmetProvider>
  </AuthProvider>
</React.StrictMode>);
