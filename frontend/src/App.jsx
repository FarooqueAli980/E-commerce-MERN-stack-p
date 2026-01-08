import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/ui/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import AdminPanel from "./pages/AdminPanel";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Return from "./pages/Return";
import Products from "./pages/Products";
import ProductView from "./pages/ProductView";
// import { Toaster } from "./components/ui/sonner.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <>
      <Navbar />
      <Home />
      <Footer/>
    </>
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/verify',
    element: <Verify />
  },
  
  {
    path: '/verify/:token',
    element: <VerifyEmail/>
  },
  
  {
    path: '/admin',
    element: <>
      <Navbar />
      <AdminPanel />
      <Footer/>
    </>
  },

  {
    path: '/cart',
    element: <>
      <Navbar />
      <Cart />
      <Footer/>
    </>
  },

  {
    path: '/checkout',
    element: <>
      <Navbar />
      <Checkout />
      <Footer/>
    </>
  },

  {
    path: '/order-success',
    element: <>
      <Navbar />
      <OrderSuccess />
      <Footer/>
    </>
  },

  {
    path: '/return',
    element: <>
      <Navbar />
      <Return />
      <Footer/>
    </>
  },

  {
    path: '/products',
    element: <>
      <Navbar />
      <Products />
      <Footer/>
    </>
  },

  {
    path: '/product/:productId',
    element: <>
      <Navbar />
      <ProductView />
      <Footer/>
    </>
  },
]);

function App() {
  return (
    <>

      <RouterProvider router={router} />
    </>
  );
}

export default App;
