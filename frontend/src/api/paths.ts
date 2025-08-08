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
    DOWNLOAD: `${API_BASE_URL}/files/file`,
    DELETE: `${API_BASE_URL}/files/file`,
    LIST: `${API_BASE_URL}/files/all`,
  },
} as const;

export type ApiPaths = typeof API_PATHS;
