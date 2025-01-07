// app/api/users/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/lib/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const connection = await pool.getConnection();

  try {
    const { firstName, lastName, email, phone, userType } =
      await request.json();

    await connection.execute(
      `UPDATE app_user 
       SET user_first_name = ?, 
           user_last_name = ?, 
           user_email = ?, 
           user_phone = ?, 
           user_type = ?
       WHERE user_id = ?`,
      [firstName, lastName, email, phone, userType, userId]
    );

    // Fetch the updated user to return
    const [rows] = await connection.execute(
      "SELECT * FROM app_user WHERE user_id = ?",
      [userId]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      return NextResponse.json(rows[0]);
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
