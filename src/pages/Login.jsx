import React, { useState } from 'react';
import { loginAdmin } from '../firebase/auth';
import { ShoppingBag } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await loginAdmin(email, password);
            // ✅ If admin → login success
        } catch (err) {
            // 🔐 ADMIN CHECK ERROR
            if (err.message === 'NOT_ADMIN') {
                setError('Access denied. Admin only.');
            } else {
                setError('Invalid email or password');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="flex justify-center mb-6">
                    <div className="bg-primary p-4 rounded-2xl shadow-lg">
                        <ShoppingBag size={32} className="text-white" />
                    </div>
                </div>

                <h2>Admin Login</h2>

                {error && (
                    <div className="bg-red-50 text-danger p-3 rounded-lg mb-4 text-sm text-center border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="admin@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full py-3"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Sign In'}
                    </button>
                </form>

                <p className="text-center text-slate-500 text-sm mt-6">
                    Please contact system administrator for access.
                </p>
            </div>
        </div>
    );
};

export default Login;
