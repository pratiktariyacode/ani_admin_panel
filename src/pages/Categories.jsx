import React, { useState, useEffect } from 'react';
import { getCategories, addCategory, deleteCategory } from '../firebase/categories';
import { Plus, Trash2, Tag, Loader2 } from 'lucide-react';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        setSaving(true);
        try {
            await addCategory(newCategory);
            setNewCategory('');
            fetchCategories();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this category? Products might still be linked to it.')) {
            await deleteCategory(id);
            fetchCategories();
        }
    };

    return (
        <div className="page-container">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Product Categories</h1>
                <p className="text-slate-500">Organize your products with categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add Category Form */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold mb-4">Add New Category</h3>
                        <form onSubmit={handleAddCategory} className="space-y-4">
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Electronics, Fashion"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={saving || !newCategory.trim()}
                            >
                                {saving ? 'Adding...' : (
                                    <>
                                        <Plus size={20} />
                                        Add Category
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Categories List */}
                <div className="md:col-span-2">
                    <div className="data-table-container">
                        {loading ? (
                            <div className="flex justify-center p-12">
                                <Loader2 className="animate-spin text-primary" size={32} />
                            </div>
                        ) : (
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Category Name</th>
                                        <th>Created At</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categories.map((cat) => (
                                        <tr key={cat.id}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                                        <Tag size={16} />
                                                    </div>
                                                    <span className="font-medium">{cat.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-sm text-slate-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                                            <td className="text-right">
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="p-2 text-slate-400 hover:text-danger transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {categories.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="text-center py-12 text-slate-400">
                                                No categories found. Start by adding one.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
