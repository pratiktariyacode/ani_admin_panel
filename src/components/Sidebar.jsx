import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    ShoppingCart,
    Users as UsersIcon,
    Settings,
    LogOut
} from 'lucide-react';
import { logoutAdmin } from '../firebase/auth';

const Sidebar = () => {
    const handleLogout = async () => {
        try {
            await logoutAdmin();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard /> },
        { name: 'Products', path: '/products', icon: <ShoppingBag /> },
        { name: 'Categories', path: '/categories', icon: <ShoppingCart /> },
        { name: 'Orders', path: '/orders', icon: <ShoppingCart /> },
        { name: 'Users', path: '/users', icon: <UsersIcon /> },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon bg-primary p-2 rounded-lg">
                    <ShoppingBag className="text-white" />
                </div>
                <span>AdminPanel</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                        {item.icon}
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer p-4 border-t border-slate-700">
                <button onClick={handleLogout} className="nav-link w-full text-left bg-transparent border-none cursor-pointer">
                    <LogOut />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
