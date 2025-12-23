import { useState } from 'react';
import { Plus, Video, Trash2, Calendar, Clock, User, BookOpen, Loader2, ExternalLink } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useLiveLectures, useCreateLiveLecture, useDeleteLiveLecture } from '../hooks/useLiveLectures';
import { liveLectureFormSchema, type LiveLecture } from '../lib/schemas';

const LiveLectures = () => {
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: lectures = [], isLoading: lecturesLoading } = useLiveLectures();
  const createLiveLecture = useCreateLiveLecture();
  const deleteLiveLecture = useDeleteLiveLecture();

  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    scheduledAt: '',
    duration: '60',
    meetingLink: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const dataToValidate = {
      courseId: formData.courseId,
      title: formData.title,
      description: formData.description,
      scheduledAt: formData.scheduledAt,
      duration: Number(formData.duration) || 60,
      meetingLink: formData.meetingLink,
    };

    const result = liveLectureFormSchema.safeParse(dataToValidate);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await createLiveLecture.mutateAsync({
        courseId: formData.courseId,
        title: formData.title,
        description: formData.description,
        scheduledAt: formData.scheduledAt,
        duration: Number(formData.duration) || 60,
        meetingLink: formData.meetingLink,
      });
      
      setFormData({
        courseId: '',
        title: '',
        description: '',
        scheduledAt: '',
        duration: '60',
        meetingLink: '',
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error creating live lecture:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this live lecture?')) {
      try {
        await deleteLiveLecture.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting live lecture:', err);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find(c => c._id === courseId);
    return course?.title || 'Unknown Course';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  if (coursesLoading || lecturesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">
          Live Lectures
        </h1>
        <p className="text-slate-500">Schedule and manage live lecture sessions</p>
      </div>

      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50">
          <span className="text-lg">✓</span>
          Live lecture scheduled successfully!
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Schedule Live Lecture</h2>
            <p className="text-sm text-slate-500">Add a new live lecture session</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course</label>
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none bg-white ${
                errors.courseId ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>{course.title}</option>
              ))}
            </select>
            {errors.courseId && <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                errors.title ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
              placeholder="Enter lecture title"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
              placeholder="60"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Schedule Date & Time</label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                errors.scheduledAt ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
            />
            {errors.scheduledAt && <p className="text-red-500 text-sm mt-1">{errors.scheduledAt}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Google Meet Link</label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                errors.meetingLink ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
            />
            {errors.meetingLink && <p className="text-red-500 text-sm mt-1">{errors.meetingLink}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
              placeholder="Brief description of the lecture..."
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={createLiveLecture.isPending}
            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {createLiveLecture.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Schedule Lecture
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-red-600" />
          Scheduled Lectures ({lectures.length})
        </h2>

        {lectures.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Video className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No live lectures scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lectures.map((lecture: LiveLecture) => (
              <div
                key={lecture._id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-800">{lecture.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(lecture.status)}`}>
                        {lecture.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {getCourseName(lecture.courseId)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(lecture.scheduledAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(lecture.scheduledAt)} ({lecture.duration} min)
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {lecture.instructorName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={lecture.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleDelete(lecture._id)}
                      disabled={deleteLiveLecture.isPending}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveLectures;
