
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  
  return (
    <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-400">
            HackathonHub
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`navigation-link ${location.pathname === "/" ? "text-foreground after:scale-x-100" : ""}`}
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to={user?.role === "admin" ? "/admin-dashboard" : "/user-dashboard"} 
                className={`navigation-link ${
                  location.pathname.includes("dashboard") ? "text-foreground after:scale-x-100" : ""
                }`}
              >
                Dashboard
              </Link>
              
              <button 
                onClick={logout} 
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`navigation-link ${
                  location.pathname === "/login" ? "text-foreground after:scale-x-100" : ""
                }`}
              >
                Login
              </Link>
              
              <Link 
                to="/register" 
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
              >
                Register
              </Link>
            </>
          )}
        </nav>
        
        {/* Mobile menu button */}
        <button className="md:hidden text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
