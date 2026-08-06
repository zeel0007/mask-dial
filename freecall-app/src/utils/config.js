// config.js — Central helper for API and Socket server URLs
export const getApiUrl = () => {
  if (import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL;
  }
  // Automatically use current host IP when accessed from mobile phone / local network
  const hostname = typeof window !== "undefined" && window.location.hostname
    ? window.location.hostname
    : "localhost";
  return `http://${hostname}:5001`;
};
