import type { ExtractedSkills, CompanyInfo, RoundMapping, ChecklistRound, DayPlan, AnalysisEntry } from "./types";

const SKILL_CHECKS: Record<keyof Omit<ExtractedSkills, "other">, [string, RegExp][]> = {
  coreCS: [
    ["DSA", /\b(dsa|data\s*structure|algorithm)\b/i],
    ["OOP", /\b(oop|object[\s-]oriented)\b/i],
    ["DBMS", /\bdbms\b/i],
    ["OS", /\boperating\s*system\b/i],
    ["Networks", /\b(computer\s*network|networking)\b/i],
  ],
  languages: [
    ["Java", /\bjava\b(?!script)/i],
    ["Python", /\bpython\b/i],
    ["JavaScript", /\bjavascript\b/i],
    ["TypeScript", /\btypescript\b/i],
    ["C++", /\bc\+\+\b/i],
    ["C#", /\bc#\b/i],
    ["Go", /\bgolang\b|\bgo\s+(language|programming)\b/i],
  ],
  web: [
    ["React", /\breact\b/i],
    ["Next.js", /\bnext\.?js\b/i],
    ["Node.js", /\bnode\.?js\b/i],
    ["Express", /\bexpress(\.js)?\b/i],
    ["REST", /\brest(\s*api|ful)\b/i],
    ["GraphQL", /\bgraphql\b/i],
  ],
  data: [
    ["SQL", /(?<!\w)sql\b/i],
    ["MongoDB", /\bmongodb\b/i],
    ["PostgreSQL", /\bpostgres(ql)?\b/i],
    ["MySQL", /\bmysql\b/i],
    ["Redis", /\bredis\b/i],
  ],
  cloud: [
    ["AWS", /\baws\b/i],
    ["Azure", /\bazure\b/i],
    ["GCP", /\b(gcp|google\s*cloud)\b/i],
    ["Docker", /\bdocker\b/i],
    ["Kubernetes", /\b(kubernetes|k8s)\b/i],
    ["CI/CD", /\bci\/?cd\b/i],
    ["Linux", /\blinux\b/i],
  ],
  testing: [
    ["Selenium", /\bselenium\b/i],
    ["Cypress", /\bcypress\b/i],
    ["Playwright", /\bplaywright\b/i],
    ["JUnit", /\bjunit\b/i],
    ["PyTest", /\bpytest\b/i],
  ],
};

export function extractSkills(jdText: string): ExtractedSkills {
  const result: ExtractedSkills = { coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: [] };

  for (const [category, patterns] of Object.entries(SKILL_CHECKS)) {
    for (const [name, regex] of patterns) {
      if (regex.test(jdText)) {
        (result as any)[category].push(name);
      }
    }
  }

  const allSkills = [...result.coreCS, ...result.languages, ...result.web, ...result.data, ...result.cloud, ...result.testing];
  if (allSkills.length === 0) {
    result.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
  }

  return result;
}

export function calculateBaseScore(skills: ExtractedSkills, company: string, role: string, jdText: string): number {
  let score = 35;
  const cats: (keyof Omit<ExtractedSkills, "other">)[] = ["coreCS", "languages", "web", "data", "cloud", "testing"];
  for (const cat of cats) {
    if (skills[cat].length > 0) score += 5;
  }
  if (company.trim()) score += 10;
  if (role.trim()) score += 10;
  if (jdText.length > 800) score += 10;
  return Math.min(score, 100);
}

export function calculateFinalScore(baseScore: number, confidenceMap: Record<string, "know" | "practice">): number {
  let adj = 0;
  for (const val of Object.values(confidenceMap)) {
    adj += val === "know" ? 2 : -2;
  }
  return Math.max(0, Math.min(100, baseScore + adj));
}

const KNOWN_ENTERPRISES = new Set([
  "amazon", "google", "microsoft", "apple", "meta", "facebook", "infosys", "tcs",
  "wipro", "hcl", "cognizant", "accenture", "ibm", "oracle", "sap", "deloitte",
  "capgemini", "tech mahindra", "flipkart", "walmart", "uber", "netflix", "adobe",
  "salesforce", "paypal", "stripe", "intel", "cisco", "qualcomm",
]);

const KNOWN_MIDSIZE = new Set([
  "razorpay", "cred", "swiggy", "zomato", "phonepe", "paytm", "ola", "byju",
  "unacademy", "meesho", "groww", "slice", "jupiter", "freshworks", "zoho",
]);

export function inferCompanyInfo(company: string): CompanyInfo | null {
  if (!company.trim()) return null;
  const lower = company.toLowerCase().trim();
  let sizeCategory: CompanyInfo["sizeCategory"] = "Startup";
  if (KNOWN_ENTERPRISES.has(lower)) sizeCategory = "Enterprise";
  else if (KNOWN_MIDSIZE.has(lower)) sizeCategory = "Mid-size";

  const hiringFocus = sizeCategory === "Enterprise"
    ? "Structured DSA rounds, core CS fundamentals, and system design. Strong emphasis on problem-solving methodology."
    : sizeCategory === "Mid-size"
    ? "Balanced approach — practical coding, system thinking, and product understanding. Values ownership mindset."
    : "Practical problem solving, stack depth, and ability to ship. Culture fit matters significantly.";

  return {
    name: company.trim(),
    industry: "Technology Services",
    sizeCategory,
    hiringFocus,
  };
}

export function generateRoundMapping(skills: ExtractedSkills, companyInfo: CompanyInfo | null): RoundMapping[] {
  const isEnterprise = companyInfo?.sizeCategory === "Enterprise";
  const isStartup = companyInfo?.sizeCategory === "Startup";
  const hasWeb = skills.web.length > 0;
  const hasDSA = skills.coreCS.some(s => s === "DSA");

  if (isStartup && hasWeb) {
    return [
      { roundTitle: "Round 1: Practical Coding", focusAreas: ["Build a small feature", "Code quality", ...skills.web.slice(0, 2)], whyItMatters: "Startups assess your ability to ship working code quickly." },
      { roundTitle: "Round 2: System Discussion", focusAreas: ["Architecture decisions", "Trade-offs", "Scalability basics"], whyItMatters: "They want to see how you think about building real products." },
      { roundTitle: "Round 3: Culture Fit", focusAreas: ["Ownership", "Communication", "Learning mindset"], whyItMatters: "Small teams need people who align with their pace and values." },
    ];
  }

  return [
    { roundTitle: "Round 1: Online Test", focusAreas: ["Aptitude", "Basic DSA", "MCQs on core CS"], whyItMatters: "Filters candidates on fundamentals. Speed and accuracy matter." },
    { roundTitle: "Round 2: Technical Interview", focusAreas: [hasDSA ? "DSA problem solving" : "Coding", "Core CS concepts", "Time complexity"], whyItMatters: "Deep assessment of your problem-solving approach and CS depth." },
    { roundTitle: "Round 3: Tech + Projects", focusAreas: ["Project walkthroughs", ...skills.web.slice(0, 2), ...skills.languages.slice(0, 1)], whyItMatters: "Validates hands-on experience and your ability to explain technical decisions." },
    { roundTitle: "Round 4: HR / Managerial", focusAreas: ["Behavioral questions", "Conflict resolution", "Career goals"], whyItMatters: "Assesses your communication, maturity, and cultural alignment." },
  ];
}

export function generateChecklist(skills: ExtractedSkills, rounds: RoundMapping[]): ChecklistRound[] {
  return rounds.map(round => {
    const items: string[] = [];
    if (round.roundTitle.includes("Online") || round.roundTitle.includes("Aptitude")) {
      items.push("Practice 20 aptitude questions", "Solve 10 easy DSA problems", "Review basic data structures", "Time yourself on MCQs", "Revise OS and DBMS basics");
    } else if (round.roundTitle.includes("Technical") || round.roundTitle.includes("Coding")) {
      items.push("Solve 5 medium DSA problems", "Review sorting and searching algorithms", "Practice explaining your approach aloud");
      if (skills.languages.length > 0) items.push(`Revise ${skills.languages[0]} syntax and idioms`);
      if (skills.coreCS.length > 0) items.push(`Review ${skills.coreCS.join(", ")} concepts`);
      items.push("Practice whiteboard coding", "Study time/space complexity analysis");
    } else if (round.roundTitle.includes("Project") || round.roundTitle.includes("System")) {
      items.push("Prepare 2-minute project walkthrough", "Know your tech stack trade-offs", "Be ready for 'Why did you choose X?' questions");
      if (skills.web.length > 0) items.push(`Review ${skills.web.join(", ")} concepts`);
      items.push("Draw a simple system diagram for your main project", "Prepare for follow-up questions on scale");
    } else if (round.roundTitle.includes("HR") || round.roundTitle.includes("Culture")) {
      items.push("Prepare STAR method answers", "Research company values and mission", "Prepare 'Tell me about yourself'", "Think about your strengths/weaknesses", "Have questions ready for the interviewer");
    } else {
      items.push("Review fundamentals", "Practice common questions", "Prepare project explanations", "Research the company", "Rest well before the round");
    }
    return { roundTitle: round.roundTitle, items };
  });
}

export function generate7DayPlan(skills: ExtractedSkills): DayPlan[] {
  const hasWeb = skills.web.length > 0;
  const hasCloud = skills.cloud.length > 0;
  const hasTesting = skills.testing.length > 0;

  return [
    {
      day: "Day 1", focus: "Foundations",
      tasks: ["Review OOP concepts", "Brush up on DBMS normalization", "Revise OS scheduling basics", "Read about networking layers"],
    },
    {
      day: "Day 2", focus: "Core CS Deep Dive",
      tasks: ["Solve 5 easy DSA problems", "Study arrays, strings, linked lists", "Review time complexity", "Practice explaining solutions aloud"],
    },
    {
      day: "Day 3", focus: "DSA Practice",
      tasks: ["Solve 5 medium problems (trees, graphs)", "Study recursion and backtracking", "Practice stack and queue problems", "Analyze space complexity"],
    },
    {
      day: "Day 4", focus: "Advanced Coding",
      tasks: ["Solve 3 medium-hard problems", "Practice dynamic programming basics", "Review greedy algorithms", "Timed coding session (45 min)"],
    },
    {
      day: "Day 5", focus: "Projects & Stack",
      tasks: [
        "Polish project descriptions for resume",
        hasWeb ? `Review ${skills.web.join(", ")} fundamentals` : "Review your tech stack deeply",
        "Prepare 2-min project pitch",
        hasCloud ? "Review cloud/deployment concepts" : "Document your project architecture",
      ],
    },
    {
      day: "Day 6", focus: "Mock Interview",
      tasks: [
        "Do 1 full mock coding interview",
        "Practice behavioral questions (STAR)",
        hasTesting ? "Review testing fundamentals" : "Review code quality practices",
        "Record yourself and review",
      ],
    },
    {
      day: "Day 7", focus: "Revision & Rest",
      tasks: ["Review weak areas from practice", "Re-solve 3 problems you struggled with", "Light reading on company/role", "Rest well — confidence matters"],
    },
  ];
}

const QUESTION_BANK: Record<string, string[]> = {
  DSA: ["How would you optimize search in sorted data?", "Explain the difference between BFS and DFS with use cases."],
  OOP: ["Explain SOLID principles with examples.", "What is the difference between composition and inheritance?"],
  DBMS: ["What is normalization? Explain up to 3NF.", "When would you choose NoSQL over SQL?"],
  OS: ["Explain process vs thread with real examples.", "What is deadlock and how can it be prevented?"],
  Networks: ["Explain TCP/IP vs UDP with use cases.", "What happens when you type a URL in a browser?"],
  Java: ["Explain JVM architecture briefly.", "What are the differences between HashMap and ConcurrentHashMap?"],
  Python: ["How does Python handle memory management?", "Explain generators and when to use them."],
  JavaScript: ["Explain closures with a practical example.", "What is the event loop in JavaScript?"],
  TypeScript: ["How do generics improve type safety?", "Explain union vs intersection types."],
  React: ["Explain state management options in React.", "How does the virtual DOM work?"],
  "Node.js": ["How does Node.js handle concurrent requests?", "Explain middleware in Express."],
  SQL: ["Explain indexing and when it helps.", "Write a query to find the second highest salary."],
  MongoDB: ["When would you embed vs reference documents?", "Explain aggregation pipeline stages."],
  AWS: ["Explain the difference between EC2 and Lambda.", "How would you set up a basic CI/CD pipeline on AWS?"],
  Docker: ["What is the difference between an image and a container?", "Explain multi-stage Docker builds."],
  Communication: ["How do you explain a technical concept to a non-technical person?", "Describe a time you resolved a team conflict."],
  "Problem solving": ["Walk through your approach to solving a new problem.", "How do you handle ambiguous requirements?"],
};

export function generateQuestions(skills: ExtractedSkills): string[] {
  const allSkills = [...skills.coreCS, ...skills.languages, ...skills.web, ...skills.data, ...skills.cloud, ...skills.testing, ...skills.other];
  const questions: string[] = [];

  for (const skill of allSkills) {
    const bank = QUESTION_BANK[skill];
    if (bank) {
      questions.push(...bank);
    }
  }

  if (questions.length === 0) {
    questions.push(
      "Tell me about yourself and your technical background.",
      "Walk through a project you're most proud of.",
      "How do you approach learning a new technology?",
      "Describe a bug you spent a long time debugging.",
      "What is your understanding of version control?",
    );
  }

  return questions.slice(0, 10);
}

export function getAllSkillNames(skills: ExtractedSkills): string[] {
  return [...skills.coreCS, ...skills.languages, ...skills.web, ...skills.data, ...skills.cloud, ...skills.testing, ...skills.other];
}

export function runAnalysis(company: string, role: string, jdText: string): AnalysisEntry {
  const skills = extractSkills(jdText);
  const baseScore = calculateBaseScore(skills, company, role, jdText);
  const allNames = getAllSkillNames(skills);
  const confidenceMap: Record<string, "know" | "practice"> = {};
  for (const s of allNames) confidenceMap[s] = "practice";
  const companyInfo = inferCompanyInfo(company);
  const roundMapping = generateRoundMapping(skills, companyInfo);
  const checklist = generateChecklist(skills, roundMapping);
  const plan7Days = generate7DayPlan(skills);
  const questions = generateQuestions(skills);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    company,
    role,
    jdText,
    extractedSkills: skills,
    companyInfo,
    roundMapping,
    checklist,
    plan7Days,
    questions,
    baseScore,
    skillConfidenceMap: confidenceMap,
    finalScore: calculateFinalScore(baseScore, confidenceMap),
    updatedAt: new Date().toISOString(),
  };
}
