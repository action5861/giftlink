// src/store/authStore.ts
import { create } from 'zustand'

type User = {
  id: number
  email: string
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  login: (userData: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (userData) => set({ isLoggedIn: true, user: userData }),
  logout: () => set({ isLoggedIn: false, user: null }),
}))