import axios from 'axios';

const api = axios.create({
  baseURL:'https://jobmate-backend-p47g.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jobmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('jobmate_token');
        localStorage.removeItem('jobmate_user');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  getFeatured: () => api.get('/jobs/featured'),
  getLatest: () => api.get('/jobs/latest'),
  getCategories: () => api.get('/jobs/categories'),
  getRecommended: () => api.get('/jobs/recommended')
};

export const companiesAPI = {
  getAll: (params) => api.get('/companies', { params }),
  getById: (id) => api.get(`/companies/${id}`),
  create: (formData) => api.post('/companies', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/companies/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/companies/${id}`)
};

export const applicationsAPI = {
  apply: (data) => api.post('/applications', data),
  getMy: () => api.get('/applications/my'),
  getById: (id) => api.get(`/applications/${id}`),
  checkStatus: (jobId) => api.get(`/applications/check/${jobId}`),
  getMyAppliedIds: () => api.get('/applications/my-applied-ids')
};

export const savedJobsAPI = {
  save: (jobId) => api.post(`/saved-jobs/${jobId}`),
  remove: (jobId) => api.delete(`/saved-jobs/${jobId}`),
  getAll: () => api.get('/saved-jobs'),
  checkIsSaved: (jobId) => api.get(`/saved-jobs/check/${jobId}`)
};

export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  analyze: (data) => {
    if (data instanceof FormData) {
      return api.post('/resume/analyze', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/resume/analyze', data);
  },
  jobMatch: (data) => api.post('/resume/job-match', data),
  getMyResumes: () => api.get('/resume/my')
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllJobs: (params) => api.get('/admin/jobs', { params }),
  createJob: (data) => api.post('/admin/jobs', data),
  updateJob: (id, data) => api.put(`/admin/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/admin/jobs/${id}`),
  updateJobStatus: (id, status) => api.patch(`/admin/jobs/${id}/status`, { status }),
  bulkUploadJobsJson: (data) => {
    if (data instanceof FormData) {
      return api.post('/admin/jobs/bulk-upload-json', data, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return api.post('/admin/jobs/bulk-upload-json', data);
  },
  getAllUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (id, data) => api.patch(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllApplications: (params) => api.get('/admin/applications', { params }),
  updateApplicationStatus: (id, data) => api.patch(`/admin/applications/${id}/status`, data)
};

export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: "https://jobmate-backend-p47g.onrender.com/api",
//   timeout: 30000,
//   headers: {
//     "Content-Type": "application/json"
//   }
// });

// // Attach token to requests
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("jobmate_token");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Handle API errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       const currentPath = window.location.pathname;

//       if (
//         currentPath !== "/login" &&
//         currentPath !== "/register"
//       ) {
//         localStorage.removeItem("jobmate_token");
//         localStorage.removeItem("jobmate_user");

//         // Redirect only if your application requires it.
//         // window.location.href = "/login";
//       }
//     }

//     console.error(
//       "API Error:",
//       error.response?.status,
//       error.response?.data || error.message
//     );

//     return Promise.reject(error);
//   }
// );

// export default api;
