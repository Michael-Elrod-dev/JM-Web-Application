// components/ContactCard.tsx
import React from 'react';
import CardFrame from './CardFrame';
import { AppUser } from '@/app/types';

const ContactCard: React.FC<AppUser> = ({ user_name, user_email, user_phone, user_type }) => {
  return (
    <CardFrame>
      <div className="flex items-center">
        <input type="checkbox" className="mr-4" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium">{user_name}</h3>
            <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {user_type}
            </span>
          </div>
          <p className="text-sm">{user_email}</p>
          <p className="text-sm">{user_phone}</p>
        </div>
      </div>
    </CardFrame>
  );
};

export default ContactCard;