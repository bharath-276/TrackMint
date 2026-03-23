import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ SERVICE WORKER (ADD HERE ONLY)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("SW Registered"))
      .catch((err) => console.log("SW Error:", err));
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);