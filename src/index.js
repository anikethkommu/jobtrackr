// ─────────────────────────────────────────────
//  index.js  — React Entry Point
//
//  This is the very first file React runs.
//  It finds the <div id="root"> in public/index.html
//  and renders our <App /> component inside it.
//  You almost never need to edit this file.
// ─────────────────────────────────────────────

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Find the <div id="root"> in public/index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render our App component inside it
root.render(
  // StrictMode helps catch bugs during development
  // (shows extra warnings in the browser console)
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
