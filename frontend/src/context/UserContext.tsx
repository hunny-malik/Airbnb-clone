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
  const [guestUser, setGuestUser] = useState<User | null>({
    id: 4,
    name: "Aarav Verma",
    email: "guest@airbnb.com",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    bio: "Tech professional based in Gurugram exploring stays across India.",
    is_host: false,
    is_superhost: false,
    joined_date: "2022"
  });
  const [hostUser, setHostUser] = useState<User | null>({
    id: 1,
    name: "Rajesh Sharma",
    email: "rajesh.sharma@airbnb.com",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    bio: "Superhost running premier heritage stays and luxury penthouses.",
    is_host: true,
    is_superhost: true,
    joined_date: "2018"
  });
  const [isHostMode, setIsHostMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const { guest, host } = await getDefaultUsers();
        if (guest) setGuestUser(guest);
        if (host) setHostUser(host);
      } catch (err) {
        console.warn("Using default static guest/host profiles:", err);
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
