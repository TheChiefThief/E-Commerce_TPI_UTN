import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    search,
    status,
    pageNumber,
    pageSize,
  });

  const response = await instance.get(`api/products/admin?${queryString}`);

  return { data: response.data, error: null };
};

export const getCustomerProducts = async (search = '', pageNumber = 1, pageSize = 20 ) => {
  const queryString = new URLSearchParams({
    //search,
    pageNumber,
    pageSize,
  });
  console.log('Query String:', queryString); // Debugging line
  const response = await instance.get(`api/products?${queryString}`);

  return { data: response.data, error: null };
};