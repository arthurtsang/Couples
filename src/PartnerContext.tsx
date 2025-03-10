import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Partner } from './types';

interface PartnerContextType {
  selectedPartner: Partner | null;
  setSelectedPartner: (partner: Partner | null) => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export function PartnerProvider({ children }: { children: ReactNode }) {
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  return (
    <PartnerContext.Provider value={{ selectedPartner, setSelectedPartner }}>
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (!context) throw new Error('usePartner must be used within a PartnerProvider');
  return context;
}