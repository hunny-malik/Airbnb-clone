'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { getDefaultUsers } from '@/services/api';

interface UserContextType {
  currentUser: User | null;
  guestUser: User | null;
  hostUser: User | null;
  isHostMode: boolean;
  toggleHostMode: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [guestUser, setGuestUser] = useState<User | null>(null);
  const [hostUser, setHostUser] = useState<User | null>(null);
  const [isHostMode, setIsHostMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const { guest, host } = await getDefaultUsers();
        setGuestUser(guest);
        setHostUser(host);
      } catch (err) {
        console.error("Failed to load users:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const toggleHostMode = () => {
    setIsHostMode((prev) => !prev);
  };

  const currentUser = isHostMode ? hostUser : guestUser;

  return (
    <UserContext.Provider
      value={{
        currentUser,
        guestUser,
        hostUser,
        isHostMode,
        toggleHostMode,
        isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
