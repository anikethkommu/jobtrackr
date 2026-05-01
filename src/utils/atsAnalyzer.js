
const STOP_WORDS = new Set([
  "a","an","the","and","or","but","in","on","at","to","for",
  "of","with","by","from","is","are","was","were","be","been",
  "being","have","has","had","do","does","did","will","would",
  "could","should","may","might","shall","can","need","dare",
  "ought","used","able","this","that","these","those","it","its",
  "we","our","you","your","they","their","he","his","she","her",
  "i","my","me","us","them","who","which","what","when","where",
  "how","why","all","any","both","each","few","more","most",
  "other","some","such","no","not","only","same","so","than",
  "too","very","just","also","as","if","about","above","after",
  "before","between","into","through","during","including",
  "across","behind","within","without","following","per",
]);


const TECH_KEYWORDS = new Set([
  "react","angular","vue","javascript","typescript","python","java",
  "node","nodejs","express","sql","mysql","postgresql","mongodb",
  "aws","azure","gcp","docker","kubernetes","git","github","ci/cd",
  "rest","api","graphql","html","css","sass","tailwind","redux",
  "figma","agile","scrum","jira","linux","bash","c++","c#","php",
  "spring","django","flask","firebase","tensorflow","pytorch",
  "machine learning","deep learning","data science","devops",
  "microservices","cloud","testing","jest","cypress","webpack",
]);

const SOFT_SKILL_KEYWORDS = new Set([
  "leadership","communication","teamwork","collaboration","problem solving",
  "analytical","critical thinking","adaptability","time management",
  "project management","mentoring","presentation","stakeholder",
  "cross-functional","detail-oriented","self-motivated","proactive",
]);


//  MAIN FUNCTION: analyzeResume

export function analyzeResume(resumeText, jobDescription) {
  if (!resumeText || !jobDescription) return null;

  // Lowercase everything for case-insensitive comparison
  const resumeLower = resumeText.toLowerCase();
  const jdLower     = jobDescription.toLowerCase();

  // ── Step 1: Extract meaningful words from the job description ──
  const jdWords = tokenize(jdLower);
  const jdKeywords = jdWords.filter(w => !STOP_WORDS.has(w) && w.length > 2);

  // Remove duplicates using a Set
  const uniqueJdKeywords = [...new Set(jdKeywords)];

  // ── Step 2: Check which JD keywords exist in the resume ──
  const matched = [];
  const missing = [];

  uniqueJdKeywords.forEach(keyword => {
    // Check if the keyword (could be multi-word phrase) appears in resume
    if (resumeLower.includes(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  });

  // ── Step 3: Calculate score ──
  const total = uniqueJdKeywords.length || 1; // avoid divide-by-zero
  const score = Math.round((matched.length / total) * 100);

  // ── Step 4: Categorize missing keywords by priority ──
  const criticalMissing = missing.filter(k => TECH_KEYWORDS.has(k));
  const softMissing     = missing.filter(k => SOFT_SKILL_KEYWORDS.has(k));
  const otherMissing    = missing.filter(
    k => !TECH_KEYWORDS.has(k) && !SOFT_SKILL_KEYWORDS.has(k)
  );

  // ── Step 5: Check resume structure tips ──
  const tips = generateTips(resumeText, resumeLower, score);

  // ── Step 6: Word frequency in JD (most repeated = most important) ──
  const topKeywords = getTopFrequent(jdKeywords, 10);

  return {
    score,
    matched,
    missing,
    criticalMissing,
    softMissing,
    otherMissing,
    topKeywords,
    tips,
    totalJdKeywords: uniqueJdKeywords.length,
  };
}


function tokenize(text) {
  // First check for 2-word tech phrases before splitting
  const phrases = [];
  const phrasesToCheck = [...TECH_KEYWORDS, ...SOFT_SKILL_KEYWORDS].filter(k => k.includes(" "));

  phrasesToCheck.forEach(phrase => {
    if (text.includes(phrase)) phrases.push(phrase);
  });

  // Then split into single words, removing punctuation
  const words = text
    .replace(/[^\w\s]/g, " ")   // remove punctuation
    .split(/\s+/)                // split on whitespace
    .filter(Boolean);            // remove empty strings

  return [...words, ...phrases];
}


function getTopFrequent(words, n) {
  const freq = {};
  words.forEach(w => {
    if (!STOP_WORDS.has(w) && w.length > 2) {
      freq[w] = (freq[w] || 0) + 1;
    }
  });

  // Sort by frequency descending, take top N
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}


function generateTips(rawText, lowerText, score) {
  const tips = [];

  // Check resume length (ideal: 400–800 words)
  const wordCount = rawText.trim().split(/\s+/).length;
  if (wordCount < 200) {
    tips.push({ type: "warning", text: "Resume seems too short. Aim for at least 300–500 words to cover your experience fully." });
  } else if (wordCount > 1000) {
    tips.push({ type: "warning", text: "Resume is quite long. ATS systems prefer concise resumes. Consider trimming to 1–2 pages." });
  } else {
    tips.push({ type: "success", text: `Good resume length — ${wordCount} words.` });
  }

  // Check for common sections
  const sections = ["experience", "education", "skills", "projects"];
  sections.forEach(section => {
    if (!lowerText.includes(section)) {
      tips.push({ type: "warning", text: `Missing "${section.toUpperCase()}" section. ATS systems look for standard section headers.` });
    }
  });

  // Check for action verbs (strong resume language)
  const actionVerbs = ["developed","built","designed","implemented","led","managed",
    "created","improved","optimized","deployed","collaborated","delivered",
    "increased","reduced","achieved","launched"];
  const foundVerbs = actionVerbs.filter(v => lowerText.includes(v));
  if (foundVerbs.length < 3) {
    tips.push({ type: "warning", text: "Use more action verbs (e.g. 'Developed', 'Led', 'Optimized') to make bullet points stronger." });
  } else {
    tips.push({ type: "success", text: `Good use of action verbs: ${foundVerbs.slice(0,4).join(", ")} etc.` });
  }

  // Check for quantified achievements (numbers = good)
  const hasNumbers = /\d+/.test(rawText);
  if (!hasNumbers) {
    tips.push({ type: "warning", text: "Add numbers to your achievements (e.g. 'Improved performance by 40%'). Quantified results stand out to ATS and recruiters." });
  } else {
    tips.push({ type: "success", text: "Great — you have quantified achievements with numbers." });
  }

  // Check for contact info
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(lowerText);
  if (!hasEmail) {
    tips.push({ type: "warning", text: "No email address detected. Make sure your contact info is included as plain text (not inside an image)." });
  }

  // Score-based tip
  if (score < 40) {
    tips.push({ type: "error", text: "Low ATS match score. Carefully read the job description and naturally add the missing keywords to your resume." });
  } else if (score < 70) {
    tips.push({ type: "warning", text: "Moderate match. Add more relevant keywords from the 'Missing Keywords' list below." });
  } else {
    tips.push({ type: "success", text: "Strong ATS match! Your resume aligns well with this job description." });
  }

  return tips;
}

// ── Score label helper (used in UI) ──
export function getScoreLabel(score) {
  if (score >= 80) return { label: "Excellent", color: "#22c55e" };
  if (score >= 60) return { label: "Good",      color: "#84cc16" };
  if (score >= 40) return { label: "Fair",       color: "#f97316" };
  return               { label: "Weak",          color: "#ef4444" };
}
