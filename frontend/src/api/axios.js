import axios from "axios"
import { useAuthStore } from "../store/authStore"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true
})

/* attach access token */

api.interceptors.request.use((config) => {

  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})



/* auto refresh token */

api.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true

      try {

        const res = await axios.post(
          `${API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newToken = res.data.accessToken

        useAuthStore.getState().setAuth(newToken)

        originalRequest.headers.Authorization = `Bearer ${newToken}`

        return api(originalRequest)

      } catch (err) {

        useAuthStore.getState().logout()

        return Promise.reject(err)

      }

    }

    return Promise.reject(error)

  }

)

export default api