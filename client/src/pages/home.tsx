import React, { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import Navbar from '../components/Navbar';

// Types
interface StatItem {
  number: string;
  label: string;
}

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

interface NoteCategory {
  icon: string;
  title: string;
  description: string;
  topics: string[];
}

interface BoardCard {
  title: string;
  description: string;
}

interface ContactCard {
  icon: string;
  title: string;
  lines: string[];
}

interface ValueItem {
  icon: string;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const [formMessage, setFormMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  });

  // Refs for fade-in animation
  const fadeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Stats data
  const stats: StatItem[] = [
    { number: '50K+', label: 'Students' },
    { number: '500+', label: 'Courses' },
    { number: '95%', label: 'Success Rate' }
  ];

  // Features data
  const features: FeatureCard[] = [
    {
      icon: '📚',
      title: 'Premium Notes',
      description: 'Carefully curated notes covering all subjects and topics. Our expert-prepared materials ensure you have the best study resources at your fingertips.'
    },
    {
      icon: '🎓',
      title: 'Expert Lectures',
      description: 'High-quality video lectures from experienced educators. Learn at your own pace with detailed explanations and practical examples.'
    },
    {
      icon: '💡',
      title: 'Subject Suggestions',
      description: 'Personalized study recommendations based on your learning progress. Get targeted suggestions to improve your understanding and performance.'
    },
    {
      icon: '📝',
      title: 'Board Preparation',
      description: 'Specialized preparation materials for various educational boards. Practice tests, mock exams, and strategic study plans for exam success.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics. Track your progress and identify areas that need more attention.'
    },
    {
      icon: '💻',
      title: 'Technical Courses',
      description: 'Master cutting-edge technologies including IoT, Robotics, C, C++, Python, and other programming languages with hands-on projects and expert guidance.'
    }
  ];

  // Notes categories data
  const noteCategories: NoteCategory[] = [
    {
      icon: '🔢',
      title: 'Mathematics',
      description: 'Complete notes covering algebra, geometry, calculus, and statistics with solved examples and practice problems.',
      topics: ['Algebra', 'Geometry', 'Calculus']
    },
    {
      icon: '🧪',
      title: 'Science',
      description: 'Detailed notes for Physics, Chemistry, and Biology with diagrams, formulas, and experimental procedures.',
      topics: ['Physics', 'Chemistry', 'Biology']
    },
    {
      icon: '🌍',
      title: 'Languages',
      description: 'Comprehensive study materials for English, Hindi, and other regional languages with grammar and literature.',
      topics: ['English', 'Hindi', 'Literature']
    },
    {
      icon: '📜',
      title: 'Social Studies',
      description: 'History, Geography, Political Science, and Economics notes with maps, timelines, and case studies.',
      topics: ['History', 'Geography', 'Civics']
    },
    {
      icon: '💻',
      title: 'Computer Science',
      description: 'Programming concepts, algorithms, data structures, and computer fundamentals with code examples.',
      topics: ['Programming', 'Algorithms', 'Database']
    },
    {
      icon: '💼',
      title: 'Commerce',
      description: 'Accounting, Business Studies, and Economics notes with practical examples and case studies.',
      topics: ['Accounts', 'Business', 'Economics']
    }
  ];

  // Technical courses data
  const technicalCourses: FeatureCard[] = [
    {
      icon: '🤖',
      title: 'IoT & Robotics',
      description: 'Learn Internet of Things and Robotics with hands-on projects. Build smart devices and automated systems from scratch.'
    },
    {
      icon: '🔠',
      title: 'C & C++',
      description: 'Master the fundamentals of programming with C and advance to object-oriented programming with C++. Build strong coding foundations.'
    },
    {
      icon: '🐍',
      title: 'Python Programming',
      description: 'Learn Python from basics to advanced concepts. Perfect for beginners and those looking to expand into data science and web development.'
    },
    {
      icon: '🌐',
      title: 'Other Technologies',
      description: 'Explore various programming languages and technologies including web development, mobile apps, and emerging tech stacks.'
    }
  ];

  // Boards data
  const boards: BoardCard[] = [
    { title: 'CBSE', description: 'Complete preparation for Central Board of Secondary Education' },
    { title: 'ICSE', description: 'Indian Certificate of Secondary Education board materials' },
    { title: 'State Boards', description: 'Regional state board examination preparation' },
    { title: 'Technical Courses', description: 'IoT, Robotics, C, C++, Python and other programming languages' }
  ];

  // Contact cards data
  const contactCards: ContactCard[] = [
    { icon: '📧', title: 'Email Us', lines: ['info@becslearning.com', 'support@becslearning.com'] },
    { icon: '📞', title: 'Call Us', lines: ['+91-xxx-xxx-xxxx', 'Available 24/7'] },
    { icon: '📍', title: 'Visit Us', lines: ['Bankra, West Bengal', 'India'] },
    { icon: '🕒', title: 'Support Hours', lines: ['Monday - Sunday', '24/7 Online Support'] }
  ];

  // Values data
  const values: ValueItem[] = [
    { icon: '🎯', title: 'Our Mission', description: 'To make quality education accessible and engaging for every student' },
    { icon: '👁️', title: 'Our Vision', description: 'To be the leading e-learning platform that bridges traditional and modern education' },
    { icon: '🌟', title: 'Our Values', description: 'Excellence, Innovation, Accessibility, and Student-Centric Approach' }
  ];

  // Course options for select
  const courseOptions = [
    { value: '', label: 'Select a course' },
    { value: 'notes', label: 'Study Notes' },
    { value: 'lectures', label: 'Video Lectures' },
    { value: 'board-prep', label: 'Board Preparation' },
    { value: 'iot', label: 'IoT & Robotics' },
    { value: 'programming', label: 'Programming (C/C++/Python)' },
    { value: 'other', label: 'Other Technical Courses' }
  ];

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    fadeRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const { name, email, message } = formData;

    // Basic validation
    if (!name || !email || !message) {
      setFormMessage({ text: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFormMessage({ text: 'Please enter a valid email address.', type: 'error' });
      return;
    }

    // Simulate form submission
    setFormMessage({ text: 'Thank you for your message! We will get back to you soon.', type: 'success' });
    setFormData({ name: '', email: '', phone: '', course: '', message: '' });

    // Clear message after 5 seconds
    setTimeout(() => setFormMessage(null), 5000);
  };

  // Add ref to fade elements
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !fadeRefs.current.includes(el)) {
      fadeRefs.current.push(el);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Navbar Component */}
      <Navbar onNavClick={handleNavClick} />
      
      {/* Hero Section */}
      <section className="min-h-screen relative flex min-w-full items-center overflow-hidden text-white" 
        id="home"
      >
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center bg-fixed -z-20"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-[5%] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10">
          <div className="animate-slideInLeft text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Master Your <span className="text-red-400">Education</span> Journey
            </h1>
            <p className="text-lg md:text-xl text-slate-100 mb-8 leading-relaxed">
              Access premium notes, expert lectures, and comprehensive board preparation materials. Your success is our priority with BECS E-Learning platform.
            </p>

            <div className="flex flex-col md:flex-row gap-4 mb-12 items-center md:items-start">
              <a 
                href="#courses" 
                onClick={(e) => handleNavClick(e, '#courses')}
                className="bg-gradient-to-br from-red-700 to-red-800 text-white py-4 px-8 border-none rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 no-underline inline-block hover:-translate-y-1 hover:shadow-2xl"
              >
                Explore Courses
              </a>
              <a 
                href="#courses" 
                onClick={(e) => handleNavClick(e, '#courses')}
                className="bg-transparent text-white py-4 px-8 border-2 border-white rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 no-underline inline-block hover:bg-white/20 hover:-translate-y-1"
              >
                Learn More
              </a>
            </div>

            <div className="flex gap-8 justify-center md:justify-start">
              {stats.map((stat, index) => (
                <div className="text-center" key={index}>
                  <div className="text-3xl font-bold text-red-400">{stat.number}</div>
                  <div className="text-sm text-slate-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-slideInRight hidden md:block">
            {/* Visual content can be added here if needed */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white" id="courses">
        <div className="max-w-7xl mx-auto px-[5%]">
          <div 
            className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-500" 
            ref={addToRefs}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">What We Offer</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Comprehensive educational resources designed to help you excel in your academic journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 border border-slate-100 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-2xl opacity-0 translate-y-8" 
                key={index} 
                ref={addToRefs}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-700 to-red-800 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notes Section */}
      <section className="py-24 bg-slate-50" id="notes">
        <div className="max-w-7xl mx-auto px-[5%]">
          <div 
            className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-500" 
            ref={addToRefs}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Study Notes</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Comprehensive notes organized by subjects and boards for effective learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {noteCategories.map((category, index) => (
              <div 
                className="bg-white p-10 rounded-2xl shadow-lg transition-all duration-300 border-l-4 border-red-700 hover:-translate-y-2 hover:shadow-2xl opacity-0 translate-y-8" 
                key={index} 
                ref={addToRefs}
              >
                <span className="text-5xl mb-6 block">{category.icon}</span>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{category.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.topics.map((topic, topicIndex) => (
                    <span 
                      className="bg-gradient-to-br from-red-700 to-red-800 text-white py-1 px-3 rounded-full text-sm font-medium" 
                      key={topicIndex}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white" id="about">
        <div className="max-w-7xl mx-auto px-[5%]">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-16 items-center">
            <div className="opacity-0 translate-y-8 transition-all duration-500" ref={addToRefs}>
              <div className="text-center lg:text-left mb-12">
                <h2 className="text-4xl font-bold text-slate-800 mb-4">About BECS E-Learning</h2>
                <p className="text-lg text-slate-500">Transforming education through innovative learning solutions</p>
              </div>

              <div className="mb-12">
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  BECS E-Learning is a comprehensive educational platform dedicated to providing high-quality learning resources for students across various academic levels. We specialize in delivering expertly crafted notes, engaging video lectures, and strategic study materials for different educational boards.
                </p>
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  Our platform extends beyond traditional academics to include cutting-edge technical courses in IoT, Robotics, and programming languages like C, C++, and Python. We believe in empowering students with both theoretical knowledge and practical skills necessary for success in today's digital world.
                </p>
                <p className="text-slate-500 text-lg leading-relaxed">
                  With a focus on personalized learning experiences, we provide subject-wise suggestions and comprehensive board preparation materials to ensure every student achieves their academic goals.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {values.map((value, index) => (
                  <div 
                    className="flex items-start gap-4 p-6 bg-slate-50 rounded-2xl transition-all duration-300 hover:bg-slate-100 hover:translate-x-2.5" 
                    key={index}
                  >
                    <div className="text-3xl w-16 h-16 bg-gradient-to-br from-red-700 to-red-800 rounded-full flex items-center justify-center flex-shrink-0">
                      {value.icon}
                    </div>
                    <div>
                      <h4 className="text-slate-800 text-xl font-semibold mb-2">{value.title}</h4>
                      <p className="text-slate-500 text-base leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="opacity-0 translate-y-8 transition-all duration-500 flex justify-center items-center order-first lg:order-last" ref={addToRefs}>
              <div className="w-72 h-72 bg-gradient-to-br from-slate-50 to-slate-200 rounded-2xl relative flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg animate-float top-[20%] left-[20%]">🤖</div>
                  <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg animate-float animation-delay-500 top-[30%] right-[20%]">📱</div>
                  <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg animate-float animation-delay-1000 bottom-[30%] left-[15%]">💡</div>
                  <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg animate-float animation-delay-1500 bottom-[20%] right-[15%]">🛠️</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Courses Section */}
      <section className="py-24 bg-white" id="technical">
        <div className="max-w-7xl mx-auto px-[5%]">
          <div 
            className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-500" 
            ref={addToRefs}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Technical Courses</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Master cutting-edge technologies with our comprehensive programming and technology courses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {technicalCourses.map((course, index) => (
              <div 
                className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 border border-slate-100 hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-2xl opacity-0 translate-y-8" 
                key={index} 
                ref={addToRefs}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-700 to-red-800 rounded-2xl flex items-center justify-center mb-6 text-white text-2xl">
                  {course.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">{course.title}</h3>
                <p className="text-slate-500 leading-relaxed">{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Boards Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-200" id="boards">
        <div className="max-w-7xl mx-auto px-[5%]">
          <div 
            className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-500" 
            ref={addToRefs}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Board Preparation</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Comprehensive preparation materials for major educational boards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {boards.map((board, index) => (
              <div 
                className="bg-white p-8 rounded-2xl text-center transition-all duration-300 shadow-lg hover:-translate-y-1.5 hover:shadow-2xl opacity-0 translate-y-8" 
                key={index} 
                ref={addToRefs}
              >
                <h3 className="text-red-700 text-2xl font-semibold mb-2">{board.title}</h3>
                <p className="text-slate-500 text-sm">{board.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-slate-200" id="contact">
        <div className="max-w-7xl mx-auto px-[5%]">
          <div 
            className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-500" 
            ref={addToRefs}
          >
            <h2 className="text-4xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Get in touch with us for any queries or support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 opacity-0 translate-y-8 transition-all duration-500" ref={addToRefs}>
              {contactCards.map((card, index) => (
                <div 
                  className="bg-white p-8 rounded-2xl text-center shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl" 
                  key={index}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-red-700 to-red-800 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                    {card.icon}
                  </div>
                  <h3 className="text-slate-800 text-xl font-semibold mb-2">{card.title}</h3>
                  {card.lines.map((line, lineIndex) => (
                    <p className="text-slate-500 text-sm mb-1" key={lineIndex}>{line}</p>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-white p-10 rounded-2xl shadow-lg opacity-0 translate-y-8 transition-all duration-500" ref={addToRefs}>
              <form id="contactForm" onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2 text-slate-800 font-semibold text-sm">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 bg-slate-50 focus:outline-none focus:border-red-700 focus:bg-white focus:ring-2 focus:ring-red-700/10"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-slate-800 font-semibold text-sm">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 bg-slate-50 focus:outline-none focus:border-red-700 focus:bg-white focus:ring-2 focus:ring-red-700/10"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="phone" className="block mb-2 text-slate-800 font-semibold text-sm">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 bg-slate-50 focus:outline-none focus:border-red-700 focus:bg-white focus:ring-2 focus:ring-red-700/10"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="course" className="block mb-2 text-slate-800 font-semibold text-sm">Course Interest</label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 bg-slate-50 focus:outline-none focus:border-red-700 focus:bg-white focus:ring-2 focus:ring-red-700/10"
                  >
                    {courseOptions.map((option, index) => (
                      <option key={index} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block mb-2 text-slate-800 font-semibold text-sm">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="w-full py-3 px-4 border-2 border-slate-200 rounded-xl text-base transition-all duration-300 bg-slate-50 resize-y min-h-[120px] focus:outline-none focus:border-red-700 focus:bg-white focus:ring-2 focus:ring-red-700/10"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full mt-4 bg-gradient-to-br from-red-700 to-red-800 text-white py-4 px-8 border-none rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  Send Message
                </button>
              </form>

              {formMessage && (
                <div className={`mt-4 p-4 rounded-xl font-semibold text-center ${
                  formMessage.type === 'success' 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {formMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white pt-12 pb-4">
        <div className="max-w-7xl mx-auto px-[5%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-red-700 mb-4 font-semibold">BECS E-Learning</h3>
            <p className="text-slate-400">Empowering students with quality education and comprehensive learning resources for academic excellence.</p>
          </div>

          <div>
            <h3 className="text-red-700 mb-4 font-semibold">Quick Links</h3>
            <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">Home</a>
            <a href="#courses" onClick={(e) => handleNavClick(e, '#courses')} className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">Courses</a>
            <a href="#notes" onClick={(e) => handleNavClick(e, '#notes')} className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">Notes</a>
            <a href="#boards" onClick={(e) => handleNavClick(e, '#boards')} className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">Board Prep</a>
          </div>

          <div>
            <h3 className="text-red-700 mb-4 font-semibold">Resources</h3>
            <a href="#" className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">Study Materials</a>
            <a href="#" className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">Practice Tests</a>
            <a href="#" className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">Video Lectures</a>
            <a href="#" className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">Expert Guidance</a>
          </div>

          <div>
            <h3 className="text-red-700 mb-4 font-semibold">Contact Info</h3>
            <a href="mailto:info@becslearning.com" className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">info@becslearning.com</a>
            <a href="tel:+91-xxx-xxx-xxxx" className="text-slate-400 no-underline block mb-2 transition-colors duration-300 hover:text-red-700">+91-xxx-xxx-xxxx</a>
            <p className="text-slate-400">Available 24/7 for student support</p>
          </div>
        </div>

        <div className="text-center mt-8 pt-8 border-t border-gray-700 text-slate-400">
          <p>&copy; 2025 BECS E-Learning. All rights reserved. | Designed for educational excellence</p>
        </div>
      </footer>

      {/* Custom Keyframes Style */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-slideInLeft {
          animation: slideInLeft 1s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 1s ease-out;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
};

export default Home;
