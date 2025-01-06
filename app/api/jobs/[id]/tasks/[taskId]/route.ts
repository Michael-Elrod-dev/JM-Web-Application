// app/api/jobs/[id]/tasks/[taskId]/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { TaskUpdatePayload } from '@/app/types/database';
import { RowDataPacket } from 'mysql2';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string, taskId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json(
      { error: 'Unauthorized: Session not found or user not authenticated' },
      { status: 401 }
    );
  }
  const connection = await pool.getConnection();

  try {
    const body: TaskUpdatePayload = await request.json();
    const taskId = params.taskId;
    const jobId = params.id;
    const userId = parseInt(session.user.id);

    await connection.beginTransaction();

    // Verify task belongs to this job (existing code)
    const [taskCheck] = await connection.query<RowDataPacket[]>(
      `SELECT t.task_id 
       FROM task t
       JOIN phase p ON t.phase_id = p.phase_id
       WHERE t.task_id = ? AND p.job_id = ?`,
      [taskId, jobId]
    );

    if (!taskCheck.length) {
      return NextResponse.json(
        { error: 'Task not found or does not belong to this job' },
        { status: 404 }
      );
    }

    // Handle basic updates (existing code)
    if (body.task_title) {
      await connection.query(
        'UPDATE task SET task_title = ? WHERE task_id = ?',
        [body.task_title, taskId]
      );
    }

    if (body.task_description) {
      await connection.query(
        'UPDATE task SET task_description = ? WHERE task_id = ?',
        [body.task_description, taskId]
      );
    }

    if (body.extension_days && !isNaN(body.extension_days)) {
      await connection.query(
        'UPDATE task SET task_duration = task_duration + ? WHERE task_id = ?',
        [body.extension_days, taskId]
      );
    }

    // Handle user assignments
    if (body.new_users) {
      // Get current user assignments
      const [currentUsers] = await connection.query<RowDataPacket[]>(
        'SELECT user_id FROM user_task WHERE task_id = ?',
        [taskId]
      );
      
      const currentUserIds = new Set(currentUsers.map(u => u.user_id));
      const newUserIds = new Set(body.new_users);
      
      // Users to remove (in current but not in new)
      const usersToRemove = Array.from(currentUserIds).filter(id => !newUserIds.has(id));
      
      // Users to add (in new but not in current)
      const usersToAdd = Array.from(newUserIds).filter(id => !currentUserIds.has(id));

      // Verify all new users exist
      if (usersToAdd.length > 0) {
        const [users] = await connection.query<RowDataPacket[]>(
          'SELECT user_id FROM app_user WHERE user_id IN (?)',
          [usersToAdd]
        );

        if (users.length !== usersToAdd.length) {
          throw new Error('One or more invalid user IDs');
        }
      }

      // Remove users no longer assigned
      if (usersToRemove.length > 0) {
        await connection.query(
          'DELETE FROM user_task WHERE task_id = ? AND user_id IN (?)',
          [taskId, usersToRemove]
        );
      }

      // Add new users
      for (const newUser of usersToAdd) {
        await connection.query(
          `INSERT INTO user_task (user_id, task_id, assigned_by) 
           VALUES (?, ?, ?)`,
          [newUser, taskId, userId]
        );
      }
    }

    await connection.commit();
    return NextResponse.json({ success: true });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string, taskId: string } }
) {
  const connection = await pool.getConnection();

  try {
    const taskId = params.taskId;
    const jobId = params.id;

    await connection.beginTransaction();

    // Verify task belongs to this job
    const [taskCheck] = await connection.query<RowDataPacket[]>(
      `SELECT t.task_id 
       FROM task t
       JOIN phase p ON t.phase_id = p.phase_id
       WHERE t.task_id = ? AND p.job_id = ?`,
      [taskId, jobId]
    );

    if (!taskCheck.length) {
      return NextResponse.json(
        { error: "Task not found or does not belong to this job" },
        { status: 404 }
      );
    }

    // Delete related entries
    await connection.query('DELETE FROM user_task WHERE task_id = ?', [taskId]);
    await connection.query('DELETE FROM task WHERE task_id = ?', [taskId]);

    await connection.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
