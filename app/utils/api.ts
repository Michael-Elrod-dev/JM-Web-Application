// app/utils/api.ts
import { AppUser } from '@/app/types';

export async function fetchUsers(): Promise<AppUser[]> {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}