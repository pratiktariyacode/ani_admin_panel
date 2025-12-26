import React, { useEffect, useState } from 'react';
import { User, Mail, MapPin, Calendar, Loader2 } from 'lucide-react';
import { getUsers } from '../firebase/users';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="page-container">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-1">User Management</h1>
                <p className="text-slate-500">View and manage your registered customers</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            ) : (
                <div className="data-table-container">
                    <table className="data-table w-full">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Location</th>
                                <th>Joined Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-12 text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm uppercase">
                                                {user.name ? user.name[0] : <User size={16} />}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-800">{user.name || 'Unknown User'}</div>
                                                <div className="text-xs text-slate-400">{user.email || 'No email'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 capitalize">
                                            {user.role || 'Customer'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <MapPin size={14} className="text-slate-400" />
                                            {user.location || 'N/A'}
                                        </div>
                                    </td>
                                    <td className="text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {user.joined || user.createdAt ? new Date(user.joined || user.createdAt).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex gap-2">
                                            <button className="btn btn-sm bg-slate-100 text-slate-600 hover:text-primary text-xs">View History</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Users;
