import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAllNotes } from '../hooks/useCourses';

const AllNotes = () => {
  const { data: notesFromApi, isLoading, error } = useAllNotes();
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get unique categories and levels for filters
  const categories = [...new Set(notesFromApi?.map(note => note.category).filter(Boolean))] as string[];
  const levels = [...new Set(notesFromApi?.map(note => note.level).filter(Boolean))] as string[];

  const filteredNotes = notesFromApi?.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         note.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || note.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || note.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  }) || [];

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
      <main className="mt-[90px] px-[5%] py-12 max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>All Study Notes</h1>
          <p className="text-slate-500">Access comprehensive study materials from our courses</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-[15px] shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-3 px-4 pl-12 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 transition-colors" />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            {categories.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Category:</span>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="py-2 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 cursor-pointer">
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}
            {levels.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-sm">Level:</span>
                <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className="py-2 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 cursor-pointer">
                  <option value="all">All Levels</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-slate-800" style={{ fontFamily: "'Poppins', sans-serif" }}>Loading notes...</h3>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>Error loading notes</h3>
            <p className="text-slate-500">Please try again later</p>
          </div>
        )}

        {/* Notes Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredNotes.map((note) => (
              <div key={note._id} className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                <div className="relative">
                  <img src={note.image || 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop'} alt={note.title} className="w-full h-[160px] object-cover" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }} />
                  {note.category && (
                    <span className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', fontFamily: "'Poppins', sans-serif" }}>{note.category}</span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{note.title}</h3>
                  <p className="text-slate-500 text-sm mb-3 leading-relaxed line-clamp-2">From: {note.courseTitle}</p>
                  {note.level && (
                    <div className="flex gap-3 mb-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">📚 {note.level}</span>
                    </div>
                  )}
                  <a
                    href={note.notesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5 block no-underline"
                    style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)', fontFamily: "'Poppins', sans-serif" }}
                  >
                    📄 View Notes
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && filteredNotes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>No notes found</h3>
            <p className="text-slate-500">{notesFromApi?.length === 0 ? 'No notes available in courses yet' : 'Try adjusting your search or filter'}</p>
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

export default AllNotes;
