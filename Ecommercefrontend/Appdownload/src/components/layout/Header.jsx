import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-none">
          <Link to="/" className="text-2xl font-bold hover:text-gray-200 transition-colors">
            Tech & Timepieces
          </Link>
        </div>

        <div className="flex items-center space-x-6 justify-end">
          {isAuthenticated ? (
            <>
              <span className="text-gray-300">
                Welcome, {user ? (user.name || user.username) : "User"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
              >
                Logout
              </button>
              {!user?.is_admin && (
                <Link 
                  to="/cart" 
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
                >
                  Cart
                </Link>
              )}
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;