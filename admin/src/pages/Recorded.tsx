import { useState } from 'react';
import { Plus, Video, Edit2, Trash2, X, Loader2, PlayCircle, ExternalLink } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useRecordedLectures, useCreateRecordedLecture, useUpdateRecordedLecture, useDeleteRecordedLecture } from '../hooks/useRecordedLectures';
import { recordedLectureFormSchema, type RecordedLecture } from '../lib/schemas';

const Recorded = () => {
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: lectures = [], isLoading: lecturesLoading } = useRecordedLectures();
  const createLecture = useCreateRecordedLecture();
  const updateLecture = useUpdateRecordedLecture();
  const deleteLecture = useDeleteRecordedLecture();

  const [showForm, setShowForm] = useState(false);
  const [editingLecture, setEditingLecture] = useState<RecordedLecture | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    chapterName: '',
    lectureNumber: '1',
    videoUrl: '',
    duration: '',
    isPublished: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      courseId: '',
      title: '',
      chapterName: '',
      lectureNumber: '1',
      videoUrl: '',
      duration: '',
      isPublished: false,
    });
    setErrors({});
    setEditingLecture(null);
    setShowForm(false);
  };

  const validateForm = () => {
    const dataToValidate = {
      courseId: formData.courseId,
      title: formData.title,
      chapterName: formData.chapterName,
      lectureNumber: Number(formData.lectureNumber) || 1,
      videoUrl: formData.videoUrl,
      duration: formData.duration,
      isPublished: formData.isPublished,
    };

    const result = recordedLectureFormSchema.safeParse(dataToValidate);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      courseId: formData.courseId,
      title: formData.title,
      chapterName: formData.chapterName,
      lectureNumber: Number(formData.lectureNumber) || 1,
      videoUrl: formData.videoUrl,
      duration: formData.duration,
      isPublished: formData.isPublished,
    };

    try {
      if (editingLecture) {
        await updateLecture.mutateAsync({ id: editingLecture._id, data: payload });
      } else {
        await createLecture.mutateAsync(payload);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving lecture:', err);
    }
  };

  const handleEdit = (lecture: RecordedLecture) => {
    setEditingLecture(lecture);
    setFormData({
      courseId: lecture.courseId || '',
      title: lecture.title || '',
      chapterName: lecture.chapterName || '',
      lectureNumber: String(lecture.lectureNumber || 1),
      videoUrl: lecture.videoUrl || '',
      duration: lecture.duration || '',
      isPublished: lecture.isPublished || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this recorded lecture?')) {
      try {
        await deleteLecture.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting lecture:', err);
      }
    }
  };

  const getCourseName = (courseId: string | { _id: string; title: string } | null) => {
    // Handle populated courseId object from MongoDB
    if (courseId && typeof courseId === 'object' && 'title' in courseId) {
      return courseId.title;
    }
    // Handle string courseId
    if (typeof courseId === 'string') {
      const course = courses.find(c => c._id === courseId);
      return course?.title || 'Unknown Course';
    }
    return 'Unknown Course';
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
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
          Recorded Lectures
        </h1>
        <p className="text-slate-500">Manage recorded lecture videos from YouTube</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <PlayCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingLecture ? 'Edit Recorded Lecture' : 'Add Recorded Lecture'}
              </h2>
              <p className="text-sm text-slate-500">Upload YouTube video links</p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
            >
              <Plus className="w-5 h-5" />
              Add Lecture
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Chapter Name</label>
                <input
                  type="text"
                  value={formData.chapterName}
                  onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors.chapterName ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="e.g., Introduction"
                />
                {errors.chapterName && <p className="text-red-500 text-sm mt-1">{errors.chapterName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Lecture Number</label>
                <input
                  type="number"
                  value={formData.lectureNumber}
                  onChange={(e) => setFormData({ ...formData, lectureNumber: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
                  placeholder="e.g., 45:30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">YouTube Video URL</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                  errors.videoUrl ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                }`}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl}</p>}
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
                Publish this lecture
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createLecture.isPending || updateLecture.isPending}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(createLecture.isPending || updateLecture.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingLecture ? 'Update Lecture' : 'Add Lecture'}
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
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-red-600" />
          Recorded Lectures ({lectures.length})
        </h2>

        {lectures.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Video className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No recorded lectures yet. Add your first video!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lectures.map((lecture: RecordedLecture) => (
              <div
                key={lecture._id}
                className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video bg-slate-900 relative">
                  <iframe
                    src={getYouTubeEmbedUrl(lecture.videoUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-800 line-clamp-1">{lecture.title}</h3>
                        {lecture.isPublished && (
                          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Live</span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{getCourseName(lecture.courseId)}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span>{lecture.chapterName} • Lecture {lecture.lectureNumber}</span>
                    {lecture.duration && <span>{lecture.duration}</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(lecture)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all duration-300"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </button>
                    <a
                      href={lecture.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-3 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(lecture._id)}
                      disabled={deleteLecture.isPending}
                      className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-300 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
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

export default Recorded;
