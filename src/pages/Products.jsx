import React, { useEffect, useState } from 'react';
import {
    getProducts,
    deleteProduct,
    addProduct
} from '../firebase/products';
import { getCategories } from '../firebase/categories';
import { Plus, Trash2, Edit3, Loader2 } from 'lucide-react';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '', description: '', stock: '' });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            fetchProducts();
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const productData = {
            ...newProduct,
            price: parseFloat(newProduct.price) || 0,
            stock: parseInt(newProduct.stock) || 0
        };
        await addProduct(productData);
        setNewProduct({ name: '', price: '', category: '', image: '', description: '', stock: '' });
        setShowModal(false);
        fetchProducts();
    };

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Product Inventory</h1>
                    <p className="text-slate-500">Manage your product catalog</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="data-table-container">
                {loading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : (
                    <table className="data-table w-full">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-slate-400">
                                        No products found. Add your first product!
                                    </td>
                                </tr>
                            )}
                            {products.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            {/* Fixed size image container */}
                                            <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                                <img
                                                    src={product.image || 'https://via.placeholder.com/150'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
                                                />
                                            </div>
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                    </td>
                                    <td>{product.category}</td>
                                    <td className="font-semibold">${product.price}</td>
                                    <td>
                                        <span
                                            className={`px-2 py-1 rounded-md text-xs font-semibold ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}
                                        >
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                <Edit3 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-danger transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Add New Product</h2>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-primary"
                                    value={newProduct.category}
                                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-group">
                                    <label>Price ($)</label>
                                    <input
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stock Quantity</label>
                                    <input
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-primary min-h-[100px]"
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <div className="flex gap-4 items-start">
                                    <input
                                        type="text"
                                        className="flex-1 p-3 border border-slate-200 rounded-lg outline-none focus:border-primary"
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {newProduct.image && (
                                        <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                            <img
                                                src={newProduct.image}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn bg-slate-100 text-slate-600 flex-1"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary flex-1">
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
