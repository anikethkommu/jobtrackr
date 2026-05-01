// ─────────────────────────────────────────────
//  App.jsx  — Root Component
//
//  This is the top-level component that React
//  renders first. It contains:
//  - The header
//  - Tab navigation (Job Tracker / Resume Optimizer)
//  - Renders the active tab's component
// ─────────────────────────────────────────────

import { useState } from "react";
import JobTracker from "./components/JobTracker";
import ResumeOptimizer from "./components/ResumeOptimizer";
import "./App.css";

function App() {
  // activeTab controls which panel is visible
  // "tracker" = Job Tracker, "resume" = Resume Optimizer
  const [activeTab, setActiveTab] = useState("tracker");

  return (
    <div className="app">

      {/* ───── HEADER ───── */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span>JobTrackr</span>
          </div>
          <p className="tagline">Track applications. Optimize your resume. Land the job.</p>
        </div>
      </header>

      {/* ───── TAB NAVIGATION ───── */}
      {/*
        These are simple buttons that change state.
        The active tab gets a different CSS class
        so it looks highlighted/selected.
      */}
      <nav className="tab-nav">
        <button
          className={`tab-btn ${activeTab === "tracker" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("tracker")}
        >
          📋 Job Tracker
        </button>
        <button
          className={`tab-btn ${activeTab === "resume" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("resume")}
        >
          🎯 Resume Optimizer
        </button>
      </nav>

      {/* ───── MAIN CONTENT ───── */}
      <main className="main-content">
        {/*
          Conditional rendering:
          Only the active tab's component is shown.
          The other one doesn't render at all.
        */}
        {activeTab === "tracker" && <JobTracker />}
        {activeTab === "resume"  && <ResumeOptimizer />}
      </main>

      {/* ───── FOOTER ───── */}
      <footer className="footer">
        <p>JobTrackr — Built with React & localStorage &nbsp;|&nbsp; No backend required</p>
      </footer>

    </div>
  );
}

export default App;
