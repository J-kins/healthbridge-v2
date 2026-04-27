import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { AuthRequest, AuthResponse, User } from '../types/index.js';

// Mock database - replace with real DB
const users: Map<string, any> = new Map();

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
  if (users.has(email)) {
    const error: any = new Error('User already exists');
    error.status = 409;
    throw error;
  }

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create user
  const user = {
    id: users.size + 1,
    email,
    password: hashedPassword,
    first_name,
    last_name,
    role: 'patient' as const,
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  };

  users.set(email, user);

  // Generate token
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword as User
  };
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
  const user = users.get(email);
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

  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword as User
  };
}
