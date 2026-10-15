//TESTING Routing :
// src/ComponentPharmacy/Components/Header.jsx
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
const Header = ({
  cartCount
}) => {
  const location = useLocation();

  // Navigation items
  const navItems = [{
    path: "/home/pharmacy",
    label: "Home"
  }, {
    path: "/home/pharmacy/lab",
    label: "Lab Tests"
  }, {
    path: "/home/pharmacy/insurance",
    label: "Insurance"
  }, {
    path: "/home/pharmacy/cart",
    label: "Cart",
    isCart: true
  }];
  return <header className=" z-50 bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-lg">
    <div className="container mx-auto px-4 py-3">
      <div className="flex justify-between items-center">
        {/* Logo with animation */}
        <motion.div
          whileHover={{
          scale: 1.05
        }}
          className="flex items-center space-x-2"
        >
          <motion.div
            initial={{
            rotate: 0
          }}
            animate={{
            rotate: 360
          }}
            transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </motion.div>
          <motion.h1
            className="text-2xl font-bold tracking-tight"
            whileHover={{
            scale: 1.03
          }}
          >
            <Link to="/home/pharmacy">CureCClick</Link>
          </motion.h1>
        </motion.div>
          
        {/* Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-1">
            {navItems.map(item => <motion.li
              key={item.path}
              whileHover={{
              y: -3
            }}
              whileTap={{
              scale: 0.95
            }}
            >
              <Link to={item.path} className={`relative px-4 py-2 rounded-lg flex items-center transition-all duration-300 ${location.pathname === item.path ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`}>
                {item.label}
                    
                {/* Cart badge with animation */}
                {item.isCart && <AnimatePresence>
                  <motion.span
                    key={cartCount}
                    initial={{
                    scale: 0.5,
                    opacity: 0
                  }}
                    animate={{
                    scale: 1,
                    opacity: 1,
                    transition: {
                      type: "spring",
                      stiffness: 500
                    }
                  }}
                    className="ml-2 bg-rose-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                  </AnimatePresence>}
                    
                {/* Active indicator */}
                {location.pathname === item.path && <motion.div
                  className="absolute bottom-0 left-0 right-0 mx-auto w-4/5 h-1 bg-white rounded-t-full"
                  layoutId="navIndicator"
                  initial={false}
                  transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                />}
              </Link>
            </motion.li>)}
          </ul>
        </nav>
          
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
      
    {/* Mobile menu (hidden by default) */}
    <div className="md:hidden bg-cyan-700">
      <ul className="flex flex-col py-2">
        {navItems.map(item => <li key={`mobile-${item.path}`}>
          <Link to={item.path} className={`flex items-center justify-between px-6 py-3 ${location.pathname === item.path ? "bg-white/20" : "hover:bg-white/10"}`}>
            <span>{item.label}</span>
            {item.isCart && <span className="bg-rose-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {cartCount}
              </span>}
          </Link>
        </li>)}
      </ul>
    </div>
  </header>;
};
Header.propTypes = {
  cartCount: PropTypes.number.isRequired
};
export default Header;
