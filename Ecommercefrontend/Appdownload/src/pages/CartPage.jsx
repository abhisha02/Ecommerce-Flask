import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

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

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(cartItems);

  useEffect(() => {
    setCartData(cartItems);
  }, [cartItems]);

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  return (<>
  <Header/>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        {cartData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">Your cart is empty.</p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {cartData.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between"
              >
                <div className="flex items-center flex-1">
                  <img 
                    src={item.image_url} 
                    alt={item.name} 
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="ml-6">
                    <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                    <p className="text-gray-600 text-lg">Rs.{item.price.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    className="w-20 text-center border border-gray-300 rounded p-2"
                    min="1"
                  />
                  <Button 
                    className="bg-gray-600 hover:bg-gray-700"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-8 flex justify-between items-center">
              <Button 
                className="px-8"
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </Button>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">
                  Total: Rs.{cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CartPage;