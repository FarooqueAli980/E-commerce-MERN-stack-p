import React, { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";

const Navbar = () => {
  const { user } = useSelector(store => store.user);
  const { totalItems } = useSelector(store => store.cart);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  const logoutHandler = async () => {
    if (!accessToken) {
      toast.error("User not logged in or token missing");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.removeItem("accessToken");
        dispatch(setUser(null));
        setOpen(false);
        navigate("/");
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="bg-linear-to-r from-white via-blue-50 to-indigo-50 fixed w-full z-20 border-b-2 border-blue-200 shadow-lg backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4">

        <div className="flex items-center gap-3 group">
          <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-2 rounded-lg group-hover:shadow-lg transition-shadow">
            <ShoppingCart size={24} className="text-white" />
          </div>
          <img src="/e.png" alt="Logo" className="w-[140px] hover:opacity-80 transition-opacity" />
        </div>

        <button className="md:hidden text-blue-600 hover:text-indigo-600" onClick={() => setOpen(!open)}>
          {open ? <X size={32} /> : <Menu size={32} />}
        </button>

        <nav className={`
          flex flex-col md:flex-row md:items-center gap-8 text-base font-semibold
          absolute md:static bg-white md:bg-transparent left-0 w-full md:w-auto py-6 md:py-0 px-6 md:px-0
          transition-all duration-300 ease-in-out border-b md:border-b-0 border-blue-100
          ${open ? "top-16 opacity-100 shadow-xl" : "top-[-500px] opacity-0 md:opacity-100"}
        `}>
          <Link to="/" onClick={() => setOpen(false)}>
            <li className="list-none text-gray-700 hover:text-blue-600 transition-all duration-300 relative group">
              Home
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </li>
          </Link>
          <Link to="/products" onClick={() => setOpen(false)}>
            <li className="list-none text-gray-700 hover:text-blue-600 transition-all duration-300 relative group">
              Products
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
            </li>
          </Link>
          {user && (
            <Link to="/profile" onClick={() => setOpen(false)}>
              <li className="list-none text-gray-700 hover:text-blue-600 transition-all duration-300 relative group">
                👋 Hi, {user.firstName}!
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-linear-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300"></span>
              </li>
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link to="/admin" onClick={() => setOpen(false)}>
              <li className="list-none bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-md hover:shadow-lg transition-shadow">⚙️ Admin Panel</li>
            </Link>
          )}
          <Link to="/cart" className="relative md:ml-2" onClick={() => setOpen(false)}>
            <div className="relative group cursor-pointer">
              <ShoppingCart size={28} className="text-blue-600 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="bg-gradient-to-r from-red-500 to-pink-500 rounded-full absolute text-white -top-3 -right-3 px-2 text-xs font-bold shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>
          {user ? (
            <Button
              onClick={logoutHandler}
              className="bg-linear-to-r from-red-500 to-pink-500 hover:shadow-lg text-white cursor-pointer rounded-full px-6 font-bold transition-all transform hover:scale-105"
            >
              Logout
            </Button>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              <Button className="bg-linear-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white cursor-pointer font-bold rounded-full px-8 transition-all transform hover:scale-105">
                Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
