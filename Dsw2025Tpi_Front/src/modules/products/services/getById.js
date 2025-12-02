import { instance } from '../../shared/api/axiosInstance';

export const getProductById = async (id) => {
  if (!id) return { data: null, error: 'Missing ID' };
  try {
    const response = await instance.get(`/api/products/${id}`);
    return { data: response.data, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
};
