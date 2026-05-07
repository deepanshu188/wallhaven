import axios from "axios";
import { apiKeyStorage } from './utils/mmkv';

const api = axios.create({
  baseURL: 'https://wallhaven.cc/api/v1',
});

const removeBearerToken = () => {
  delete api.defaults.headers['X-API-Key'];
};

// Use interceptor to always read the latest API key from storage
api.interceptors.request.use((config) => {
  const key = apiKeyStorage.getString('apiKey');
  if (key) {
    config.headers['X-API-Key'] = key;
  }
  return config;
});

export { api, removeBearerToken };
