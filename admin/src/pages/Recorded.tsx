import { useState } from "react";
import { Plus, Edit2, Trash2, Video, Youtube } from "lucide-react";

interface RecordedLecture {
  id: number;
  chapterName: string;
  lectureTitle: string;
  lectureNumber: number;
  youtubeLink: string;
}

export default function Recorded() {
  const [lectures, setLectures] = useState<RecordedLecture[]>([
    {
      id: 1,
      chapterName: "Introduction to React",
      lectureTitle: "What is React?",
      lectureNumber: 1,
      youtubeLink: "https://youtube.com/watch?v=example1",
    },
    {
      id: 2,
      chapterName: "Introduction to React",
      lectureTitle: "Components and Props",
      lectureNumber: 2,
      youtubeLink: "https://youtube.com/watch?v=example2",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    chapterName: "",
    lectureTitle: "",
    lectureNumber: 1,
    youtubeLink: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setLectures(
        lectures.map((lecture) =>
          lecture.id === editingId ? { ...formData, id: editingId } : lecture
        )
      );
      setEditingId(null);
    } else {
      setLectures([...lectures, { ...formData, id: Date.now() }]);
    }
    setFormData({ chapterName: "", lectureTitle: "", lectureNumber: 1, youtubeLink: "" });
    setIsFormOpen(false);
  };

  const handleEdit = (lecture: RecordedLecture) => {
    setFormData({
      chapterName: lecture.chapterName,
      lectureTitle: lecture.lectureTitle,
      lectureNumber: lecture.lectureNumber,
      youtubeLink: lecture.youtubeLink,
    });
    setEditingId(lecture.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this lecture?")) {
      setLectures(lectures.filter((lecture) => lecture.id !== id));
    }
  };

  const handleCancel = () => {
    setFormData({ chapterName: "", lectureTitle: "", lectureNumber: 1, youtubeLink: "" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recorded Lectures</h1>
          <p className="text-gray-600 mt-1">Manage YouTube lecture recordings</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Lecture
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Lecture" : "Add New Lecture"}
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
                  YouTube Link
                </label>
                <input
                  type="url"
                  value={formData.youtubeLink}
                  onChange={(e) =>
                    setFormData({ ...formData, youtubeLink: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update Lecture" : "Add Lecture"}
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

      {/* Lectures List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            All Recorded Lectures ({lectures.length})
          </h2>
        </div>
        {lectures.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Video className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recorded lectures added yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Lecture {lecture.lectureNumber}: {lecture.lectureTitle}
                    </p>
                    <p className="text-sm text-gray-500">{lecture.chapterName}</p>
                    <a
                      href={lecture.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {lecture.youtubeLink}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(lecture)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lecture.id)}
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
