import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../services/productServices.js";
import { motion } from "framer-motion";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();

        // 🛡️ safety check
        if (res && Array.isArray(res.products)) {
          setProducts(res.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError(
          err?.message ||
          err ||
          "Failed to fetch products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ⏳ loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p className="text-lg font-bold text-black">Loading products...</p>
      </div>
    );
  }

  // ❌ error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-3">
            Sneaker Collection
          </h1>
          <p className="text-gray-600 text-lg">Find your perfect pair</p>
        </motion.div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl font-medium text-gray-500">No products available at the moment.</p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          >
            {products.map((product) => (
              <motion.article
                key={product._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => navigate(`/products/${product._id}`)}
                className="group relative flex flex-col h-full overflow-hidden rounded-lg bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer"
              >
                {/* Category Badge */}
                {product.category && (
                  <div className="absolute top-4 left-4 z-10 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-lg">
                    {product.category}
                  </div>
                )}

                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden border-b-2 border-black bg-white">
                  <img
                    src={product.image || "https://via.placeholder.com/400?text=No+Image"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5 lg:p-6 bg-white">
                  <h3 className="text-lg lg:text-xl font-bold text-black mb-2 line-clamp-2 leading-tight group-hover:text-gray-800 transition-colors">
                    {product.title}
                  </h3>

                  {product.author && (
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      {product.author}
                    </p>
                  )}

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow leading-relaxed">
                    {product.description}
                  </p>

                  {/* Price and Action */}
                  <div className="mt-auto pt-4 border-t-2 border-black flex items-center justify-between gap-3">
                    <p className="text-2xl lg:text-3xl font-black text-black">
                      ₹{product.price}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product._id}`);
                      }}
                      className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-md hover:bg-white hover:text-black border-2 border-black transition-all duration-200 uppercase tracking-wide"
                    >
                      View
                    </button>
                  </div>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none"></div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Products;
