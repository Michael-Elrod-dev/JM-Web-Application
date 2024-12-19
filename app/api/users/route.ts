// app/api/users/route.ts

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM app_user ORDER BY user_first_name, user_last_name'
    );
    connection.release();
    
    // console.log('Fetched users:', rows);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}