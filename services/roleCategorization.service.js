const categorizeRole = (transcript) => {
  const lowerTranscript = transcript.toLowerCase();

  // Define keywords for different roles
  const roleKeywords = {
    "Software Engineer": ["javascript", "python", "java", "react", "node.js", "backend", "frontend", "developer", "engineer", "coding", "algorithm", "data structure"],
    "Project Manager": ["project", "manager", "scrum", "agile", "roadmap", "stakeholder", "deadline", "budget", "team lead", "planning"],
    "Data Analyst": ["data", "analysis", "sql", "excel", "tableau", "power bi", "statistics", "reporting", "insights"],
    "Marketing Specialist": ["marketing", "seo", "sem", "social media", "campaign", "content", "brand", "digital", "analytics"],
    "Customer Support": ["customer", "support", "service", "client", "troubleshoot", "help desk", "communication", "resolution"]
  };

  let matchedRole = "General";
  let maxMatches = 0;

  for (const role in roleKeywords) {
    let currentMatches = 0;
    for (const keyword of roleKeywords[role]) {
      if (lowerTranscript.includes(keyword)) {
        currentMatches++;
      }
    }
    if (currentMatches > maxMatches) {
      maxMatches = currentMatches;
      matchedRole = role;
    }
  }

  return matchedRole;
};

module.exports = { categorizeRole };

