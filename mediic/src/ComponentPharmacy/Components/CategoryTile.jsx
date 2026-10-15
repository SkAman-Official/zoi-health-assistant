// src/components/CategoryTile.jsx
// src/components/CategoryTile.jsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
const CategoryTile = ({
  title,
  link,
  icon
}) => {
  return <motion.div
    whileHover={{
    y: -5
  }}
    whileTap={{
    scale: 0.98
  }}
  >
    <Link to={link} className="block bg-white rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-xl border border-cyan-100">
      <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-cyan-800">{title}</h3>
    </Link>
  </motion.div>;
};
export default CategoryTile;
