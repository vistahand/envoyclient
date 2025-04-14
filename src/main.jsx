import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ShipmentProvider } from "./context/ShipmentContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ShipmentProvider>
      <App />
    </ShipmentProvider>
  </React.StrictMode>
);
