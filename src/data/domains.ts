import type { InternshipDomain, InternshipBatch } from "@/types";

/** Mock catalogue. Replaced by GET /internship-domains in Phase 3. */
export const domains: InternshipDomain[] = [
  {
    id: "dom-001",
    slug: "full-stack-python",
    title: "Full Stack Python Development",
    description:
      "Build and ship a complete web application — FastAPI services, a React front end, PostgreSQL persistence and a deployed live demo.",
    duration: "4 weeks",
    difficulty: "intermediate",
    status: "active",
    icon: "code",
    task_count: 4,
    skills: ["Python", "FastAPI", "React", "PostgreSQL", "REST APIs", "Git"],
    outcomes: [
      "Design and expose a REST API with authentication",
      "Model relational data and write efficient queries",
      "Connect a React front end to a live backend",
      "Deploy a full stack application end to end",
    ],
  },
  {
    id: "dom-002",
    slug: "web-development",
    title: "Web Development",
    description:
      "Master modern front-end engineering — semantic markup, responsive layout systems, component architecture and production deployment.",
    duration: "4 weeks",
    difficulty: "beginner",
    status: "active",
    icon: "layout",
    task_count: 4,
    skills: ["HTML", "CSS", "JavaScript", "React", "Responsive Design", "Vercel"],
    outcomes: [
      "Build accessible, responsive interfaces from a design",
      "Structure a component library that scales",
      "Handle state and data fetching in React",
      "Ship a production site with a custom domain",
    ],
  },
  {
    id: "dom-003",
    slug: "cyber-security",
    title: "Cyber Security",
    description:
      "Work through practical security engineering — threat modelling, vulnerability assessment, secure coding practice and incident documentation.",
    duration: "4 weeks",
    difficulty: "advanced",
    status: "active",
    icon: "shield",
    task_count: 4,
    skills: ["Threat Modelling", "OWASP Top 10", "Network Security", "Linux", "Reporting"],
    outcomes: [
      "Run a structured vulnerability assessment",
      "Identify and remediate OWASP Top 10 issues",
      "Harden a Linux server against common attacks",
      "Write a professional security assessment report",
    ],
  },
  {
    id: "dom-004",
    slug: "generative-ai",
    title: "Generative AI",
    description:
      "Build applications on top of large language models — prompt design, retrieval augmented generation, evaluation and cost-aware deployment.",
    duration: "4 weeks",
    difficulty: "intermediate",
    status: "active",
    icon: "sparkles",
    task_count: 4,
    skills: ["Python", "LLM APIs", "RAG", "Vector Databases", "Prompt Engineering"],
    outcomes: [
      "Design prompts that produce reliable structured output",
      "Build a retrieval augmented generation pipeline",
      "Evaluate model output quality systematically",
      "Ship an LLM-backed application to production",
    ],
  },
  {
    id: "dom-005",
    slug: "agentic-ai",
    title: "Agentic AI",
    description:
      "Go beyond single prompts — design autonomous agents with tool use, memory, multi-step planning and human-in-the-loop control.",
    duration: "6 weeks",
    difficulty: "advanced",
    status: "active",
    icon: "bot",
    task_count: 4,
    skills: ["Agent Architecture", "Tool Calling", "Orchestration", "Python", "Evaluation"],
    outcomes: [
      "Architect an agent loop with tool calling",
      "Give an agent persistent memory and context control",
      "Add guardrails and human approval checkpoints",
      "Measure agent reliability across real tasks",
    ],
  },
  {
    id: "dom-006",
    slug: "data-science",
    title: "Data Science",
    description:
      "Turn raw datasets into decisions — cleaning, exploratory analysis, statistical modelling and communicating findings to a business audience.",
    duration: "4 weeks",
    difficulty: "intermediate",
    status: "active",
    icon: "chart",
    task_count: 4,
    skills: ["Python", "pandas", "NumPy", "Visualisation", "Statistics", "Jupyter"],
    outcomes: [
      "Clean and reshape messy real-world data",
      "Run exploratory analysis that finds real signal",
      "Build and validate a predictive model",
      "Present findings clearly to non-technical stakeholders",
    ],
  },
];

export const batches: InternshipBatch[] = domains.map((d, i) => ({
  id: `batch-${String(i + 1).padStart(3, "0")}`,
  domain_id: d.id,
  batch_name: `${d.title} — Batch 01`,
  start_date: "2026-09-01T00:00:00Z",
  end_date: "2026-09-29T00:00:00Z",
  status: "upcoming",
  seats_left: 40 - i * 3,
}));

export const getDomainBySlug = (slug: string) =>
  domains.find((d) => d.slug === slug) ?? null;

export const getBatchForDomain = (domainId: string) =>
  batches.find((b) => b.domain_id === domainId) ?? null;
