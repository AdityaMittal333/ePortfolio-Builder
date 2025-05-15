import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = ({ user, onLogin, onLogout }) => {
  const ownerId = localStorage.getItem("ownerId");

  return (
    <header className="w-full px-6 py-4 bg-white shadow-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 tracking-wide">
          <a href="/" className="hover:text-blue-500">ePortfolio</a>
        </div>

        {/* My Portfolio Button - always visible */}
        <div className="flex items-center space-x-4">
          <Link to={`/${ownerId}/profile`}>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              My Portfolio
            </Button>
          </Link>

          {/* Other Nav Links - hidden on small screens */}
          <nav className="hidden md:flex space-x-6 text-gray-600 font-medium items-center">
            <a href="/features" className="hover:text-blue-500">Features</a>
            <a href="/about" className="hover:text-blue-500">About</a>
            <a href="/contact" className="hover:text-blue-500">Contact</a>
          </nav>

          {/* Login / Logout Button */}
          {user ? (
            <Button onClick={onLogout} className="bg-blue-600 hover:bg-blue-700 text-white">
              Logout
            </Button>
          ) : (
            <Button onClick={onLogin} className="bg-blue-600 hover:bg-blue-700 text-white">
              Login with Google
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
