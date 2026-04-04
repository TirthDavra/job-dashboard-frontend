import { create } from "zustand";

interface User {
    _id: string;
    email: string;
    role: "admin" | "recruiter" | "candidate";
}

interface AuthState {
    user: User | null;
    token: string | null;
    setAuth: (data: { user: User; token: string }) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,

    setAuth: ({ user, token }) => set({ user, token }),

    logout: () => set({ user: null, token: null }),
}));