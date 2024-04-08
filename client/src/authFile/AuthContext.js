import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminInfo, setAdminInfo] = useState(null);

    useEffect(() => {
        // Check if the user is already logged in when the app loads
        const loggedInAdmin = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(loggedInAdmin);
    }, []);

    const login = (adminData) => {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
        setAdminInfo(adminData);
    };

    const logout = () => {
        const logoutConfirmed = window.confirm('Are you sure you want to log out')
        if (logoutConfirmed) {
            setIsAdmin(false);
            setAdminInfo(null);
            localStorage.removeItem('isAdmin');
        }
    };

    return (
        <AuthContext.Provider value={{ isAdmin, adminInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

