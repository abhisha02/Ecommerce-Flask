import api from './api';

export const userService = {
  fetchProducts: async () => {
    const response = await api.get('/products');
    return response.data.items || [];
  }
};

export default userService;