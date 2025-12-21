import { useState } from "react";
import {
  Settings as SettingsIcon,
  Database,
  BarChart3,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Users,
  BookOpen,
  Video,
  FileText,
} from "lucide-react";

export default function Settings() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const stats = [
    { label: "Total Courses", value: 12, icon: BookOpen, color: "blue" },
    { label: "Live Lectures", value: 8, icon: Video, color: "green" },
    { label: "Recorded Lectures", value: 45, icon: Video, color: "purple" },
    { label: "Study Notes", value: 32, icon: FileText, color: "orange" },
    { label: "Total Students", value: 156, icon: Users, color: "pink" },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Data exported successfully!");
    }, 2000);
  };

  const handleImport = () => {
    setIsImporting(true);
    setTimeout(() => {
      setIsImporting(false);
      alert("Data imported successfully!");
    }, 2000);
  };

  const handleClearData = (type: string) => {
    if (confirm(`Are you sure you want to clear all ${type}? This action cannot be undone.`)) {
      alert(`${type} cleared successfully!`);
    }
  };

  const handleDeleteAllData = () => {
    if (
      confirm(
        "⚠️ DANGER: This will permanently delete ALL data including courses, lectures, notes, and student records. This action CANNOT be undone. Are you absolutely sure?"
      )
    ) {
      if (confirm("This is your last chance to cancel. Type 'DELETE' to confirm.")) {
        alert("All data has been deleted.");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SettingsIcon className="w-7 h-7" />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">Manage your admin panel settings</p>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Dashboard Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg bg-${stat.color}-50 border border-${stat.color}-100`}
              style={{
                backgroundColor:
                  stat.color === "blue"
                    ? "#eff6ff"
                    : stat.color === "green"
                    ? "#f0fdf4"
                    : stat.color === "purple"
                    ? "#faf5ff"
                    : stat.color === "orange"
                    ? "#fff7ed"
                    : "#fdf2f8",
              }}
            >
              <div className="flex items-center gap-3">
                <stat.icon
                  className="w-8 h-8"
                  style={{
                    color:
                      stat.color === "blue"
                        ? "#2563eb"
                        : stat.color === "green"
                        ? "#16a34a"
                        : stat.color === "purple"
                        ? "#9333ea"
                        : stat.color === "orange"
                        ? "#ea580c"
                        : "#db2777",
                  }}
                />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

   

    

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-semibold mb-2 text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Danger Zone
        </h2>
        <p className="text-sm text-red-600 mb-4">
          These actions are irreversible. Please proceed with extreme caution.
        </p>
        <button
          onClick={handleDeleteAllData}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete All Data
        </button>
      </div>

      {/* System Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          System Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Version:</span>
            <span className="ml-2 font-medium">1.0.0</span>
          </div>
          <div>
            <span className="text-gray-500">Last Backup:</span>
            <span className="ml-2 font-medium">Today, 10:30 AM</span>
          </div>
          <div>
            <span className="text-gray-500">Database:</span>
            <span className="ml-2 font-medium text-green-600">Connected</span>
          </div>
          <div>
            <span className="text-gray-500">Storage:</span>
            <span className="ml-2 font-medium">45% used</span>
          </div>
        </div>
      </div>
    </div>
  );
}
