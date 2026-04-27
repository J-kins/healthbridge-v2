import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { AuthRequest, AuthResponse, User } from '../types/index.js';
import * as db from '../database/connection.js';

export async function register(data: AuthRequest & { first_name?: string; last_name?: string }): Promise<AuthResponse> {
  const { email, password, first_name, last_name } = data;

  // Validation
  if (!email || !password) {
    const error: any = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  if (password.length < 6) {
    const error: any = new Error('Password must be at least 6 characters');
    error.status = 400;
    throw error;
  }

  // Check if user exists
  const existingUser = await db.queryOne(
    'SELECT id FROM users WHERE email = ?',
    [email]
  );

  if (existingUser) {
    const error: any = new Error('User already exists');
    error.status = 409;
    throw error;
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create user in database
  const result = await db.execute(
    'INSERT INTO users (email, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
    [email, hashedPassword, first_name || null, last_name || null, 'patient']
  );

  const userId = (result as any).insertId || (result as any)[0]?.id;

  // Generate token
  const token = jwt.sign(
    { id: userId, email, role: 'patient' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const user: User = {
    id: userId,
    email,
    first_name: first_name || '',
    last_name: last_name || '',
    role: 'patient'
  };

  return { token, user };
}

export async function login(data: AuthRequest): Promise<AuthResponse> {
  const { email, password } = data;

  // Validation
  if (!email || !password) {
    const error: any = new Error('Email and password are required');
    error.status = 400;
    throw error;
  }

  // Find user
  const user = await db.queryOne(
    'SELECT id, email, password, first_name, last_name, role FROM users WHERE email = ?',
    [email]
  );

  if (!user) {
    const error: any = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // Verify password
  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    const error: any = new Error('Invalid credentials');
    error.status = 401;
    throw error;
  }

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const userResponse: User = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role
  };

  return { token, user: userResponse };
}
