import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCourse, useCheckPurchase, useLiveLecture } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'live'>('videos');
  const [_selectedVideo, _setSelectedVideo] = useState<string | null>(null);

  // Fetch course details from API
  const { data: course, isLoading, error } = useCourse(courseId || '');
  
  // Fetch live lecture for this course
  const { data: liveLecture } = useLiveLecture(courseId || '');
  
  // Check if user has purchased this course
  const { data: isPurchased } = useCheckPurchase(courseId || '', user?._id);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePurchase = () => {
    if (!isAuthenticated) {
      alert('Please login to purchase this course');
      navigate('/login');
      return;
    }
    // Navigate to order/payment page
    alert('Redirecting to payment... (Payment integration needed)');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-800">Loading course...</h2>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Course not found</h2>
          <Link
            to="/courses"
            className="inline-block py-2.5 px-6 rounded-lg font-semibold text-white no-underline"
            style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total lessons from curriculum
  const totalLessons = course.curriculum?.length || 0;

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
            <img src={course.image || 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=800&h=400&fit=crop'} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{course.title}</h1>
              <p className="text-white/80 mb-3">{course.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2">👨‍🏫 {course.teachers?.teacherName || 'Instructor'}</span>
                <span className="flex items-center gap-2">⏱️ {course.totalDuration || 'N/A'}</span>
                <span className="flex items-center gap-2">📚 {totalLessons} Lessons</span>
                <span className="flex items-center gap-2">💰 ₹{course.pricing || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Button (if not purchased) */}
        {!isPurchased && (
          <div className="bg-white rounded-[15px] shadow-lg p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Get Full Access</h3>
              <p className="text-slate-600 text-sm">Unlock all {totalLessons} lessons and live classes</p>
            </div>
            <button
              onClick={handlePurchase}
              className="py-3 px-8 rounded-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}
            >
              Buy Now - ₹{course.pricing || 0}
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'videos' ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            style={activeTab === 'videos' ? { background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' } : {}}
          >
            📹 Recorded Videos ({totalLessons})
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'live' ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            style={activeTab === 'live' ? { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' } : {}}
          >
            🔴 Live Class {liveLecture ? '(Available)' : '(Not Scheduled)'}
          </button>
        </div>

        {/* Video Content - Simple List */}
        {activeTab === 'videos' && (
          <div className="bg-white rounded-[15px] shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Course Videos</h3>
            {course.curriculum && course.curriculum.length > 0 ? (
              <div className="flex flex-col gap-4">
                {course.curriculum.map((lecture, index) => {
                  const canAccess = isPurchased || lecture.freePreview;
                  return (
                    <div key={lecture._id || index} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50/30 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-800">{lecture.title}</h4>
                            {lecture.freePreview && (
                              <span className="py-0.5 px-2 bg-green-100 text-green-600 text-xs font-semibold rounded-full">Free Preview</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">⏱️ {lecture.duration || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lecture.notesUrl && canAccess && (
                          <a
                            href={lecture.notesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-4 rounded-lg font-semibold text-sm text-center no-underline transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 text-slate-700 bg-slate-100 hover:bg-slate-200"
                          >
                            📄 Notes
                          </a>
                        )}
                        {canAccess ? (
                          <a
                            href={lecture.videoUrl}
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
                        ) : (
                          <button
                            onClick={handlePurchase}
                            className="py-2 px-4 rounded-lg font-semibold text-sm text-center transition-all duration-300 flex items-center gap-2 text-white opacity-70 cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}
                          >
                            🔒 Unlock
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <div className="text-4xl mb-4">📹</div>
                <p>No videos available yet</p>
              </div>
            )}
          </div>
        )}

        {/* Live Classes Content */}
        {activeTab === 'live' && (
          <div className="bg-white rounded-[15px] shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Live Class</h3>
            {liveLecture ? (
              isPurchased ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 mb-2">Join Live Session</h4>
                      <p className="text-slate-600 text-sm mb-2">Click the button to join the live class for this course.</p>
                      <p className="text-slate-500 text-xs">👨‍🏫 Instructor: {course.teachers?.teacherName || 'Instructor'}</p>
                    </div>
                    <a
                      href={liveLecture.gmeetinglink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-6 rounded-lg font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}
                    >
                      🔴 Join Live Class
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🔒</div>
                  <h4 className="text-lg font-bold text-slate-800 mb-2">Live Class Available!</h4>
                  <p className="text-slate-600 mb-4">Purchase this course to access live classes.</p>
                  <button
                    onClick={handlePurchase}
                    className="py-3 px-8 rounded-lg font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}
                  >
                    Buy Now - ₹{course.pricing || 0}
                  </button>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-slate-500">
                <div className="text-4xl mb-4">📅</div>
                <p>No live class scheduled for this course yet.</p>
                <p className="text-sm text-slate-400 mt-2">Check back later for updates!</p>
              </div>
            )}
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
