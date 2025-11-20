import React,{useState} from "react";

const ProductCard = ({product, onAddToCart}) => {
    const [quantity, setQuantity] = useState(1);
    const currentStock = product.stockQuantity || 0;

    const isOutOfStock = currentStock <= 0;
    
    const handleQuantityChange = (e) => {
        const newQuantity = Math.max(1, quantity+e);
        setQuantity(Math.min(newQuantity, currentStock));
    };
    const handleAddToCart = () => {
        if(isOutOfStock){
            alert("Producto sin stock");
            return;
        }
        if(quantity < 1) {
            alert ("Cantidad inválida");
        return;
        }

        onAddToCart(product, quantity);
        setQuantity(1);
    }
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">${product.price}</p>
            <p className="product-stock-status">stock: <span style={{color: isOutOfStock ? "red" : "green"}}>{isOutOfStock ? "Agotado" : "Disponible"}</span></p>
            <div className="controls">
                <button className="qty-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
                <span className="quantity-display">{quantity}</span>
                <button className="qty-btn" onClick={() => handleQuantityChange(1)} disabled={quantity >= currentStock}>+</button>
                <button className="add-btn" onClick={handleAddToCart} disabled={isOutOfStock || quantity < 1}>Agregar al carrito</button>
            </div>

        </div>
    );
};

export default ProductCard;