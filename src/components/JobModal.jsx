

import { useState, useEffect } from "react";

// Default empty form values
const EMPTY_FORM = {
  company: "",
  role: "",
  status: "Applied",
  date: "",
  notes: "",
};

function JobModal({ isOpen, initialData, onSave, onClose }) {
  // Local state for form fields
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  // When modal opens, fill form with existing data (edit)
  // or reset to empty (add)
  useEffect(() => {
    if (isOpen) {
      setForm(initialData || EMPTY_FORM);
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Don't render anything if modal is closed
  if (!isOpen) return null;


  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field when user starts typing
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  // ── Validate before saving ──
  function validate() {
    const newErrors = {};
    if (!form.company.trim()) newErrors.company = "Company name is required";
    if (!form.role.trim())    newErrors.role    = "Job role is required";
    return newErrors;
  }

  // ── Submit the form ──
  function handleSubmit() {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Pass the form data up to the parent component
    onSave({
      ...form,
      date: form.date || new Date().toISOString().split("T")[0], // default to today
    });
  }

  // ── Close when clicking dark overlay ──
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  const isEditing = !!initialData;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-card">

        <h3>{isEditing ? "✏️ Edit Application" : "➕ Add Application"}</h3>

        {/* Company */}
        <div className="input-group">
          <label>Company Name</label>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="e.g. Google"
            autoFocus
          />
          {errors.company && <span className="field-error">{errors.company}</span>}
        </div>

        {/* Role */}
        <div className="input-group">
          <label>Job Role</label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
          />
          {errors.role && <span className="field-error">{errors.role}</span>}
        </div>

        {/* Date + Status in a row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div className="input-group">
            <label>Date Applied</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Applied">🔵 Applied</option>
              <option value="Interview">🟠 Interview</option>
              <option value="Offer">🟢 Offer</option>
              <option value="Rejected">🔴 Rejected</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="input-group">
          <label>Notes (optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="e.g. Referral from John, 2 rounds expected..."
          />
        </div>

        {/* Buttons */}
        <div className="modal-actions">
          <button className="btn-save"   onClick={handleSubmit}>
            {isEditing ? "Save Changes" : "Add Application"}
          </button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>

      </div>
    </div>
  );
}

export default JobModal;
