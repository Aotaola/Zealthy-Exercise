import React from "react";
import AdminCard from "./AdminCard";
import { useAuth } from '../authFile/AuthContext';
import log_out from "../assets/log_out.png"

const AdminProfileCard = () => {
    const { isAdmin, logout } = useAuth();
    return (
        <div className="admin-profile-card">
            {isAdmin && (
                <>
                    <div className="admin-space">
                        <button onClick={logout} className="logout-button">
                            <img src={log_out} alt="Log Out" className="logout-icon"/>
                        </button>
                    </div>
                    <AdminCard />
                </>
            )}
        </div>
    )
}

export default AdminProfileCard