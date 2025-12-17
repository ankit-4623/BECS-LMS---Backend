import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Purchase {
  id: string;
  name: string;
  price: number;
  date: string;
  type: 'course' | 'notes';
}

const AllNotes = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const storedPurchases = localStorage.getItem('becs_purchases');
    if (storedPurchases) {
      setPurchases(JSON.parse(storedPurchases));
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const purchaseNotes = (noteId: string, noteName: string, price: number) => {
    const purchase: Purchase = {
      id: noteId,
      name: noteName,
      price: price,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      type: 'notes',
    };

    if (purchases.find((p) => p.id === noteId)) {
      alert('You have already purchased these notes!');
      return;
    }

    const newPurchases = [...purchases, purchase];
    setPurchases(newPurchases);
    localStorage.setItem('becs_purchases', JSON.stringify(newPurchases));
    alert(`✅ Successfully purchased "${noteName}"! Access it from "My Purchases".`);
  };

  const notes = [
    { id: 'algebra-notes', title: 'Mathematics Notes - Algebra', description: 'CBSE Grade 10 - Comprehensive equations and polynomials guide.', image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '45 pages', rating: '4.9 (180)', price: 9.99 },
    { id: 'chemistry-notes', title: 'Science Notes - Chemistry', description: 'ICSE Grade 9 - Atomic structure and chemical reactions.', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop', badge: 'ICSE', board: 'ICSE', pages: '52 pages', rating: '4.8 (165)', price: 8.99 },
    { id: 'biology-notes', title: 'Biology Notes - Cell Structure', description: 'CBSE Grade 11 - Cell biology and organism classification.', image: 'https://images.unsplash.com/photo-1636633062127-fbac4e922b40?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '38 pages', rating: '4.7 (142)', price: 7.99 },
    { id: 'physics-notes', title: 'Physics Notes - Mechanics', description: 'CBSE Grade 11 - Motion, force, work, energy, and power.', image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '55 pages', rating: '4.8 (210)', price: 10.99 },
    { id: 'english-notes', title: 'English Literature Notes', description: 'ICSE Grade 10 - Poetry, prose, and drama analysis.', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop', badge: 'ICSE', board: 'ICSE', pages: '42 pages', rating: '4.6 (130)', price: 7.99 },
    { id: 'history-notes', title: 'History Notes - Modern India', description: 'CBSE Grade 10 - Indian freedom struggle and independence.', image: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '48 pages', rating: '4.7 (155)', price: 8.99 },
    { id: 'geography-notes', title: 'Geography Notes - India', description: 'CBSE Grade 10 - Resources, agriculture, and industries.', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '40 pages', rating: '4.5 (120)', price: 7.99 },
    { id: 'math-calculus-notes', title: 'Mathematics Notes - Calculus', description: 'CBSE Grade 12 - Differentiation and integration.', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '65 pages', rating: '4.9 (240)', price: 12.99 },
    { id: 'organic-chem-notes', title: 'Organic Chemistry Notes', description: 'CBSE Grade 12 - Hydrocarbons, alcohols, and reactions.', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '58 pages', rating: '4.8 (195)', price: 11.99 },
    { id: 'economics-notes', title: 'Economics Notes - Micro', description: 'CBSE Grade 11 - Consumer behavior and market structures.', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '50 pages', rating: '4.6 (140)', price: 9.99 },
    { id: 'accountancy-notes', title: 'Accountancy Notes', description: 'ICSE Grade 11 - Financial statements and partnerships.', image: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=400&h=300&fit=crop', badge: 'ICSE', board: 'ICSE', pages: '55 pages', rating: '4.7 (160)', price: 10.99 },
    { id: 'computer-notes', title: 'Computer Science Notes', description: 'CBSE Grade 12 - Python programming and data structures.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop', badge: 'CBSE', board: 'CBSE', pages: '70 pages', rating: '4.9 (280)', price: 12.99 },
  ];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoard = boardFilter === 'all' || note.board === boardFilter;
    return matchesSearch && matchesBoard;
  });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return parseFloat(b.rating) - parseFloat(a.rating);
    return 0;
  });

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
          <p className="text-slate-500">Comprehensive study materials for CBSE and ICSE boards</p>
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
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Board:</span>
              <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)} className="py-2 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 cursor-pointer">
                <option value="all">All Boards</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="py-2 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 cursor-pointer">
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
              <div className="relative">
                <img src={note.image} alt={note.title} className="w-full h-[160px] object-cover" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }} />
                <span className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold" style={{ background: note.board === 'CBSE' ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'linear-gradient(135deg, #059669 0%, #047857 100%)', fontFamily: "'Poppins', sans-serif" }}>{note.badge}</span>
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{note.title}</h3>
                <p className="text-slate-500 text-sm mb-3 leading-relaxed line-clamp-2">{note.description}</p>
                <div className="flex gap-3 mb-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">📄 {note.pages}</span>
                  <span className="flex items-center gap-1">⭐ {note.rating}</span>
                </div>
                <button onClick={() => purchaseNotes(note.id, note.title, note.price)} className="w-full py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)', fontFamily: "'Poppins', sans-serif" }}>${note.price}</button>
              </div>
            </div>
          ))}
        </div>

        {sortedNotes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>No notes found</h3>
            <p className="text-slate-500">Try adjusting your search or filter</p>
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
