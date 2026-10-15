import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom'; // Added Link and useLocation
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import Header from './Components/Header';
import productsData from './Data/Product5';
import productsData1 from './Data/Product1';
import productsData2 from './Data/Product3';
import productsData3 from './Data/Product3';
import productsData4 from './Data/Product4';
function PharmacyHome() {
  const [cartItems, setCartItems] = useState([]);
  const [userEmail, setUserEmail] = useState('guest@example.com');
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation(); // Get current location

  const addToCart = product => {
    setCartItems([...cartItems, product]);
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.email) {
          setUserEmail(decoded.email);
        }
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
    setIsMounted(true);
  }, []);
  const outletContext = {
    cartItems,
    addToCart,
    userEmail,
    productsData,
    productsData1,
    productsData2,
    productsData3,
    productsData4
  };

  // Don't show cart button on cart page itself
  const showCartButton = !location.pathname.includes('/cart');
  return <motion.div
    initial={{
    opacity: 0
  }}
    animate={{
    opacity: 1
  }}
    transition={{
    duration: 0.5
  }}
    className="min-h-screen overflow-auto bg-gradient-to-br from-blue-50 via-cyan-50 to-emerald-50"
  >
    {/* Floating decorative elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => <motion.div
        key={i}
        className="absolute rounded-full opacity-10"
        style={{
        backgroundColor: i % 2 === 0 ? '#3b82f6' : '#10b981',
        width: `${Math.random() * 200 + 50}px`,
        height: `${Math.random() * 200 + 50}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`
      }}
        animate={{
        y: [0, -20, 0],
        x: [0, 10, 0]
      }}
        transition={{
        duration: 5 + Math.random() * 10,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      />)}
    </div>
      
    {/* This is the key fix: Add padding to account for the main navbar */}
    <div className="pt-6"> {/* Add top padding equal to navbar height */}
        
      {/* Pharmacy Header - now in normal flow with animation */}
      <motion.div
        initial={{
        y: -20,
        opacity: 0
      }}
        animate={{
        y: 0,
        opacity: 1
      }}
        transition={{
        duration: 0.3
      }}
        className="bg-gradient-to-r from-cyan-600 to-teal-600 shadow-lg"
      >
        <Header cartCount={cartItems.length} />
      </motion.div>
        
      {/* Main content with fade-in animation */}
      <motion.main
        className="flex-grow container mx-auto p-4"
        initial={{
        y: 20,
        opacity: 0
      }}
        animate={{
        y: 0,
        opacity: 1,
        transition: {
          delay: 0.3,
          duration: 0.5
        }
      }}
      >
        <Outlet context={outletContext} />
      </motion.main>
    </div>

    {/* Floating Cart Button - Lower Left Corner */}
    {showCartButton && <motion.div
      className="fixed bottom-6 left-6 z-50"
      initial={{
      opacity: 0,
      scale: 0.8
    }}
      animate={{
      opacity: 1,
      scale: 1
    }}
      transition={{
      duration: 0.5,
      delay: 0.7,
      type: "spring"
    }}
      whileHover={{
      scale: 1.05
    }}
      whileTap={{
      scale: 0.95
    }}
    >
      <Link to="/home/pharmacy/cart">
        <button className="w-16 h-16 rounded-full bg-teal-600 shadow-lg hover:bg-teal-700 flex items-center justify-center text-white relative transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
              
          {cartItems.length > 0 && <motion.span
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
            initial={{
            scale: 0
          }}
            animate={{
            scale: 1
          }}
            transition={{
            type: "spring",
            stiffness: 500
          }}
          >
              {cartItems.length}
            </motion.span>}
        </button>
      </Link>
    </motion.div>}
  </motion.div>;
}
export default PharmacyHome;
