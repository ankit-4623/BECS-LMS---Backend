import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Purchase {
  id: string;
  name: string;
  price: number;
  date: string;
  type: 'course' | 'notes';
}

interface CoursePreview {
  title: string;
  teacher: string;
  experience: string;
  validity: string;
}

const AllSchoolCourses = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
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

  const purchaseCourse = (courseId: string, courseName: string, price: number) => {
    const purchase: Purchase = {
      id: courseId,
      name: courseName,
      price: price,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      type: 'course',
    };

    if (purchases.find((p) => p.id === courseId)) {
      alert('You have already purchased this course!');
      return;
    }

    const newPurchases = [...purchases, purchase];
    setPurchases(newPurchases);
    localStorage.setItem('becs_purchases', JSON.stringify(newPurchases));
    alert(`✅ Successfully purchased "${courseName}"! Access it from "My Purchases".`);
  };

  const openPreview = (course: string) => {
    const previews: Record<string, CoursePreview> = {
      physics: { title: 'Physics Fundamentals', teacher: 'Prof. Rajesh Kumar, Ph.D.', experience: '20+ years', validity: '6 months' },
      english: { title: 'English Literature Essentials', teacher: 'Ms. Anita Desai, M.A.', experience: '12+ years', validity: '6 months' },
      chemistry: { title: 'Chemistry Mastery', teacher: 'Dr. Neha Patel, Ph.D.', experience: '14+ years', validity: '6 months' },
      biology: { title: 'Biology Complete', teacher: 'Dr. Suman Roy, Ph.D.', experience: '16+ years', validity: '6 months' },
      math9: { title: 'Mathematics Grade 9', teacher: 'Mr. Arun Singh, M.Sc.', experience: '10+ years', validity: '6 months' },
      math10: { title: 'Mathematics Grade 10', teacher: 'Dr. Anil Sharma, Ph.D.', experience: '15+ years', validity: '6 months' },
      math11: { title: 'Mathematics Grade 11', teacher: 'Prof. Ramesh Gupta, Ph.D.', experience: '18+ years', validity: '6 months' },
      math12: { title: 'Mathematics Grade 12', teacher: 'Dr. Priya Verma, Ph.D.', experience: '12+ years', validity: '6 months' },
      science9: { title: 'Science Grade 9', teacher: 'Ms. Kavita Sharma, M.Sc.', experience: '8+ years', validity: '6 months' },
      science10: { title: 'Science Grade 10', teacher: 'Mr. Vikas Kumar, M.Sc.', experience: '11+ years', validity: '6 months' },
      history: { title: 'History & Civics', teacher: 'Prof. Amit Joshi, M.A.', experience: '14+ years', validity: '6 months' },
      geography: { title: 'Geography Complete', teacher: 'Ms. Rekha Devi, M.A.', experience: '9+ years', validity: '6 months' },
    };

    const preview = previews[course];
    if (preview) {
      alert(`📚 ${preview.title}\n\n👨‍🏫 Instructor: ${preview.teacher}\n📊 Experience: ${preview.experience}\n⏱️ Validity: ${preview.validity}\n\nClick "Buy Now" to enroll!`);
    }
  };

  const schoolCourses = [
    { id: 'physics', title: 'Physics Fundamentals', description: 'Explore motion, force, and energy with interactive experiments.', image: 'https://images.unsplash.com/photo-1636633062127-fbac4e922b40?w=400&h=300&fit=crop', badge: 'Grade 9-10', grade: '9-10', duration: '28 hours', rating: '4.6 (210)', price: 39.99 },
    { id: 'english', title: 'English Literature Essentials', description: 'Study classic literature and develop advanced writing skills.', image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop', badge: 'Grade 11-12', grade: '11-12', duration: '20 hours', rating: '4.8 (195)', price: 29.99 },
    { id: 'chemistry', title: 'Chemistry Mastery', description: 'Master atomic structure, reactions, and organic chemistry.', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop', badge: 'Grade 10-12', grade: '10-12', duration: '36 hours', rating: '4.7 (320)', price: 39.99 },
    { id: 'biology', title: 'Biology Complete', description: 'Comprehensive study of life sciences from cells to ecosystems.', image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop', badge: 'Grade 9-12', grade: '9-12', duration: '32 hours', rating: '4.8 (280)', price: 34.99 },
    { id: 'math9', title: 'Mathematics Grade 9', description: 'Number systems, polynomials, geometry, and statistics.', image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop', badge: 'Grade 9', grade: '9', duration: '30 hours', rating: '4.7 (240)', price: 29.99 },
    { id: 'math10', title: 'Mathematics Grade 10', description: 'Real numbers, polynomials, triangles, and trigonometry.', image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop', badge: 'Grade 10', grade: '10', duration: '35 hours', rating: '4.8 (310)', price: 34.99 },
    { id: 'math11', title: 'Mathematics Grade 11', description: 'Sets, relations, functions, trigonometry, and calculus intro.', image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=300&fit=crop', badge: 'Grade 11', grade: '11', duration: '40 hours', rating: '4.6 (190)', price: 39.99 },
    { id: 'math12', title: 'Mathematics Grade 12', description: 'Relations, calculus, vectors, probability, and linear programming.', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop', badge: 'Grade 12', grade: '12', duration: '45 hours', rating: '4.9 (350)', price: 44.99 },
    { id: 'science9', title: 'Science Grade 9', description: 'Matter, atoms, tissues, motion, work, energy, and sound.', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop', badge: 'Grade 9', grade: '9', duration: '28 hours', rating: '4.5 (180)', price: 29.99 },
    { id: 'science10', title: 'Science Grade 10', description: 'Chemical reactions, life processes, electricity, and light.', image: 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400&h=300&fit=crop', badge: 'Grade 10', grade: '10', duration: '32 hours', rating: '4.7 (220)', price: 34.99 },
    { id: 'history', title: 'History & Civics', description: 'Indian and world history with political science fundamentals.', image: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=400&h=300&fit=crop', badge: 'Grade 9-12', grade: '9-12', duration: '25 hours', rating: '4.6 (160)', price: 24.99 },
    { id: 'geography', title: 'Geography Complete', description: 'Physical and human geography with map skills.', image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&h=300&fit=crop', badge: 'Grade 9-12', grade: '9-12', duration: '22 hours', rating: '4.5 (140)', price: 24.99 },
  ];

  const filteredCourses = schoolCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = gradeFilter === 'all' || course.grade.includes(gradeFilter);
    return matchesSearch && matchesGrade;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
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
          <h1 className="text-4xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>School Level Courses</h1>
          <p className="text-slate-500">Academic courses designed for school students from Grade 9 to 12</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-[15px] shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full py-3 px-4 pl-12 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 transition-colors" />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-sm">Grade:</span>
              <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="py-2 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 cursor-pointer">
                <option value="all">All Grades</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
              <div className="relative">
                <img src={course.image} alt={course.title} className="w-full h-[180px] object-cover" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }} />
                <span className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', fontFamily: "'Poppins', sans-serif" }}>{course.badge}</span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{course.title}</h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">{course.description}</p>
                <div className="flex gap-4 mb-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">⏱️ {course.duration}</span>
                  <span className="flex items-center gap-1">⭐ {course.rating}</span>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => openPreview(course.id)} className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200" style={{ fontFamily: "'Poppins', sans-serif" }}>Preview</button>
                  <button onClick={() => purchaseCourse(course.id, course.title, course.price)} className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)', fontFamily: "'Poppins', sans-serif" }}>${course.price}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>No courses found</h3>
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

export default AllSchoolCourses;
