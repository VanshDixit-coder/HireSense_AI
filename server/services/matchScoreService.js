function quickMatchScore(userSkills = [], jobRequiredSkills = []) {
  if (!jobRequiredSkills.length) {
    return { score: 0, matching: [], missing: [] };
  }

  const userSet = new Set(userSkills.map((skill) => String(skill).toLowerCase()));
  const matching = jobRequiredSkills.filter((skill) => userSet.has(String(skill).toLowerCase()));
  const missing = jobRequiredSkills.filter((skill) => !userSet.has(String(skill).toLowerCase()));
  const score = Math.round((matching.length / jobRequiredSkills.length) * 100);
  return { score, matching, missing };
}

module.exports = { quickMatchScore };
