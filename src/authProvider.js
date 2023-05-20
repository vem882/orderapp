import axios from 'axios';

const authProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await axios.post('/api/login', { username, password });
      localStorage.setItem('token', response.data.token);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
  checkError: (error) => {
    if (error.status === 401 || error.status === 403) {
      localStorage.removeItem('token');
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem('token') ? Promise.resolve() : Promise.reject({ redirectTo: '/login' });
},

  getPermissions: () => {
    const token = localStorage.getItem('token');
    return token ? Promise.resolve(JSON.parse(atob(token.split('.')[1]))) : Promise.reject();
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};

export default authProvider;
