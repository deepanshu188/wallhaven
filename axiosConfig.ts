import axios from "axios";
import { apiKeyStorage } from './utils/mmkv';

const key = apiKeyStorage.getString('apiKey')

const api = axios.create({
  baseURL: 'https://wallhaven.cc/api/v1',
});

const removeBearerToken = () => {
  delete api.defaults.headers['X-API-Key'];
};


if (key) {
  api.defaults.headers["X-API-Key"] = key;
}

export { api, removeBearerToken };
