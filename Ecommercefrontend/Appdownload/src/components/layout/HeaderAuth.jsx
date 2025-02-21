import { Link } from "react-router-dom";

const HeaderAuth = () => {
  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex-none">
          <Link to="/" className="text-2xl font-bold hover:text-gray-200 transition-colors">
            Tech & Timepieces
          </Link>
        </div>

       
      </div>
    </header>
  );
};

export default HeaderAuth;