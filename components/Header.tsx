import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';
import { APP_NAME } from '../constants';
import { UserCircleIcon, SparklesIcon, KeyIcon, ArrowUpOnSquareIcon, ChartBarIcon, XMarkIcon } from './IconComponents';
import LoadingSpinner from './LoadingSpinner';


const Header: React.FC = () => {
  const { currentUser, login, logout, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-DEFAULT text-white'
        : 'text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700'
    }`;
  
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
    isActive
      ? 'bg-primary-DEFAULT text-white'
      : 'text-text-light dark:text-text-dark hover:bg-gray-200 dark:hover:bg-gray-700'
  }`;


  const renderAuthSection = () => {
    if (isLoading) {
      return <div className="w-24 h-8 flex items-center justify-center"><LoadingSpinner size="sm" /></div>;
    }
    if (currentUser && currentUser.accountType !== 'guest') {
      return (
        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <img src={currentUser.avatarUrl} alt={currentUser.username} className="w-8 h-8 rounded-full" />
            <span className="hidden md:inline text-text-light dark:text-text-dark">{currentUser.username}</span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-card-light dark:bg-card-dark rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
            <Link to="/dashboard" className="block px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</Link>
            {currentUser.accountType === 'creator' && (
               <Link to="/creator-portal" className="block px-4 py-2 text-sm text-text-light dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700">Creator Portal</Link>
            )}
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => login('consumer')}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark rounded-md transition-colors"
        >
          Login
        </button>
         <button
          onClick={() => login('creator')}
          className="hidden md:block px-4 py-2 text-sm font-medium text-primary-DEFAULT border border-primary-DEFAULT hover:bg-primary-DEFAULT/10 rounded-md transition-colors"
        >
          Become a Creator
        </button>
      </div>
    );
  };
  
  const commonNavLinks = (
    <>
      <NavLink to="/" className={isMobileMenuOpen ? mobileNavLinkClasses : navLinkClasses} end>
        Models
      </NavLink>
      <NavLink to="/developer-tools" className={isMobileMenuOpen ? mobileNavLinkClasses : navLinkClasses}>
        Developer Tools
      </NavLink>
    </>
  );

  const userSpecificNavLinks = (
    <>
      {currentUser && currentUser.accountType !== 'guest' && (
        <NavLink to="/dashboard" className={isMobileMenuOpen ? mobileNavLinkClasses : navLinkClasses}>
          Dashboard
        </NavLink>
      )}
      {currentUser && currentUser.accountType === 'creator' && (
        <NavLink to="/creator-portal" className={isMobileMenuOpen ? mobileNavLinkClasses : navLinkClasses}>
          Creator Portal
        </NavLink>
      )}
    </>
  );


  return (
    <header className="bg-card-light dark:bg-card-dark shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
              <SparklesIcon size={28} className="text-primary-DEFAULT" />
              <span className="font-bold text-xl text-text-light dark:text-text-dark">{APP_NAME}</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            {commonNavLinks}
            {userSpecificNavLinks}
          </nav>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <div className="hidden md:block">{renderAuthSection()}</div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-DEFAULT"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon size={24} className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {commonNavLinks}
            {userSpecificNavLinks}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700 px-2 sm:px-3">
            {renderAuthSection()}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;