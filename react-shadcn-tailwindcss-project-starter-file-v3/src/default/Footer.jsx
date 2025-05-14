import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-100 via-white to-purple-100 text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center">
        {/* Left side - Logo and Copyright */}
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-extrabold text-black dark:text-white">
            ePortfolio
          </span>
          <span className="text-sm text-black dark:text-gray-300">
            &copy; {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        {/* Right side - Links */}
        <div className="flex space-x-8 mt-6 md:mt-0 text-sm">
          <Link to="#" className="text-black hover:text-blue-200 dark:hover:text-blue-300 transition ease-in-out duration-200 transform hover:scale-105">
            Privacy Policy
          </Link>
          <Link to="#" className="text-black hover:text-blue-200 dark:hover:text-blue-300 transition ease-in-out duration-200 transform hover:scale-105">
            Terms of Service
          </Link>
          <Link to="#" className="text-black hover:text-blue-200 dark:hover:text-blue-300 transition ease-in-out duration-200 transform hover:scale-105">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
