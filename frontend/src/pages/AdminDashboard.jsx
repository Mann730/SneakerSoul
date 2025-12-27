import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../services/adminServices";

function AdminDashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editForm, setEditForm] = useState({
        title: "",
        price: "",
        description: "",
        genre: "",
        image: "",
    });
    const [createForm, setCreateForm] = useState({
        title: "",
        price: "",
        description: "",
        genre: "",
        image: "",
    });

    useEffect(() => {
        // Check if admin is logged in
        const adminToken = localStorage.getItem("adminToken");
        const adminUser = localStorage.getItem("adminUser");

        if (!adminToken || !adminUser) {
            navigate("/login");
            return;
        }

        const user = JSON.parse(adminUser);
        if (user.role !== "admin") {
            navigate("/login");
            return;
        }

        fetchProducts();
    }, [navigate]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            setProducts(response.products || []);
        } catch (error) {
            setError("Failed to load products");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        navigate("/login");
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setEditForm({
            title: product.title,
            price: product.price,
            description: product.description,
            genre: product.genre,
            image: product.image,
        });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");

        try {
            await updateProduct(editingProduct._id, editForm, token);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            alert("Failed to update product: " + (error.message || "Unknown error"));
        }
    };

    const handleDeleteProduct = async (id) => {
        const token = localStorage.getItem("adminToken");

        try {
            await deleteProduct(id, token);
            setDeleteConfirm(null);
            fetchProducts();
        } catch (error) {
            alert("Failed to delete product: " + (error.message || "Unknown error"));
        }
    };

    const handleCreateChange = (e) => {
        setCreateForm({ ...createForm, [e.target.name]: e.target.value });
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");

        try {
            await createProduct(createForm, token);
            setShowCreateModal(false);
            setCreateForm({
                title: "",
                price: "",
                description: "",
                genre: "",
                image: "",
            });
            fetchProducts();
        } catch (error) {
            alert("Failed to create product: " + (error.message || "Unknown error"));
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-white text-4xl"
                >
                    ⏳
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto mb-8"
            >
                <div className="flex justify-between items-center bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl ring-1 ring-white/20">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                        <p className="text-gray-300 mt-1">Manage your products</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-2 bg-green-500/80 hover:bg-green-600 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                        >
                            <span className="text-xl">+</span> Add Product
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Error Message */}
            {error && (
                <div className="max-w-7xl mx-auto mb-4">
                    <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                </div>
            )}

            {/* Products Grid */}
            <div className="max-w-7xl mx-auto">
                {products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center shadow-xl ring-1 ring-white/20"
                    >
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-2xl font-bold text-white mb-2">No Products Yet</h3>
                        <p className="text-gray-300 mb-6">Get started by adding your first product!</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all inline-flex items-center gap-2"
                        >
                            <span className="text-xl">+</span> Add Your First Product
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl ring-1 ring-white/20 hover:ring-purple-400/50 transition-all"
                            >
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                                    <p className="text-gray-300 text-sm mb-2">{product.genre}</p>
                                    <p className="text-purple-300 font-semibold text-lg mb-4">${product.price}</p>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="flex-1 px-4 py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirm(product)}
                                            className="flex-1 px-4 py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingProduct && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setEditingProduct(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Edit Product</h2>
                            <form onSubmit={handleUpdateProduct} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editForm.title}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={editForm.price}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                                    <input
                                        type="text"
                                        name="genre"
                                        value={editForm.genre}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={editForm.image}
                                        onChange={handleEditChange}
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        rows="4"
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                                    >
                                        Update Product
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct(null)}
                                        className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Create Product Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setShowCreateModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Add New Product</h2>
                            <form onSubmit={handleCreateProduct} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={createForm.title}
                                        onChange={handleCreateChange}
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Price</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={createForm.price}
                                        onChange={handleCreateChange}
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
                                    <input
                                        type="text"
                                        name="genre"
                                        value={createForm.genre}
                                        onChange={handleCreateChange}
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL</label>
                                    <input
                                        type="text"
                                        name="image"
                                        value={createForm.image}
                                        onChange={handleCreateChange}
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        value={createForm.description}
                                        onChange={handleCreateChange}
                                        rows="4"
                                        className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                                    >
                                        Create Product
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        onClick={() => setDeleteConfirm(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-white mb-4">Confirm Delete</h2>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to delete <span className="font-semibold text-white">{deleteConfirm.title}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleDeleteProduct(deleteConfirm._id)}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="flex-1 px-6 py-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminDashboard;

