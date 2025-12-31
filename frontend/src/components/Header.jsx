import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

const Header = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { cartCount } = useCart();

  // Read auth from localStorage
  useEffect(() => {
    const readAuth = () => {
      const token = localStorage.getItem("token");
      const name = localStorage.getItem("userName") || "";
      setLoggedIn(!!token);
      setUserName(name);
    };

    readAuth();
    window.addEventListener("storage", readAuth);
    return () => window.removeEventListener("storage", readAuth);
  }, []);

  // Close dropdown on outside click & ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") setShowMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keyup", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keyup", handleEsc);
    };
  }, []);

  const links = [
    { to: "/home", label: "Home" },
    { to: "/products", label: "Store" },
    { to: "/about-us", label: "About Us" },
    { to: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md max-w-full">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 text-white w-full">

        {/* Logo */}
        <Link to="/home" className="text-lg font-bold tracking-tight">
          SneakerSoul
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-4 text-sm font-semibold">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 transition hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}

          {/* Cart Icon */}
          {loggedIn && (
            <Link
              to="/cart"
              className="relative rounded-md px-3 py-2 transition hover:bg-white/10"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {!loggedIn && (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-2 transition hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md px-3 py-2 transition hover:bg-white/10"
              >
                Register
              </Link>
            </>
          )}

          {loggedIn && (
            <div className="relative ml-2" ref={menuRef}>
              {/* Profile Button */}
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/50 bg-white/10 text-white shadow-sm transition hover:bg-white/20"
                aria-label="Profile"
                title={userName || "Profile"}
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <span className="text-xs font-bold uppercase">
                  {(userName || "U").trim().charAt(0)}
                </span>
              </button>

              {/* Dropdown */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-white/20 bg-slate-950/95 py-1 text-xs shadow-2xl z-[999] backdrop-blur">

                  {/* My Orders */}
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-white hover:bg-white/10"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/my-orders");
                    }}
                  >
                    My Orders
                  </button>

                  {/* Manage Profile */}
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-white hover:bg-white/10"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/profile");
                    }}
                  >
                    Manage Profile
                  </button>

                  <div className="my-1 h-px bg-white/10" />

                  {/* Logout */}
                  <button
                    type="button"
                    className="block w-full px-3 py-2 text-left text-red-400 hover:bg-white/10"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userName");
                      localStorage.removeItem("userEmail");
                      setLoggedIn(false);
                      setUserName("");
                      setShowMenu(false);
                      navigate("/login");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
