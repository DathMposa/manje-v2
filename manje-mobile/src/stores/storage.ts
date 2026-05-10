import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export const appStorage = createJSONStorage(() => AsyncStorage);

export const createId = (prefix: string) => {
  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${random}`;
};

export const nowIso = () => new Date().toISOString();
