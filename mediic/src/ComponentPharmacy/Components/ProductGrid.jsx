// src/components/ProductGrid.jsx
import ProductCard from './ProductCard';
const ProductGrid = ({
  products,
  onAddToCart
}) => {
  return <div className="bg-green-50 py-10">
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Our Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {products.map(product => <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />)}
      </div>
    </div>
  </div>;
};
export default ProductGrid;
