// js/api.js - Create this file in your frontend js folder

// API Base URL - Change this based on environment
const API_BASE_URL = 'http://localhost:5000/api'; // Backend URL

// Store token in localStorage
let authToken = localStorage.getItem('token') || null;

// Generic fetch function with authentication
async function apiRequest(endpoint, method = 'GET', data = null, isFormData = false) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
        method,
        headers: {}
    };

    // Add authentication token if available
    if (authToken) {
        options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    // Handle different content types
    if (data) {
        if (isFormData) {
            options.body = data; // FormData for file uploads
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Update token after login
function setAuthToken(token) {
    authToken = token;
    localStorage.setItem('token', token);
}

// Clear token on logout
function clearAuthToken() {
    authToken = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}

// Export functions for use in other files
window.api = {
    get: (endpoint) => apiRequest(endpoint, 'GET'),
    post: (endpoint, data, isFormData = false) => apiRequest(endpoint, 'POST', data, isFormData),
    put: (endpoint, data, isFormData = false) => apiRequest(endpoint, 'PUT', data, isFormData),
    delete: (endpoint) => apiRequest(endpoint, 'DELETE'),
    setToken: setAuthToken,
    clearToken: clearAuthToken
};