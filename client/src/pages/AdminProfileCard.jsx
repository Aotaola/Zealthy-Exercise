import React from "react";
import AdminCard from "./AdminCard";
import { useAuth } from '../authFile/AuthContext';

const AdminProfileCard = () => {
    const { isAdmin } = useAuth();
    const {adminInfo} = useAuth();
    console.log(adminInfo);
    console.log(isAdmin);
    
    return (
        <div className="admin-profile-card">
            {isAdmin && (
                <>
                    <AdminCard />
                </>
            )}
        </div>
    )
}

export default AdminProfileCard