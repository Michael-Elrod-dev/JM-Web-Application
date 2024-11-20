// app/api/jobs/new/route.ts

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { NewJobData } from '@/app/types/jobs';
import { ResultSetHeader } from 'mysql2';

export async function POST(request: Request) {
  try {
    const jobData: NewJobData = await request.json();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      let clientId: number;

      // If new client, create client first
      if (jobData.client.isNew) {
        const [result] = await connection.execute<ResultSetHeader>(
          `INSERT INTO app_user (user_type, user_name, user_email, user_phone)
           VALUES ('Client', ?, ?, ?)`,
          [jobData.client.name, jobData.client.email, jobData.client.phone]
        );
        clientId = result.insertId;
      } else {
        clientId = jobData.client.id!;
      }

      // Create job
      const [jobResult] = await connection.execute<ResultSetHeader>(
        `INSERT INTO job (job_title, job_startdate, job_location, job_description, client_id, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          jobData.title,
          jobData.startDate,
          jobData.location || null,
          jobData.description || null,
          clientId,
          1, // TODO: Replace with actual user ID from session/auth
        ]
      );

      await connection.commit();

      return NextResponse.json({ 
        success: true,
        jobId: jobResult.insertId
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}