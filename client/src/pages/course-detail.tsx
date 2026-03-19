import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useCourse, useCheckPurchase, useLiveLecture, useCourseNotes, useRecordedLectures } from '../hooks/useCourses';
import { useAuth } from '../context/AuthContext';
import { useCreateOrder, useVerifyPayment } from '../hooks/useOrder';
import '../types/razorpay.d.ts';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'live' | 'notes'>('videos');

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Hooks for order/payment
  const createOrderMutation = useCreateOrder();
  const verifyPaymentMutation = useVerifyPayment();

  // Fetch course details from API
  const { data: course, isLoading, error, refetch: refetchCourse } = useCourse(courseId || '');
  
  // Fetch live lecture for this course
  const { data: liveLectureData } = useLiveLecture(courseId || '');
  
  // Fetch recorded lectures for this course
  const { data: recordedLectures } = useRecordedLectures(courseId || '');
  
  // Fetch course notes (notes attached to this course)
  const { data: courseNotesData } = useCourseNotes(courseId || '');
  
  // Check if user has purchased this course
  const [purchaseRefreshKey, setPurchaseRefreshKey] = useState(0);
  const { data: isPurchased, refetch: refetchPurchase } = useCheckPurchase(courseId || '', user?._id, purchaseRefreshKey);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      alert('Please login to purchase this course');
      navigate('/login');
      return;
    }

    if (!courseId) {
      alert('Course ID not found');
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Failed to load payment gateway. Please try again.');
        setIsProcessingPayment(false);
        return;
      }

      // Create order
      const orderResponse = await createOrderMutation.mutateAsync({ courseId });
      
      if (!orderResponse.success || !orderResponse.data) {
        alert('Failed to create order. Please try again.');
        setIsProcessingPayment(false);
        return;
      }

      const { razorpayOrderId, amount, currency, keyId } = orderResponse.data;

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'BECS E-Learning',
        description: `Payment for ${course?.title || 'Course'}`,
        order_id: razorpayOrderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          try {
            // Verify payment
            const verifyResponse = await verifyPaymentMutation.mutateAsync({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyResponse.success) {
              alert('Payment successful! You now have access to this course.');
              // Force refresh purchase status and course
              setPurchaseRefreshKey((k) => k + 1);
              refetchCourse();
              refetchPurchase();
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
          setIsProcessingPayment(false);
        },
        prefill: {
          name: user?.userName || '',
          email: user?.userEmail || '',
        },
        theme: {
          color: '#dc2626',
        },
        modal: {
          ondismiss: () => {
            setIsProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-800">Loading course...</h2>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Course not found</h2>
          <Link
            to="/courses"
            className="inline-block py-2.5 px-6 rounded-lg font-semibold text-white no-underline"
            style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}
          >
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  // Get notes from curriculum (lectures with notesUrl)
  const curriculumNotes = (course.curriculum || []).filter(lecture => lecture.notesUrl).map(lecture => ({
    _id: lecture._id || `${course._id}-lecture-${lecture.title}`,
    title: `${lecture.title} Notes`,
    notesUrl: lecture.notesUrl,
    type: 'curriculum' as const,
  }));

  // Get course notes (from the separate notes API)
  const courseSpecificNotes = (courseNotesData || []).map(note => ({
    _id: note._id,
    title: note.title,
    notesUrl: note.driveLink,
    type: 'course' as const,
  }));

  // Combine all notes
  const allNotes = [...curriculumNotes, ...courseSpecificNotes];

  // Get independent notes for this course (if any)
  // (Assumes you have a useAllNotes or similar hook, otherwise skip this block)
  // import { useAllNotes } from '../hooks/useCourses';
  // const { data: allNotes } = useAllNotes();
  // const independentNotes = (allNotes || []).filter(note => note.courseId === course._id && note.isIndependent);

  // For now, only show courseNotes. To show independent notes, merge them here.

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
        {/* Course Header */}
        <div className="bg-white rounded-[15px] shadow-lg overflow-hidden mb-8">
          <div className="relative h-[200px]">
            <img src={course.image?.url || 'https://images.unsplash.com/photo-1516321318423-f06f70d504f0?w=800&h=400&fit=crop'} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>{course.title}</h1>
              <p className="text-white/80 mb-3">{course.description}</p>
              <div className="flex items-center gap-6 text-sm flex-wrap">
                <span className="flex items-center gap-2">👨‍🏫 {course.teachers?.teacherName || 'Instructor'}</span>
                <span className="flex items-center gap-2">⏱️ {course.totalDuration || 'N/A'}</span>
                <span className="flex items-center gap-2">📹 Videos</span>
                <span className="flex items-center gap-2">📄 Notes</span>
                <span className="flex items-center gap-2">🔴 Live</span>
                <span className="flex items-center gap-2">💰 ₹{course.pricing || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase/Access Section */}
        <div className="bg-white rounded-[15px] shadow-lg p-6 mb-8 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {isPurchased ? '✅ You have full access' : 'Get Full Access'}
            </h3>
            <p className="text-slate-600 text-sm">
              {isPurchased 
                ? 'Access all videos, notes and live classes'
                : 'Unlock all videos, notes and live classes'
              }
            </p>
          </div>
          {isPurchased ? (
            <div className="py-3 px-8 rounded-lg font-semibold text-white" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 15px rgba(5, 150, 105, 0.3)' }}>
              🎓 View Course Content
            </div>
          ) : (
            <button
              onClick={handlePurchase}
              disabled={isProcessingPayment}
              className={`py-3 px-8 rounded-lg font-semibold text-white transition-all duration-300 ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
              style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}
            >
              {isProcessingPayment ? 'Processing...' : `Buy Now - ₹${course.pricing || 0}`}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'videos' ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            style={activeTab === 'videos' ? { background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' } : {}}
          >
            📹 Recorded Videos
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'notes' ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            style={activeTab === 'notes' ? { background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' } : {}}
          >
            📄 Notes
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${activeTab === 'live' ? 'text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
            style={activeTab === 'live' ? { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)' } : {}}
          >
            🔴 Live Class
          </button>
        </div>

        {/* Video Content */}
        {activeTab === 'videos' && (
          <div className="bg-white rounded-[15px] shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Recorded Videos</h3>
            {recordedLectures && recordedLectures.length > 0 ? (
              isPurchased ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recordedLectures.map((lecture, index) => (
                    <div key={lecture._id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                          {lecture.lectureNumber || index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-lg mb-2">{lecture.title}</h4>
                          <p className="text-slate-600 text-sm mb-2">📚 {lecture.chapterName}</p>
                          <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">⏱️ Duration:</span>
                              <span>{lecture.duration || 'N/A'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">👨‍🏫 Instructor:</span>
                              <span>{lecture.instructorId?.userName || 'Instructor'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a
                        href={lecture.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-center no-underline transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white"
                        style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}
                      >
                        🎥 Watch Video
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="text-center py-8 mb-8">
                    <div className="text-4xl mb-4">🔒</div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Recorded Videos Available!</h4>
                    <p className="text-slate-600 mb-6">Purchase this course to access all recorded videos.</p>
                    <button
                      onClick={handlePurchase}
                      disabled={isProcessingPayment}
                      className={`py-3 px-8 rounded-lg font-semibold text-white transition-all duration-300 ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                      style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}
                    >
                      {isProcessingPayment ? 'Processing...' : `Buy Now - ₹${course.pricing || 0}`}
                    </button>
                  </div>

                  {/* Preview of recorded videos (locked) */}
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Available Recorded Videos</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recordedLectures.slice(0, 6).map((lecture) => (
                        <div key={lecture._id} className="flex items-center gap-4 p-4 rounded-lg bg-white border border-slate-200">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' }}>
                            🔒
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-slate-700 truncate">{lecture.title}</h5>
                            <p className="text-sm text-slate-500 truncate">📚 {lecture.chapterName}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                              <span>⏱️ {lecture.duration || 'N/A'}</span>
                              <span>👨‍🏫 {lecture.instructorId?.userName || 'Instructor'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {recordedLectures.length > 6 && (
                        <div className="col-span-full text-center">
                          <p className="text-sm text-slate-500">...and {recordedLectures.length - 6} more videos</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-slate-500">
                <div className="text-4xl mb-4">📹</div>
                <p>No recorded videos available yet</p>
                <p className="text-sm text-slate-400 mt-2">Videos will be added soon!</p>
              </div>
            )}
          </div>
        )}

        {/* Live Classes Content */}
        {activeTab === 'live' && (
          <div className="bg-white rounded-[15px] shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Live Classes</h3>
            {liveLectureData?.allLectures && liveLectureData.allLectures.length > 0 ? (
              isPurchased ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {liveLectureData.allLectures.map((lecture: any, index: number) => (
                    <div key={lecture._id || index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
                          🔴
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-lg mb-2">{lecture.title || `Live Session ${index + 1}`}</h4>
                          {lecture.description && (
                            <p className="text-slate-600 text-sm mb-3">{lecture.description}</p>
                          )}
                          <div className="space-y-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">📅 Date:</span>
                              <span>{new Date(lecture.scheduledAt).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">⏰ Time:</span>
                              <span>{new Date(lecture.scheduledAt).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                hour12: true 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">👨‍🏫 Instructor:</span>
                              <span>{lecture.instructorName || course.teachers?.teacherName || 'Instructor'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">⏱️ Duration:</span>
                              <span>{lecture.duration || 60} minutes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <a
                        href={lecture.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-center no-underline transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white"
                        style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)' }}
                      >
                        🔴 Join Live Class
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="text-center py-8 mb-8">
                    <div className="text-4xl mb-4">🔒</div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">Live Classes Available!</h4>
                    <p className="text-slate-600 mb-6">Purchase this course to access live classes.</p>
                    <button
                      onClick={handlePurchase}
                      disabled={isProcessingPayment}
                      className={`py-3 px-8 rounded-lg font-semibold text-white transition-all duration-300 ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                      style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}
                    >
                      {isProcessingPayment ? 'Processing...' : `Buy Now - ₹${course.pricing || 0}`}
                    </button>
                  </div>
                  
                  {/* Preview of upcoming live classes */}
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h4 className="text-lg font-bold text-slate-800 mb-4">Upcoming Live Classes</h4>
                    <div className="space-y-4">
                      {liveLectureData.allLectures.slice(0, 3).map((lecture: any, index: number) => (
                        <div key={lecture._id || index} className="flex items-center gap-4 p-4 rounded-lg bg-white border border-slate-200">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)' }}>
                            🔒
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-slate-700">{lecture.title || `Live Session ${index + 1}`}</h5>
                            <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                              <span>📅 {new Date(lecture.scheduledAt).toLocaleDateString()}</span>
                              <span>⏰ {new Date(lecture.scheduledAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                              <span>👨‍🏫 {lecture.instructorName || course.teachers?.teacherName || 'Instructor'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      {liveLectureData.allLectures.length > 3 && (
                        <p className="text-sm text-slate-500 text-center">...and {liveLectureData.allLectures.length - 3} more sessions</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-slate-500">
                <div className="text-4xl mb-4">📅</div>
                <p>No live classes scheduled for this course yet.</p>
                <p className="text-sm text-slate-400 mt-2">Check back later for updates!</p>
              </div>
            )}
          </div>
        )}

        {/* Notes Content */}
        {activeTab === 'notes' && (
          <div className="bg-white rounded-[15px] shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>Course Notes</h3>
            {isPurchased ? (
              allNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allNotes.map((note, index) => (
                    <div key={note._id || index} className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-5 border border-purple-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)' }}>
                          📄
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{note.title}</h4>
                          <p className="text-xs text-slate-500 mt-1">
                            {note.type === 'curriculum' ? 'Lecture notes' : 'Course notes'}
                          </p>
                        </div>
                      </div>
                      <a
                        href={note.notesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-center no-underline transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-white"
                        style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}
                      >
                        📥 Download Notes
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <div className="text-4xl mb-4">📝</div>
                  <p>No notes available for this course yet.</p>
                  <p className="text-sm text-slate-400 mt-2">Notes will be added soon!</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔒</div>
                <h4 className="text-lg font-bold text-slate-800 mb-2">Notes Available</h4>
                <p className="text-slate-600 mb-4">Purchase this course to access all study notes.</p>
                <button
                  onClick={handlePurchase}
                  disabled={isProcessingPayment}
                  className={`py-3 px-8 rounded-lg font-semibold text-white transition-all duration-300 ${isProcessingPayment ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                  style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.3)' }}
                >
                  {isProcessingPayment ? 'Processing...' : `Buy Now - ₹${course.pricing || 0}`}
                </button>
              </div>
            )}
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

export default CourseDetail;
