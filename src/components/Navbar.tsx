import { List } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: "/books", label: "All Books" },
    { path: "/create-book", label: "Add Book" },
    { path: "/borrow-summary", label: "Borrow Summary" },
  ];

  return (
    <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 text-white hover:text-blue-400 transition-colors"
          >
            <List className="h-8 w-8" />
            <span className="text-xl font-bold">LibraryTM</span>
          </Link>

          <div className="flex space-x-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <span className="inline text-[13px] sm:text-[15px]">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
