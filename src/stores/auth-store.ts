import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  token: string | null;
  user: User | null;

  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;

  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      setToken: (token) => set({ token }),

      setUser: (user) => set({ user }),

      clear: () =>
        set({
          token: null,
          user: null,
        }),
    }),
    { name: "datn-auth-storage" },
  ),
);
