import { useQuery } from '@tanstack/react-query';
import { getAllCourses, getCourseDetails, getPurchasedCourses, checkCoursePurchase, getLiveLectureByCourse } from '../services/course.service';
import { getAllIndependentNotes } from '../services/note.service';
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
    staleTime: 0, // Always refetch to get latest data
    refetchOnMount: true,
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

// Hook to get all notes (from independent notes API + course curriculum)
export const useAllNotes = () => {
  // Fetch independent notes from API
  const { data: independentNotesResponse, isLoading: independentLoading, error: independentError } = useQuery({
    queryKey: ['independentNotes'],
    queryFn: () => getAllIndependentNotes(),
  });

  const { data: courses, isLoading: coursesLoading, error: coursesError } = useCourses();
  
  // Extract all lectures with notesUrl from all courses
  const courseNotes = courses?.flatMap(course => 
    (course.curriculum || [])
      .filter(lecture => lecture.notesUrl)
      .map(lecture => ({
        _id: lecture._id || `${course._id}-${lecture.title}`,
        title: `${lecture.title} Notes`,
        courseTitle: course.title,
        courseId: course._id,
        notesUrl: lecture.notesUrl,
        driveLink: lecture.notesUrl,
        category: course.category,
        level: course.level,
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
        isIndependent: false,
        pricing: 0,
      }))
  ) || [];

  // Format independent notes
  const independentNotes = (independentNotesResponse?.data || []).map(note => ({
    _id: note._id,
    title: note.title,
    description: note.description,
    courseTitle: note.category || 'Independent Note',
    courseId: '',
    notesUrl: note.driveLink,
    driveLink: note.driveLink,
    category: note.category,
    level: note.level,
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
    isIndependent: true,
    pricing: note.pricing || 0,
  }));

  // Combine both - independent notes first
  const allNotes = [...independentNotes, ...courseNotes];

  return { 
    data: allNotes, 
    isLoading: independentLoading || coursesLoading, 
    error: independentError || coursesError 
  };
};
