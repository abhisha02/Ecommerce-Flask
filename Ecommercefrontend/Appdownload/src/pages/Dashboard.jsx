import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Custom Button Component
const Button = ({ children, onClick, className = "", ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Custom Card Component
const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-full ${className}`}>
      {children}
    </div>
  );
};

// Custom CardContent Component
const CardContent = ({ children, className = "" }) => {
  return <div className={`p-4 flex flex-col flex-grow ${className}`}>{children}</div>;
};

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products");
        setProducts(response.data.items || []);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(addToCart(product));
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Image */}
      <div className="relative w-full h-64">
        <img
          src="your-image-url-here" // Replace with your actual image URL
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-600/50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Welcome to Our Store</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Card key={product.id}>
                <div className="w-full h-48">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent>
                  <div className="flex-grow">
                    <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                    <p className="text-gray-600">Rs.{product.price}</p>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className="w-full"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;