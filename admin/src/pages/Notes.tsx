import { useState } from "react";
import { Plus, Edit2, Trash2, FileText, ExternalLink } from "lucide-react";

interface StudyNote {
  id: number;
  chapterName: string;
  lectureTitle: string;
  lectureNumber: number;
  driveLink: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<StudyNote[]>([
    {
      id: 1,
      chapterName: "Introduction to React",
      lectureTitle: "What is React?",
      lectureNumber: 1,
      driveLink: "https://drive.google.com/file/d/example1",
    },
    {
      id: 2,
      chapterName: "Introduction to React",
      lectureTitle: "Components and Props",
      lectureNumber: 2,
      driveLink: "https://drive.google.com/file/d/example2",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    chapterName: "",
    lectureTitle: "",
    lectureNumber: 1,
    driveLink: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setNotes(
        notes.map((note) =>
          note.id === editingId ? { ...formData, id: editingId } : note
        )
      );
      setEditingId(null);
    } else {
      setNotes([...notes, { ...formData, id: Date.now() }]);
    }
    setFormData({ chapterName: "", lectureTitle: "", lectureNumber: 1, driveLink: "" });
    setIsFormOpen(false);
  };

  const handleEdit = (note: StudyNote) => {
    setFormData({
      chapterName: note.chapterName,
      lectureTitle: note.lectureTitle,
      lectureNumber: note.lectureNumber,
      driveLink: note.driveLink,
    });
    setEditingId(note.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this note?")) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ chapterName: "", lectureTitle: "", lectureNumber: 1, driveLink: "" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Study Notes</h1>
          <p className="text-gray-600 mt-1">Manage Google Drive notes links</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Notes
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Notes" : "Add New Notes"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chapter Name
                </label>
                <input
                  type="text"
                  value={formData.chapterName}
                  onChange={(e) =>
                    setFormData({ ...formData, chapterName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter chapter name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lecture Title
                </label>
                <input
                  type="text"
                  value={formData.lectureTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, lectureTitle: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter lecture title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lecture Number
                </label>
                <input
                  type="number"
                  value={formData.lectureNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, lectureNumber: parseInt(e.target.value) || 1 })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Drive Link
                </label>
                <input
                  type="url"
                  value={formData.driveLink}
                  onChange={(e) =>
                    setFormData({ ...formData, driveLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://drive.google.com/file/d/..."
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update Notes" : "Add Notes"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notes List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            All Study Notes ({notes.length})
          </h2>
        </div>
        {notes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No study notes added yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Lecture {note.lectureNumber}: {note.lectureTitle}
                    </p>
                    <p className="text-sm text-gray-500">{note.chapterName}</p>
                    <a
                      href={note.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open in Google Drive
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(note)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
