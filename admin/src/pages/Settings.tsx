import { BookOpen, Users, Video, FileText, Loader2, PlayCircle, TrendingUp, RefreshCw } from 'lucide-react';
import { useDashboardStats } from '../hooks/useSettings';

const Settings = () => {
  const { data: stats, isLoading, error, refetch, isRefetching } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading dashboard stats</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Courses',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Live Lectures',
      value: stats?.totalLiveLectures || 0,
      icon: Video,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      title: 'Recorded Lectures',
      value: stats?.totalRecordedLectures || 0,
      icon: PlayCircle,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
    {
      title: 'Study Notes',
      value: stats?.totalStudyNotes || 0,
      icon: FileText,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: 'Total Revenue',
      value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'emerald',
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-600',
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent mb-2">
            Dashboard & Settings
          </h1>
          <p className="text-slate-500">Overview of your platform statistics</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-300 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-7 h-7 ${stat.textColor}`} />
              </div>
            </div>
            <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
            <p className={`text-3xl font-black ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/courses"
            className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300"
          >
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Manage Courses</span>
          </a>
          <a
            href="/live-lectures"
            className="flex items-center gap-3 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300"
          >
            <Video className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">Schedule Live Lecture</span>
          </a>
          <a
            href="/recorded"
            className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all duration-300"
          >
            <PlayCircle className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Add Recorded Lecture</span>
          </a>
          <a
            href="/notes"
            className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all duration-300"
          >
            <FileText className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-orange-800">Upload Study Notes</span>
          </a>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-md border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Platform Information</h2>
        <div className="space-y-3 text-slate-600">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span>Platform Version</span>
            <span className="font-semibold text-slate-800">1.0.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span>Last Updated</span>
            <span className="font-semibold text-slate-800">{new Date().toLocaleDateString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span>Support</span>
            <a href="mailto:support@becs.edu.in" className="font-semibold text-red-600 hover:text-red-700">
              support@becs.edu.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
