import { create } from 'zustand';
import { apiKeyStorage } from '@/utils/mmkv';

interface AuthState {
  hasApiKey: boolean;
  setHasApiKey: (value: boolean) => void;
  checkApiKey: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  hasApiKey: !!apiKeyStorage.getString("apiKey"),
  setHasApiKey: (value) => set({ hasApiKey: value }),
  checkApiKey: () => set({ hasApiKey: !!apiKeyStorage.getString("apiKey") }),
}));
