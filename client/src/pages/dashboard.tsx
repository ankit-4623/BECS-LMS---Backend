import { useState, useEffect, useRef } from 'react';
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

const Dashboard = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isPurchasesModalOpen, setIsPurchasesModalOpen] = useState(false);
  const [isCircuitModalOpen, setIsCircuitModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Circuit simulator state
  const [voltage, setVoltage] = useState(9);
  const [r1, setR1] = useState(1000);
  const [r2, setR2] = useState(2000);
  const [powerOn, setPowerOn] = useState(true);
  const [ledEnabled, setLedEnabled] = useState(false);
  const [ledCurrent, setLedCurrent] = useState(20);
  const [simulationResult, setSimulationResult] = useState('');
  const [showResult, setShowResult] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load purchases from localStorage
    const storedPurchases = localStorage.getItem('becs_purchases');
    if (storedPurchases) {
      setPurchases(JSON.parse(storedPurchases));
    }

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

  const purchaseCourse = (courseId: string, courseName: string, price: number) => {
    const isNotes = courseId.includes('notes');
    const purchase: Purchase = {
      id: courseId,
      name: courseName,
      price: price,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      type: isNotes ? 'notes' : 'course',
    };

    if (purchases.find((p) => p.id === courseId)) {
      alert(`You have already purchased this ${isNotes ? 'note' : 'course'}!`);
      return;
    }

    const newPurchases = [...purchases, purchase];
    setPurchases(newPurchases);
    localStorage.setItem('becs_purchases', JSON.stringify(newPurchases));
    alert(`✅ Successfully purchased "${courseName}"! Access it from "My Purchases".`);
  };

  const openPreview = (course: string) => {
    const previews: Record<string, CoursePreview> = {
      math: {
        title: 'Mathematics for Beginners',
        teacher: 'Dr. Anil Sharma, M.Sc., Ph.D.',
        experience: '15+ years',
        validity: '6 months',
      },
      python: {
        title: 'Python Programming Basics',
        teacher: 'Ms. Priya Kapoor, B.Tech',
        experience: '10+ years',
        validity: '9 months',
      },
      physics: {
        title: 'Physics Fundamentals',
        teacher: 'Prof. Rajesh Kumar, Ph.D.',
        experience: '20+ years',
        validity: '6 months',
      },
      english: {
        title: 'English Literature Essentials',
        teacher: 'Ms. Anita Desai, M.A.',
        experience: '12+ years',
        validity: '6 months',
      },
      web: {
        title: 'Web Development Essentials',
        teacher: 'Mr. Vikram Singh, B.Tech',
        experience: '8+ years',
        validity: '12 months',
      },
      chemistry: {
        title: 'Chemistry Mastery',
        teacher: 'Dr. Neha Patel, Ph.D.',
        experience: '14+ years',
        validity: '6 months',
      },
    };

    const preview = previews[course];
    if (preview) {
      alert(
        `📚 ${preview.title}\n\n👨‍🏫 Instructor: ${preview.teacher}\n📊 Experience: ${preview.experience}\n⏱️ Validity: ${preview.validity}\n\nClick "Buy Now" to enroll!`
      );
    }
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

  const runSimulation = () => {
    if (!powerOn) {
      setSimulationResult('Circuit is powered off.');
      setShowResult(true);
      return;
    }

    const req = r1 + r2;
    const current = voltage / req;
    const vAcrossR2 = current * r2;
    const powerR1 = current * current * r1;
    const powerR2 = current * current * r2;

    let result = `Total Current: ${(current * 1000).toFixed(2)} mA\n`;
    result += `Voltage across R2: ${vAcrossR2.toFixed(2)} V\n`;
    result += `Power in R1: ${(powerR1 * 1000).toFixed(2)} mW\n`;
    result += `Power in R2: ${(powerR2 * 1000).toFixed(2)} mW`;

    if (ledEnabled) {
      const ledResistor = voltage / (ledCurrent / 1000) - (r1 + r2);
      if (ledResistor > 0) {
        result += `\nLED Resistor needed: ${ledResistor.toFixed(0)} Ω`;
      } else {
        result += '\nLED circuit overload! Reduce current.';
      }
    }

    setSimulationResult(result);
    setShowResult(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const courses = [
    {
      id: 'math',
      title: 'Mathematics for Beginners',
      description: 'Master algebra, geometry, and arithmetic fundamentals with expert guidance.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop',
      badge: 'Popular',
      duration: '24 hours',
      rating: '4.8 (320)',
      price: 29.99,
    },
    {
      id: 'python',
      title: 'Python Programming Basics',
      description: 'Learn Python syntax and build simple programs from scratch.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      badge: 'Trending',
      duration: '32 hours',
      rating: '4.9 (450)',
      price: 34.99,
    },
    {
      id: 'web',
      title: 'Web Development Essentials',
      description: 'Build responsive websites with HTML, CSS, and JavaScript.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=400&h=300&fit=crop',
      badge: 'New',
      duration: '40 hours',
      rating: '4.7 (280)',
      price: 44.99,
    },
  ];

  const schoolCourses = [
    {
      id: 'physics',
      title: 'Physics Fundamentals',
      description: 'Explore motion, force, and energy with interactive experiments.',
      image: 'https://images.unsplash.com/photo-1636633062127-fbac4e922b40?w=400&h=300&fit=crop',
      badge: 'Grade 9-10',
      duration: '28 hours',
      rating: '4.6 (210)',
      price: 39.99,
    },
    {
      id: 'english',
      title: 'English Literature Essentials',
      description: 'Study classic literature and develop advanced writing skills.',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop',
      badge: 'Grade 11-12',
      duration: '20 hours',
      rating: '4.8 (195)',
      price: 29.99,
    },
    {
      id: 'chemistry',
      title: 'Chemistry Mastery',
      description: 'Master atomic structure, reactions, and organic chemistry.',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
      badge: 'Grade 10-12',
      duration: '36 hours',
      rating: '4.7 (320)',
      price: 39.99,
    },
  ];

  const notes = [
    {
      id: 'algebra-notes',
      title: 'Mathematics Notes - Algebra',
      description: 'CBSE Grade 10 - Comprehensive equations and polynomials guide.',
      image: 'https://images.unsplash.com/photo-1507842217343-583f20270319?w=400&h=300&fit=crop',
      badge: 'CBSE',
      pages: '45 pages',
      rating: '4.9 (180)',
      price: 9.99,
    },
    {
      id: 'chemistry-notes',
      title: 'Science Notes - Chemistry',
      description: 'ICSE Grade 9 - Atomic structure and chemical reactions.',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop',
      badge: 'ICSE',
      pages: '52 pages',
      rating: '4.8 (165)',
      price: 8.99,
    },
    {
      id: 'biology-notes',
      title: 'Biology Notes - Cell Structure',
      description: 'CBSE Grade 11 - Cell biology and organism classification.',
      image: 'https://images.unsplash.com/photo-1636633062127-fbac4e922b40?w=400&h=300&fit=crop',
      badge: 'CBSE',
      pages: '38 pages',
      rating: '4.7 (142)',
      price: 7.99,
    },
  ];

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
            {['home', 'courses', 'school-level', 'notes', 'simulations', 'contact'].map((item) => (
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
            <button
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
                {purchases.length}
              </span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="bg-transparent border-none cursor-pointer text-2xl text-slate-600 p-2 transition-colors duration-300 hover:text-red-600"
              >
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
                    to="/complete-profile"
                    className="block py-3 px-4 text-slate-800 no-underline font-medium text-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:pl-5"
                  >
                    Complete Profile
                  </Link>
                  <Link
                    to="/faq"
                    className="block py-3 px-4 text-slate-800 no-underline font-medium text-sm transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:pl-5"
                  >
                    FAQ
                  </Link>
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
            { label: 'Free Simulations', href: 'simulations' },
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
          <h2
            className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span
              className="w-1 h-8 rounded"
              style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
            />
            Featured Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-[180px] object-cover"
                    style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
                  />
                  <span
                    className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {course.badge}
                  </span>
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">{course.description}</p>
                  <div className="flex gap-4 mb-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">⏱️ {course.duration}</span>
                    <span className="flex items-center gap-1">⭐ {course.rating}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openPreview(course.id)}
                      className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => purchaseCourse(course.id, course.title, course.price)}
                      className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      ${course.price}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* School Level Section */}
        <section id="school-level" className="mb-16 p-10 bg-white rounded-[15px] shadow-lg">
          <h2
            className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span
              className="w-1 h-8 rounded"
              style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
            />
            School Level Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {schoolCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="relative">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-[180px] object-cover"
                    style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
                  />
                  <span
                    className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {course.badge}
                  </span>
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {course.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">{course.description}</p>
                  <div className="flex gap-4 mb-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">⏱️ {course.duration}</span>
                    <span className="flex items-center gap-1">⭐ {course.rating}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openPreview(course.id)}
                      className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => purchaseCourse(course.id, course.title, course.price)}
                      className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      ${course.price}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notes Section */}
        <section id="notes" className="mb-16 p-10 bg-white rounded-[15px] shadow-lg">
          <h2
            className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span
              className="w-1 h-8 rounded"
              style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
            />
            Study Notes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="relative">
                  <img
                    src={note.image}
                    alt={note.title}
                    className="w-full h-[180px] object-cover"
                    style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
                  />
                  <span
                    className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    {note.badge}
                  </span>
                </div>
                <div className="p-6">
                  <h3
                    className="text-lg font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {note.title}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">{note.description}</p>
                  <div className="flex gap-4 mb-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">📄 {note.pages}</span>
                    <span className="flex items-center gap-1">⭐ {note.rating}</span>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => purchaseCourse(note.id, note.title, note.price)}
                      className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5"
                      style={{
                        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      ${note.price}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Simulations Section */}
        <section id="simulations" className="mb-16 p-10 bg-white rounded-[15px] shadow-lg">
          <h2
            className="text-3xl font-bold text-slate-800 mb-8 flex items-center gap-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span
              className="w-1 h-8 rounded"
              style={{ background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)' }}
            />
            Free Simulations
          </h2>
          <p className="text-center text-slate-500 mb-8">
            Interactive electronics circuit simulations powered by client-side JavaScript.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div
              className="bg-white rounded-xl overflow-hidden transition-all duration-300 border border-slate-200 hover:-translate-y-2 hover:shadow-xl hover:border-red-600"
              style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1558618047-3c8c98a9e6a5?w=400&h=300&fit=crop"
                  alt="Circuit Simulation"
                  className="w-full h-[180px] object-cover"
                  style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)' }}
                />
                <span
                  className="absolute top-3 right-3 text-white py-1.5 px-3 rounded-full text-xs font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Free
                </span>
              </div>
              <div className="p-6">
                <h3
                  className="text-lg font-semibold text-slate-800 mb-2"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Basic Electronics Circuit Simulator
                </h3>
                <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                  Build and simulate basic electronic circuits like voltage dividers, series/parallel resistors,
                  and LED circuits.
                </p>
                <div className="flex gap-4 mb-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">⚡ Interactive</span>
                  <span className="flex items-center gap-1">⭐ 4.9 (Hands-on)</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCircuitModalOpen(true)}
                    className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white hover:-translate-y-0.5"
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      boxShadow: '0 4px 12px rgba(5, 150, 105, 0.2)',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Launch Simulator
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Circuit Modal */}
      {isCircuitModalOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.7)' }}
          onClick={(e) => e.target === e.currentTarget && setIsCircuitModalOpen(false)}
        >
          <div
            className="bg-white p-8 rounded-[15px] w-full max-w-[1000px] max-h-[90vh] overflow-y-auto relative"
            style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-100">
              <h2
                className="text-2xl font-bold text-slate-800 m-0"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Electronics Circuit Simulator
              </h2>
              <button
                onClick={() => setIsCircuitModalOpen(false)}
                className="bg-transparent border-none text-3xl cursor-pointer text-slate-400 p-0 w-10 h-10 flex items-center justify-center transition-colors duration-300 hover:text-red-600"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div
                className="flex-1 min-h-[500px] border-2 border-slate-200 rounded-[10px] p-4 relative"
                style={{ background: '#f8fafc' }}
              >
                <h4 className="text-center mb-4 text-slate-800">Circuit Diagram</h4>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-auto border border-slate-200 rounded bg-slate-50"
                />
                {showResult && (
                  <div
                    className="text-center mt-4 p-4 rounded-lg"
                    style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}
                  >
                    <h4 className="text-green-800 mb-2">Simulation Results</h4>
                    <pre className="whitespace-pre-wrap text-sm text-slate-600">{simulationResult}</pre>
                  </div>
                )}
              </div>
              <div className="w-full lg:w-[300px] flex flex-col gap-4">
                <div className="p-4 rounded-lg border border-slate-200" style={{ background: '#f1f5f9' }}>
                  <h4
                    className="text-sm font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Power Supply
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-500">Voltage (V):</label>
                      <span className="font-semibold text-red-600" style={{ fontFamily: "'Poppins', sans-serif" }}>
                        {voltage}V
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="12"
                      step="0.5"
                      value={voltage}
                      onChange={(e) => setVoltage(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={powerOn}
                        onChange={(e) => setPowerOn(e.target.checked)}
                      />
                      Power On
                    </label>
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200" style={{ background: '#f1f5f9' }}>
                  <h4
                    className="text-sm font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Resistors
                  </h4>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-500">R1 (Ω):</label>
                      <span className="text-sm text-slate-600">{(r1 / 1000).toFixed(1)}kΩ</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      value={r1}
                      onChange={(e) => setR1(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <label className="text-sm text-slate-500">R2 (Ω):</label>
                      <span className="text-sm text-slate-600">{(r2 / 1000).toFixed(1)}kΩ</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="10000"
                      value={r2}
                      onChange={(e) => setR2(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-slate-200" style={{ background: '#f1f5f9' }}>
                  <h4
                    className="text-sm font-semibold text-slate-800 mb-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    LED Circuit
                  </h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ledEnabled}
                        onChange={(e) => setLedEnabled(e.target.checked)}
                      />
                      Enable LED
                    </label>
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-slate-500">LED Current Limit (mA):</label>
                      <span className="text-sm text-slate-600">{ledCurrent}mA</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      value={ledCurrent}
                      onChange={(e) => setLedCurrent(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
                <button
                  onClick={runSimulation}
                  className="w-full text-white py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Run Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <h2
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
              </button>
            </div>
            {purchases.length === 0 ? (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="rounded-xl p-6 border transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fce7e7 100%)',
                      border: '1px solid #fecaca',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <h3
                      className="text-lg font-semibold text-slate-800 mb-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {purchase.name}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4">
                      Price: <strong>${purchase.price.toFixed(2)}</strong>
                    </p>
                    <div className="flex items-center gap-1.5 text-sm text-slate-400 mb-4">
                      📅 Purchased on {purchase.date}
                    </div>
                    <div className="flex gap-3">
                      <Link
                        to={purchase.type === 'notes' ? `/notes/${purchase.id}` : `/course/${purchase.id}`}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold cursor-pointer transition-all duration-300 text-sm text-center text-white no-underline hover:-translate-y-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)',
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {purchase.type === 'notes' ? 'View Notes' : 'View Course'}
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