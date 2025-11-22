import {useState} from 'react';
import * as productApi from '../API/product.js';

export const useProduct = () => {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cambiado a argumentos posicionales para coincidir con llamadas desde `Home.jsx`.
    const fetchProducts = async (searchTerms = '', pageNumber = 1, pageSize = 10, status = 'Active') => {
        setIsLoading(true);
        setError(null);
        try{
            const resp = await productApi.getProducts({ name: searchTerms, pageNumber, pageSize, status });
            // `productApi.getProducts` devuelve `response.data` (según implementacion en API).
            // Aceptamos varias formas de respuesta para mayor robustez.
            const data = resp ?? {};
            if (Array.isArray(data)) {
                setProducts(data);
                setTotalPages(1);
            } else if (Array.isArray(data.data)) {
                setProducts(data.data);
                setTotalPages(data.totalPages || 1);
            } else if (Array.isArray(data.items)) {
                setProducts(data.items);
                setTotalPages(data.totalPages || 1);
            } else {
                setProducts([]);
                setTotalPages(1);
            }
        } catch (err) {
            setError("Failed to fetch products");
            setProducts([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }

    }
    return { products, totalPages, isLoading, error, fetchProducts };
}
