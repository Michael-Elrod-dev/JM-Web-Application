// components/ContactCard.tsx
import React from 'react';
import CardFrame from './CardFrame';
import { ContactCardProps } from '../app/types/props';

const ContactCard: React.FC<ContactCardProps> = ({ 
  user_first_name,
  user_last_name, 
  user_email, 
  user_phone, 
  showCheckbox = false 
}) => {
  const fullName = `${user_first_name} ${user_last_name}`;

  return (
    <CardFrame noMargin> {/* Added noMargin prop */}
      <div className="grid grid-cols-3 items-center">
        {showCheckbox && <input type="checkbox" className="mr-4" />}
        <span className="text-lg">{fullName}</span>
        <span className="text-lg text-center">{user_phone}</span>
        <span className="text-lg text-right">{user_email}</span>
      </div>
    </CardFrame>
  );
};

export default ContactCard;