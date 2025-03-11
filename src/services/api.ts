
// Mock API service for demonstration
// In a real application, replace with actual API calls using Axios or fetch

// Base URL for API
const API_BASE_URL = "https://api.yourhackathondomain.com";

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper to simulate API request
const mockRequest = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: any,
  shouldFail = false
): Promise<T> => {
  // Simulate network delay
  await delay(Math.random() * 500 + 200);
  
  // Simulate error
  if (shouldFail) {
    throw new Error("API request failed");
  }
  
  console.log(`Mock API call to ${endpoint} with method ${method} and data:`, data);
  
  // Return mock response
  return {} as T;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return mockRequest("/auth/login", "POST", { email, password });
  },
  register: async (name: string, email: string, password: string, institute: string) => {
    return mockRequest("/auth/register", "POST", { name, email, password, institute });
  },
  getCurrentUser: async () => {
    return mockRequest("/auth/me", "GET");
  },
};

// Projects API
export const projectsAPI = {
  getProjects: async () => {
    return mockRequest("/projects", "GET");
  },
  getProjectById: async (id: string) => {
    return mockRequest(`/projects/${id}`, "GET");
  },
  applyToProject: async (projectId: string) => {
    return mockRequest(`/projects/${projectId}/apply`, "POST");
  },
  getUserProjects: async () => {
    return mockRequest("/user/projects", "GET");
  },
};

// Submissions API
export const submissionsAPI = {
  submitProject: async (projectId: string, data: any) => {
    return mockRequest(`/projects/${projectId}/submit`, "POST", data);
  },
  getSubmissions: async (projectId?: string) => {
    const endpoint = projectId 
      ? `/submissions?projectId=${projectId}` 
      : "/submissions";
    return mockRequest(endpoint, "GET");
  },
  approveSubmission: async (submissionId: string, feedback?: string) => {
    return mockRequest(`/submissions/${submissionId}/approve`, "POST", { feedback });
  },
  rejectSubmission: async (submissionId: string, feedback: string) => {
    return mockRequest(`/submissions/${submissionId}/reject`, "POST", { feedback });
  },
};

// Admin API
export const adminAPI = {
  getUsers: async () => {
    return mockRequest("/admin/users", "GET");
  },
  addUserToProject: async (userId: string, projectId: string) => {
    return mockRequest("/admin/projects/add-user", "POST", { userId, projectId });
  },
};

export default {
  auth: authAPI,
  projects: projectsAPI,
  submissions: submissionsAPI,
  admin: adminAPI,
};
