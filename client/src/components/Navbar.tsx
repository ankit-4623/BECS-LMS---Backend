import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['Home', 'Courses', 'Notes', 'Technical', 'About', 'Contact'];

  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (onNavClick) {
      onNavClick(e, targetId);
    } else {
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full backdrop-blur-md z-[1000] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/[0.98] shadow-lg' 
          : 'bg-white/95 shadow-md'
      }`}
    >
      <nav className="flex justify-between items-center py-2 px-[5%] max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center text-xl font-bold text-red-700">
          <svg width="40" height="40" viewBox="0 0 100 100" className="mr-2.5">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#333" strokeWidth="4" />
            <rect x="20" y="35" width="12" height="12" fill="#333" />
            <path
              d="M35 35 L35 65 L50 65 Q65 65 65 50 Q65 35 50 35 L35 35 M35 45 L50 45 Q55 45 55 50 Q55 55 50 55 L35 55"
              fill="#c53030"
            />
            <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#333">BECS</text>
          </svg>
          BECS E-Learning
        </div>

        {/* Navigation Links */}
        <ul className={`${mobileMenuOpen 
          ? 'flex absolute top-full left-0 right-0 bg-white flex-col p-4 shadow-lg' 
          : 'hidden md:flex'} list-none gap-8`}
        >
          {navItems.map((item) => (
            <li key={item}>
              <a 
                href={`#${item.toLowerCase()}`} 
                onClick={(e) => handleNavClick(e, `#${item.toLowerCase()}`)}
                className="no-underline text-gray-800 font-medium transition-colors duration-300 relative hover:text-red-700 group"
              >
                {item}
                <span className="absolute w-0 h-0.5 -bottom-1 left-0 bg-red-700 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>

        {/* Login Button */}
        <a 
          href="/login" 
          className="bg-gradient-to-br from-red-700 to-red-800 text-white py-2.5 px-6 border-none rounded-full no-underline font-semibold transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
        >
          Login
        </a>

        {/* Mobile Menu Button */}
        <div 
          className="flex md:hidden flex-col gap-1.5 cursor-pointer p-1.5"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-gray-800 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
