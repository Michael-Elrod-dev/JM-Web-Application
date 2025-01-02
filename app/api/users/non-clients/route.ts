// app/api/users/non-clients/route.ts

import { NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2';
import pool from '@/app/lib/db';

export async function GET() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute<RowDataPacket[]>(
      'SELECT * FROM app_user WHERE user_type <> "Client" ORDER BY user_first_name, user_last_name'
    );
    // Transform the database rows to match the UserView interface
    const transformedRows = rows.map((user: any) => ({
      user_id: user.user_id,
      first_name: user.user_first_name,
      last_name: user.user_last_name,
      user_email: user.user_email,
      user_phone: user.user_phone,
    }));

    connection.release();

    return NextResponse.json(transformedRows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
