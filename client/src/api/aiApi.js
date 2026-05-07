import api from './authApi';

export const aiApi = {
  matchScore: (jobId, deep = true) => api.post('/ai/match-score', { jobId, deep }).then((res) => res.data.data),
  generateResume: (jobId) => api.post('/ai/generate-resume', { jobId }).then((res) => res.data.data),
  generateCoverLetter: (jobId) => api.post('/ai/generate-cover-letter', { jobId }).then((res) => res.data.data),
  skillGap: (payload) => api.post('/ai/skill-gap', payload).then((res) => res.data.data),
  recommendations: () => api.get('/ai/recommendations').then((res) => res.data.data),
  applications: () => api.get('/ai/applications').then((res) => res.data.data),
  deleteApplication: (id) => api.delete(`/ai/applications/${id}`).then((res) => res.data.data)
};
