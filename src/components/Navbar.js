import React from 'react';
import { NavLink } from 'react-router-dom';
import { Film, ListPlus, ShoppingCart, Info } from 'lucide-react';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="logo">
                <h2>EZTechMovie: Stream List</h2>
            </div>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" end>
                        <ListPlus className="icon" /> Stream List
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/movies">
                        <Film className="icon" /> Movies
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/cart">
                        <ShoppingCart className="icon" /> Cart
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/about">
                        <Info className="icon" /> About
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;