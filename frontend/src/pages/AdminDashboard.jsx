import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../services/adminServices";
import axios from "axios";

function AdminDashboard() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterGenre, setFilterGenre] = useState("all");
    const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
    const [activeSection, setActiveSection] = useState("dashboard"); // 'dashboard' or 'orders'
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    const [editForm, setEditForm] = useState({
        title: "",
        price: "",
        description: "",
        genre: "",
        brand: "",
        image: "",
    });
    const [createForm, setCreateForm] = useState({
        title: "",
        price: "",
        description: "",
        genre: "",
        brand: "",
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

    const fetchOrders = async () => {
        try {
            setLoadingOrders(true);
            const token = localStorage.getItem("adminToken");
            const response = await axios.get('http://localhost:7000/api/orders/admin/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleUpdateOrderStatus = async (orderId, orderStatus) => {
        try {
            const token = localStorage.getItem("adminToken");
            await axios.put(`http://localhost:7000/api/orders/${orderId}/status`,
                { orderStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchOrders();
        } catch (error) {
            alert('Failed to update order status');
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
            brand: product.brand,
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
                brand: "",
                image: "",
            });
            fetchProducts();
        } catch (error) {
            alert("Failed to create product: " + (error.message || "Unknown error"));
        }
    };

    // Filter and search products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.genre?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = filterGenre === "all" || product.genre === filterGenre;
        return matchesSearch && matchesGenre;
    });

    // Get unique genres for filter
    const genres = [...new Set(products.map(p => p.genre))];

    // Calculate statistics
    const stats = {
        totalProducts: products.length,
        totalValue: products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0),
        avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0) / products.length : 0,
        recentProducts: products.filter(p => {
            const daysSinceCreated = (Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceCreated <= 7;
        }).length
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-64 bg-slate-800/50 backdrop-blur-xl border-r border-white/10 p-6 hidden lg:block">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-1">SneakerSoul</h2>
                    <p className="text-sm text-gray-400">Admin Panel</p>
                </div>

                <nav className="space-y-2">
                    <button
                        onClick={() => setActiveSection("dashboard")}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${activeSection === "dashboard"
                            ? "bg-purple-600/20 text-purple-300"
                            : "text-gray-400 hover:bg-white/5"
                            }`}
                    >
                        <span className="text-xl">📊</span>
                        Dashboard
                    </button>
                    <button
                        onClick={() => {
                            setActiveSection("orders");
                            fetchOrders();
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${activeSection === "orders"
                            ? "bg-purple-600/20 text-purple-300"
                            : "text-gray-400 hover:bg-white/5"
                            }`}
                    >
                        <span className="text-xl">📦</span>
                        Orders
                    </button>
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors font-semibold"
                    >
                        <span className="text-xl">🚪</span>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            {activeSection === "dashboard" && (
                <div className="lg:ml-64 p-4 lg:p-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Dashboard Overview</h1>
                                <p className="text-gray-400">Welcome back! Here's what's happening with your store.</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg"
                            >
                                <span className="text-xl">+</span>
                                Add New Product
                            </button>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-gray-400 text-sm font-medium">Total Products</p>
                                    <span className="text-2xl">📦</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                                <p className="text-xs text-green-400 mt-2">Active inventory</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-gray-400 text-sm font-medium">Total Value</p>
                                    <span className="text-2xl">💰</span>
                                </div>
                                <p className="text-3xl font-bold text-white">₹{stats.totalValue.toFixed(0)}</p>
                                <p className="text-xs text-blue-400 mt-2">Inventory worth</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-gray-400 text-sm font-medium">Avg Price</p>
                                    <span className="text-2xl">📊</span>
                                </div>
                                <p className="text-3xl font-bold text-white">₹{stats.avgPrice.toFixed(0)}</p>
                                <p className="text-xs text-purple-400 mt-2">Per product</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-gray-400 text-sm font-medium">Recent (7d)</p>
                                    <span className="text-2xl">🆕</span>
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.recentProducts}</p>
                                <p className="text-xs text-yellow-400 mt-2">New additions</p>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Search and Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/10 backdrop-blur-lg rounded-xl p-4 lg:p-6 border border-white/20 mb-6"
                    >
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="🔍 Search products by name, brand, or category..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-800/50 text-white rounded-lg border border-white/10 focus:border-purple-400 focus:outline-none placeholder-gray-500"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={filterGenre}
                                    onChange={(e) => setFilterGenre(e.target.value)}
                                    className="px-4 py-3 bg-slate-800/50 text-white rounded-lg border border-white/10 focus:border-purple-400 focus:outline-none"
                                >
                                    <option value="all">All Categories</option>
                                    {genres.map(genre => (
                                        <option key={genre} value={genre}>{genre}</option>
                                    ))}
                                </select>
                                <div className="flex bg-slate-800/50 rounded-lg border border-white/10 p-1">
                                    <button
                                        onClick={() => setViewMode("table")}
                                        className={`px-3 py-2 rounded ${viewMode === "table" ? "bg-purple-600 text-white" : "text-gray-400"}`}
                                    >
                                        📋
                                    </button>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`px-3 py-2 rounded ${viewMode === "grid" ? "bg-purple-600 text-white" : "text-gray-400"}`}
                                    >
                                        ⊞
                                    </button>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 mt-3">
                            Showing {filteredProducts.length} of {products.length} products
                        </p>
                    </motion.div>

                    {/* Products Display */}
                    <div id="products-section">
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20"
                            >
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
                                <p className="text-gray-400 mb-6">
                                    {searchTerm || filterGenre !== "all"
                                        ? "Try adjusting your search or filter criteria"
                                        : "Get started by adding your first product!"}
                                </p>
                                {!searchTerm && filterGenre === "all" && (
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all inline-flex items-center gap-2"
                                    >
                                        <span className="text-xl">+</span>
                                        Add Your First Product
                                    </button>
                                )}
                            </motion.div>
                        ) : viewMode === "table" ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-white/5 border-b border-white/10">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Product</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Brand</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {filteredProducts.map((product, index) => (
                                                <motion.tr
                                                    key={product._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-white/5 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={product.image}
                                                                alt={product.title}
                                                                className="w-12 h-12 rounded-lg object-cover border border-white/20"
                                                            />
                                                            <div>
                                                                <p className="text-white font-semibold">{product.title}</p>
                                                                <p className="text-gray-400 text-sm line-clamp-1">{product.description}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-gray-300">{product.brand || "N/A"}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium">
                                                            {product.genre}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-green-400 font-semibold">₹{product.price}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                ✏️ Edit
                                                            </button>
                                                            <button
                                                                onClick={() => setDeleteConfirm(product)}
                                                                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-sm font-medium transition-colors"
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.title}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-2">{product.title}</h3>
                                            <p className="text-gray-300 text-sm mb-1">{product.brand}</p>
                                            <p className="text-gray-400 text-xs mb-2">{product.genre}</p>
                                            <p className="text-purple-300 font-semibold text-lg mb-4">₹{product.price}</p>
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
                            </div>
                        )}
                    </div>
                </div>

            )
            }

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
                            className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">✏️ Edit Product</h2>
                            <form onSubmit={handleUpdateProduct} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={editForm.price}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Brand *</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={editForm.brand}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                                        <input
                                            type="text"
                                            name="genre"
                                            value={editForm.genre}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL *</label>
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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
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
                                        💾 Update Product
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
                            className="bg-slate-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">➕ Add New Product</h2>
                            <form onSubmit={handleCreateProduct} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
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
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Price *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={createForm.price}
                                            onChange={handleCreateChange}
                                            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Brand *</label>
                                        <input
                                            type="text"
                                            name="brand"
                                            value={createForm.brand}
                                            onChange={handleCreateChange}
                                            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
                                        <input
                                            type="text"
                                            name="genre"
                                            value={createForm.genre}
                                            onChange={handleCreateChange}
                                            className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Image URL *</label>
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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
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
                                        ✨ Create Product
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
                            <div className="text-center mb-6">
                                <div className="text-6xl mb-4">⚠️</div>
                                <h2 className="text-2xl font-bold text-white mb-2">Confirm Delete</h2>
                                <p className="text-gray-300">
                                    Are you sure you want to delete <span className="font-semibold text-white">"{deleteConfirm.title}"</span>?
                                </p>
                                <p className="text-red-400 text-sm mt-2">This action cannot be undone.</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleDeleteProduct(deleteConfirm._id)}
                                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
                                >
                                    🗑️ Delete
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

            {/* Orders Section */}
            {
                activeSection === "orders" && (
                    <div className="lg:ml-64 p-4 lg:p-8">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8"
                        >
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Orders Management</h1>
                            <p className="text-gray-400">View and manage all customer orders</p>
                        </motion.div>

                        {loadingOrders ? (
                            <div className="text-center py-12">
                                <div className="text-2xl font-bold text-white">Loading orders...</div>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
                                <p className="text-gray-400">Orders will appear here once customers start placing them</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order, index) => (
                                    <motion.div
                                        key={order._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                                            <div>
                                                <p className="text-sm text-gray-400">Order Number</p>
                                                <p className="text-xl font-bold text-white">{order.orderNumber}</p>
                                            </div>
                                            <div className="flex gap-4 mt-2 lg:mt-0">
                                                <div>
                                                    <p className="text-sm text-gray-400">Customer</p>
                                                    <p className="font-semibold text-white">{order.user?.name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Date</p>
                                                    <p className="font-semibold text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-400">Total</p>
                                                    <p className="font-bold text-green-400">₹{order.totalAmount.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-white/10 pt-4 mb-4">
                                            <p className="text-sm text-gray-400 mb-2">Items ({order.items.length})</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {order.items.slice(0, 3).map((item, idx) => (
                                                    <div key={idx} className="flex gap-2 bg-white/5 rounded-lg p-2">
                                                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-white truncate">{item.title}</p>
                                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {order.items.length > 3 && (
                                                <p className="text-xs text-gray-400 mt-2">+ {order.items.length - 3} more items</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10 pt-4">
                                            <div className="flex gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Payment</p>
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300">
                                                        {order.paymentMethod}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 mb-1">Status</p>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-300' :
                                                        order.orderStatus === 'Shipped' ? 'bg-purple-500/20 text-purple-300' :
                                                            order.orderStatus === 'Confirmed' ? 'bg-blue-500/20 text-blue-300' :
                                                                order.orderStatus === 'Cancelled' ? 'bg-red-500/20 text-red-300' :
                                                                    'bg-orange-500/20 text-orange-300'
                                                        }`}>
                                                        {order.orderStatus}
                                                    </span>
                                                </div>
                                            </div>
                                            <select
                                                value={order.orderStatus}
                                                onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                                                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            {/* Mobile Logout Button */}
            <div className="lg:hidden fixed bottom-4 right-4">
                <button
                    onClick={handleLogout}
                    className="px-4 py-3 bg-red-500/90 backdrop-blur-lg text-white rounded-full font-semibold hover:bg-red-600 transition-all shadow-lg flex items-center gap-2"
                >
                    <span>🚪</span>
                    Logout
                </button>
            </div>
        </div>
    );
}

export default AdminDashboard;


