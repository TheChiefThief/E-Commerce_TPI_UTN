import { instance } from '../../shared/api/axiosInstance';

export const getProducts = async (search = null, status = null, pageNumber = 1, pageSize = 20) => {
  const params = {};
  if (search !== null && search !== undefined && String(search).trim() !== '') params.search = search;
  if (status !== null && status !== undefined && String(status).trim() !== '') params.isActive = status;
  params.pageNumber = pageNumber;
  params.pageSize = pageSize;

  const queryString = new URLSearchParams(params).toString();

  const response = await instance.get(`api/products?${queryString}`);

  return { data: response.data, error: null };
};

