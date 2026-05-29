import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#111118",
              color: "#e2e2f0",
              border: "1px solid #1e1e2e",
              borderRadius: "10px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#111118" },
            },
            error: { iconTheme: { primary: "#ef4444", secondary: "#111118" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
