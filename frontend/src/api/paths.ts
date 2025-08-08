const API_BASE_URL = "http://localhost:8080/api";

export const API_PATHS = {
  // User management endpoints
  USER: {
    LOGIN: `${API_BASE_URL}/users/signin`,
    LOGOUT: `${API_BASE_URL}/users/logout`,
    SIGNOUT: `${API_BASE_URL}/users/signout`,
    REFRESH: `${API_BASE_URL}/users/refresh`,
    REGISTER: `${API_BASE_URL}/users/signup`,
  },

  // File upload/download endpoints
  FILES: {
    UPLOAD: `${API_BASE_URL}/files/upload`,
    DOWNLOAD: (fileId: string) => `${API_BASE_URL}/files/download/${fileId}`,
    LIST: `${API_BASE_URL}/files/all`,
    DELETE: (fileId: string) => `${API_BASE_URL}/files/${fileId}`,
  },
} as const;

export type ApiPaths = typeof API_PATHS;
