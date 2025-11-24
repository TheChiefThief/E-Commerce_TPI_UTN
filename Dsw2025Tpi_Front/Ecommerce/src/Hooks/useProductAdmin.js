import { useState, useCallback } from 'react';
import * as productsApi from '../api/products';
import { useNavigate } from 'react-router-dom';

export const useProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    // 1. Fetch y Filtrado (Listado Administrativo) [cite: 467]
    const fetchAdminProducts = useCallback(async ({ 
        searchTerm = '', 
        pageNumber = 1, 
        pageSize = 10, 
        status = '' // Filtro por estado IsActive
    }) => {
        setIsLoading(true);
        setError(null);
        try {
            // Llama a la API con token (GET /api/products)
            const response = await productsApi.getProducts({ 
                name: searchTerm, pageNumber, pageSize, status
            });
            setProducts(response.data);
            setTotalPages(response.totalPages || 1); 
        } catch (err) {
            setError("Error al cargar la lista de productos.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 2. Creación de un Producto (POST /api/products)
    const createNewProduct = async (productData) => {
        // Validaciones de Frontend (SKU, Nombre, Precio>0, Stock>=0) [cite: 129-136]
        // ... (Lógica de validación)
        
        setIsLoading(true);
        try {
            await productsApi.createProduct(productData);
            navigate('/admin/products'); 
            return { success: true, message: "Producto creado exitosamente." };
        } catch (err) {
            const apiMessage = err.response?.data?.message || "Error al crear el producto. Verifique que el SKU no esté duplicado.";
            return { success: false, message: apiMessage };
        } finally {
            setIsLoading(false);
        }
    };
    
    // 3. Inhabilitar un Producto (PATCH /api/products/{id})
    const disableProduct = async (productId) => {
        setIsLoading(true);
        setError(null);
        try {
            await productsApi.updateProductStatus(productId, false); 
            // Actualiza el estado local (optimistic update)
            setProducts(prev => 
                prev.map(p => p.id === productId ? { ...p, isActive: false } : p)
            );
            return { success: true };
        } catch (err) {
            return { success: false, message: "Error al inhabilitar." };
        } finally {
            setIsLoading(false);
        }
    };

    return { products, isLoading, error, totalPages, fetchAdminProducts, createNewProduct, disableProduct };
};