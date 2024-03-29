import React from "react";
import AdminCard from "./AdminCard";
import { useAuth } from '../authFile/AuthContext';

const AdminProfileCard = () => {
    const { isAdmin, logout } = useAuth();
    return (
        <div className="admin-profile-card">
            {isAdmin && (
                <>
                    <div className="admin-space">
                        <h2> Welcome to the management portal</h2>
                        <button onClick={logout} className="logout-button">Logout</button>
                    </div>
                    <AdminCard />
                </>
            )}
        </div>
    )
}

export default AdminProfileCard