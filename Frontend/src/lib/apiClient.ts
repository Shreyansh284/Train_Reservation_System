import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from '@/components/ui/use-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5245/api';

// Define a custom error type for API responses
interface ApiError extends Error {
  status?: number;
  data?: any;
  isNetworkError?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
});

// Request interceptor to add auth token and handle request logging
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const newConfig = { ...config };
    if (token) {
      if (!newConfig.headers) {
        newConfig.headers = {} as any;
      }
      (newConfig.headers as any).Authorization = `Bearer ${token}`;
    }
    return newConfig;
  },
  (error) => {
    const errorObj: ApiError = new Error('Request failed');
    errorObj.isNetworkError = true;
    return Promise.reject(errorObj);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Handle successful responses (status code 2xx)
    if (response.data?.message) {
      toast({
        title: 'Success',
        description: response.data.message,
        variant: 'default',
      });
    }
    return response;
  },
  (error: AxiosError) => {
    const errorObj: ApiError = new Error(error.message);
    errorObj.status = error.response?.status;
    errorObj.data = error.response?.data;

    if (!error.response) {
      // Network error
      errorObj.isNetworkError = true;
      errorObj.message = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      const responseData = error.response.data as { message?: string };
      const status = error.response.status;
      // Handle different HTTP status codes
      switch (status) {
        case 400:
          errorObj.message = responseData?.message || 'Invalid request. Please check your input.';
          break;
        case 401:
          errorObj.message = responseData?.message || 'Your session has expired. Please log in again.';
          localStorage.removeItem('token');
          // Show toast but don't navigate automatically
          // The component can handle navigation if needed
          break;
        case 403:
          errorObj.message = responseData?.message || 'You do not have permission to perform this action.';
          break;
        case 404:
          errorObj.message = responseData?.message || 'The requested resource was not found.';
          break;
        case 409:
          errorObj.message = responseData?.message || 'Conflict with the current state of the resource.';
          break;
        case 422:
          errorObj.message = 'Validation failed. Please check your input.';
          break;
        case 429:
          errorObj.message = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorObj.message = 'An internal server error occurred. Our team has been notified.';
          break;
        case 503:
          errorObj.message = 'Service is currently unavailable. Please try again later.';
          break;
        default:
          errorObj.message = responseData?.message || 'An unexpected error occurred';
      }
    }

    // Only show error toast if not an authentication error (to prevent toast flash before redirect)
    if (errorObj.status !== 401) {
      toast({
        title: errorObj.status ? `Error (${errorObj.status})` : 'Error',
        description: errorObj.message,
        variant: 'destructive',
        duration: 5000, // 5 seconds
      });
    }

    return Promise.reject(errorObj);
  }
);

// Helper function to handle API errors in components
export const handleApiError = (error: unknown, defaultMessage = 'An error occurred') => {
  const apiError = error as ApiError;
  if (apiError.isNetworkError) {
    toast({
      title: 'Network Error',
      description: 'Unable to connect to the server. Please check your internet connection.',
      variant: 'destructive',
    });
  }
  return apiError.message || defaultMessage;
};

export default apiClient;
