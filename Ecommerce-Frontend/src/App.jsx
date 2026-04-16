import "./App.css";
import React, { useState, lazy, Suspense } from "react";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddProduct from "./components/AddProduct";
import Product from "./components/Product";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./Context/Context";
import { AuthProvider } from "./Context/AuthContext";
import UpdateProduct from "./components/UpdateProduct";
const LandingPage = lazy(() => import("./pages/LandingPage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const Orders = lazy(() => import("./pages/Orders"));
import { Toaster } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { borderRadius: "12px", fontWeight: 500 },
            }}
          />
          <Routes>
            {/* Landing page — with suspense */}
            <Route path="/" element={<Suspense fallback={null}><LandingPage /></Suspense>} />

            {/* Auth pages — with suspense */}
            <Route path="/login" element={<Suspense fallback={null}><Login /></Suspense>} />
            <Route path="/register" element={<Suspense fallback={null}><Register /></Suspense>} />

            {/* App pages — with navbar */}
            <Route
              path="/*"
              element={
                <>
                  <Navbar onSelectCategory={handleCategorySelect} />
                  <Suspense fallback={<div className="aura-loader-full"></div>}>
                    <Routes>
                      <Route
                        path="/shop"
                        element={<Home selectedCategory={selectedCategory} />}
                      />
                      <Route path="/add_product" element={<AddProduct />} />
                      <Route path="/product" element={<Product />} />
                      <Route path="/product/:id" element={<Product />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/product/update/:id" element={<UpdateProduct />} />
                    </Routes>
                  </Suspense>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
