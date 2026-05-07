import { create } from 'zustand';
import { storage } from '@/utils/mmkv';

interface SettingsState {
  numColumns: number;
  setNumColumns: (value: number) => void;
}

const getStoredNumColumns = () => {
  const stored = storage.getNumber('numColumns');
  return stored || 3; // Default to 3
};

export const useSettings = create<SettingsState>((set) => ({
  numColumns: getStoredNumColumns(),
  setNumColumns: (value) => {
    storage.set('numColumns', value);
    set({ numColumns: value });
  },
}));
