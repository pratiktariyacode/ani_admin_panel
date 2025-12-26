import React, { useEffect, useState } from 'react';
import {
    DollarSign,
    ShoppingBag,
    ShoppingCart,
    TrendingUp
} from 'lucide-react';
import { getProducts } from '../firebase/products';
import { getOrders } from '../firebase/orders';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="stat-card">
        <div className={`stat-icon bg-${color}-50 text-${color}`}>
            {icon}
        </div>
        <div className="stat-info">
            <h3>{title}</h3>
            <p>{value}</p>
            {trend && <span className="text-xs text-success font-medium">+{trend}% from last month</span>}
        </div>
    </div>
);

const Dashboard = () => {
    const [productCount, setProductCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await getProducts();
                setProductCount(products.length);
                setRecentProducts(products.slice(0, 4));
                const orders = await getOrders();
                setOrderCount(orders.length);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="page-container">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back! Here's what's happening today.</p>
            </div>

            <div className="stats-grid">
                <StatCard
                    title="Total Sales"
                    value="$24,500"
                    icon={<DollarSign />}
                    color="indigo"
                    trend="12"
                />
                <StatCard
                    title="Total Orders"
                    value={orderCount}
                    icon={<ShoppingCart />}
                    color="emerald"
                    trend="8"
                />
                <StatCard
                    title="Total Products"
                    value={productCount}
                    icon={<ShoppingBag />}
                    color="orange"
                />
                <StatCard
                    title="Growth"
                    value="18.5%"
                    icon={<TrendingUp />}
                    color="rose"
                    trend="4"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold mb-4">Recent Actvity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <ShoppingCart size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">New order received from John Doe</p>
                                    <p className="text-xs text-slate-400">2 minutes ago</p>
                                </div>
                                <div className="ml-auto font-bold text-sm text-primary">+$120.00</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold mb-4">Top Categories</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Electronics</span>
                                <span className="font-semibold">65%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '65%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Fashion</span>
                                <span className="font-semibold">45%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-8 lg:mt-0">
                    <h3 className="font-bold mb-4">Latest Products</h3>
                    <div className="space-y-4">
                        {recentProducts.map(product => (
                            <div key={product.id} className="flex items-center gap-4 p-2 hover:bg-slate-50 transition-colors rounded-xl">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 overflow-hidden">
                                    <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{product.name}</p>
                                    <p className="text-xs text-slate-400">{product.category}</p>
                                </div>
                                <div className="font-bold text-sm text-slate-700">${product.price}</div>
                            </div>
                        ))}
                        {recentProducts.length === 0 && (
                            <p className="text-sm text-slate-400 text-center py-4">No products yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
