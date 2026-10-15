// export default ProductCard;
import { motion } from 'framer-motion';
const ProductCard = ({
  product,
  onAddToCart
}) => {
  return <motion.div
    className="flex flex-col items-center h-full bg-gradient-to-b from-cyan-50 to-teal-50 rounded-2xl overflow-hidden shadow-lg border border-white transition-all duration-300"
    initial={{
    opacity: 0,
    y: 20
  }}
    animate={{
    opacity: 1,
    y: 0
  }}
    whileHover={{
    y: -10,
    boxShadow: '0 20px 25px -5px rgba(6, 182, 212, 0.2), 0 10px 10px -5px rgba(6, 182, 212, 0.1)'
  }}
    transition={{
    duration: 0.3,
    ease: "easeOut"
  }}
  >
    {/* Product Image with Floating Effect */}
    <motion.div
      className="w-full py-4 flex justify-center bg-gradient-to-r from-cyan-100 to-teal-100"
      whileHover={{
      y: -5
    }}
      transition={{
      duration: 0.2
    }}
    >
      <img src={product.image} alt={product.name} className="w-32 h-32 object-contain drop-shadow-md" />
    </motion.div>
      
    {/* Product Information */}
    <div className="p-4 w-full flex flex-col items-center flex-grow">
      {/* Product Name with Gradient Text */}
      <h2 className="text-lg font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-teal-600">
        {product.name}
      </h2>
        
      {/* Price Information */}
      <div className="w-full flex justify-between items-center mb-3">
        <div className="text-sm text-gray-500 line-through">
          MRP ₹{product.mrp}
        </div>
        <div className="text-xs font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white py-1 px-2 rounded-full">
          {product.discount}% OFF
        </div>
      </div>
        
      {/* Discounted Price */}
      <div className="text-xl font-bold text-cyan-700 mb-4">
        ₹{product.price}
      </div>
        
      {/* Add to Cart Button with Animation */}
      <motion.button
        onClick={() => onAddToCart(product)}
        className="mt-auto w-full bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-medium py-2.5 rounded-xl shadow-md relative overflow-hidden"
        whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 20px rgba(6, 182, 212, 0.3)"
      }}
        whileTap={{
        scale: 0.95
      }}
      >
        {/* Button Text with Animation */}
        <motion.span
          className="relative z-10 flex items-center justify-center"
          initial={false}
          animate={{
          y: 0
        }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Add to Cart
        </motion.span>
          
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0"
          initial={{
          opacity: 0
        }}
          whileHover={{
          opacity: 1,
          transition: {
            duration: 0.4
          }
        }}
        />
      </motion.button>
    </div>
      
    {/* Floating Discount Tag */}
    <div className="absolute top-4 right-4">
      <motion.div
        className="bg-gradient-to-r from-rose-400 to-pink-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-lg"
        initial={{
        rotate: -5
      }}
        animate={{
        rotate: [0, -5, 0],
        transition: {
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }
      }}
      >
        Save ₹{product.mrp - product.price}
      </motion.div>
    </div>
  </motion.div>;
};
export default ProductCard;
