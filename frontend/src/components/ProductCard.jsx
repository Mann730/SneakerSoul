import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

const ProductCard = ({ book, index = 0, variants, onClick }) => {
  // Use book or props to safely access data
  const { title, image, price, category, author, description } = book;

  return (
    <motion.article
      variants={variants}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 w-full max-w-full ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Minimal Category Badge - Black and White */}
      {category && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 + 0.2 }}
          className="absolute left-4 top-4 z-10 rounded-md bg-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
        >
          {category}
        </motion.div>
      )}

      {/* Book Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white border-b-2 border-black">
        <img
          src={image || "https://via.placeholder.com/400?text=No+Image"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Book Info */}
      <div className="flex flex-1 flex-col p-5 lg:p-6 bg-white">
        <h3 className="mb-2 line-clamp-2 text-lg lg:text-xl font-bold leading-tight text-black group-hover:text-gray-800 transition-colors">
          {title}
        </h3>
        {author && (
          <p className="mb-3 text-sm font-semibold text-gray-700">
            {author}
          </p>
        )}
        {description && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600 flex-grow">
            {description}
          </p>
        )}

        {/* Price and Action */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t-2 border-black gap-3">
          <motion.p
            className="text-2xl lg:text-3xl font-black text-black"
            whileHover={{ scale: 1.05 }}
          >
            ₹{typeof price === 'number' ? price.toFixed(2) : price}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              if (onClick) {
                // If the card is clickable, we might want this button to do something else or just trigger the card click.
                // For now, let's allow it to bubble up or stay as "Add to Cart" visual.
                // If we had a specific add to cart function, we'd stopPropagation here.
              }
            }}
            className="rounded-md bg-black px-5 py-2.5 text-sm font-bold text-white border-2 border-black transition-all duration-200 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 uppercase tracking-wide"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>

      {/* Subtle shine effect - Black and White */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full pointer-events-none"></div>
    </motion.article>
  );
};

export default ProductCard;
