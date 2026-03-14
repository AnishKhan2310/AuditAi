import { create } from "zustand"
import { persist } from "zustand/middleware"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const useAuthStore = create(
  persist(
    (set) => ({

      accessToken: null,
      user: null,

      setAuth: (token, user) =>
        set({
          accessToken: token,
          user
        }),

      logout: async () => {

        try {
          await fetch(`${API_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include"
          })
        } catch {}

        set({
          accessToken: null,
          user: null
        })
      }

    }),
    {
      name: "auth-storage" // saved in localStorage
    }
  )
)