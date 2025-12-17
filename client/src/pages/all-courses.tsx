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

const AllCourses = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
      math: { title: 'Mathematics for Beginners', teacher: 'Dr. Anil Sharma, M.Sc., Ph.D.', experience: '15+ years', validity: '6 months' },
      python: { title: 'Python Programming Basics', teacher: 'Ms. Priya Kapoor, B.Tech', experience: '10+ years', validity: '9 months' },
      web: { title: 'Web Development Essentials', teacher: 'Mr. Vikram Singh, B.Tech', experience: '8+ years', validity: '12 months' },
      java: { title: 'Java Programming', teacher: 'Mr. Rahul Verma, M.Tech', experience: '12+ years', validity: '9 months' },
      datascience: { title: 'Data Science Fundamentals', teacher: 'Dr. Priya Sharma, Ph.D.', experience: '10+ years', validity: '12 months' },
      ml: { title: 'Machine Learning Basics', teacher: 'Dr. Amit Kumar, Ph.D.', experience: '8+ years', validity: '12 months' },
      react: { title: 'React.js Masterclass', teacher: 'Mr. Sanjay Gupta, B.Tech', experience: '7+ years', validity: '9 months' },
      nodejs: { title: 'Node.js Backend Development', teacher: 'Ms. Neha Sharma, B.Tech', experience: '6+ years', validity: '9 months' },
      sql: { title: 'SQL Database Mastery', teacher: 'Mr. Vijay Kumar, MCA', experience: '14+ years', validity: '6 months' },
    };

    const preview = previews[course];
    if (preview) {
      alert(`📚 ${preview.title}\n\n👨‍🏫 Instructor: ${preview.teacher}\n📊 Experience: ${preview.experience}\n⏱️ Validity: ${preview.validity}\n\nClick "Buy Now" to enroll!`);
    }
  };

  const courses = [
    { id: 'math', title: 'Mathematics for Beginners', description: 'Master algebra, geometry, and arithmetic fundamentals with expert guidance.', image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop', badge: 'Popular', duration: '24 hours', rating: '4.8 (320)', price: 29.99 },
    { id: 'python', title: 'Python Programming Basics', description: 'Learn Python syntax and build simple programs from scratch.', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop', badge: 'Trending', duration: '32 hours', rating: '4.9 (450)', price: 34.99 },
    { id: 'web', title: 'Web Development Essentials', description: 'Build responsive websites with HTML, CSS, and JavaScript.', image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop', badge: 'New', duration: '40 hours', rating: '4.7 (280)', price: 44.99 },
    { id: 'java', title: 'Java Programming', description: 'Object-oriented programming with Java from basics to advanced.', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop', badge: 'Bestseller', duration: '36 hours', rating: '4.8 (390)', price: 39.99 },
    { id: 'datascience', title: 'Data Science Fundamentals', description: 'Learn data analysis, visualization, and statistical methods.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', badge: 'Hot', duration: '45 hours', rating: '4.9 (520)', price: 49.99 },
    { id: 'ml', title: 'Machine Learning Basics', description: 'Introduction to ML algorithms and practical implementations.', image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=400&h=300&fit=crop', badge: 'Advanced', duration: '50 hours', rating: '4.7 (310)', price: 54.99 },
    { id: 'react', title: 'React.js Masterclass', description: 'Build modern web applications with React and Redux.', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop', badge: 'Popular', duration: '38 hours', rating: '4.8 (420)', price: 44.99 },
    { id: 'nodejs', title: 'Node.js Backend Development', description: 'Create scalable server-side applications with Node.js.', image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop', badge: 'New', duration: '35 hours', rating: '4.6 (250)', price: 39.99 },
    { id: 'sql', title: 'SQL Database Mastery', description: 'Master SQL queries, database design, and optimization.', image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=300&fit=crop', badge: 'Essential', duration: '28 hours', rating: '4.8 (380)', price: 34.99 },
  ];

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-4xl font-bold text-slate-800 mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>All Featured Courses</h1>
          <p className="text-slate-500">Explore our complete collection of professional courses</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-[15px] shadow-lg p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-4 pl-12 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 transition-colors"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-500 text-sm">Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="py-2 px-4 rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 cursor-pointer">
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
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
            <p className="text-slate-500">Try adjusting your search query</p>
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

export default AllCourses;
