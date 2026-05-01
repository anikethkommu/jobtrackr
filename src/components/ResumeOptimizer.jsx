

import { useState, useRef } from "react";
import { analyzeResume, getScoreLabel } from "../utils/atsAnalyzer";

function ResumeOptimizer() {
  // ── State ──
  const [resumeText, setResumeText]   = useState("");
  const [jobDesc, setJobDesc]         = useState("");
  const [fileName, setFileName]       = useState("");
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  // useRef lets us "click" the hidden file input programmatically
  const fileInputRef = useRef(null);


  function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Only allow .txt files (PDF needs a library — explain to user)
    if (!file.name.endsWith(".txt")) {
      setError("Please upload a .txt file. To use a PDF, open it and copy-paste the text into the box below.");
      return;
    }

    setError("");
    setFileName(file.name);

    // FileReader is a browser API that reads local files
    const reader = new FileReader();
    reader.onload = (event) => {
      setResumeText(event.target.result); // put file content into state
    };
    reader.readAsText(file); // read as plain text
  }


  //  ANALYZE BUTTON — runs the keyword engine

  function handleAnalyze() {
    setError("");

    if (!resumeText.trim()) {
      setError("Please upload a resume file or paste your resume text.");
      return;
    }
    if (!jobDesc.trim()) {
      setError("Please paste the job description.");
      return;
    }

    setLoading(true);
    setResult(null);

    // Small timeout so the loading state is visible
    setTimeout(() => {
      const analysis = analyzeResume(resumeText, jobDesc);
      setResult(analysis);
      setLoading(false);
    }, 600);
  }

  // ── Reset everything ──
  function handleReset() {
    setResumeText("");
    setJobDesc("");
    setFileName("");
    setResult(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }


  //  RENDER


  return (
    <div className="optimizer-wrapper">

      {/* ─── INPUT SECTION ─── */}
      <div className="optimizer-inputs">

        {/* ── Resume Upload Panel ── */}
        <div className="panel">
          <h3 className="panel-title">📄 Your Resume</h3>

          {/* Hidden file input — triggered by the button below */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />

          {/* Upload button */}
          <button
            className="btn-upload"
            onClick={() => fileInputRef.current.click()}
          >
            📁 Upload .txt Resume
          </button>

          {fileName && (
            <p className="file-name">✅ Loaded: <strong>{fileName}</strong></p>
          )}

          <p className="divider-text">— or paste your resume text below —</p>

          <textarea
            className="resume-textarea"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <p className="word-count">
            {resumeText.trim() ? `${resumeText.trim().split(/\s+/).length} words` : "0 words"}
          </p>
        </div>

        {/* ── Job Description Panel ── */}
        <div className="panel">
          <h3 className="panel-title">💼 Job Description</h3>
          <p className="panel-hint">
            Copy and paste the full job posting here. The more detail, the better the analysis.
          </p>
          <textarea
            className="jd-textarea"
            placeholder="Paste the job description here..."
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
          />
          <p className="word-count">
            {jobDesc.trim() ? `${jobDesc.trim().split(/\s+/).length} words` : "0 words"}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && <p className="error-msg">⚠️ {error}</p>}

      {/* ── Action Buttons ── */}
      <div className="optimizer-actions">
        <button
          className="btn-analyze"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? "⏳ Analyzing..." : "🔍 Analyze Resume"}
        </button>
        <button className="btn-reset" onClick={handleReset}>
          🔄 Reset
        </button>
      </div>

      {/* ─── RESULTS SECTION ─── */}
      {result && <AnalysisResults result={result} />}

    </div>
  );
}


