import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import TrpcProvider from "./trpc/TrpcProvider.tsx";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TrpcProvider>
      <Toaster richColors />
      <App />
    </TrpcProvider>
  </React.StrictMode>
);
