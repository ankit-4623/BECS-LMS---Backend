import { useQuery } from '@tanstack/react-query';
import { getAllCourses, getCourseDetails, getPurchasedCourses, checkCoursePurchase, getLiveLectureByCourse } from '../services/course.service';
import type { Course } from '../lib/schemas';

// Hook to get all courses
export const useCourses = (filters?: {
  category?: string;
  level?: string;
  primaryLanguage?: string;
  sortBy?: string;
}) => {
  return useQuery({
    queryKey: ['courses', filters],
    queryFn: () => getAllCourses(filters),
    select: (data) => data.data || [],
  });
};

// Hook to get single course details
export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseDetails(courseId),
    select: (data) => data.data as Course,
    enabled: !!courseId,
  });
};

// Hook to get purchased courses
export const usePurchasedCourses = (studentId: string | undefined) => {
  return useQuery({
    queryKey: ['purchasedCourses', studentId],
    queryFn: () => getPurchasedCourses(studentId!),
    select: (data) => data.data || [],
    enabled: !!studentId,
  });
};

// Hook to check if course is purchased
export const useCheckPurchase = (courseId: string, studentId: string | undefined) => {
  return useQuery({
    queryKey: ['checkPurchase', courseId, studentId],
    queryFn: () => checkCoursePurchase(courseId, studentId!),
    select: (data) => data.data || false,
    enabled: !!courseId && !!studentId,
  });
};

// Hook to get live lecture by course ID
export const useLiveLecture = (courseId: string) => {
  return useQuery({
    queryKey: ['liveLecture', courseId],
    queryFn: () => getLiveLectureByCourse(courseId),
    select: (data) => data.data,
    enabled: !!courseId,
    retry: false, // Don't retry if no live lecture exists
  });
};

// Hook to get all notes (extracted from all courses' curriculum)
export const useAllNotes = () => {
  const { data: courses, isLoading, error } = useCourses();
  
  // Extract all lectures with notesUrl from all courses
  const notes = courses?.flatMap(course => 
    (course.curriculum || [])
      .filter(lecture => lecture.notesUrl)
      .map(lecture => ({
        _id: lecture._id || `${course._id}-${lecture.title}`,
        title: `${lecture.title} Notes`,
        courseTitle: course.title,
        courseId: course._id,
        notesUrl: lecture.notesUrl,
        category: course.category,
        level: course.level,
        image: course.image,
      }))
  ) || [];

  return { data: notes, isLoading, error };
};
