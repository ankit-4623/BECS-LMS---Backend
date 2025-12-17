import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
}

interface LiveClass {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  meetLink: string;
  instructor: string;
  status: 'upcoming' | 'live' | 'completed';
}

interface CourseData {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  totalLessons: number;
  image: string;
  videos: VideoLesson[];
  liveClasses: LiveClass[];
}

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'live'>('videos');
  const [course, setCourse] = useState<CourseData | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Mock course data based on courseId
    const coursesData: Record<string, CourseData> = {
      math: {
        id: 'math',
        title: 'Mathematics for Beginners',
        description: 'Master algebra, geometry, and arithmetic fundamentals with expert guidance. This comprehensive course covers all essential mathematical concepts.',
        instructor: 'Dr. Anil Sharma',
        duration: '24 hours',
        totalLessons: 12,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=800&h=400&fit=crop',
        videos: [
          { id: 'v1', title: 'Introduction to Algebra', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v2', title: 'Linear Equations', duration: '52 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v3', title: 'Quadratic Equations', duration: '48 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v4', title: 'Polynomials', duration: '55 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v5', title: 'Geometry Basics', duration: '42 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v6', title: 'Triangles and Properties', duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ],
        liveClasses: [
          { id: 'l1', title: 'Doubt Clearing Session - Algebra', date: 'December 18, 2025', time: '10:00 AM', duration: '1 hour', meetLink: 'https://meet.google.com/abc-defg-hij', instructor: 'Dr. Anil Sharma', status: 'upcoming' },
          { id: 'l2', title: 'Problem Solving Workshop', date: 'December 20, 2025', time: '2:00 PM', duration: '1.5 hours', meetLink: 'https://meet.google.com/xyz-uvwx-rst', instructor: 'Dr. Anil Sharma', status: 'upcoming' },
          { id: 'l3', title: 'Weekly Q&A Session', date: 'December 22, 2025', time: '11:00 AM', duration: '1 hour', meetLink: 'https://meet.google.com/pqr-stuv-wxy', instructor: 'Dr. Anil Sharma', status: 'upcoming' },
        ],
      },
      python: {
        id: 'python',
        title: 'Python Programming Basics',
        description: 'Learn Python syntax and build simple programs from scratch. Perfect for beginners who want to start their programming journey.',
        instructor: 'Ms. Priya Kapoor',
        duration: '32 hours',
        totalLessons: 16,
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
        videos: [
          { id: 'v1', title: 'Introduction to Python', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v2', title: 'Variables and Data Types', duration: '55 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v3', title: 'Control Flow Statements', duration: '48 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v4', title: 'Functions in Python', duration: '52 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v5', title: 'Lists and Tuples', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v6', title: 'Dictionaries and Sets', duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v7', title: 'File Handling', duration: '42 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v8', title: 'Object Oriented Programming', duration: '60 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ],
        liveClasses: [
          { id: 'l1', title: 'Python Basics Q&A', date: 'December 19, 2025', time: '3:00 PM', duration: '1 hour', meetLink: 'https://meet.google.com/abc-defg-hij', instructor: 'Ms. Priya Kapoor', status: 'upcoming' },
          { id: 'l2', title: 'Hands-on Coding Session', date: 'December 21, 2025', time: '10:00 AM', duration: '2 hours', meetLink: 'https://meet.google.com/xyz-uvwx-rst', instructor: 'Ms. Priya Kapoor', status: 'upcoming' },
        ],
      },
      physics: {
        id: 'physics',
        title: 'Physics Fundamentals',
        description: 'Explore motion, force, and energy with interactive experiments. Build a strong foundation in physics concepts.',
        instructor: 'Prof. Rajesh Kumar',
        duration: '28 hours',
        totalLessons: 14,
        image: 'https://images.unsplash.com/photo-1636633062127-fbac4e922b40?w=800&h=400&fit=crop',
        videos: [
          { id: 'v1', title: 'Introduction to Physics', duration: '35 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v2', title: 'Motion in One Dimension', duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v3', title: 'Laws of Motion', duration: '55 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v4', title: 'Work, Energy and Power', duration: '48 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          { id: 'v5', title: 'Gravitation', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        ],
        liveClasses: [
          { id: 'l1', title: 'Physics Problem Solving', date: 'December 18, 2025', time: '4:00 PM', duration: '1.5 hours', meetLink: 'https://meet.google.com/abc-defg-hij', instructor: 'Prof. Rajesh Kumar', status: 'live' },
          { id: 'l2', title: 'Doubt Session - Mechanics', date: 'December 23, 2025', time: '11:00 AM', duration: '1 hour', meetLink: 'https://meet.google.com/xyz-uvwx-rst', instructor: 'Prof. Rajesh Kumar', status: 'upcoming' },
        ],
      },
    };

    // Default course data for unknown courseIds
    const defaultCourse: CourseData = {
      id: courseId || 'unknown',
      title: 'Course Content',
      description: 'This course provides comprehensive learning materials and live sessions to help you master the subject.',
      instructor: 'Expert Instructor',
      duration: '20 hours',
      totalLessons: 10,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=800&h=400&fit=crop',
      videos: [
        { id: 'v1', title: 'Introduction', duration: '40 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { id: 'v2', title: 'Core Concepts', duration: '50 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { id: 'v3', title: 'Advanced Topics', duration: '55 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { id: 'v4', title: 'Practical Examples', duration: '45 min', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ],
      liveClasses: [
        { id: 'l1', title: 'Live Doubt Session', date: 'December 20, 2025', time: '10:00 AM', duration: '1 hour', meetLink: 'https://meet.google.com/abc-defg-hij', instructor: 'Expert Instructor', status: 'upcoming' },
      ],
    };

    setCourse(coursesData[courseId || ''] || defaultCourse);
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-slate-800">Loading course...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', color: '#1e293b' }}>
      {/* Header */}
      <header className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`} style={{ background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(10px)', boxShadow: scrolled ? '0 4px 25px rgba(0, 0, 0, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <nav className="flex justify-between items-center px-[5%] py-4 max-w-[1400px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-3 no-underline cursor-pointer">
            <div className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center font-extrabold text-white text-2xl" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', fontFamily: "'Poppins', sans-serif", boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}>B</div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-800 m-0" style={{ fontFamily: "'Poppins', sans-serif" }}>BECS</h1>
              <p className="text-xs text-slate-500 m-0 font-medium">E-Learning Platform</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-white border-none py-2.5 px-6 rounded-lg font-semibold text-[0.95rem] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 no-underline" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', fontFamily: "'Poppins', sans-serif", boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}>Back to Dashboard</Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mt-[90px] px-[5%] py-8 max-w-[1400px] mx-auto">
        {/* Course Header */}
        <div className="bg-white rounded-[15px] shadow-lg overflow-hidden mb-8">
          <div className="relative h-[200px]">
            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{course.title}</h1>
              <p className="text-white/80 mb-3">{course.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">👨‍🏫 {course.instructor}</span>
                <span className="flex items-center gap-2">⏱️ {course.duration}</span>
                <span className="flex items-center gap-2">📚 {course.totalLessons} Lessons</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'videos' ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            style={activeTab === 'videos' ? { background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' } : {}}
          >
            📹 Recorded Videos ({course.videos.length})
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'live' ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            style={activeTab === 'live' ? { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' } : {}}
          >
            🔴 Live Classes ({course.liveClasses.length})
          </button>
        </div>

        {/* Video Content - Simple List */}
        {activeTab === 'videos' && (
          <div className="bg-white rounded-[15px] shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Course Videos</h3>
            <div className="flex flex-col gap-4">
              {course.videos.map((video, index) => (
                <div key={video.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50/30 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">{video.title}</h4>
                      <p className="text-sm text-slate-500">⏱️ {video.duration}</p>
                    </div>
                  </div>
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 rounded-lg font-semibold text-sm text-center no-underline transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 text-white"
                    style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Watch Video
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Classes Content */}
        {activeTab === 'live' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {course.liveClasses.map((liveClass) => (
              <div key={liveClass.id} className="bg-white rounded-[15px] shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800" style={{ fontFamily: "'Poppins', sans-serif" }}>{liveClass.title}</h3>
                  <span
                    className={`py-1 px-3 rounded-full text-xs font-semibold ${
                      liveClass.status === 'live' ? 'bg-red-100 text-red-600' : liveClass.status === 'upcoming' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {liveClass.status === 'live' ? '🔴 LIVE NOW' : liveClass.status === 'upcoming' ? '📅 Upcoming' : '✓ Completed'}
                  </span>
                </div>
                <div className="flex flex-col gap-2 mb-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{liveClass.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>🕐</span>
                    <span>{liveClass.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{liveClass.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>👨‍🏫</span>
                    <span>{liveClass.instructor}</span>
                  </div>
                </div>
                <a
                  href={liveClass.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-sm text-center text-white no-underline block transition-all duration-300 hover:-translate-y-0.5 ${liveClass.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    background: liveClass.status === 'live' ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    boxShadow: liveClass.status === 'live' ? '0 4px 12px rgba(220, 38, 38, 0.3)' : '0 4px 12px rgba(5, 150, 105, 0.3)',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onClick={(e) => liveClass.status === 'completed' && e.preventDefault()}
                >
                  {liveClass.status === 'live' ? '🔴 Join Live Class Now' : liveClass.status === 'upcoming' ? '📅 Join Live Class' : 'Class Ended'}
                </a>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-slate-100 px-[5%] py-12 mt-16" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
        <div className="text-center">
          <p className="text-sm text-slate-300">© 2025 BECS E-Learning. All rights reserved. | Crafted with excellence</p>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetail;
