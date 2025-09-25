'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';
import AuthModal from '@/components/AuthModel'; // Adjust the import path if necessary

interface ModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAuth = (data: any) => {
    console.log('Authentication data:', data);
    // Here you would typically handle the login/signup logic,
    // like calling an API, updating user state, etc.
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
        <AuthModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        // onAuth={handleAuth} 
      />
    </ModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within a ModalProvider');
  }
  return context;
};
      