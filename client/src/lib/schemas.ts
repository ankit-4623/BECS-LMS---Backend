import { z } from 'zod';

// ============ AUTH SCHEMAS ============

// Login Schema
export const loginSchema = z.object({
  userEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Signup Schema
export const signupSchema = z.object({
  userName: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  userEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(/^\d{10}$/, 'Phone number must be 10 digits')
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type SignupInput = z.infer<typeof signupSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  userEmail: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset Password Schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ============ USER SCHEMAS ============

export const userSchema = z.object({
  _id: z.string(),
  userName: z.string(),
  userEmail: z.string().email(),
  role: z.enum(['student', 'instructor', 'admin']),
  active: z.boolean().optional(),
  lastLogin: z.string().optional(),
});

export type User = z.infer<typeof userSchema>;

// ============ COURSE SCHEMAS ============

export const lectureSchema = z.object({
  _id: z.string().optional(),
  title: z.string(),
  videoUrl: z.string(),
  notesUrl: z.string().optional(),
  public_id: z.string().optional(),
  freePreview: z.boolean().default(false),
  duration: z.string().default('00:00'),
});

export type Lecture = z.infer<typeof lectureSchema>;

export const courseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  category: z.string().optional(),
  level: z.string().optional(),
  primaryLanguage: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.object({
    url: z.string(),
    public_id: z.string().optional(),
  }).optional(),
  welcomeMessage: z.string().optional(),
  pricing: z.number(),
  objectives: z.string().optional(),
  curriculum: z.array(lectureSchema).optional(),
  instructorId: z.string().optional(),
  instructorName: z.string().optional(),
  date: z.string().optional(),
  students: z.array(z.object({
    studentId: z.string(),
    studentName: z.string().optional(),
    studentEmail: z.string().optional(),
    paidAmount: z.number().optional(),
  })).optional(),
  teachers: z.object({
    teacherName: z.string().optional(),
    degree: z.string().optional(),
    experience: z.string().optional(),
  }).optional(),
  isPublished: z.boolean().optional(),
  totalDuration: z.string().optional(),
  lastUpdated: z.string().optional(),
});

export type Course = z.infer<typeof courseSchema>;

// ============ ORDER SCHEMAS ============

export const orderSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  userName: z.string().optional(),
  userEmail: z.string().optional(),
  orderStatus: z.string(),
  paymentMethod: z.string().optional(),
  paymentStatus: z.string().optional(),
  orderDate: z.string(),
  paymentId: z.string().optional(),
  payerId: z.string().optional(),
  instructorId: z.string().optional(),
  instructorName: z.string().optional(),
  courseImage: z.string().optional(),
  courseTitle: z.string().optional(),
  courseId: z.string(),
  coursePricing: z.number().optional(),
});

export type Order = z.infer<typeof orderSchema>;

// ============ LIVE LECTURE SCHEMAS ============

export const liveLectureSchema = z.object({
  _id: z.string(),
  courseId: z.string(),
  courseName: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  meetLink: z.string().url(),
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  duration: z.string().optional(),
  instructorId: z.string().optional(),
  instructorName: z.string().optional(),
  status: z.enum(['scheduled', 'live', 'completed', 'cancelled']).default('scheduled'),
});

export type LiveLecture = z.infer<typeof liveLectureSchema>;
