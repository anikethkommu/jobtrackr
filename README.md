# ⚡ JobTrackr — Smart Job Application Tracker + Resume Optimizer

A full-featured React web app to track job applications and optimize your resume for ATS systems.  
Built with **React, CSS3, and localStorage** — no backend, no database needed.

---

## ✨ Features

### 📋 Job Tracker
- Add applications with company, role, date, status, and notes
- Full **CRUD** — Create, Read, Update, Delete
- Live stats dashboard (Total / Applied / Interview / Offer / Rejected)
- **Search** by company or role
- **Filter** by status and **sort** by date or company
- Data saved to browser `localStorage` — persists across refreshes

### 🎯 Resume Optimizer (ATS Analyzer)
- Upload a `.txt` resume file or paste text directly
- Paste any job description
- Get an **ATS match score (0–100%)**
- See matched keywords ✅ and missing keywords ❌
- Critical tech skills highlighted separately 🚨
- Top repeated keywords from the job description
- Actionable improvement tips with colour-coded warnings

---

## 📁 Project Structure

```
jobtrackr/
├── public/
│   └── index.html              ← HTML shell (don't edit)
├── src/
│   ├── components/
│   │   ├── JobTracker.jsx      ← Job tracking tab
│   │   ├── ResumeOptimizer.jsx ← Resume optimizer tab
│   │   ├── JobCard.jsx         ← Single job card UI
│   │   ├── JobModal.jsx        ← Add / Edit modal
│   │   ├── StatsBar.jsx        ← Dashboard stat cards
│   │   └── Toast.jsx           ← Pop-up notifications
│   ├── hooks/
│   │   └── useLocalStorage.js  ← Custom hook for persistence
│   ├── utils/
│   │   └── atsAnalyzer.js      ← Keyword matching engine
│   ├── App.jsx                 ← Root component + tab nav
│   ├── App.css                 ← All styles
│   └── index.js                ← React entry point
└── package.json
```

---

## 🚀 How to Run

### Step 1 — Install Node.js
Download from [nodejs.org](https://nodejs.org) → choose **LTS** version → install.

Verify: open terminal and run:
```bash
node --version   # e.g. v20.11.0
npm --version    # e.g. 10.2.4
```

### Step 2 — Install & Start
```bash
# Go into the project folder
cd jobtrackr

# Install dependencies (only needed once)
npm install

# Start the development server
npm start
```

App opens at **http://localhost:3000** 🎉

### Step 3 — Build for Production
```bash
npm run build
```
Creates an optimized `build/` folder you can host anywhere.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI components, state management |
| CSS3 (custom) | Styling, Grid, Flexbox, animations |
| localStorage API | Persistent data storage (no backend) |
| FileReader API | Reading uploaded .txt resume files |
| Google Fonts | Outfit + Plus Jakarta Sans |

---

## 🧠 How the ATS Analyzer Works

1. **Tokenizes** the job description into individual keywords and phrases
2. **Removes stop words** (the, and, is, etc.) to keep only meaningful terms
3. **Checks** which keywords appear in the resume text
4. **Categorizes** missing keywords: Critical (tech skills) vs Soft skills
5. **Calculates score**: `(matched / total JD keywords) × 100`
6. **Generates tips** by checking resume structure, length, action verbs, and numbers

---

## 🔮 Future Improvements

- [ ] PDF resume parsing (using pdf.js library)
- [ ] Export applications to CSV
- [ ] Dark mode
- [ ] Kanban board view
- [ ] Backend with Node.js + MongoDB
- [ ] Interview date reminders

---

## 📄 License

MIT License — free to use and modify.
