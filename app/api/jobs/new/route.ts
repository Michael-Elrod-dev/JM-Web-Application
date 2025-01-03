// app/api/jobs/new/route.ts

import { NextResponse } from 'next/server';
import db from '../../../lib/db';
import { RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { NewJob } from '@/app/types/database';


// Validates that all assigned users exist in the database
async function validateUsers(connection: PoolConnection, userIds: number[]) {
  if (userIds.length === 0) return;

  const userIdString = userIds.join(',');

  const [rows] = await connection.execute<RowDataPacket[]>(
    `SELECT user_id FROM app_user WHERE user_id IN (${userIdString})`
  );

  if ((rows as RowDataPacket[]).length !== userIds.length) {
    throw new Error(`One or more assigned users do not exist. Looking for: ${userIdString}, found: ${rows.length} users`);
  }
}

export async function POST(request: Request) {
  try {
    const data: NewJob = await request.json();

    // Basic validation
    if (!data.title || !data.startDate) {
      throw new Error('Job title and start date are required');
    }

    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // Handle client
      let clientId: number | null = null;

      if (data.client?.user_id) {
        // Verify existing client user
        const [rows] = await connection.execute<RowDataPacket[]>(
          'SELECT user_id FROM app_user WHERE user_id = ? AND user_type = "Client"',
          [data.client.user_id]
        );

        if (rows.length === 0) {
          throw new Error('Invalid client ID');
        }
        clientId = data.client.user_id;
      }

      // Create the job
      const [jobResult] = await connection.execute<ResultSetHeader>(
        'INSERT INTO job (job_title, job_startdate, job_location, job_description, client_id, created_by, job_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          data.title,
          data.startDate,
          data.location || null,
          data.description || null,
          clientId,
          64, // TODO: Replace with actual user ID from session
          'active'
        ]
      );
      const jobId = jobResult.insertId;

      // Create phases and their children
      if (data.phases) {
        for (const phase of data.phases) {
          // Create phase
          const [phaseResult] = await connection.execute<ResultSetHeader>(
            'INSERT INTO phase (job_id, phase_title, phase_startdate, phase_description, created_by) VALUES (?, ?, ?, ?, ?)',
            [
              jobId,
              phase.title,
              phase.startDate,
              phase.description || null,
              64 // TODO: Replace with actual user ID from session
            ]
          );
          const phaseId = phaseResult.insertId;

          // Create tasks
          for (const task of phase.tasks) {
            const [taskResult] = await connection.execute<ResultSetHeader>(
              'INSERT INTO task (phase_id, task_title, task_startdate, task_duration, task_description, task_status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
              [
                phaseId,
                task.title,
                task.startDate,
                task.duration,
                task.details || null,
                'Incomplete',
                64 // TODO: Replace with actual user ID from session
              ]
            );
            // Create task assignments
            if (task.assignedUsers?.length) {
              const taskId = taskResult.insertId;
              await Promise.all(task.assignedUsers.map(userId =>
                connection.execute(
                  'INSERT INTO user_task (user_id, task_id, assigned_by) VALUES (?, ?, ?)',
                  [userId, taskId, 64] // TODO: Replace last 1 with actual user ID from session
                )
              ));
            }
          }

          // Create materials
          for (const material of phase.materials) {
            const [materialResult] = await connection.execute<ResultSetHeader>(
              'INSERT INTO material (phase_id, material_title, material_duedate, material_description, material_status, created_by) VALUES (?, ?, ?, ?, ?, ?)',
              [
                phaseId,
                material.title,
                material.dueDate,
                material.details || null,
                'Incomplete',
                64 // TODO: Replace with actual user ID from session
              ]
            );

            // Create material assignments
            if (material.assignedUsers?.length) {
              const materialId = materialResult.insertId;
              await Promise.all(material.assignedUsers.map(userId =>
                connection.execute(
                  'INSERT INTO user_material (user_id, material_id, assigned_by) VALUES (?, ?, ?)',
                  [userId, materialId, 64] // TODO: Replace last 1 with actual user ID from session
                )
              ));
            }
          }

          // Create notes
          for (const note of phase.notes) {
            await connection.execute(
              'INSERT INTO note (phase_id, note_details, created_by) VALUES (?, ?, ?)',
              [
                phaseId,
                note.content,
                64 // TODO: Replace with actual user ID from session
              ]
            );
          }
        }
      }

      // Commit transaction if everything succeeded
      await connection.commit();
      return NextResponse.json({ success: true, jobId });

    } catch (error) {
      // Add the new logging here, in the inner catch block
      console.error('Database operation error:', error);
      await connection.rollback();
      if (error instanceof Error) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    // Add the new logging here, in the outer catch block
    console.error('Request processing error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}