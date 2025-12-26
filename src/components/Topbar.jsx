import React from 'react';
import { Search, Bell, User } from 'lucide-react';

const Topbar = ({ userEmail }) => {
    return (
        <div className="topbar">
            <div className="search-bar">
                <Search size={18} className="text-slate-400" />
                <input type="text" placeholder="Search anything..." />
            </div>

            <div className="user-profile">
                <div className="notifications relative cursor-pointer">
                    <Bell size={20} className="text-slate-600" />
                    <span className="absolute -top-1 -right-1 bg-danger text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
                </div>

                <div className="flex items-center gap-3 ml-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold">{userEmail?.split('@')[0] || 'Admin'}</p>
                        <p className="text-xs text-slate-500">Super Admin</p>
                    </div>
                    <div className="avatar">
                        {userEmail?.[0].toUpperCase() || <User size={20} />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Topbar;
