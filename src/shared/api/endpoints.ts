export const apiUrl = "https://easy-cooking-backend.onrender.com";

// export const apiUrl = "http://localhost:8000";


export const endpoints = {
  path: {
    recipes: "/recipes",
    },
  auth: {
    login: "/login",
    logout: "/logout",
  },
} as const