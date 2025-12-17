import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface NoteData {
  id: string;
  title: string;
  description: string;
  subject: string;
  board: string;
  grade: string;
  pages: string;
  author: string;
  lastUpdated: string;
  image: string;
  pdfUrl: string;
  chapters: {
    id: string;
    title: string;
    pages: string;
    pdfUrl: string;
  }[];
}

const NoteDetail = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const [scrolled, setScrolled] = useState(false);
  const [note, setNote] = useState<NoteData | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Mock notes data based on noteId
    const notesData: Record<string, NoteData> = {
      'algebra-notes': {
        id: 'algebra-notes',
        title: 'Mathematics Notes - Algebra',
        description: 'Comprehensive notes covering all algebra topics including linear equations, quadratic equations, polynomials, and more. Perfect for CBSE Grade 10 students preparing for board exams.',
        subject: 'Mathematics',
        board: 'CBSE',
        grade: 'Grade 10',
        pages: '45 pages',
        author: 'Dr. Anil Sharma',
        lastUpdated: 'December 10, 2025',
        image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=800&h=400&fit=crop',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        chapters: [
          { id: 'c1', title: 'Chapter 1: Real Numbers', pages: '8 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c2', title: 'Chapter 2: Polynomials', pages: '10 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c3', title: 'Chapter 3: Linear Equations', pages: '12 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c4', title: 'Chapter 4: Quadratic Equations', pages: '15 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
      },
      'chemistry-notes': {
        id: 'chemistry-notes',
        title: 'Science Notes - Chemistry',
        description: 'Detailed chemistry notes covering atomic structure, chemical reactions, periodic table, and more. Ideal for ICSE Grade 9 students.',
        subject: 'Chemistry',
        board: 'ICSE',
        grade: 'Grade 9',
        pages: '52 pages',
        author: 'Dr. Neha Patel',
        lastUpdated: 'December 8, 2025',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=400&fit=crop',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        chapters: [
          { id: 'c1', title: 'Chapter 1: Matter and Its Composition', pages: '10 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c2', title: 'Chapter 2: Atomic Structure', pages: '14 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c3', title: 'Chapter 3: Periodic Table', pages: '12 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c4', title: 'Chapter 4: Chemical Bonding', pages: '16 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
      },
      'biology-notes': {
        id: 'biology-notes',
        title: 'Biology Notes - Cell Structure',
        description: 'Complete biology notes on cell structure, cell division, and organism classification. Designed for CBSE Grade 11 students.',
        subject: 'Biology',
        board: 'CBSE',
        grade: 'Grade 11',
        pages: '38 pages',
        author: 'Dr. Suman Roy',
        lastUpdated: 'December 5, 2025',
        image: 'https://images.unsplash.com/photo-1636633062127-fbac4e922b40?w=800&h=400&fit=crop',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        chapters: [
          { id: 'c1', title: 'Chapter 1: Cell - The Unit of Life', pages: '12 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c2', title: 'Chapter 2: Cell Cycle and Division', pages: '10 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c3', title: 'Chapter 3: Biomolecules', pages: '16 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
      },
      'physics-notes': {
        id: 'physics-notes',
        title: 'Physics Notes - Mechanics',
        description: 'In-depth physics notes covering motion, force, work, energy, and power. Essential for CBSE Grade 11 students.',
        subject: 'Physics',
        board: 'CBSE',
        grade: 'Grade 11',
        pages: '55 pages',
        author: 'Prof. Rajesh Kumar',
        lastUpdated: 'December 12, 2025',
        image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&h=400&fit=crop',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        chapters: [
          { id: 'c1', title: 'Chapter 1: Units and Measurements', pages: '8 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c2', title: 'Chapter 2: Motion in a Straight Line', pages: '12 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c3', title: 'Chapter 3: Laws of Motion', pages: '15 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c4', title: 'Chapter 4: Work, Energy and Power', pages: '12 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
          { id: 'c5', title: 'Chapter 5: Gravitation', pages: '8 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        ],
      },
    };

    // Default note data for unknown noteIds
    const defaultNote: NoteData = {
      id: noteId || 'unknown',
      title: 'Study Notes',
      description: 'Comprehensive study notes to help you master the subject and prepare for exams.',
      subject: 'General',
      board: 'CBSE',
      grade: 'All Grades',
      pages: '30 pages',
      author: 'Expert Author',
      lastUpdated: 'December 2025',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=800&h=400&fit=crop',
      pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      chapters: [
        { id: 'c1', title: 'Chapter 1: Introduction', pages: '10 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'c2', title: 'Chapter 2: Core Concepts', pages: '10 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
        { id: 'c3', title: 'Chapter 3: Practice Problems', pages: '10 pages', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
      ],
    };

    setNote(notesData[noteId || ''] || defaultNote);
  }, [noteId]);

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-slate-800">Loading notes...</h2>
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
        {/* Note Header */}
        <div className="bg-white rounded-[15px] shadow-lg overflow-hidden mb-8">
          <div className="relative h-[200px]">
            <img src={note.image} alt={note.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <span className="py-1 px-3 rounded-full text-xs font-semibold" style={{ background: note.board === 'CBSE' ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>{note.board}</span>
                <span className="py-1 px-3 rounded-full text-xs font-semibold bg-white/20">{note.grade}</span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{note.title}</h1>
              <p className="text-white/80">{note.description}</p>
            </div>
          </div>
          {/* Note Info */}
          <div className="p-6 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
              <span className="flex items-center gap-2">📚 {note.subject}</span>
              <span className="flex items-center gap-2">📄 {note.pages}</span>
              <span className="flex items-center gap-2">✍️ {note.author}</span>
              <span className="flex items-center gap-2">🕐 Updated: {note.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Chapter-wise Notes */}
        <div className="bg-white rounded-[15px] shadow-lg p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Chapter-wise Notes</h3>
          <div className="flex flex-col gap-4">
            {note.chapters.map((chapter, index) => (
              <div key={chapter.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{chapter.title}</h4>
                    <p className="text-sm text-slate-500">{chapter.pages}</p>
                  </div>
                </div>
                <a
                  href={chapter.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 rounded-lg font-semibold text-sm text-center no-underline transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-2 text-white"
                  style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  View
                </a>
              </div>
            ))}
          </div>
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
