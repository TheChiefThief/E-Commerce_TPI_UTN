import { instance } from '../../shared/api/axiosInstance';

export const getProductsClient = async (search = null, status = null, pageNumber = 1, pageSize = 12) => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (pageNumber) params.pageNumber = pageNumber;
  if (pageSize) params.pageSize = pageSize;

  const query = new URLSearchParams(params).toString();

  const response = await instance.get(`api/products?${query}`);

  return { data: response.data, error: null };
};

export default getProductsClient;
