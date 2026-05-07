import api from './authApi';

export const resumeApi = {
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api
      .post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress
      })
      .then((res) => res.data.data);
  },
  latest: () => api.get('/resume').then((res) => res.data.data),
  remove: (id) => api.delete(`/resume/${id}`).then((res) => res.data.data)
};
