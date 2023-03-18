import { create } from 'zustand';
import { UserData } from '../Helper/helper';

interface AuthState  {
  auth: UserData;
  setUsername: (name: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  auth: {
    username: '',
    email: '',
    password: '',
    profile: '',
  },
  setUsername: (name) =>
    set((state) => ({
      auth: {
        ...state.auth,
        username: name,
      },
    })),
}));

