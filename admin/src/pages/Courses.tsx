import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  price: number;
  teacherName: string;
  degree: string;
  experience: number;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: 'Complete Electronics', price: 2999, teacherName: 'Prof. Rajesh Kumar', degree: 'M.Tech, PhD', experience: 15 },
    { id: '2', name: 'Digital Logic Design', price: 1999, teacherName: 'Dr. Anita Sharma', degree: 'PhD', experience: 12 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    teacherName: '',
    degree: '',
    experience: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({ name: '', price: '', teacherName: '', degree: '', experience: '' });
    setErrors({});
    setEditingCourse(null);
    setShowForm(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Course name is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.teacherName.trim()) newErrors.teacherName = 'Teacher name is required';
    if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
    if (!formData.experience || Number(formData.experience) < 0) newErrors.experience = 'Valid experience is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingCourse) {
      setCourses(courses.map(c => 
        c.id === editingCourse.id 
          ? { ...c, ...formData, price: Number(formData.price), experience: Number(formData.experience) }
          : c
      ));
    } else {
      const newCourse: Course = {
        id: Date.now().toString(),
        name: formData.name,
        price: Number(formData.price),
        teacherName: formData.teacherName,
        degree: formData.degree,
        experience: Number(formData.experience),
      };
      setCourses([...courses, newCourse]);
    }
    resetForm();
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      price: course.price.toString(),
      teacherName: course.teacherName,
      degree: course.degree,
      experience: course.experience.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">
          Courses
        </h1>
        <p className="text-slate-500">Manage your courses and instructors</p>
      </div>

      {/* Create Course Card */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Course Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors.name ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="e.g., Complete Electronics"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors.price ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="2999"
                  min="0"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Teacher Name</label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors.teacherName ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="Prof. Rajesh Kumar"
                />
                {errors.teacherName && <p className="text-red-500 text-sm mt-1">{errors.teacherName}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Degree</label>
                <input
                  type="text"
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors.degree ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="M.Tech, PhD"
                />
                {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Experience (Years)</label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                  errors.experience ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                }`}
                placeholder="15"
                min="0"
              />
              {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5"
              >
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

      {/* Courses List */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Courses List</h2>
        
        {courses.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <div className="text-5xl mb-4 opacity-50">📚</div>
            <p>No courses yet. Add your first course!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-300"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800">{course.name}</h3>
                  <p className="text-sm text-slate-500">
                    {course.teacherName} • {course.degree} • {course.experience} years exp • ₹{course.price}
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
                    onClick={() => handleDelete(course.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300"
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
