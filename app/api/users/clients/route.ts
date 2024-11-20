// app/api/users/clients/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  try {
    const connection = await pool.getConnection();
    try {
      // If no search param, return all clients
      if (!search) {
        const [rows] = await connection.execute(`
          SELECT user_id, user_name, user_email, user_phone
          FROM app_user
          WHERE user_type = 'Client'
          ORDER BY user_name
          LIMIT 50
        `);
        return NextResponse.json(rows);
      }

      // If search param exists, filter clients
      const [rows] = await connection.execute(`
        SELECT user_id, user_name, user_email, user_phone
        FROM app_user
        WHERE user_type = 'Client'
        AND (
          user_name LIKE ? OR
          user_email LIKE ? OR
          user_phone LIKE ?
        )
        ORDER BY user_name
        LIMIT 50
      `, [`%${search}%`, `%${search}%`, `%${search}%`]);

      return NextResponse.json(rows);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}