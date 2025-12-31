import express from "express";
import Product from "../models/Products.js";
import { getAllProducts, getSingleProduct, createProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected route - requires authentication
router.post("/create-product", protect, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Admin-only routes for update and delete
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;

