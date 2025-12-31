import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getProductById } from "../services/productServices.js";
import { useCart } from "../context/CartContext.jsx";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(id);
        setProduct(res.product || res);
      } catch (err) {
        setError(err?.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p className="text-lg font-bold text-black">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-sm font-bold text-black hover:text-gray-600 transition-colors uppercase tracking-wide group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Collection
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start"
        >
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden rounded-xl border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-300"
          >
            <div className="aspect-[3/4] w-full bg-white">
              <img
                src={product.image || "https://via.placeholder.com/600?text=No+Image"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Details Section */}
          <div className="flex flex-col space-y-6">
            {/* Genre Badge */}
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-fit px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider bg-black text-white shadow-md"
            >
              {product.genre || product.category || "Sneaker"}
            </motion.span>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-black leading-tight"
            >
              {product.title}
            </motion.h1>

            {/* Author */}
            {product.author && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg font-semibold text-gray-700"
              >
                {product.author}
              </motion.p>
            )}

            {/* Price */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="py-6 border-y-2 border-black"
            >
              <p className="text-4xl lg:text-5xl font-black text-black">
                ₹{product.price}
              </p>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              <h2 className="text-sm font-bold text-black uppercase tracking-wider">
                About This Sneaker
              </h2>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {product.description}
              </p>
            </motion.div>

            {/* Meta Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-6 pt-4"
            >
              <div className="space-y-1">
                <p className="font-bold text-black uppercase tracking-wide text-xs">Brand</p>
                <p className="text-gray-700 font-semibold text-base">
                  {product.brand || product.author || "Unknown Brand"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-black uppercase tracking-wide text-xs">Added</p>
                <p className="text-gray-700 font-semibold text-base">
                  {new Date(product.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </motion.div>

            {/* Add to Cart Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                  alert('Please login to add items to cart');
                  navigate('/login');
                  return;
                }

                setAddingToCart(true);
                try {
                  await addToCart(product._id, 1);
                  alert('Product added to cart successfully!');
                  navigate('/cart');
                } catch (error) {
                  alert(error.message || 'Failed to add to cart. Please try again.');
                } finally {
                  setAddingToCart(false);
                }
              }}
              disabled={addingToCart}
              className="w-full sm:w-auto px-8 py-4 rounded-lg bg-black text-white font-bold text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black transition-all duration-200 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetails;
