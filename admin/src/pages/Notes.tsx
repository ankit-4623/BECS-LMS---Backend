import { useState } from 'react';
import { Plus, FileText, Edit2, Trash2, X, Loader2, ExternalLink, BookOpen, DollarSign } from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import { useStudyNotes, useCreateStudyNote, useUpdateStudyNote, useDeleteStudyNote } from '../hooks/useStudyNotes';
import { studyNoteFormSchema, type StudyNote } from '../lib/schemas';

const Notes = () => {
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: notes = [], isLoading: notesLoading } = useStudyNotes();
  const createNote = useCreateStudyNote();
  const updateNote = useUpdateStudyNote();
  const deleteNote = useDeleteStudyNote();

  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    description: '',
    chapterName: '',
    lectureNumber: '1',
    driveLink: '',
    isPublished: false,
    isIndependent: false,
    pricing: '0',
    category: '',
    level: '' as '' | 'Beginner' | 'Intermediate' | 'Advanced',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      courseId: '',
      title: '',
      description: '',
      chapterName: '',
      lectureNumber: '1',
      driveLink: '',
      isPublished: false,
      isIndependent: false,
      pricing: '0',
      category: '',
      level: '',
    });
    setErrors({});
    setEditingNote(null);
    setShowForm(false);
  };

  const validateForm = () => {
    const dataToValidate = {
      courseId: formData.isIndependent ? undefined : formData.courseId,
      title: formData.title,
      description: formData.description,
      chapterName: formData.isIndependent ? undefined : formData.chapterName,
      lectureNumber: Number(formData.lectureNumber) || 1,
      driveLink: formData.driveLink,
      isIndependent: formData.isIndependent,
      pricing: Number(formData.pricing) || 0,
      category: formData.category,
      level: formData.level,
    };

    const result = studyNoteFormSchema.safeParse(dataToValidate);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        newErrors[path] = issue.message;
      });
      setErrors(newErrors);
      return false;
    }

    // Additional validation for non-independent notes
    if (!formData.isIndependent && !formData.courseId) {
      setErrors({ courseId: 'Course is required for course-linked notes' });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      courseId: formData.isIndependent ? undefined : formData.courseId,
      title: formData.title,
      description: formData.description,
      chapterName: formData.isIndependent ? '' : formData.chapterName,
      lectureNumber: Number(formData.lectureNumber) || 1,
      driveLink: formData.driveLink,
      isPublished: formData.isPublished,
      isIndependent: formData.isIndependent,
      pricing: Number(formData.pricing) || 0,
      category: formData.category,
      level: formData.level,
    };

    try {
      if (editingNote) {
        await updateNote.mutateAsync({ id: editingNote._id, data: payload });
      } else {
        await createNote.mutateAsync(payload);
      }
      resetForm();
    } catch (err) {
      console.error('Error saving note:', err);
    }
  };

  const handleEdit = (note: StudyNote) => {
    setEditingNote(note);
    setFormData({
      courseId: note.courseId || '',
      title: note.title || '',
      description: note.description || '',
      chapterName: note.chapterName || '',
      lectureNumber: String(note.lectureNumber || 1),
      driveLink: note.driveLink || '',
      isPublished: note.isPublished || false,
      isIndependent: note.isIndependent || false,
      pricing: String(note.pricing || 0),
      category: note.category || '',
      level: (note.level as '' | 'Beginner' | 'Intermediate' | 'Advanced') || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this study note?')) {
      try {
        await deleteNote.mutateAsync(id);
      } catch (err) {
        console.error('Error deleting note:', err);
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

  if (coursesLoading || notesLoading) {
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
          Study Notes
        </h1>
        <p className="text-slate-500">Manage study materials and Google Drive links</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                {editingNote ? 'Edit Study Note' : 'Add Study Note'}
              </h2>
              <p className="text-sm text-slate-500">Upload Google Drive links for study materials</p>
            </div>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-red-600/20"
            >
              <Plus className="w-5 h-5" />
              Add Note
            </button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Independent Note Toggle */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isIndependent"
                  checked={formData.isIndependent}
                  onChange={(e) => setFormData({ ...formData, isIndependent: e.target.checked, courseId: '' })}
                  className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isIndependent" className="text-sm font-semibold text-slate-700">
                  <span className="text-blue-600">Independent Note</span> - Can be purchased without a course
                </label>
              </div>
              <p className="text-xs text-slate-500 mt-2 ml-8">
                Enable this to sell this note separately. Students can buy it without enrolling in any course.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!formData.isIndependent && (
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
              )}

              <div className={formData.isIndependent ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                    errors.title ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                  }`}
                  placeholder="Enter note title"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>
            </div>

            {/* Independent note specific fields */}
            {formData.isIndependent && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
                    min="0"
                    placeholder="0 for free"
                  />
                  <p className="text-xs text-slate-500 mt-1">Set 0 for free notes</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
                    placeholder="e.g., Physics, Math"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Level</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value as '' | 'Beginner' | 'Intermediate' | 'Advanced' })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500 bg-white"
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            )}

            {/* Chapter/Lecture fields - only for course-linked notes */}
            {!formData.isIndependent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Chapter Name</label>
                  <input
                    type="text"
                    value={formData.chapterName}
                    onChange={(e) => setFormData({ ...formData, chapterName: e.target.value })}
                    className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                      errors.chapterName ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                    }`}
                    placeholder="e.g., Chapter 1: Introduction"
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
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Google Drive Link</label>
              <input
                type="url"
                value={formData.driveLink}
                onChange={(e) => setFormData({ ...formData, driveLink: e.target.value })}
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                  errors.driveLink ? 'border-red-500' : 'border-slate-200 focus:border-red-500'
                }`}
                placeholder="https://drive.google.com/..."
              />
              {errors.driveLink && <p className="text-red-500 text-sm mt-1">{errors.driveLink}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-all duration-300 focus:outline-none focus:border-red-500"
                placeholder="Brief description of the study material..."
              />
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
                Publish this note
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createNote.isPending || updateNote.isPending}
                className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {(createNote.isPending || updateNote.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingNote ? 'Update Note' : 'Add Note'}
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
          <FileText className="w-5 h-5 text-red-600" />
          Study Notes ({notes.length})
        </h2>

        {notes.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No study notes yet. Add your first note!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note: StudyNote) => (
              <div
                key={note._id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${note.isIndependent ? 'bg-purple-100' : 'bg-blue-100'}`}>
                  <FileText className={`w-6 h-6 ${note.isIndependent ? 'text-purple-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-slate-800 truncate">{note.title}</h3>
                    {note.isIndependent && (
                      <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full flex-shrink-0">Independent</span>
                    )}
                    {note.isIndependent && note.pricing > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-amber-100 text-amber-700 rounded-full flex-shrink-0">₹{note.pricing}</span>
                    )}
                    {note.isIndependent && note.pricing === 0 && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full flex-shrink-0">Free</span>
                    )}
                    {note.isPublished && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full flex-shrink-0">Published</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {note.isIndependent ? (
                      <>
                        {note.category && <span className="flex items-center gap-1">📁 {note.category}</span>}
                        {note.level && <span className="flex items-center gap-1">📊 {note.level}</span>}
                        {note.purchasedBy && note.purchasedBy.length > 0 && (
                          <span className="flex items-center gap-1">👥 {note.purchasedBy.length} purchased</span>
                        )}
                      </>
                    ) : (
                      <>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {getCourseName(note.courseId || '')}
                        </span>
                        <span>{note.chapterName} • Lecture {note.lectureNumber}</span>
                      </>
                    )}
                  </div>
                  {note.description && (
                    <p className="text-sm text-slate-500 mt-1 truncate">{note.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={note.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
                    title="Open in Google Drive"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg transition-all duration-300"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    disabled={deleteNote.isPending}
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

export default Notes;
