import {useState, useEffect } from 'react';
import {useProduct} from '../../Hooks/useProduct';
import {useCart } from '../../Hooks/useCart';

const Home = () => {
    const [searchTerms, setSearchTerms] = useState(''); // Para los términos de búsqueda
    const [pageNumber, setPageNumber] = useState(1); // Para la paginación
    const pageSize = 10;
    const { products, totalPages, isLoading, fetchProducts } = useProduct(); // hook personalizado para manejar productos
    const { addToCart } = useCart(); // hook personalizado para manejar el carrito de compras

    useEffect(() => {
        fetchProducts(searchTerms, pageNumber, pageSize);
    }, [searchTerms, pageNumber, pageSize]);

    const handleAddToCart = (product, quantity) => {
        addToCart(product, quantity);
        alert(`${quantity} of ${product.name} added to cart!`);
    };
    if (isLoading) { // Para manejar el estado de carga
        return <p>Loading...</p>;
    }

    return (
        <div className="home-container">
            <header>
                <input type="text" placeholder="Search products..." value={searchTerms} onChange={(e) => setSearchTerms(e.target.value)} />
            </header>
            <div className="product-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
                
                
            </div>
            <Pagination currentPage={pageNumber} totalPages={totalPages} onPageChange={setPageNumber} />

        </div>
    )    

}
export default Home;
