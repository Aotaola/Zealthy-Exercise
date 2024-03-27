import React from "react";
import { useAuth } from '../authFile/AuthContext'; 
import { Link } from "react-router-dom";

const NavBar = () => {
    const { isAdmin } = useAuth();

    const links = [
        { name: "Home", link: "/" },
        { name: "Admin", link: "/admin_login" },
    ];

    return(
        <nav className={`navbar ${isAdmin ? 'navbar-admin' : ''}`}>
            <div className={`navbar-logo ${isAdmin ? 'navbar-logo-admin' : ''}`}>
                <h1>Zealthy</h1>
            </div>
            <div className="navbar-links">
                {links.map((link, index) => (
                    <Link key={index} to={link.link}  className={`nav-link ${isAdmin ? 'nav-link-admin' : ''}`}>
                        {link.name}
                    </Link>
                ))}
            </div>
        </nav>
    )
}

export default NavBar