const { GoogleGenerativeAI } = require('@google/generative-ai');

let model;

function getModel() {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured');
    error.statusCode = 503;
    throw error;
  }
  if (!model) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return model;
}

function extractText(result) {
  const text = result?.response?.text?.();
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }
  return text.trim();
}

function cleanJson(text) {
  return text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
}

async function runGeminiPrompt(prompt, expectsJson = false) {
  try {
    const result = await getModel().generateContent(prompt);
    const text = extractText(result);
    if (!expectsJson) return text;
    return JSON.parse(cleanJson(text));
  } catch (err) {
    const error = new Error(
      err.status === 429 || /quota|rate/i.test(err.message)
        ? 'Gemini API rate limit reached. Please try again shortly.'
        : `Gemini request failed: ${err.message}`
    );
    error.statusCode = err.status === 429 ? 429 : 502;
    throw error;
  }
}

async function extractResumeData(rawText) {
  const prompt = `Extract the following information from this resume text and return ONLY valid JSON with no markdown:
{
  "skills": ["list of technical skills"],
  "education": [{ "degree": "", "institution": "", "year": "" }],
  "experience": [{ "title": "", "company": "", "duration": "", "description": "" }],
  "projects": [{ "name": "", "description": "", "technologies": [] }]
}
Resume text:
${rawText}`;

  const parsed = await runGeminiPrompt(prompt, true);
  return {
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    education: Array.isArray(parsed.education) ? parsed.education : [],
    experience: Array.isArray(parsed.experience) ? parsed.experience : [],
    projects: Array.isArray(parsed.projects) ? parsed.projects : []
  };
}

async function computeMatchScore(resumeData, jobDescription) {
  const prompt = `You are a hiring expert and ATS system. Given the candidate's resume data and the job description, analyze the fit and respond ONLY with valid JSON (no markdown):
{
  "matchScore": <integer 0-100>,
  "matchingSkills": ["..."],
  "missingSkills": ["..."],
  "summary": "<2-sentence assessment>"
}

Resume Data: ${JSON.stringify(resumeData)}
Job Description: ${jobDescription}`;

  const data = await runGeminiPrompt(prompt, true);
  return {
    matchScore: Number.isFinite(Number(data.matchScore)) ? Math.max(0, Math.min(100, Number(data.matchScore))) : 0,
    matchingSkills: Array.isArray(data.matchingSkills) ? data.matchingSkills : [],
    missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills : [],
    summary: data.summary || ''
  };
}

async function generateOptimizedResume(resumeData, jobDescription, userName) {
  const prompt = `You are an expert resume writer. Rewrite the following resume to be ATS-optimized for the job description provided. 
- Incorporate relevant keywords naturally from the job description
- Highlight matching experience prominently
- Keep formatting clean and professional
- Output only the full resume text, no explanations

Candidate Name: ${userName}
Original Resume Data: ${JSON.stringify(resumeData)}
Target Job Description: ${jobDescription}`;

  return runGeminiPrompt(prompt);
}

async function generateCoverLetter(resumeData, jobTitle, company, userName) {
  const prompt = `Write a professional, personalized cover letter for ${userName} applying for the ${jobTitle} role at ${company}.
Use the candidate's experience and skills below. Keep it to 3 paragraphs. Output only the cover letter text.

Resume Data: ${JSON.stringify(resumeData)}`;

  return runGeminiPrompt(prompt);
}

async function getSkillGapAnalysis(missingSkills) {
  const prompt = `For each of the following missing skills, provide a learning recommendation. Respond ONLY with valid JSON (no markdown):
[
  {
    "skill": "...",
    "recommendedCourse": "...",
    "platform": "Coursera/Udemy/YouTube/freeCodeCamp",
    "estimatedTime": "..."
  }
]

Missing skills: ${JSON.stringify(missingSkills)}`;

  const data = await runGeminiPrompt(prompt, true);
  return Array.isArray(data) ? data : [];
}

function getJobRecommendations(userSkills = [], allJobs = []) {
  const normalized = new Set(userSkills.map((skill) => String(skill).toLowerCase()));
  return allJobs
    .map((job) => {
      const required = job.requiredSkills || [];
      const matches = required.filter((skill) => normalized.has(String(skill).toLowerCase()));
      const overlap = required.length ? Math.round((matches.length / required.length) * 100) : 0;
      return { job, overlap, matchingSkills: matches };
    })
    .filter((item) => item.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 5);
}

module.exports = {
  computeMatchScore,
  generateOptimizedResume,
  generateCoverLetter,
  getSkillGapAnalysis,
  getJobRecommendations,
  extractResumeData
};
