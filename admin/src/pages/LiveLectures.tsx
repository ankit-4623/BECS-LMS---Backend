import { useState } from 'react';
import { Plus, Video, Trash2, Calendar, Clock, User, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  name: string;
}

interface LiveLecture {
  id: string;
  courseName: string;
  duration: string;
  date: string;
  time: string;
  teacherName: string;
  meetLink: string;
}

const LiveLectures = () => {
  // Mock courses - in real app, this would come from API/context
  const [courses] = useState<Course[]>([
    { id: '1', name: 'Complete Electronics' },
    { id: '2', name: 'Digital Logic Design' },
    { id: '3', name: 'Microprocessors' },
    { id: '4', name: 'Signal Processing' },
  ]);

  const [lectures, setLectures] = useState<LiveLecture[]>([
    {
      id: '1',
      courseName: 'Complete Electronics',
      duration: '2 hours',
      date: '2025-12-20',
      time: '10:00',
      teacherName: 'Dr. Sharma',
      meetLink: 'https://meet.google.com/abc-defg-hij',
    },
  ]);

  const [formData, setFormData] = useState({
    courseName: '',
    duration: '',
    date: '',
    time: '',
    teacherName: '',
    meetLink: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.courseName.trim()) newErrors.courseName = 'Course name is required';
    if (!formData.duration.trim()) newErrors.duration = 'Duration is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.teacherName.trim()) newErrors.teacherName = 'Teacher name is required';
    if (!formData.meetLink.trim()) {
      newErrors.meetLink = 'Meet link is required';
    } else if (!formData.meetLink.match(/^https?:\/\/.+/)) {
      newErrors.meetLink = 'Please enter a valid URL';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setTimeout(() => {
      const newLecture: LiveLecture = {
        id: Date.now().toString(),
        ...formData,
      };
      setLectures([...lectures, newLecture]);
      setFormData({
        courseName: '',
        duration: '',
        date: '',
        time: '',
        teacherName: '',
        meetLink: '',
      });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setLectures(lectures.filter((lecture) => lecture.id !== id));
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

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">
          Live Lectures
        </h1>
        <p className="text-slate-500">Schedule and manage live lecture sessions</p>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slideUp z-50">
          <span className="text-lg">✓</span>
          Live lecture scheduled successfully!
        </div>
      )}

      {/* Add Live Lecture Form */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Course Name</label>
            <select
              value={formData.courseName}
              onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none bg-white ${
                errors.courseName ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
            >
              <option value="">-- Select Course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.name}>
                  {course.name}
                </option>
              ))}
            </select>
            {errors.courseName && <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Teacher Name</label>
            <input
              type="text"
              value={formData.teacherName}
              onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                errors.teacherName ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
              placeholder="Enter teacher name"
            />
            {errors.teacherName && <p className="text-red-500 text-sm mt-1">{errors.teacherName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Duration</label>
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                errors.duration ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
              placeholder="e.g., 2 hours"
            />
            {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                errors.date ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                errors.time ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
            />
            {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Google Meet Link</label>
            <input
              type="url"
              value={formData.meetLink}
              onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                errors.meetLink ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
              }`}
              placeholder="https://meet.google.com/abc-defg-hij"
            />
            {errors.meetLink && <p className="text-red-500 text-sm mt-1">{errors.meetLink}</p>}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-5 h-5" />
          {isSaving ? 'Scheduling...' : 'Schedule Lecture'}
        </button>
      </div>

      {/* Scheduled Lectures */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mt-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Scheduled Live Lectures</h2>
        
        {lectures.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <div className="text-4xl mb-3 opacity-50">🎥</div>
            <p>No live lectures scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{lecture.courseName}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        {lecture.teacherName}
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {formatDate(lecture.date)}
                      </p>
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {formatTime(lecture.time)} • {lecture.duration}
                      </p>
                    </div>
                    <a
                      href={lecture.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <Video className="w-4 h-4" />
                      Join Meeting
                    </a>
                  </div>
                  <button
                    onClick={() => handleDelete(lecture.id)}
                    className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete lecture"
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

export default LiveLectures;
