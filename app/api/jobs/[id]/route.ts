// app/api/jobs/[id]/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { RowDataPacket } from 'mysql2';

// Interfaces
interface JobDetails extends RowDataPacket {
  job_id: number;
  job_title: string;
  job_startdate: Date;
  job_location: string;
  job_description: string;
  date_range: string;
  total_weeks: number;
  current_week: number;
}

interface User extends RowDataPacket {
  user_id: number;
  user_name: string;
  user_phone: string;
  user_email: string;
}

interface Task extends RowDataPacket {
  task_id: number;
  task_title: string;
  task_startdate: string;
  task_duration: number;
  task_status: string;
  task_description: string;
  users: User[];
}

interface Material extends RowDataPacket {
  material_id: number;
  material_title: string;
  material_duedate: string;
  material_status: string;
  material_description: string;
  users: User[];
}

interface Phase extends RowDataPacket {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  tasks: Task[];
  materials: Material[];
  note: string[];
}

interface StatusCounts extends RowDataPacket {
    overdue: number;
    nextSevenDays: number;
    sevenDaysPlus: number;
}

interface NoteDetails extends RowDataPacket {
  note_details: string;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.getConnection();
    
    try {
      // Get basic job info
      const [jobRows] = await connection.query<JobDetails[]>(`
        SELECT 
          j.job_id,
          j.job_title,
          j.job_startdate,
          j.job_location,
          j.job_description,
          CONCAT(
            DATE_FORMAT(j.job_startdate, '%m/%d'),
            ' - ',
            DATE_FORMAT(
              GREATEST(
                IFNULL((
                  SELECT MAX(DATE_ADD(t.task_startdate, INTERVAL t.task_duration DAY))
                  FROM task t
                  JOIN phase p ON t.phase_id = p.phase_id
                  WHERE p.job_id = j.job_id
                ), j.job_startdate),
                IFNULL((
                  SELECT MAX(m.material_duedate)
                  FROM material m
                  JOIN phase p ON m.phase_id = p.phase_id
                  WHERE p.job_id = j.job_id
                ), j.job_startdate)
              ),
              '%m/%d'
            )
          ) as date_range,
          CEIL(
            DATEDIFF(
              GREATEST(
                IFNULL((
                  SELECT MAX(DATE_ADD(t.task_startdate, INTERVAL t.task_duration DAY))
                  FROM task t
                  JOIN phase p ON t.phase_id = p.phase_id
                  WHERE p.job_id = j.job_id
                ), j.job_startdate),
                IFNULL((
                  SELECT MAX(m.material_duedate)
                  FROM material m
                  JOIN phase p ON m.phase_id = p.phase_id
                  WHERE p.job_id = j.job_id
                ), j.job_startdate)
              ),
              j.job_startdate
            ) / 7
          ) + 1 as total_weeks,
          CEIL(DATEDIFF(CURDATE(), j.job_startdate) / 7) + 1 as current_week
        FROM job j
        WHERE j.job_id = ?
      `, [params.id]);

      if (!jobRows.length) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }

      const job = jobRows[0];

      // Get phases with their tasks, materials, and notes
      const [phases] = await connection.query<Phase[]>(`
        SELECT 
          p.phase_id as id,
          p.phase_title as name,
          p.phase_startdate as startDate,
          GREATEST(
            IFNULL((
              SELECT MAX(DATE_ADD(t.task_startdate, INTERVAL t.task_duration DAY))
              FROM task t
              WHERE t.phase_id = p.phase_id
            ), p.phase_startdate),
            IFNULL((
              SELECT MAX(m.material_duedate)
              FROM material m
              WHERE m.phase_id = p.phase_id
            ), p.phase_startdate)
          ) as endDate,
          CASE (p.phase_id % 6)
            WHEN 0 THEN '#3B82F6'
            WHEN 1 THEN '#10B981'
            WHEN 2 THEN '#6366F1'
            WHEN 3 THEN '#8B5CF6'
            WHEN 4 THEN '#EC4899'
            WHEN 5 THEN '#F59E0B'
          END as color
        FROM phase p
        WHERE p.job_id = ?
        ORDER BY p.phase_startdate
      `, [params.id]);

      // Get status counts for progress bar
      const [statusCounts] = await connection.query<StatusCounts[]>(`
        WITH task_counts AS (
          SELECT
            COUNT(CASE 
              WHEN task_status = 'Incomplete' 
              AND DATE_ADD(task_startdate, INTERVAL task_duration DAY) < CURDATE() 
              THEN 1 END) as task_overdue,
            COUNT(CASE 
              WHEN task_status = 'Incomplete' 
              AND DATE_ADD(task_startdate, INTERVAL task_duration DAY) 
              BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
              THEN 1 END) as task_next_seven,
            COUNT(CASE 
              WHEN task_status = 'Incomplete' 
              AND DATE_ADD(task_startdate, INTERVAL task_duration DAY) > DATE_ADD(CURDATE(), INTERVAL 7 DAY)
              THEN 1 END) as task_beyond_seven
          FROM task t
          JOIN phase p ON t.phase_id = p.phase_id
          WHERE p.job_id = ?
        ),
        material_counts AS (
          SELECT
            COUNT(CASE 
              WHEN material_status = 'Incomplete' 
              AND material_duedate < CURDATE() 
              THEN 1 END) as material_overdue,
            COUNT(CASE 
              WHEN material_status = 'Incomplete' 
              AND material_duedate 
              BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
              THEN 1 END) as material_next_seven,
            COUNT(CASE 
              WHEN material_status = 'Incomplete' 
              AND material_duedate > DATE_ADD(CURDATE(), INTERVAL 7 DAY)
              THEN 1 END) as material_beyond_seven
          FROM material m
          JOIN phase p ON m.phase_id = p.phase_id
          WHERE p.job_id = ?
        )
        SELECT
            (task_overdue + material_overdue) as overdue,
            (task_next_seven + material_next_seven) as nextSevenDays,
            (task_beyond_seven + material_beyond_seven) as sevenDaysPlus
        FROM task_counts, material_counts
      `, [job.job_id, job.job_id]);

