import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCourses, usePurchasedCourses } from '../hooks/useCourses';
import { useIndependentNotes, usePurchasedNotes } from '../hooks/useNotes';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isPurchasesModalOpen, setIsPurchasesModalOpen] = useState(false);
  const [isCircuitModalOpen, _setIsCircuitModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Circuit simulator state
  const [voltage] = useState(9);
  const [ledEnabled] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch courses from API
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  
  // Fetch purchased courses from API
  const { data: purchasedCourses = [], isLoading: purchasesLoading } = usePurchasedCourses(user?._id);

  // Fetch independent notes from API
  const { data: allNotes = [], isLoading: notesLoading } = useIndependentNotes();

  // Fetch purchased notes from API
  const { data: purchasedNotes = [], isLoading: purchasedNotesLoading } = usePurchasedNotes(user?._id);

  useEffect(() => {
    // Scroll listener
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isCircuitModalOpen && canvasRef.current) {
      drawCircuit();
    }
  }, [isCircuitModalOpen]);

  const handleBuyCourse = (courseId: string, _courseTitle: string) => {
    if (!isAuthenticated) {
      alert('Please login to purchase courses');
      navigate('/login');
      return;
    }
    // Navigate to course detail page for purchase
    navigate(`/course/${courseId}`);
  };

  const openPreview = (_courseId: string, courseTitle: string, teacherName?: string) => {
    alert(`📚 ${courseTitle}\n\n👨‍🏫 Instructor: ${teacherName || 'Expert Instructor'}\n\nClick "Buy Now" to enroll!`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check if a course is purchased
  const isCoursePurchased = (courseId: string) => {
    return purchasedCourses.some(course => course.courseId === courseId);
  };

  // Check if a note is purchased
  const isNotePurchased = (noteId: string) => {
    return purchasedNotes.some(note => note._id === noteId);
  };

  const drawCircuit = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw wires
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 150);
    ctx.lineTo(150, 150);
    ctx.lineTo(250, 150);
    ctx.lineTo(350, 150);
    ctx.lineTo(450, 150);
    ctx.lineTo(450, 300);
    ctx.moveTo(250, 150);
    ctx.lineTo(250, 250);
    ctx.lineTo(350, 250);
    ctx.lineTo(350, 300);
    ctx.stroke();

    // Draw battery
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(40, 140, 10, 40);
    ctx.fillRect(45, 130, 10, 60);
    ctx.strokeRect(40, 140, 10, 40);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(`${voltage}V`, 30, 135);

    // Draw resistors
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(160, 135, 80, 30);
    ctx.fillStyle = '#333';
    ctx.fillText('R1', 180, 180);

    ctx.fillStyle = '#8b4513';
    ctx.fillRect(360, 135, 80, 30);
    ctx.fillStyle = '#333';
    ctx.fillText('R2', 380, 180);

    // Draw LED
    ctx.fillStyle = ledEnabled ? '#ffff00' : '#999';
    ctx.beginPath();
    ctx.moveTo(270, 240);
    ctx.lineTo(280, 250);
    ctx.lineTo(270, 260);
    ctx.lineTo(290, 250);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillText('LED', 300, 255);

    // Ground symbol
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(450, 310);
    ctx.lineTo(450, 320);
    ctx.moveTo(440, 320);
    ctx.lineTo(460, 320);
    ctx.moveTo(443, 325);
    ctx.lineTo(457, 325);
    ctx.moveTo(446, 330);
    ctx.lineTo(454, 330);
    ctx.stroke();
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get first 3 courses for display (exclude school level)
  const featuredCourses = courses.filter(c => c.level !== 'School Level').slice(0, 3);
  // Get school level courses
  const schoolCourses = courses.filter(c => c.level === 'School Level').slice(0, 3);

  // Get first 3 notes for display
  const notes = allNotes.slice(0, 3);

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

          <ul className="hidden md:flex gap-12 list-none">
            {[ 'courses', 'school-level', 'notes'].map((item) => (
              <li key={item}>
                <button
                  onClick={() => scrollToSection(item)}
                  className="text-slate-600 font-medium text-[0.95rem] transition-all duration-300 relative py-2 bg-transparent border-none cursor-pointer hover:text-red-600 group"
                >
                  {item === 'school-level' ? 'School Level' : item.charAt(0).toUpperCase() + item.slice(1)}
                  <span className="absolute w-0 h-0.5 bottom-0 left-0 bg-gradient-to-r from-red-600 to-red-800 transition-all duration-300 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-6">
            {/* <button
              onClick={() => setIsPurchasesModalOpen(true)}
              className="relative text-white border-none py-2.5 px-6 rounded-lg font-semibold text-[0.95rem] cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                fontFamily: "'Poppins', sans-serif",
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
              }}
            >
              My Purchases
              <span
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: '#fbbf24', color: '#1e293b' }}
              >
                {purchasedCourses.length}
              </span>
            </button> */}

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="bg-transparent border-none cursor-pointer text-2xl text-slate-600 p-2 transition-colors duration-300 hover:text-red-600 flex items-center gap-2"
              >
                {user && (
                  <span className="text-sm font-medium text-slate-700">{user.userName}</span>
                )}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M12 14c-3.3 0-6 2.7-6 6h12c0-3.3-2.7-6-6-6z" />
                </svg>
              </button>
              {isProfileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2.5 min-w-[180px] rounded-[10px] overflow-hidden z-[1001]"
                  style={{
                    background: 'white',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                  }}
                >
                  <Link
                    to="/profile"
                    className="block py-3 px-4 text-slate-800 no-underline font-medium text-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:pl-5"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/faq"
                    className="block py-3 px-4 text-slate-800 no-underline font-medium text-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:pl-5"
                  >
                    FAQ
                  </Link>
                  {isAuthenticated && (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-3 px-4 text-red-600 bg-transparent border-none font-medium text-sm cursor-pointer transition-all duration-300 hover:bg-red-50 hover:pl-5"
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mt-[90px] px-[5%] py-12 max-w-[1400px] mx-auto">
        {/* Header Buttons */}
        <div className="flex gap-6 mb-12 justify-center flex-wrap">
          {[
            { label: 'Explore Courses', href: 'courses' },
            { label: 'School Level', href: 'school-level' },
            { label: 'Study Notes', href: 'notes' },
          ].map((btn) => (
            <button
              key={btn.href}
              onClick={() => scrollToSection(btn.href)}
              className="text-white py-3.5 px-8 border-none rounded-[10px] font-semibold cursor-pointer transition-all duration-300 text-base hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Courses Section */}
        <section id="courses" className="mb-16 p-10 bg-white rounded-[15px] shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-3xl font-bold text-slate-800 flex items-center gap-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span
                className="w-1 h-8 rounded"
                style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
              />
              Featured Courses
            </h2>
            <Link
              to="/courses"
              className="text-white py-2.5 px-6 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 no-underline flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Loading State */}
          {coursesLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-slate-500">Loading courses...</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="relative">
                  <img
                    src={course.image?.url || 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop'}
                    alt={course.title}
                    className="w-full h-[180px] object-cover"
                    style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
                  />
                  {course.level && (
                    <span
                      className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {course.level}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">{course.description || course.subtitle}</p>
                  <div className="flex gap-4 mb-4 text-sm text-slate-400">
                    {course.totalDuration && <span className="flex items-center gap-1">⏱️ {course.totalDuration}</span>}
                    {course.category && <span className="flex items-center gap-1">📚 {course.category}</span>}
                  </div>
                  <div className="flex gap-3">
                    {isCoursePurchased(course._id) ? (
                      <Link
                        to={`/course/${course._id}`}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5 no-underline"
                        style={{
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        View Course
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleBuyCourse(course._id, course.title)}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        ₹{course.pricing || 0}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* School Level Section */}
        <section id="school-level" className="mb-16 p-10 bg-white rounded-[15px] shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-3xl font-bold text-slate-800 flex items-center gap-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span
                className="w-1 h-8 rounded"
                style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
              />
              School Level Courses
            </h2>
            <Link
              to="/school-courses"
              className="text-white py-2.5 px-6 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 no-underline flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="relative">
                  <img
                    src={course.image?.url || 'https://images.unsplash.com/photo-1636633062127-fbac4e922b40?w=400&h=300&fit=crop'}
                    alt={course.title}
                    className="w-full h-[180px] object-cover"
                    style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
                  />
                  {course.level && (
                    <span
                      className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {course.level}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">{course.description || course.subtitle}</p>
                  <div className="flex gap-4 mb-4 text-sm text-slate-400">
                    {course.totalDuration && <span className="flex items-center gap-1">⏱️ {course.totalDuration}</span>}
                    {course.category && <span className="flex items-center gap-1">📚 {course.category}</span>}
                  </div>
                  <div className="flex gap-3">
                    {isCoursePurchased(course._id) ? (
                      <Link
                        to={`/course/${course._id}`}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5 no-underline"
                        style={{
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        View Course
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleBuyCourse(course._id, course.title)}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        ₹{course.pricing || 0}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notes Section */}
        <section id="notes" className="mb-16 p-10 bg-white rounded-[15px] shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h2
              className="text-3xl font-bold text-slate-800 flex items-center gap-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              <span
                className="w-1 h-8 rounded"
                style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
              />
              Study Notes
            </h2>
            <Link
              to="/notes"
              className="text-white py-2.5 px-6 rounded-lg font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5 no-underline flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notesLoading ? (
              <div className="col-span-full text-center py-8 text-slate-500">Loading notes...</div>
            ) : notes.length === 0 ? (
              <div className="col-span-full text-center py-8 text-slate-500">No notes available</div>
            ) : (
              notes.map((note) => (
                <div
                  key={note._id}
                  className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600"
                  style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
                >
                  <div className="relative">
                    <img
                      src={
                        typeof note.image === 'string'
                          ? note.image
                          : note.image?.url || 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop'
                      }
                      alt={note.title}
                      className="w-full h-[180px] object-cover"
                    />
                    <span
                      className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {note.category || note.level || 'PDF'}
                    </span>
                    {note.isIndependent && note.pricing > 0 && (
                      <span
                        className="absolute top-3 left-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold"
                        style={{
                          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        ₹{note.pricing}
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3
                      className="text-lg font-semibold text-slate-800 mb-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {note.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                      {note.isIndependent ? note.category || 'Independent Note' : `From: ${note.courseId ? 'Course' : 'Course'}`}
                    </p>
                    <div className="flex gap-4 mb-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">📚 {note.level || 'All levels'}</span>
                      <span className="flex items-center gap-1">📁 {note.category || 'General'}</span>
                    </div>
                    <div className="flex gap-3">
                      {isNotePurchased(note._id) ? (
                        <a
                          href={note.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5 no-underline"
                          style={{
                            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          View Notes
                        </a>
                      ) : note.isIndependent && note.pricing > 0 ? (
                        <Link
                          to={`/notes/${note._id}`}
                          className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5 no-underline"
                          style={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Buy Now - ₹{note.pricing}
                        </Link>
                      ) : (
                        <a
                          href={note.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5 no-underline"
                          style={{
                            background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          View Notes
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      
      </main>

      {/* Circuit Modal */}
    

      {/* Purchases Modal */}
      {isPurchasesModalOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => e.target === e.currentTarget && setIsPurchasesModalOpen(false)}
        >
          <div
            className="bg-white p-10 rounded-[15px] w-full max-w-[900px] max-h-[85vh] overflow-y-auto relative"
            style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
          >
            <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-slate-100">
              {/* <h2
                className="text-2xl font-bold text-slate-800 m-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                My Purchased Courses
              </h2>
              <button
                onClick={() => setIsPurchasesModalOpen(false)}
                className="bg-transparent border-none text-3xl cursor-pointer text-slate-400 p-0 w-10 h-10 flex items-center justify-center transition-colors duration-300 hover:text-red-600"
              >
                ×
              </button> */}
            </div>
            
            {/* Loading State */}
            {purchasesLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-slate-500">Loading your purchases...</p>
              </div>
            )}
            
            {/* Not Authenticated */}
            {!isAuthenticated && (
              <div className="text-center py-12 px-4">
                <div className="text-5xl mb-4">🔐</div>
                <h3
                  className="text-xl font-semibold text-slate-800 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Please Login
                </h3>
                <p className="text-slate-500 mb-6">
                  Login to view your purchased courses and notes.
                </p>
                <Link
                  to="/login"
                  className="inline-block py-2.5 px-6 rounded-lg font-semibold text-white no-underline"
                  style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}
                >
                  Login Now
                </Link>
              </div>
            )}
            
            {isAuthenticated && !purchasesLoading && purchasedCourses.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="text-5xl mb-4">📚</div>
                <h3
                  className="text-xl font-semibold text-slate-800 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  No Courses or Notes Yet
                </h3>
                <p className="text-slate-500 mb-6">
                  You haven't purchased any courses or notes yet. Explore our collection and start learning today!
                </p>
              </div>
            )}
            
            {isAuthenticated && !purchasesLoading && purchasedCourses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {purchasedCourses.map((purchase) => (
                  <div
                    key={purchase.courseId}
                    className="rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fce7e7 100%)',
                      border: '1px solid #fecaca',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    {purchase.courseImage && (
                      <img 
                        src={purchase.courseImage} 
                        alt={purchase.title}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3
                      className="text-lg font-semibold text-slate-800 mb-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {purchase.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-2">
                      Instructor: <strong>{purchase.instructorName}</strong>
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
                      📅 Purchased on {new Date(purchase.dateOfPurchase).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to={`/course/${purchase.courseId}`}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white no-underline hover:-translate-y-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

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
            {['Home', 'Courses', 'Notes', 'School Level', 'Simulations'].map((link) => (
              <button
                key={link}
                onClick={() => scrollToSection(link.toLowerCase().replace(' ', '-'))}
                className="text-slate-300 text-[0.95rem] no-underline transition-colors duration-300 hover:text-red-600 bg-transparent border-none cursor-pointer text-left p-0"
              >
                {link}
              </button>
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

export default Dashboard;