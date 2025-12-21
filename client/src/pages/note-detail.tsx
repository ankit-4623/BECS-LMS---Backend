import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

const NoteDetail = () => {
  const { noteId: _noteId } = useParams<{ noteId: string }>();
  const [searchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  
  // Get note info from URL params (passed when clicking from all-notes)
  const noteUrl = searchParams.get('url');
  const noteTitle = searchParams.get('title') || 'Study Notes';
  const courseTitle = searchParams.get('course') || 'Course';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // If we have a direct URL, redirect to it
  useEffect(() => {
    if (noteUrl) {
      window.open(noteUrl, '_blank');
    }
  }, [noteUrl]);

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
        <div className="bg-white rounded-[15px] shadow-lg p-8 text-center">
          {noteUrl ? (
            <>
              <div className="text-5xl mb-4">📄</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>{noteTitle}</h2>
              <p className="text-slate-600 mb-2">From: {courseTitle}</p>
              <p className="text-slate-500 mb-6">The notes should have opened in a new tab.</p>
              <div className="flex justify-center gap-4">
                <a
                  href={noteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-lg font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}
                >
                  📄 Open Notes Again
                </a>
                <Link
                  to="/notes"
                  className="py-3 px-6 rounded-lg font-semibold text-slate-700 no-underline border border-slate-200 hover:bg-slate-50 transition-all duration-300"
                >
                  Browse All Notes
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>Note Not Found</h2>
              <p className="text-slate-500 mb-6">The note you're looking for doesn't exist or has been removed.</p>
              <Link
                to="/notes"
                className="inline-block py-3 px-6 rounded-lg font-semibold text-white no-underline transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}
              >
                Browse All Notes
              </Link>
            </>
          )}
        </div>
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

export default NoteDetail;
