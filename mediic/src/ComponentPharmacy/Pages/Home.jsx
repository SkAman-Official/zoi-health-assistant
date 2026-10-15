import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import ProductCard from '../Components/ProductCard';
import CategoryTile from '../Components/CategoryTile';
import { motion, AnimatePresence } from 'framer-motion';
const Home = () => {
  const context = useOutletContext();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    productsData: products = [],
    productsData1 = [],
    productsData2 = [],
    productsData3 = [],
    productsData4 = [],
    addToCart: onAddToCart = () => {}
  } = context || {};
  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false);
    }
  }, [products]);
  const filterProducts = data => (data || []).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filtered = filterProducts(products);
  const filtered1 = filterProducts(productsData1);
  const filtered2 = filterProducts(productsData2);
  const filtered3 = filterProducts(productsData3);
  const filtered4 = filterProducts(productsData4);
  const categories = [{
    title: 'Pharmacy',
    link: '/home/pharmacy',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  }, {
    title: 'Lab Tests',
    link: '/home/pharmacy/lab',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  }, {
    title: 'Doctor Appointment',
    link: '/home/pharmacy/doctor',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  }, {
    title: 'Health Insurance',
    link: '/home/pharmacy/insurance',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  }];
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-cyan-50">
      <motion.div
        animate={{
        rotate: 360
      }}
        transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }}
        className="w-16 h-16 rounded-full border-t-4 border-b-4 border-cyan-600"
      />
    </div>;
  }
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
    className="p-4 bg-gradient-to-b from-blue-50 to-cyan-50 min-h-screen"
  >
    {/* Hero Section */}
    <div className="relative overflow-hidden rounded-2xl mb-8 h-64 bg-gradient-to-r from-cyan-600 to-teal-600 shadow-xl">
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center px-8 text-center">
        <motion.h1
          initial={{
          y: -20,
          opacity: 0
        }}
          animate={{
          y: 0,
          opacity: 1
        }}
          transition={{
          delay: 0.2
        }}
          className="text-4xl font-bold text-white mb-3"
        >
          Your Health, Our Priority
        </motion.h1>
        <motion.p
          initial={{
          y: 20,
          opacity: 0
        }}
          animate={{
          y: 0,
          opacity: 1
        }}
          transition={{
          delay: 0.4
        }}
          className="text-xl text-cyan-100 max-w-xl mb-6"
        >
          Quality healthcare products and services at your fingertips
        </motion.p>
          
        {/* Compact Centered Search Bar */}
        <motion.div
          initial={{
          y: 20,
          opacity: 0
        }}
          animate={{
          y: 0,
          opacity: 1
        }}
          transition={{
          delay: 0.6
        }}
          className="relative w-full max-w-lg"
        >
          <input type="text" placeholder="Search medicines, health products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="border-2 border-cyan-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-300 bg-white text-gray-700 placeholder-cyan-500 rounded-full py-3 pl-12 pr-6 w-full outline-none transition-all duration-300 shadow-md hover:shadow-lg" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </motion.div>
      </div>
        
      {/* Floating medical icons */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => <motion.div
          key={i}
          className="absolute text-white opacity-10"
          style={{
          fontSize: `${Math.random() * 3 + 2}rem`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`
        }}
          animate={{
          y: [0, -30, 0],
          rotate: [0, 10, 0]
        }}
          transition={{
          duration: 8 + Math.random() * 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </motion.div>)}
      </div>
    </div>

    {/* Categories */}
    <div className="mb-12 space-y-6">
      <AnimatedSectionTitle title="Health Services" delay={0.8} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat, index) => <motion.div
          key={cat.title}
          initial={{
          y: 20,
          opacity: 0
        }}
          animate={{
          y: 0,
          opacity: 1
        }}
          transition={{
          delay: 0.9 + index * 0.1
        }}
        >
          <CategoryTile title={cat.title} link={cat.link} icon={cat.icon} />
        </motion.div>)}
      </div>
    </div>

    {/* Product sections */}
    <div className="space-y-12">
      <Section title="Top Products" products={filtered} onAddToCart={onAddToCart} delay={1.0} />
      <Section title="New Launches" products={filtered1} onAddToCart={onAddToCart} delay={1.1} />
      <Section title="Deals of The Day" products={filtered2} onAddToCart={onAddToCart} delay={1.2} />
      <Section title="Featured Products" products={filtered3} onAddToCart={onAddToCart} delay={1.3} />
      <Section title="In The Spotlight" products={filtered4} onAddToCart={onAddToCart} delay={1.4} />
    </div>

    {/* Health Tips Banner */}
    <motion.div
      initial={{
      y: 30,
      opacity: 0
    }}
      animate={{
      y: 0,
      opacity: 1
    }}
      transition={{
      delay: 1.6
    }}
      className="mt-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6 border border-cyan-200 shadow-sm"
    >
      <div className="flex flex-col md:flex-row items-center">
        <div className="flex-1">
          <AnimatedSectionTitle title="Health Tips of the Day" delay={0} className="mb-2" />
          <p className="text-cyan-700 mb-4">
            Stay hydrated with at least 8 glasses of water daily. Proper hydration supports 
            digestion, nutrient absorption, and overall bodily functions.
          </p>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-6 rounded-full transition duration-300">
            More Health Tips
          </button>
        </div>
        <div className="mt-6 md:mt-0">
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-64 h-48" />
        </div>
      </div>
    </motion.div>
  </motion.div>;
};

// Reusable animated section title component
const AnimatedSectionTitle = ({
  title,
  delay = 0,
  className = ""
}) => <motion.div
  initial={{
  scale: 0.8,
  opacity: 0
}}
  animate={{
  scale: 1,
  opacity: 1
}}
  transition={{
  delay,
  type: "spring",
  stiffness: 300
}}
  className={`inline-block ${className}`}
>
  <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full px-6 py-3 shadow-lg">
    <h2 className="text-xl md:text-2xl font-bold text-center">{title}</h2>
  </div>
</motion.div>;
const Section = ({
  title,
  products,
  onAddToCart,
  delay = 0
}) => {
  if (!products || products.length === 0) return null;
  return <motion.div
    initial={{
    y: 20,
    opacity: 0
  }}
    animate={{
    y: 0,
    opacity: 1
  }}
    transition={{
    delay
  }}
  >
    <div className="flex justify-center mb-6">
      <AnimatedSectionTitle title={title} delay={delay} />
    </div>
      
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <AnimatePresence>
        {products.map((prod, index) => <motion.div
          key={prod.id}
          initial={{
          y: 30,
          opacity: 0
        }}
          animate={{
          y: 0,
          opacity: 1
        }}
          transition={{
          delay: delay + index * 0.05
        }}
        >
          <ProductCard product={prod} onAddToCart={onAddToCart} />
        </motion.div>)}
      </AnimatePresence>
    </div>
  </motion.div>;
};
export default Home;
