import { z } from 'zod';

// Course schemas
export const teacherSchema = z.object({
  teacherName: z.string().min(1, 'Teacher name is required'),
  degree: z.string().optional(),
  experience: z.string().optional(),
});

export const curriculumSchema = z.object({
  _id: z.string().optional(),
  title: z.string().min(1, 'Lecture title is required'),
  videoUrl: z.string().url('Invalid video URL'),
  notesUrl: z.string().url('Invalid notes URL').optional(),
  public_id: z.string().optional(),
  freePreview: z.boolean().default(false),
  duration: z.string().default('00:00'),
});

export const courseFormSchema = z.object({
  title: z.string().min(1, 'Course title is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.string().min(1, 'Level is required'),
  primaryLanguage: z.string().min(1, 'Primary language is required'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  welcomeMessage: z.string().optional(),
  pricing: z.number().min(0, 'Price must be a positive number'),
  objectives: z.string().optional(),
  isPublished: z.boolean().default(false),
  teachers: teacherSchema.optional(),
  curriculum: z.array(curriculumSchema).optional(),
});

export const courseSchema = courseFormSchema.extend({
  _id: z.string(),
  instructorId: z.string().optional(),
  instructorName: z.string().optional(),
  date: z.string().optional(),
  image: z.union([
    z.string(),
    z.object({
      url: z.string(),
      public_id: z.string(),
    }),
  ]).optional(),
  students: z.array(z.object({
    studentId: z.string(),
    studentName: z.string(),
    studentEmail: z.string(),
    paidAmount: z.number(),
  })).optional(),
  totalDuration: z.string().optional(),
  lastUpdated: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Live Lecture schemas
export const liveLectureFormSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, 'Schedule date and time is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute').default(60),
  meetingLink: z.string()
    .min(1, 'Meeting link is required')
    .regex(/^https:\/\/meet\.google\.com\/[a-z0-9-]+$/i, 'Invalid Google Meet link format'),
});

export const liveLectureSchema = liveLectureFormSchema.extend({
  _id: z.string(),
  instructorId: z.string(),
  instructorName: z.string(),
  status: z.enum(['scheduled', 'live', 'completed', 'cancelled']).default('scheduled'),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Recorded Lecture schemas
export const recordedLectureFormSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  title: z.string().min(1, 'Title is required'),
  chapterName: z.string().min(1, 'Chapter name is required'),
  lectureNumber: z.number().min(1, 'Lecture number must be at least 1').default(1),
  videoUrl: z.string()
    .min(1, 'Video URL is required')
    .regex(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i, 'Invalid YouTube link format'),
  duration: z.string().default('00:00'),
});

export const recordedLectureSchema = recordedLectureFormSchema.extend({
  _id: z.string(),
  instructorId: z.string(),
  isPublished: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Study Note schemas
export const studyNoteFormSchema = z.object({
  courseId: z.string().min(1, 'Course is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  chapterName: z.string().min(1, 'Chapter name is required'),
  lectureNumber: z.number().min(1, 'Lecture number must be at least 1').default(1),
  driveLink: z.string()
    .min(1, 'Google Drive link is required')
    .regex(/^https:\/\/(drive\.google\.com|docs\.google\.com)\/.+/i, 'Invalid Google Drive link format'),
});

export const studyNoteSchema = studyNoteFormSchema.extend({
  _id: z.string(),
  instructorId: z.string(),
  isPublished: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  totalCourses: z.number(),
  liveLectures: z.number(),
  recordedLectures: z.number(),
  studyNotes: z.number(),
  totalStudents: z.number(),
  totalOrders: z.number(),
  totalRevenue: z.number(),
});

// API Response schemas
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string().optional(),
    data: dataSchema,
  });

// Type exports
export type Teacher = z.infer<typeof teacherSchema>;
export type Curriculum = z.infer<typeof curriculumSchema>;
export type CourseFormData = z.infer<typeof courseFormSchema>;
export type Course = z.infer<typeof courseSchema>;
export type LiveLectureFormData = z.infer<typeof liveLectureFormSchema>;
export type LiveLecture = z.infer<typeof liveLectureSchema>;
export type RecordedLectureFormData = z.infer<typeof recordedLectureFormSchema>;
export type RecordedLecture = z.infer<typeof recordedLectureSchema>;
export type StudyNoteFormData = z.infer<typeof studyNoteFormSchema>;
export type StudyNote = z.infer<typeof studyNoteSchema>;
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;
