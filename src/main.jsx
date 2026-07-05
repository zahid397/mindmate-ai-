import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initMockDb } from "./services/mockDb";
import "./styles/index.css";

// Seed the demo + admin accounts (and sample assessments) on first run.
// Safe to call every load — it never overwrites data that already
// exists, so a returning user's real accounts/history are untouched.
initMockDb();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
