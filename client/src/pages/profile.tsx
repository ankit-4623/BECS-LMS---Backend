import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePurchasedCourses } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // Fetch purchased courses from API
  const { data: purchasedCourses = [], isLoading: purchasesLoading } = usePurchasedCourses(user?._id);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        color: '#1e293b',
      }}
    >
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-[1000] transition-all duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(10px)',
          boxShadow: scrolled ? '0 4px 25px rgba(0, 0, 0, 0.1)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}
      >
        <nav className="flex justify-between items-center px-[5%] py-4 max-w-[1400px] mx-auto w-full">
          <Link to="/" className="flex items-center gap-3 no-underline cursor-pointer">
            <div
              className="w-[45px] h-[45px] rounded-[10px] flex items-center justify-center font-extrabold text-white text-2xl"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
              }}
            >
              B
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-800 m-0" style={{ fontFamily: "'Poppins', sans-serif" }}>
                BECS
              </h1>
              <p className="text-xs text-slate-500 m-0 font-medium">E-Learning Platform</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="text-white border-none py-2.5 px-6 rounded-lg font-semibold text-[0.95rem] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 no-underline"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
              }}
            >
              Back to Dashboard
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mt-[90px] px-[5%] py-12 max-w-[1400px] mx-auto">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl font-bold text-slate-800 mb-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            My Profile
          </h1>
          <p className="text-slate-500">Manage your account and view your purchases</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-[15px] shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Avatar */}
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-bold text-white flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 8px 25px rgba(220, 38, 38, 0.3)',
              }}
            >
              {user.userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h2
                className="text-3xl font-bold text-slate-800 mb-4"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {user.userName}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: '#fef2f2' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Email</p>
                    <p className="text-slate-700 font-medium">{user.userEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: '#fef2f2' }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M12 14c-3.3 0-6 2.7-6 6h12c0-3.3-2.7-6-6-6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">Role</p>
                    <p className="text-slate-700 font-medium capitalize">{user.role}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-6 justify-center md:justify-start">
                <div className="text-center">
                  <p
                    className="text-3xl font-bold text-red-600"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {purchasesLoading ? '...' : purchasedCourses.length}
                  </p>
                  <p className="text-sm text-slate-500">Courses</p>
                </div>
              </div>

              {/* Logout Button */}
              <div className="mt-6 flex justify-center md:justify-start">
                <button
                  onClick={handleLogout}
                  className="py-2.5 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm border border-red-600 text-red-600 hover:bg-red-50"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Courses and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Purchased Courses Box */}
          <div className="bg-white rounded-[15px] shadow-lg p-8">
            <h2
              className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span
                className="w-1 h-8 rounded"
                style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
              />
              Purchased Courses
            </h2>

            {/* Loading State */}
            {purchasesLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading your courses...</p>
              </div>
            )}

            {!purchasesLoading && purchasedCourses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📚</div>
                <h3
                  className="text-xl font-semibold text-slate-800 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  No Courses Yet
                </h3>
                <p className="text-slate-500 mb-6">
                  You haven't purchased any courses yet.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-block text-white py-2.5 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 no-underline"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                    fontFamily: "'Poppins', sans-serif",
                    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
                  }}
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {purchasedCourses.map((course) => (
                  <div
                    key={course.courseId}
                    className="rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 flex justify-between items-center"
                    style={{
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fce7e7 100%)',
                      border: '1px solid #fecaca',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      {course.courseImage && (
                        <img 
                          src={course.courseImage} 
                          alt={course.title}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3
                          className="text-lg font-semibold text-slate-800 mb-1"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          {course.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Instructor: {course.instructorName}
                        </p>
                        <p className="text-sm text-slate-500">
                          Purchased on {new Date(course.dateOfPurchase).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/course/${course.courseId}`}
                      className="py-2.5 px-5 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white no-underline hover:-translate-y-0.5 flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      View Course
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Placeholder for Notes - Coming Soon */}
          <div className="bg-white rounded-[15px] shadow-lg p-8">
            <h2
              className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span
                className="w-1 h-8 rounded"
                style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
              />
              Purchased Notes
            </h2>

            <div className="text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <h3
                className="text-xl font-semibold text-slate-800 mb-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                No Notes Yet
              </h3>
              <p className="text-slate-500 mb-6">
                You haven't purchased any notes yet.
              </p>
              <Link
                to="/notes"
                className="inline-block text-white py-2.5 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 no-underline"
                style={{
                  background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                  fontFamily: "'Poppins', sans-serif",
                  boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
                }}
              >
                Browse Notes
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-slate-100 px-[5%] py-12 mt-16"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-[1400px] mx-auto pb-8">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              BECS E-Learning
            </h3>
            <p className="text-slate-300 text-[0.95rem]">
              A premier platform dedicated to delivering high-quality education and innovative learning solutions for
              students worldwide.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Quick Links
            </h3>
            {['Home', 'Courses', 'Notes', 'Dashboard'].map((link) => (
              <Link
                key={link}
                to={link === 'Home' ? '/' : `/${link.toLowerCase()}`}
                className="text-slate-300 text-[0.95rem] no-underline transition-colors duration-300 hover:text-red-600"
              >
                {link}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Resources
            </h3>
            {['Study Materials', 'Practice Exams', 'Video Lectures', 'Support Center'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-slate-300 text-[0.95rem] no-underline transition-colors duration-300 hover:text-red-600"
              >
                {link}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Contact Information
            </h3>
            <a
              href="mailto:info@becslearning.com"
              className="text-slate-300 text-[0.95rem] no-underline transition-colors duration-300 hover:text-red-600"
            >
              info@becslearning.com
            </a>
            <a
              href="tel:+91-123-456-7890"
              className="text-slate-300 text-[0.95rem] no-underline transition-colors duration-300 hover:text-red-600"
            >
              +91-123-456-7890
            </a>
            <p className="text-slate-300 text-[0.95rem]">Available 24/7 for assistance</p>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-slate-700 mt-8">
          <p className="text-sm text-slate-300">© 2025 BECS E-Learning. All rights reserved. | Crafted with excellence</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
