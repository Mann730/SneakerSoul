import express from "express";
import Product from "../models/Products.js";
import { getAllProducts, getSingleProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

const createProduct = async (req, res) => {
  try {
    const { title, image, price, description, genre, author, category } = req.body;

    const newProduct = new Product({
      title,
      image,
      price,
      description,
      genre,
      author,
      category,
      createdBy: req.user._id // Add user reference
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating product",
      error: error.message
    });
  }
};

// Protected route - requires authentication
router.post("/create-product", protect, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Admin-only routes for update and delete
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;

