
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { DEFAULT_USER_AVATAR } from '../constants';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for an existing session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userType: 'consumer' | 'creator') => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const user: User = {
        id: Date.now().toString(),
        username: userType === 'creator' ? 'CreatorUser123' : 'ConsumerUser789',
        email: userType === 'creator' ? 'creator@example.com' : 'consumer@example.com',
        accountType: userType,
        avatarUrl: DEFAULT_USER_AVATAR,
      };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setIsLoading(false);
    }, 500);
  };

  const logout = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      setIsLoading(false);
    }, 300);
  };
  
  const guestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      const guestUser: User = {
        id: 'guest',
        username: 'Guest User',
        accountType: 'guest',
        avatarUrl: DEFAULT_USER_AVATAR,
      };
      setCurrentUser(guestUser);
      // Optionally store guest session, or not for true ephemeral guest access
      // localStorage.setItem('currentUser', JSON.stringify(guestUser)); 
      setIsLoading(false);
    }, 300);
  };

  // Automatically log in as guest if no user is found after initial check
  useEffect(() => {
    if (!isLoading && !currentUser) {
      guestLogin();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]); // Run only when isLoading changes, specifically after initial load


  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
