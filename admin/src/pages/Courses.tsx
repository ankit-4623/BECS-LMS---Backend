import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, ImageIcon } from 'lucide-react';
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse } from '../hooks/useCourses';
import { courseFormSchema, type Course } from '../lib/schemas';

const CATEGORIES = ['Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Electronics', 'Programming'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const LANGUAGES = ['English', 'Hindi', 'Both'];

const Courses = () => {
  const { data: courses = [], isLoading, error } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    level: '',
    primaryLanguage: '',
    subtitle: '',
    description: '',
    welcomeMessage: '',
    pricing: '',
    objectives: '',
    teacherName: '',
    degree: '',
    experience: '',
    isPublished: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      level: '',
      primaryLanguage: '',
      subtitle: '',
      description: '',
      welcomeMessage: '',
      pricing: '',
      objectives: '',
      teacherName: '',
      degree: '',
      experience: '',
      isPublished: false,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const dataToValidate = {
      title: formData.title,
      category: formData.category,
      level: formData.level,
      primaryLanguage: formData.primaryLanguage,
      subtitle: formData.subtitle,
      description: formData.description,
      welcomeMessage: formData.welcomeMessage,
      pricing: Number(formData.pricing) || 0,
      objectives: formData.objectives,
      isPublished: formData.isPublished,
      teachers: {
        teacherName: formData.teacherName,
        degree: formData.degree,
        experience: formData.experience,
      },
    };

    const result = courseFormSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    if (!editingCourse && !imageFile) {
      setErrors({ image: 'Course image is required' });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('level', formData.level);
    formDataToSend.append('primaryLanguage', formData.primaryLanguage);
    formDataToSend.append('subtitle', formData.subtitle);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('welcomeMessage', formData.welcomeMessage);
    formDataToSend.append('pricing', formData.pricing);
    formDataToSend.append('objectives', formData.objectives);
    formDataToSend.append('isPublished', String(formData.isPublished));
    formDataToSend.append('teachers', JSON.stringify({
      teacherName: formData.teacherName,
      degree: formData.degree,
      experience: formData.experience,
    }));

    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      if (editingCourse) {
        await updateCourse.mutateAsync({ id: editingCourse._id, data: formDataToSend });
      } else {
        await createCourse.mutateAsync(formDataToSend);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving course:', err);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      category: course.category || '',
      level: course.level || '',
      primaryLanguage: course.primaryLanguage || '',
      subtitle: course.subtitle || '',
      description: course.description || '',
      welcomeMessage: course.welcomeMessage || '',
      pricing: String(course.pricing || ''),
      objectives: course.objectives || '',
      teacherName: course.teachers?.teacherName || '',
      degree: course.teachers?.degree || '',
      experience: course.teachers?.experience || '',
      isPublished: course.isPublished || false,
    });
    const imageUrl = typeof course.image === 'string' ? course.image : course.image?.url;
    if (imageUrl) {
      setImagePreview(imageUrl);
    }
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting course:', err);
      }
    }
  };

  const getImageUrl = (course: Course): string | undefined => {
    if (typeof course.image === 'string') return course.image;
    return course.image?.url;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading courses. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">
          Courses
        </h1>
        <p className="text-slate-500">Manage your courses and instructors</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            {editingCourse ? 'Edit Course' : 'Create New Course'}
          </h2>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
            >
              <Plus className="w-5 h-5" />
              Add Course
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Course Image</label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>
              {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors.title ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="e.g., Complete Electronics"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none bg-white ${
                    errors.category ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none bg-white ${
                    errors.level ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                >
                  <option value="">Select Level</option>
                  {LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
                {errors.level && <p className="text-red-500 text-sm mt-1">{errors.level}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                <select
                  value={formData.primaryLanguage}
                  onChange={(e) => setFormData({ ...formData, primaryLanguage: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none bg-white ${
                    errors.primaryLanguage ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                >
                  <option value="">Select Language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                {errors.primaryLanguage && <p className="text-red-500 text-sm mt-1">{errors.primaryLanguage}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors.pricing ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="2999"
                  min="0"
                />
                {errors.pricing && <p className="text-red-500 text-sm mt-1">{errors.pricing}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Subtitle</label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
                placeholder="A brief subtitle for the course"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                  errors.description ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                }`}
                placeholder="Detailed description of the course..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Teacher Name</label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors['teachers.teacherName'] ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="Prof. Rajesh Kumar"
                />
                {errors['teachers.teacherName'] && <p className="text-red-500 text-sm mt-1">{errors['teachers.teacherName']}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
                  placeholder="M.Tech, PhD"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
                  placeholder="15 years"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">
                Publish this course
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createCourse.isPending || updateCourse.isPending}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(createCourse.isPending || updateCourse.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCourse ? 'Update Course' : 'Create Course'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Courses List ({courses.length})</h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-5xl mb-4 opacity-50">📚</div>
            <p>No courses yet. Add your first course!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-300"
              >
                {getImageUrl(course) && (
                  <img
                    src={getImageUrl(course)}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-800">{course.title}</h3>
                    {course.isPublished && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Published</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {course.teachers?.teacherName || 'No teacher'} • {course.category} • {course.level} • ₹{course.pricing}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    disabled={deleteCourse.isPending}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 disabled:opacity-50"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
