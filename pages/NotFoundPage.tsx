import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../constants';

const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = `Page Not Found | ${APP_NAME}`;
  }, []);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center text-center px-4">
      <img src="https://picsum.photos/seed/404page/300/200" alt="Lost Robot" className="w-64 h-auto mb-8 rounded-lg shadow-md"/>
      <h1 className="text-6xl font-bold text-primary-DEFAULT dark:text-primary-light mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-text-light dark:text-text-dark mb-2">Oops! Page Not Found.</h2>
      <p className="text-lg text-text-muted-light dark:text-text-muted-dark mb-8">
        The page you're looking for doesn't seem to exist. Maybe it was moved, or you typed something wrong.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-primary-DEFAULT text-white font-semibold rounded-md hover:bg-primary-dark transition-colors shadow-lg"
      >
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;