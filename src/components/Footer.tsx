import { BookOpen } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <BookOpen className="h-6 w-6 text-blue-500" />
            <span className="text-lg font-semibold text-gray-400">
              TM Library
            </span>
          </div>

          <div className="text-sm text-gray-400 text-center md:text-right">
            <p>&copy; 2025 Tarek Monowar And PH Instructor</p>
            <p className="mt-1">
              Built with React, TypeScript , Tailwind CSS ,ShadcnUi , Express
              .js And MongoDb
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
