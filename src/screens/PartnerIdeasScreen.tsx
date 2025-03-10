import IdeasScreen from './IdeasScreen';
import { usePartner } from '../PartnerContext';
import React from 'react';

export default function PartnerIdeasScreen() {
  const { selectedPartner } = usePartner();
  const title = selectedPartner
    ? `${selectedPartner[selectedPartner.preferredName]}'s Ideas`
    : "Partner's Ideas";
  return <IdeasScreen title={title} />;
}