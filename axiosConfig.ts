import axios from "axios";
import { BASE_URL } from "./content/constants";

const api = axios.create({
  baseURL: BASE_URL,
});

// const setBearerToken = (token: string) => {
//   api.defaults.headers['Authorization'] = `Bearer ${token}`;
// };
//
// const removeBearerToken = () => {
//   delete api.defaults.headers['Authorization'];
// };

// const token = localStorage.getItem('token');
// if (token) {
//   setBearerToken(token);
// }

export { api };
