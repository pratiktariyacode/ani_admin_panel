import React, { useEffect, useState } from 'react';
import { getOrders, updateOrderStatus } from '../firebase/orders';
import { getUsers } from '../firebase/users'; // Fetch user info
import { ShoppingCart, Eye, X, Package, MapPin, CreditCard } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const orderData = await getOrders();
                setOrders(orderData);

                const userData = await getUsers();
                const userMap = {};
                userData.forEach(user => {
                    userMap[user.id] = user;
                });
                setUsers(userMap);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(
                orders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const getStatusColor = status => {
        switch (status?.toLowerCase()) {
            case 'delivered':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'processing':
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'pending':
                return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'shipped':
                return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'cancelled':
                return 'bg-red-50 text-red-600 border-red-100';
            default:
                return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    return (
        <div className="page-container">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">Customer Orders</h1>
                <p className="text-slate-500">Track and manage your customer orders</p>
            </div>

            <div className="data-table-container">
                <table className="data-table w-full">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {
                            const user = users[order.userId] || {};
                            return (
                                <tr key={order.id}>
                                    <td className="font-mono text-xs text-slate-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                                    <td>{user.name || order.customerName || 'Walk-in Customer'}</td>
                                    <td>{user.email || order.customerEmail || 'N/A'}</td>
                                    <td>{user.phone || order.phone || 'N/A'}</td>
                                    <td>{order.orderDate?.split('T')[0] || '2025-12-26'}</td>
                                    <td className="font-bold">${order.total || '0.00'}</td>
                                    <td>
                                        <select
                                            value={order.status || 'Pending'}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            className={`px-2 py-1 rounded-md text-xs font-semibold border outline-none cursor-pointer ${getStatusColor(order.status || 'Pending')}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="8" className="text-center py-12 text-slate-400">
                                    <ShoppingCart size={48} className="mx-auto mb-4 opacity-10" />
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-auto max-h-[90vh]">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Order #{selectedOrder.id.slice(0, 8).toUpperCase()}</h2>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Shipping Info */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><MapPin size={18} /> Shipping Info</h3>
                                <p>Name: {users[selectedOrder.userId]?.name || selectedOrder.customerName}</p>
                                <p>Email: {users[selectedOrder.userId]?.email || selectedOrder.customerEmail}</p>
                                <p>Phone: {users[selectedOrder.userId]?.phone || selectedOrder.phone}</p>
                                <p>
                                    Address: {selectedOrder.deliveryAddress?.home}, {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state}, {selectedOrder.deliveryAddress?.country} - {selectedOrder.deliveryAddress?.pin}
                                </p>
                            </div>

                            {/* Payment Info */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><CreditCard size={18} /> Payment</h3>
                                <p>Method: {selectedOrder.paymentMethod || 'Credit Card'}</p>
                                <p>Status: <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                            </div>

                            {/* Items Info */}
                            <div>
                                <h3 className="font-semibold flex items-center gap-2"><Package size={18} /> Items</h3>
                                <div className="divide-y border rounded">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={index} className="flex justify-between p-2">
                                            <div className="flex items-center gap-2">
                                                <img src={item.imageUrl || 'https://via.placeholder.com/40'} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                                <span>{item.name}</span>
                                            </div>
                                            <span>{item.quantity} × ${item.price}</span>
                                            <span>${(item.quantity * item.price).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-end gap-8 font-bold text-lg pt-2">
                                <div>Total:</div>
                                <div>${selectedOrder.total || '0.00'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
