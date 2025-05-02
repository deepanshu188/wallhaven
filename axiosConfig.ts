import * as SecureStore from 'expo-secure-store';
import axios from "axios";

const api = axios.create({
  baseURL: 'https://wallhaven.cc/api/v1',
});

const removeBearerToken = () => {
  delete api.defaults.headers['X-API-Key'];
};


(async () => {
  let key = await SecureStore.getItemAsync("apiKey");
  api.defaults.headers["X-API-Key"] = key;
})();

export { api, removeBearerToken };
