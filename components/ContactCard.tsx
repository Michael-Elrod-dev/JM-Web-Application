// components/ContactCard.tsx

import React from 'react';
import CardFrame from './CardFrame';

interface ContactData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

const ContactCard: React.FC<ContactData> = ({ name, email, phone }) => {
  return (
    <CardFrame>
      <div className="flex items-center">
        <input type="checkbox" className="mr-4" />
        <div className="flex-1">
          <h3 className="text-lg font-medium">{name}</h3>
          <p className="text-sm">{email}</p>
          <p className="text-sm">{phone}</p>
        </div>
      </div>
    </CardFrame>
  );
};

export default ContactCard;