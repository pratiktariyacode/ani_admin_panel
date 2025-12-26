import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { subscribeToAuth } from './firebase/auth';

// Components
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Login from './pages/Login';

// Styles
import './styles/main.css';

const App = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuth((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <Router>
            {!user ? (
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            ) : (
                <div className="app-container">
                    <Sidebar />
                    <main className="main-content">
                        <Topbar userEmail={user.email} />
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                </div>
            )}
        </Router>
    );
};

export default App;
