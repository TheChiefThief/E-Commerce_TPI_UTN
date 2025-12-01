import { instance } from '../api/axiosInstance';

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await instance.post('/api/images/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
