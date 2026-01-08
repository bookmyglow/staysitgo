export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
  }
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

const buildHeaders = (withAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (withAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const api = {
  get: async <T>(endpoint: string, withAuth: boolean = true): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: buildHeaders(withAuth),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          data
        );
      }

      return { success: true, data };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  },

  post: async <T>(
    endpoint: string,
    body: unknown,
    withAuth: boolean = true
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: buildHeaders(withAuth),
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          data
        );
      }

      return { success: true, data };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  },

  put: async <T>(
    endpoint: string,
    body: unknown,
    withAuth: boolean = true
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: buildHeaders(withAuth),
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          data
        );
      }

      return { success: true, data };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  },

  delete: async <T>(
    endpoint: string,
    withAuth: boolean = true
  ): Promise<ApiResponse<T>> => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: buildHeaders(withAuth),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'Request failed',
          response.status,
          data
        );
      }

      return { success: true, data };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  },

  upload: async <T>(
    endpoint: string,
    formData: FormData,
    withAuth: boolean = true
  ): Promise<ApiResponse<T>> => {
    try {
      const headers: HeadersInit = {};
      if (withAuth) {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.error || 'Upload failed',
          response.status,
          data
        );
      }

      return { success: true, data };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500
      );
    }
  },
};

export const auth = {
  setToken: setAuthToken,
  removeToken: removeAuthToken,
  getToken: getAuthToken,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: '/auth/verify-email',
    VERIFY_PHONE: '/auth/verify-phone',
    RESEND_VERIFICATION: '/auth/resend-verification',
    ME: '/auth/me',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    EMERGENCY_CONTACT: '/users/emergency-contact',
    AVATAR: '/users/avatar',
    ID_VERIFICATION: '/users/id-verification',
    BADGES: '/users/badges',
    CHANGE_PASSWORD: '/users/change-password',
  },
  LISTINGS: {
    PARENT: '/listings/parent',
    SITTER: '/listings/sitter',
    SEARCH: '/listings/search',
    MY_LISTINGS: '/listings/my-listings',
    DELETE: (type: string, id: string) => `/listings/${type}/${id}`,
  },
  BOOKINGS: {
    CREATE: '/bookings',
    MY_BOOKINGS: '/bookings/my-bookings',
    GET: (id: string) => `/bookings/${id}`,
    ACCEPT: (id: string) => `/bookings/${id}/accept`,
    CANCEL: (id: string) => `/bookings/${id}/cancel`,
  },
  MESSAGES: {
    SEND: '/messages',
    CONVERSATIONS: '/messages/conversations',
    GET: (userId: string) => `/messages/${userId}`,
  },
  SUBSCRIPTIONS: {
    PLANS: '/subscriptions/plans',
    CREATE: '/subscriptions/create-subscription',
    CANCEL: '/subscriptions/cancel-subscription',
    MY: '/subscriptions/my-subscription',
    PAYMENT_METHODS: '/subscriptions/payment-methods',
  },
  AI: {
    CHAT: '/ai/chat',
    SUGGESTIONS: '/ai/suggestions',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    VERIFICATIONS: '/admin/verifications',
    LISTINGS: '/admin/listings',
    SUBSCRIPTIONS: '/admin/subscriptions',
    STATS: '/admin/platform-stats',
    MESSAGE_USER: '/admin/message-user',
  },
};

export default api;