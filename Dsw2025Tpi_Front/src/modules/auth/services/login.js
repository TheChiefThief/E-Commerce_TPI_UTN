import { instance } from '../../shared/api/axiosInstance';

export const login = async (username, password) => {
  const response = await instance.post('/api/auth/login', { username, password });                        
  // Return entire response body so caller can pick token, customerId, etc.
  return { data: response.data, error: null };
};