// api/axios.ts
import axios from "axios";

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = store?.getState()?.auth?.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Use a plain axios request to avoid interceptor loops
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          }
        );

        const { accessToken, user } = refreshResponse.data;

        store.dispatch({
          type: "auth/refresh/fulfilled",
          payload: {
            accessToken,
            user,
          },
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed -> logout
        store.dispatch({
          type: "auth/logout",
        });

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;