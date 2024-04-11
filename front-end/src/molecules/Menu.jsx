import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Menu = () => {
  const { logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(true);
      } else {
        setMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-purple-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link to="/" className="text-xl font-bold">
            Organizador de Eventos Comunitarios
          </Link>
        </div>
        {isAuthenticated && (
          <>
            <nav className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="hover:text-purple-300">
                Dashboard
              </Link>
              <Link className="hover:text-gray-300">
                <button onClick={() => logout()}>Sair</button>
              </Link>
            </nav>
            <div className="md:hidden">
              <button
                className="focus:outline-none"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  )}
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
      {menuOpen && isAuthenticated && (
        <div className="md:hidden bg-purple-800 px-8">
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-white hover:bg-gray-700"
          >
            Dashboard
          </Link>
          <Link className="block px-4 py-2 text-white hover:bg-gray-700">
            <button onClick={() => logout()}>Sair</button>
          </Link>
        </div>
      )}
    </header>
  );
};
export default Menu;
