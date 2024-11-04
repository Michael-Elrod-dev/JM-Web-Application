// app/types/index.ts

export interface AppUser {
    user_id: number;
    user_type: 'Owner' | 'Admin' | 'User' | 'Client';
    user_name: string;
    user_phone: string;
    user_email: string;
    created_at?: string;
    updated_at?: string;
  }