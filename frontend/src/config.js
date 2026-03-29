// Centralized Configuration for FeedLoop API
// In production (Vercel), this will be set via Environment Variables.
// Locally, it defaults to the stable 127.0.0.1:5000 address.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

export const API_ENDPOINTS = {
    FOOD: `${API_BASE_URL}/api/food`,
    AUTH: `${API_BASE_URL}/api/auth`,
    USER: `${API_BASE_URL}/api/user`,
    SOCKET: API_BASE_URL
};
