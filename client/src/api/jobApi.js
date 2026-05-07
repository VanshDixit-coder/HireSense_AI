import api from './authApi';

export const jobApi = {
  list: (params) => api.get('/jobs', { params }).then((res) => res.data.data),
  get: (id) => api.get(`/jobs/${id}`).then((res) => res.data.data),
  toggleSave: (id) => api.post(`/jobs/save/${id}`).then((res) => res.data.data),
  saved: () => api.get('/jobs/saved').then((res) => res.data.data),
  seed: () => api.post('/jobs/seed').then((res) => res.data.data)
};
