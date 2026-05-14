import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);
   const location = useLocation();

   const navItems = [
      { name: 'HOME', path: '/' },
      { name: 'TERMS', path: '/terms' },
      { name: 'LIVE DASHBOARD', path: '/dashboard' },
      { name: 'SUPPORT', path: '/help' },
   ];

   return (
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 fixed w-full top-0 z-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex justify-center items-center h-16">
               {/* Desktop/Tablet Menu - Centered */}
               <div className="hidden md:flex space-x-8">
                  {navItems.map((item) => (
                     <Link
                        key={item.name}
                        to={item.path}
                        className={`text-sm font-semibold tracking-widest transition-colors duration-300 ${location.pathname === item.path
                           ? 'text-blue-600 border-b-2 border-blue-600'
                           : 'text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-blue-300'
                           } py-2`}
                     >
                        {item.name}
                     </Link>
                  ))}
               </div>

               {/* Mobile Menu Button - Positioned Right */}
               <div className="absolute right-0 flex items-center md:hidden">
                  <button
                     onClick={() => setIsOpen(!isOpen)}
                     className="text-gray-600 hover:text-blue-600 focus:outline-none"
                  >
                     {isOpen ? <X size={28} /> : <Menu size={28} />}
                  </button>
               </div>
            </div>
         </div>

         {/* Mobile Menu Dropdown */}
         {isOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 absolute w-full">
               <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
                  {navItems.map((item) => (
                     <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === item.path
                           ? 'text-blue-600 bg-blue-50'
                           : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                           }`}
                     >
                        {item.name}
                     </Link>
                  ))}
               </div>
            </div>
         )}
      </nav>
   );
};

export default Navbar;