function AnalysisResults({ result }) {
  const scoreInfo = getScoreLabel(result.score);

  // Circular progress ring math
  // circumference = 2 * π * radius
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (result.score / 100) * circumference;

  return (
    <div className="results-wrapper">

      {/* ── Score Card ── */}
      <div className="score-card">
        <div className="score-ring-wrapper">
          <svg width="130" height="130" viewBox="0 0 130 130">
            {/* Background circle */}
            <circle cx="65" cy="65" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="10" />
            {/* Coloured progress arc */}
            <circle
              cx="65" cy="65" r={radius}
              fill="none"
              stroke={scoreInfo.color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 65 65)"
              style={{ transition: "stroke-dashoffset 1s ease" }}
            />
          </svg>
          <div className="score-center">
            <span className="score-number">{result.score}%</span>
            <span className="score-label-text" style={{ color: scoreInfo.color }}>
              {scoreInfo.label}
            </span>
          </div>
        </div>
        <div className="score-summary">
          <h3>ATS Match Score</h3>
          <p>
            Your resume matched <strong>{result.matched.length}</strong> out of{" "}
            <strong>{result.totalJdKeywords}</strong> keywords from the job description.
          </p>
          <p style={{ marginTop: "8px", color: "#64748b", fontSize: "0.85rem" }}>
            ATS systems automatically filter resumes. A score above 70% significantly
            improves your chances of passing the initial screening.
          </p>
        </div>
      </div>

      {/* ── Three-column keyword breakdown ── */}
      <div className="keyword-grid">

        {/* Matched */}
        <div className="keyword-panel matched">
          <h4>✅ Matched Keywords ({result.matched.length})</h4>
          <div className="keyword-tags">
            {result.matched.length === 0
              ? <p className="no-keywords">No matches found</p>
              : result.matched.map((kw) => (
                  <span key={kw} className="tag tag-green">{kw}</span>
                ))}
          </div>
        </div>

        {/* Critical Missing */}
        <div className="keyword-panel critical">
          <h4>🚨 Critical Missing ({result.criticalMissing.length})</h4>
          <p className="keyword-hint">Tech skills — add these first</p>
          <div className="keyword-tags">
            {result.criticalMissing.length === 0
              ? <p className="no-keywords">None — great job! 🎉</p>
              : result.criticalMissing.map((kw) => (
                  <span key={kw} className="tag tag-red">{kw}</span>
                ))}
          </div>
        </div>

        {/* Other Missing */}
        <div className="keyword-panel missing">
          <h4>⚠️ Other Missing ({result.softMissing.length + result.otherMissing.length})</h4>
          <p className="keyword-hint">Soft skills & domain terms</p>
          <div className="keyword-tags">
            {[...result.softMissing, ...result.otherMissing].length === 0
              ? <p className="no-keywords">None missing 🎉</p>
              : [...result.softMissing, ...result.otherMissing].map((kw) => (
                  <span key={kw} className="tag tag-orange">{kw}</span>
                ))}
          </div>
        </div>
      </div>

      {/* ── Top Keywords from JD ── */}
      <div className="top-keywords-section">
        <h4>🔑 Most Repeated Keywords in Job Description</h4>
        <p className="keyword-hint">These appear most often — make sure they're in your resume</p>
        <div className="keyword-tags" style={{ marginTop: "12px" }}>
          {result.topKeywords.map(({ word, count }) => (
            <span key={word} className="tag tag-purple">
              {word} <em>×{count}</em>
            </span>
          ))}
        </div>
      </div>

      {/* ── Tips ── */}
      <div className="tips-section">
        <h4>💡 Resume Improvement Tips</h4>
        <div className="tips-list">
          {result.tips.map((tip, i) => {
            const icon  = { success: "✅", warning: "⚠️", error: "❌" }[tip.type] || "ℹ️";
            const color = { success: "#166534", warning: "#92400e", error: "#991b1b" }[tip.type] || "#1e3a5f";
            const bg    = { success: "#f0fdf4", warning: "#fffbeb", error: "#fef2f2" }[tip.type] || "#eff6ff";
            return (
              <div key={i} className="tip-item" style={{ background: bg, borderLeftColor: color }}>
                <span>{icon}</span>
                <p style={{ color }}>{tip.text}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default ResumeOptimizer;
