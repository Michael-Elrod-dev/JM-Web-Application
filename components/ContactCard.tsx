// components/ContactCard.tsx
import React from 'react';
import CardFrame from './CardFrame';

interface ContactCardProps {
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  showCheckbox?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({ 
  user_name, 
  user_email, 
  user_phone, 
  showCheckbox = false 
}) => {
  return (
    <CardFrame>
      <div className="grid grid-cols-3 items-center">
        {showCheckbox && <input type="checkbox" className="mr-4" />}
        <span className="text-lg">{user_name}</span>
        <span className="text-lg text-center">{user_phone}</span>
        <span className="text-lg text-right">{user_email}</span>
      </div>
    </CardFrame>
  );
};

export default ContactCard;