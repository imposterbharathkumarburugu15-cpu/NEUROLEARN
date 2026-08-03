import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  avatarUrl?: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: '1',
    name: 'Guest Scholar',
    email: 'guest@neurolearn.ai',
    role: 'student',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJHK5uy-RrJHgXXl1AFf6gvKstzxZGvbxaVD2GBuseu4qoK99H7sBdCvU6W5Tkh2DDSdEj_WoMrRQg-2YJrR5TqZwfELmG2JtH4kKTRxjHzHiM0sjG62mga11BLJjOqgGdycTyqZYDX4VvXUuQ1ACK8QnM8OcpT_paq55_k2tj_rTv9_mcHckCmTFqBguxgkCHVmRSbOOXP9kz2OSfrCIf_SLa50UPh3NMY1aRG8XIpY5yRUQIQHrgug',
  },
  setUser: (user) => set({ user }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  theme: 'dark',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toasts: [],
  addToast: (message, type = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
