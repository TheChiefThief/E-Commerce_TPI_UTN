import apiClient from "./apiClient";


export const createOrder = async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
}

export const getOrders = async (params) => {
    const response = await apiClient.get('/orders', { params });
    return response.data;
}

export const getOrderById = async (Id) => {
    const response = await apiClient.get(`/orders/${Id}`);
    return response.data;
}

export const updateOrder = async (Id, orderData) => {
    const response = await apiClient.put(`/orders/${Id}`, orderData);
    return response.data;
}