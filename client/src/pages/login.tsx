import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginSchema } from '../lib/schemas';
import type { LoginInput } from '../lib/schemas';
import { ZodError } from 'zod';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated, error: authError, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [pageLoaded, setPageLoaded] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Page load animation
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Show auth errors
  useEffect(() => {
    if (authError) {
      setErrorMessage(authError);
      clearError();
    }
  }, [authError, clearError]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const hideMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    hideMessages();

    // Validate with Zod
    try {
      const validatedData: LoginInput = loginSchema.parse({
        userEmail: formData.email,
        password: formData.password,
      });

      // Call login API
      await login(validatedData);
      
      setSuccessMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (err) {
      if (err instanceof ZodError) {
        // Handle Zod validation errors
        const errors: Record<string, string> = {};
        err.issues.forEach((error) => {
          const field = error.path[0] as string;
          // Map userEmail back to email for form field
          const fieldName = field === 'userEmail' ? 'email' : field;
          errors[fieldName] = error.message;
        });
        setFieldErrors(errors);
        setErrorMessage('Please fix the errors below.');
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-opacity duration-500 ${
        pageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden z-[1]">
        <div
          className="floating-shape absolute w-[100px] h-[100px] rounded-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, #c53030, #a02626)',
            top: '10%',
            left: '10%',
            animationDelay: '0s',
          }}
        />
        <div
          className="floating-shape absolute w-[60px] h-[60px] rounded-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, #c53030, #a02626)',
            top: '70%',
            right: '20%',
            animationDelay: '5s',
          }}
        />
        <div
          className="floating-shape absolute w-[80px] h-[80px] rounded-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, #c53030, #a02626)',
            bottom: '20%',
            left: '20%',
            animationDelay: '10s',
          }}
        />
        <div
          className="floating-shape absolute w-[120px] h-[120px] rounded-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, #c53030, #a02626)',
            top: '30%',
            right: '10%',
            animationDelay: '15s',
          }}
        />
      </div>

      {/* Back to Home Button */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          to="/"
          className="flex items-center gap-2 bg-white/90 text-slate-800 px-5 py-2.5 rounded-full font-medium transition-all duration-300 hover:bg-white hover:-translate-y-0.5"
          style={{
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Back to Home
        </Link>
      </div>

      {/* Login Container */}
      <div
        className="login-container relative z-10 w-full max-w-[900px] mx-8 grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden m-2 h-[97vh]"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Left Side - Branding */}
        <div
          className="flex flex-col justify-center items-center p-12 text-white text-center relative"
          style={{ background: 'linear-gradient(135deg, #c53030, #a02626)' }}
        >
          {/* Logo */}
          <div className="mb-8">
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="white" strokeWidth="4" />
              <rect x="20" y="35" width="12" height="12" fill="white" />
              <path
                d="M35 35 L35 65 L50 65 Q65 65 65 50 Q65 35 50 35 L35 35 M35 45 L50 45 Q55 45 55 50 Q55 55 50 55 L35 55"
                fill="white"
              />
              <text x="50" y="85" textAnchor="middle" fontSize="8" fill="white">
                BECS
              </text>
            </svg>
          </div>

          <h1 className="text-3xl font-bold mb-4">BECS E-Learning</h1>
          <p className="text-lg opacity-90 leading-relaxed mb-8">
            Access your personalized learning dashboard and continue your educational journey with us.
          </p>

          <ul className="text-left hidden md:block">
            {[
              'Premium Study Notes',
              'Expert Video Lectures',
              'Technical Courses',
              'Board Preparation',
              'Progress Tracking',
            ].map((feature, index) => (
              <li key={index} className="flex items-center mb-4 opacity-90">
                <span
                  className="mr-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
            <p className="text-slate-500">Sign in to your account to continue learning</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="p-4 rounded-lg mb-4 text-sm"
              style={{
                background: '#fee2e2',
                color: '#991b1b',
                border: '1px solid #fecaca',
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div
              className="p-4 rounded-lg mb-4 text-sm"
              style={{
                background: '#d1fae5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
              }}
            >
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            {/* Email Field */}
            <div className="mb-6 form-group transition-transform duration-300">
              <label htmlFor="email" className="block mb-2 text-slate-800 font-semibold text-sm">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none"
                style={{
                  border: fieldErrors.email ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  background: '#f8fafc',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = fieldErrors.email ? '#ef4444' : '#c53030';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = fieldErrors.email 
                    ? '0 0 0 4px rgba(239, 68, 68, 0.1)' 
                    : '0 0 0 4px rgba(197, 48, 48, 0.1)';
                  e.target.parentElement!.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.email ? '#ef4444' : '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                  e.target.parentElement!.style.transform = 'translateY(0)';
                }}
                required
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-6 form-group transition-transform duration-300">
              <label htmlFor="password" className="block mb-2 text-slate-800 font-semibold text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none"
                style={{
                  border: fieldErrors.password ? '2px solid #ef4444' : '2px solid #e2e8f0',
                  background: '#f8fafc',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = fieldErrors.password ? '#ef4444' : '#c53030';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = fieldErrors.password 
                    ? '0 0 0 4px rgba(239, 68, 68, 0.1)' 
                    : '0 0 0 4px rgba(197, 48, 48, 0.1)';
                  e.target.parentElement!.style.transform = 'translateY(-2px)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.password ? '#ef4444' : '#e2e8f0';
                  e.target.style.background = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                  e.target.parentElement!.style.transform = 'translateY(0)';
                }}
                required
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Form Options */}
            <div className="flex items-center justify-between mb-8 text-sm">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="w-auto m-0"
                />
                Remember me
              </label>
              <Link
                to="/forgot-password"
                className="font-medium transition-all duration-300 hover:underline"
                style={{ color: '#c53030' }}
                onMouseOver={(e) => (e.currentTarget.style.color = '#a02626')}
                onMouseOut={(e) => (e.currentTarget.style.color = '#c53030')}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 mb-6 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
              style={{
                background: 'linear-gradient(135deg, #c53030, #a02626)',
                fontFamily: 'inherit',
                boxShadow: isLoading ? 'none' : undefined,
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(197, 48, 48, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  Signing In...
                  <span className="loading-spinner" />
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative text-center my-6 text-slate-400 text-sm">
            <div
              className="absolute top-1/2 left-0 right-0 h-px z-[1]"
              style={{ background: '#e2e8f0' }}
            />
            <span className="relative z-[2] bg-white px-4">or</span>
          </div>

          {/* Signup Link */}
          <p className="text-center text-slate-500 text-sm">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold transition-all duration-300 hover:underline"
              style={{ color: '#c53030' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#a02626')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#c53030')}
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Custom animation styles */}
      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-30px) rotate(120deg);
          }
          66% {
            transform: translateY(30px) rotate(240deg);
          }
          100% {
            transform: translateY(0px) rotate(360deg);
          }
        }
        
        .floating-shape {
          animation: float 20s infinite linear;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .login-container {
          animation: slideIn 0.8s ease-out;
        }
        
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr !important;
            margin: 1rem;
            max-width: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;