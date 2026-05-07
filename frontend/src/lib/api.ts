import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers.Authorization) {
    delete config.headers.Authorization;
  }

  return config;
});

interface LaravelErrorPayload {
  message?: string;
  errors?: Record<string, string[] | string>;
}

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (!axios.isAxiosError<LaravelErrorPayload>(error)) {
    return fallback;
  }

  const payload = error.response?.data;

  if (payload?.errors) {
    const firstKey = Object.keys(payload.errors)[0];
    const firstValue = payload.errors[firstKey];

    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return firstValue[0];
    }

    if (typeof firstValue === 'string' && firstValue.length > 0) {
      return firstValue;
    }
  }

  if (payload?.message) {
    return payload.message;
  }

  if (error.code === 'ECONNABORTED') {
    return '请求超时，请稍后重试';
  }

  return fallback;
};
