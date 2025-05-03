import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

export const apiKeyStorage = new MMKV({
  id: 'apiKey',
  encryptionKey: process.env.EXPO_PUBLIC_ENCRYPTION_KEY,
})
