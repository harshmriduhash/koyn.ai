
import React from 'react';
import { APP_NAME } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card-light dark:bg-card-dark border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary-DEFAULT dark:hover:text-primary-light">Privacy Policy</a>
            <a href="#" className="text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary-DEFAULT dark:hover:text-primary-light">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
