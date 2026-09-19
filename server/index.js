import express from "express";
import compression from "compression";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.json({ limit: "20kb" }));

const profile = {
  name: "Akshay Chandra",
  role: "Computer Science Student · Data Science · AI/ML",
  education: "B.Tech CSE, Netaji Subhash Engineering College (2023–2027)",
  skills: ["Python","Java","C","JavaScript","React","Tailwind","Pandas","Scikit-learn","PyTorch","SQL","Git/GitHub","Linux"],
  projects: ["Digital Twin for UAV","TB Burden Country","Jarvis Assistant","California House Prediction"],
  links: {
    github: "https://github.com/Mr-Mysterious001",
    linkedin: "https://in.linkedin.com/in/akshay-chandra-309449283"
  }
};

app.get("/api/health", (_req,res) => res.json({ok:true,service:"akshay-portfolio"}));
app.get("/api/profile", (_req,res) => res.json(profile));

app.post("/api/chat", (req,res) => {
  const q = String(req.body?.message || "").trim().toLowerCase();
  if (!q) return res.status(400).json({error:"Message is required."});

  let answer = "Ask me about Akshay’s projects, skills, education, AI/ML work, or contact details.";
  if (q.includes("project") || q.includes("work")) {
    answer = "Akshay’s featured work includes a UAV Digital Twin, TB Burden Country dashboard, Jarvis Assistant, and California House Prediction.";
  } else if (q.includes("skill") || q.includes("stack") || q.includes("tech")) {
    answer = "His stack includes Python, Java, C, JavaScript, React, Tailwind, pandas, scikit-learn, PyTorch, SQL, Git/GitHub and Linux.";
  } else if (q.includes("education") || q.includes("college") || q.includes("study")) {
    answer = "Akshay is pursuing B.Tech CSE at Netaji Subhash Engineering College from 2023 to 2027.";
  } else if (q.includes("ai") || q.includes("ml") || q.includes("data science")) {
    answer = "His current technical direction is Data Science and AI/ML, with experience across EDA, ML pipelines, regression, dashboards and research-oriented systems.";
  } else if (q.includes("contact") || q.includes("linkedin") || q.includes("github")) {
    answer = "The contact section links directly to Akshay’s LinkedIn and GitHub.";
  }
  res.json({answer});
});

const dist = path.join(__dirname, "..", "dist");
app.use(express.static(dist, { maxAge: "1y", immutable: true }));
app.get("*", (_req,res) => res.sendFile(path.join(dist, "index.html")));

app.listen(PORT, () => console.log(`Portfolio server running on http://localhost:${PORT}`));
