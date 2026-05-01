

import { useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import JobCard from "./JobCard";
import JobModal from "./JobModal";
import StatsBar from "./StatsBar";
import Toast from "./Toast";

function JobTracker() {
  // ── Persistent state (saved to localStorage) ──
  const [jobs, setJobs] = useLocalStorage("jobtrackr_jobs", []);

  // ── UI state (not saved — resets on refresh) ──
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilter] = useState("All");
  const [sortBy, setSort]         = useState("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // null = add mode
  const [toast, setToast]         = useState({ msg: "", type: "success" });

  //  CRUD OPERATIONS


  // CREATE — Add a new job
  function handleAdd(formData) {
    const newJob = {
      id: Date.now(),   // unique ID using current timestamp
      ...formData,
    };
    setJobs([newJob, ...jobs]); // add at beginning (newest first)
    closeModal();
    showToast(`✅ "${formData.company}" added!`, "success");
  }

  // UPDATE — Save edits to an existing job
  function handleEdit(formData) {
    setJobs(
      jobs.map((j) => (j.id === editingJob.id ? { ...j, ...formData } : j))
    );
    closeModal();
    showToast("✅ Application updated!", "success");
  }

  // DELETE — Remove a job by its ID
  function handleDelete(id, company) {
    if (!window.confirm(`Delete "${company}"?`)) return;
    setJobs(jobs.filter((j) => j.id !== id));
    showToast("🗑️ Application deleted.", "info");
  }


  //  MODAL HELPERS

  function openAddModal() {
    setEditingJob(null);   // null = add mode
    setModalOpen(true);
  }

  function openEditModal(job) {
    setEditingJob(job);    // pre-fill with job data
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingJob(null);
  }


  //  TOAST HELPER


  function showToast(msg, type) {
    setToast({ msg, type });
  }

  function clearToast() {
    setToast({ msg: "", type: "success" });
  }


  //  FILTER + SEARCH + SORT
  //  Applied in sequence: search → filter → sort


  const query = search.toLowerCase();

  let displayed = jobs

    // 1. Filter by search text (company OR role)
    .filter((j) =>
      j.company.toLowerCase().includes(query) ||
      j.role.toLowerCase().includes(query)
    )

    // 2. Filter by selected status
    .filter((j) => filterStatus === "All" || j.status === filterStatus)

    // 3. Sort
    .sort((a, b) => {
      if (sortBy === "oldest")  return new Date(a.date) - new Date(b.date);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      return 0; // "newest" keeps unshift order
    });


  //  RENDER


  return (
    <div>

      {/* ── Stats Dashboard ── */}
      <StatsBar jobs={jobs} />

      {/* ── Controls Row: search + filter + sort + Add button ── */}
      <div className="controls-bar">
        <div className="controls-left">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterStatus} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
          <select value={sortBy} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="company">Company A–Z</option>
          </select>
        </div>

        <button className="btn-add" onClick={openAddModal}>
          + Add Application
        </button>
      </div>

      {/* ── Job Cards Grid ── */}
      {displayed.length === 0 ? (
        <p className="empty-msg">
          {jobs.length === 0
            ? "No applications yet. Click '+ Add Application' to get started! 🚀"
            : "No results match your search/filter."}
        </p>
      ) : (
        <div className="job-grid">
          {displayed.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={() => openEditModal(job)}
              onDelete={() => handleDelete(job.id, job.company)}
            />
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <JobModal
        isOpen={modalOpen}
        initialData={editingJob}
        onSave={editingJob ? handleEdit : handleAdd}
        onClose={closeModal}
      />

      {/* ── Toast Notification ── */}
      <Toast message={toast.msg} type={toast.type} onClose={clearToast} />

    </div>
  );
}

export default JobTracker;
