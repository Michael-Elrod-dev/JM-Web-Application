// app/api/register/route.ts
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json();
    const hashedPassword = await hash(password, 12);

    await pool.execute(
      'INSERT INTO app_user (user_type, user_first_name, user_last_name, user_email, password) VALUES (?, ?, ?, ?, ?)',
      ['User', firstName, lastName, email, hashedPassword]
    );

    return NextResponse.json({ message: 'User created successfully' });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { message: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}