      // Enhance each phase with its tasks, materials, and notes
      const enhancedPhases = await Promise.all(phases.map(async (phase) => {
        const [tasks] = await connection.query<Task[]>(
          `SELECT 
            t.task_id,
            t.task_title,
            t.task_startdate,
            t.task_duration,
            t.task_status,
            t.task_description,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'user_id', u.user_id,
                'user_name', u.user_name,
                'user_phone', u.user_phone,
                'user_email', u.user_email
              )
            ) as users
          FROM task t
          LEFT JOIN user_task ut ON t.task_id = ut.task_id
          LEFT JOIN app_user u ON ut.user_id = u.user_id
          WHERE t.phase_id = ?
          GROUP BY t.task_id`,
          [phase.id]
        );
          
        const [materials] = await connection.query<Material[]>(
          `SELECT 
            m.material_id,
            m.material_title,
            m.material_duedate,
            m.material_status,
            m.material_description,
            JSON_ARRAYAGG(
              JSON_OBJECT(
                'user_id', u.user_id,
                'user_name', u.user_name,
                'user_phone', u.user_phone,
                'user_email', u.user_email
              )
            ) as users
          FROM material m
          LEFT JOIN user_material um ON m.material_id = um.material_id
          LEFT JOIN app_user u ON um.user_id = u.user_id
          WHERE m.phase_id = ?
          GROUP BY m.material_id`,
          [phase.id]
        );
          
        const [notes] = await connection.query<NoteDetails[]>(
          `SELECT 
            n.note_details,
            n.created_at,
            JSON_OBJECT(
              'user_name', u.user_name
            ) as created_by
          FROM note n
          JOIN app_user u ON n.created_by = u.user_id
          WHERE n.phase_id = ?`,
          [phase.id]
        );

        const transformedTasks = tasks.map(task => ({
          ...task,
          users: task.users[0]?.user_id ? task.users : []
        }));
      
        const transformedMaterials = materials.map(material => ({
          ...material,
          users: material.users[0]?.user_id ? material.users : []
        }));
      
        return {
          ...phase,
          tasks: transformedTasks,
          materials: transformedMaterials,
          notes: notes
        };
      }));

      const jobDetails = {
        ...job,
        phases: enhancedPhases,
        ...statusCounts[0]
      };

      return NextResponse.json({ job: jobDetails });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job details' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.getConnection();
    const body = await request.json();

    try {
      // Hardcode Michael Elrod's user ID for now
      // You'll want to replace this with actual user authentication later
      const TEMP_USER_ID = 20; // Assuming Michael Elrod's user_id is 1

      // Check if the phase_id exists and is valid
      const [phaseCheck] = await connection.query<RowDataPacket[]>(
        'SELECT phase_id FROM phase WHERE phase_id = ? AND job_id = ?',
        [body.phase_id, params.id]
      );

      if (!phaseCheck.length) {
        return NextResponse.json(
          { error: 'Invalid phase ID or phase does not belong to this job' },
          { status: 400 }
        );
      }

      // Insert the new note
      const [result] = await connection.query(
        `INSERT INTO note (
          phase_id,
          note_details,
          created_by
        ) VALUES (?, ?, ?)`,
        [
          body.phase_id,
          body.note_details,
          TEMP_USER_ID
        ]
      );

      // Fetch the newly created note with user info
      const [newNote] = await connection.query<RowDataPacket[]>(
        `SELECT 
          n.note_details,
          n.created_at,
          JSON_OBJECT(
            'user_name', u.user_name
          ) as created_by
        FROM note n
        JOIN app_user u ON n.created_by = u.user_id
        WHERE n.note_id = ?`,
        [(result as any).insertId]
      );

      return NextResponse.json({ note: newNote[0] });

    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await pool.getConnection();
    const body = await request.json();
    const { id, type, newStatus } = body;

    try {
      if (type !== 'task' && type !== 'material') {
        return NextResponse.json(
          { error: 'Invalid type specified' },
          { status: 400 }
        );
      }

      const table = type === 'task' ? 'task' : 'material';
      const idField = type === 'task' ? 'task_id' : 'material_id';
      const statusField = type === 'task' ? 'task_status' : 'material_status';

      await connection.query(
        `UPDATE ${table} SET ${statusField} = ? WHERE ${idField} = ?`,
        [newStatus, id]
      );

      return NextResponse.json({ success: true });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    );
  }
}