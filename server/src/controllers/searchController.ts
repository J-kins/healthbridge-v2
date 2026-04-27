import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import { Pool } from 'pg';

declare global {
  namespace Express {
    interface Request {
      db?: mysql.Connection | Pool;
      user?: { id: number; role: string };
    }
  }
}

export const searchClinics = async (req: Request, res: Response) => {
  try {
    const {
      latitude,
      longitude,
      radius = 10,
      specialization_id,
      medicine_id,
      service_name,
      rating_min,
      is_verified,
      limit = 20,
      offset = 0,
    } = req.query;

    const db = req.db;
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    let query: string;
    const params: any[] = [];

    // Check if using PostgreSQL or MySQL based on query method
    const isPostgres = (db as any).query.toString().includes('Promise');

    if (isPostgres) {
      // PostgreSQL query with PostGIS support
      query = `
        SELECT 
          c.*,
          ST_Distance(c.location, ST_Point($1, $2)::geography) / 1000 as distance
        FROM clinics c
        WHERE c.is_active = true
      `;
      params.push(longitude, latitude);

      if (radius) {
        query += ` AND ST_DWithin(c.location, ST_Point($3, $4)::geography, $5 * 1000)`;
        params.push(longitude, latitude, radius);
      }

      if (is_verified !== undefined) {
        query += ` AND c.is_verified = $${params.length + 1}`;
        params.push(is_verified === 'true');
      }

      if (rating_min) {
        query += ` AND c.rating >= $${params.length + 1}`;
        params.push(parseFloat(rating_min as string));
      }

      // Join with specializations if filtering by specialization
      if (specialization_id) {
        query = `
          SELECT DISTINCT c.*, 
          ST_Distance(c.location, ST_Point($1, $2)::geography) / 1000 as distance
          FROM clinics c
          JOIN clinic_service_specializations css ON c.id IN (
            SELECT clinic_id FROM services WHERE id = css.service_id
          )
          WHERE c.is_active = true AND css.specialization_id = $${params.length + 1}
        `;
        params.splice(0, 2, longitude, latitude);
        params.push(specialization_id);
      }

      if (medicine_id) {
        query = `
          SELECT DISTINCT c.*,
          ST_Distance(c.location, ST_Point($1, $2)::geography) / 1000 as distance
          FROM clinics c
          JOIN services s ON c.id = s.clinic_id
          JOIN service_medicines sm ON s.id = sm.service_id
          WHERE c.is_active = true AND sm.medicine_id = $${params.length + 1}
        `;
        params.splice(0, 2, longitude, latitude);
        params.push(medicine_id);
      }

      if (service_name) {
        query += ` AND EXISTS (
          SELECT 1 FROM services WHERE clinic_id = c.id AND name ILIKE $${params.length + 1}
        )`;
        params.push(`%${service_name}%`);
      }

      query += ` ORDER BY distance ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await (db as Pool).query(query, params);
      return res.json(result.rows);
    } else {
      // MySQL query with spatial functions
      query = `
        SELECT 
          c.*,
          ST_Distance_Sphere(location, ST_Point(?, ?)) / 1000 as distance
        FROM clinics c
        WHERE c.is_active = true
      `;
      params.push(longitude, latitude);

      if (radius) {
        query += ` AND ST_Distance_Sphere(c.location, ST_Point(?, ?)) / 1000 <= ?`;
        params.push(longitude, latitude, radius);
      }

      if (is_verified !== undefined) {
        query += ` AND c.is_verified = ?`;
        params.push(is_verified === 'true');
      }

      if (rating_min) {
        query += ` AND c.rating >= ?`;
        params.push(parseFloat(rating_min as string));
      }

      if (specialization_id) {
        query = `
          SELECT DISTINCT c.*, 
          ST_Distance_Sphere(c.location, ST_Point(?, ?)) / 1000 as distance
          FROM clinics c
          JOIN services s ON c.id = s.clinic_id
          JOIN clinic_service_specializations css ON s.id = css.service_id
          WHERE c.is_active = true AND css.specialization_id = ?
        `;
        params.splice(0, 2, longitude, latitude);
        params.push(specialization_id);
      }

      if (medicine_id) {
        query = `
          SELECT DISTINCT c.*,
          ST_Distance_Sphere(c.location, ST_Point(?, ?)) / 1000 as distance
          FROM clinics c
          JOIN services s ON c.id = s.clinic_id
          JOIN service_medicines sm ON s.id = sm.service_id
          WHERE c.is_active = true AND sm.medicine_id = ?
        `;
        params.splice(0, 2, longitude, latitude);
        params.push(medicine_id);
      }

      if (service_name) {
        query += ` AND EXISTS (SELECT 1 FROM services WHERE clinic_id = c.id AND name LIKE ?)`;
        params.push(`%${service_name}%`);
      }

      query += ` ORDER BY distance ASC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await (db as mysql.Connection).query(query, params);
      return res.json(rows);
    }
  } catch (error) {
    console.error('Search clinics error:', error);
    res.status(500).json({ error: 'Failed to search clinics' });
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const { clinic_id, specialization_id, limit = 20, offset = 0 } = req.query;
    const db = req.db;

    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const isPostgres = (db as any).query.toString().includes('Promise');

    if (isPostgres) {
      let query = `
        SELECT d.*, u.first_name, u.last_name, u.profile_image_url,
        json_agg(s.*) FILTER (WHERE s.id IS NOT NULL) as specializations
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        LEFT JOIN doctor_specializations ds ON d.id = ds.doctor_id
        LEFT JOIN specializations s ON ds.specialization_id = s.id
        WHERE d.is_available = true
      `;

      const params: any[] = [];

      if (clinic_id) {
        query += ` AND d.clinic_id = $${params.length + 1}`;
        params.push(clinic_id);
      }

      if (specialization_id) {
        query += ` AND ds.specialization_id = $${params.length + 1}`;
        params.push(specialization_id);
      }

      query += ` GROUP BY d.id, u.id LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);

      const result = await (db as Pool).query(query, params);
      return res.json(result.rows);
    } else {
      let query = `
        SELECT d.*, u.first_name, u.last_name, u.profile_image_url
        FROM doctors d
        JOIN users u ON d.user_id = u.id
        WHERE d.is_available = true
      `;

      const params: any[] = [];

      if (clinic_id) {
        query += ` AND d.clinic_id = ?`;
        params.push(clinic_id);
      }

      if (specialization_id) {
        query += ` AND EXISTS (
          SELECT 1 FROM doctor_specializations 
          WHERE doctor_id = d.id AND specialization_id = ?
        )`;
        params.push(specialization_id);
      }

      query += ` LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await (db as mysql.Connection).query(query, params);
      return res.json(rows);
    }
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};

export const getSpecializations = async (req: Request, res: Response) => {
  try {
    const db = req.db;
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const isPostgres = (db as any).query.toString().includes('Promise');

    const query = 'SELECT * FROM specializations ORDER BY name ASC';

    if (isPostgres) {
      const result = await (db as Pool).query(query);
      return res.json(result.rows);
    } else {
      const [rows] = await (db as mysql.Connection).query(query);
      return res.json(rows);
    }
  } catch (error) {
    console.error('Get specializations error:', error);
    res.status(500).json({ error: 'Failed to fetch specializations' });
  }
};

export const quickBook = async (req: Request, res: Response) => {
  try {
    const { clinic_id, service_id, appointment_date, appointment_time } = req.body;
    const patient_id = req.user?.id;

    if (!patient_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const db = req.db;
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const isPostgres = (db as any).query.toString().includes('Promise');

    // Validate clinic and service exist
    const validateQuery = isPostgres
      ? `SELECT 1 FROM services WHERE id = $1 AND clinic_id = $2`
      : `SELECT 1 FROM services WHERE id = ? AND clinic_id = ?`;

    if (isPostgres) {
      const check = await (db as Pool).query(validateQuery, [service_id, clinic_id]);
      if (check.rows.length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
    } else {
      const [check] = await (db as mysql.Connection).query(validateQuery, [
        service_id,
        clinic_id,
      ]);
      if ((check as any).length === 0) {
        return res.status(404).json({ error: 'Service not found' });
      }
    }

    // Create appointment
    const insertQuery = isPostgres
      ? `
        INSERT INTO appointments (patient_id, clinic_id, service_id, appointment_date, appointment_time, status)
        VALUES ($1, $2, $3, $4, $5, 'scheduled')
        RETURNING *
      `
      : `
        INSERT INTO appointments (patient_id, clinic_id, service_id, appointment_date, appointment_time, status)
        VALUES (?, ?, ?, ?, ?, 'scheduled')
      `;

    if (isPostgres) {
      const result = await (db as Pool).query(insertQuery, [
        patient_id,
        clinic_id,
        service_id,
        appointment_date,
        appointment_time,
      ]);
      return res.status(201).json(result.rows[0]);
    } else {
      const [result] = await (db as mysql.Connection).query(insertQuery, [
        patient_id,
        clinic_id,
        service_id,
        appointment_date,
        appointment_time,
      ]);
      return res.status(201).json(result);
    }
  } catch (error) {
    console.error('Quick book error:', error);
    res.status(500).json({ error: 'Failed to book appointment' });
  }
};
