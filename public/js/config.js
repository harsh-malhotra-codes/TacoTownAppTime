// Configuration for the frontend

// Export the API URL so other files (menu.js, main.js, payment.js) can use it
export const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000' // Local development backend URL
    : window.location.origin; // Automatically use the current site URL
