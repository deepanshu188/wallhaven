import axios from "axios";

const api = axios.create({
  baseURL: 'https://wallhaven.cc/api/v1',
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
