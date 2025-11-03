import {useState} from 'react';
import * as productsApi from '../API/product.js';

export const useProduct = () => {
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchProducts = async ({searchTerms = '', pageNumber = 1, pageSize = 10, status = 'Active'}) => {
        setIsLoading(true);
        setError(null);
        try{
            const response = await productApi.getProducts({name: searchTerms, pageNumber, pageSize, status});
            setProducts(response.data);
            setTotalPages(response.totalPages);
        } catch (err) {
            setError("Failed to fetch products");
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
        

    }
    return { products, totalPages, isLoading, error, fetchProducts };
}
