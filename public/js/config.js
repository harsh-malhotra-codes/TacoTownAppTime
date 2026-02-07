// Configuration for Backend API URL
// When running locally, use http://localhost:3000
// When deployed, replace the URL below with your actual Vercel Backend URL
export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://YOUR-VERCEL-PROJECT-NAME.vercel.app'; // ⚠️ UPDATE THIS AFTER DEPLOYING BACKEND