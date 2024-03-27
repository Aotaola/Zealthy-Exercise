import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if the user is already logged in when the app loads
        const loggedInAdmin = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(loggedInAdmin);
    }, []);

    const login = () => {
        setIsAdmin(true);
        localStorage.setItem('isAdmin', 'true');
    };

    const logout = () => {
        setIsAdmin(false);
        localStorage.removeItem('isAdmin');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

