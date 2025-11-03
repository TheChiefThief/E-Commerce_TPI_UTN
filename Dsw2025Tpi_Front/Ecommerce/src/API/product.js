import apiClient from "./apiClient";


export const getProducts = async (params) => {
    const response = await apiClient.get('/products', { params });
    return response.data;
}

export const getProductById = async (Id) => {
    const response = await apiClient.get(`/products/${Id}`);
    return response.data;
}

export const createProduct = async (productData) => {
    const response = await apiClient.post('/products', productData);
    return response.data;
}

export const patchProduct = async (Id) => {
    const response = await apiClient.patch(`/products/${Id}`, {isActive});
    return response.data;
}

export const updateProduct = async (Id, productData) => {
    const response = await apiClient.put(`/products/${Id}`, productData);
    return response.data;
}
