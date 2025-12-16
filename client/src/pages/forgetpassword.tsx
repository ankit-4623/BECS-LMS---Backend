import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

type Step = 'email' | 'otp' | 'password';

const ForgotPassword = () => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({ percentage: 0, text: '', class: '' });
  const [confirmFeedback, setConfirmFeedback] = useState({ message: '', type: '' as 'error' | 'success' | '' });

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

  // Password requirements regex
  const requirements = {
    length: /^.{8,}$/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    special: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const showMessage = (type: 'error' | 'success', message: string) => {
    if (type === 'error') {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
    setTimeout(() => {
      setErrorMessage('');
      setSuccessMessage('');
    }, 3000);
  };

  const validatePassword = (password: string) => {
    let validCount = 0;
    const newRequirements = { ...passwordRequirements };

    Object.keys(requirements).forEach((req) => {
      const isValid = requirements[req as keyof typeof requirements].test(password);
      newRequirements[req as keyof typeof newRequirements] = isValid;
      if (isValid) validCount++;
    });

    setPasswordRequirements(newRequirements);

    // Update strength indicator
    const percentage = (validCount / 5) * 100;
    let text = '';
    let strengthClass = '';

    if (validCount <= 2) {
      text = 'Weak';
      strengthClass = 'strength-weak';
    } else if (validCount <= 4) {
      text = 'Medium';
      strengthClass = 'strength-medium';
    } else {
      text = 'Strong';
      strengthClass = 'strength-strong';
    }

    setPasswordStrength({ percentage, text, class: strengthClass });

    return validCount === 5;
  };

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    validatePassword(value);

    // Re-validate confirm password if it has a value
    if (confirmNewPassword) {
      const isMatch = value === confirmNewPassword;
      setConfirmFeedback({
        message: isMatch ? 'Passwords match' : 'Passwords do not match',
        type: isMatch ? 'success' : 'error',
      });
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmNewPassword(value);
    if (value === '') {
      setConfirmFeedback({ message: '', type: '' });
    } else {
      const isMatch = newPassword === value;
      setConfirmFeedback({
        message: isMatch ? 'Passwords match' : 'Passwords do not match',
        type: isMatch ? 'success' : 'error',
      });
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showMessage('error', 'Please enter a valid email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newOtp = generateOtp();
      setSimulatedOtp(newOtp);
      console.log(`Simulated OTP sent to ${email}: ${newOtp}`);
      showMessage('success', 'OTP sent to your email!');
      setCurrentStep('otp');
      setIsLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim() === simulatedOtp) {
      showMessage('success', 'Successfully verified!');
      setCurrentStep('password');
    } else {
      showMessage('error', 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = () => {
    const newOtp = generateOtp();
    setSimulatedOtp(newOtp);
    console.log(`New simulated OTP: ${newOtp}`);
    showMessage('success', 'New OTP sent!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let validCount = 0;
    Object.keys(requirements).forEach((req) => {
      if (requirements[req as keyof typeof requirements].test(newPassword)) validCount++;
    });

    if (validCount === 5 && newPassword === confirmNewPassword) {
      setIsLoading(true);
      setTimeout(() => {
        showMessage('success', 'Password reset successfully!');
        setIsLoading(false);
        // Redirect to login after success
      }, 1000);
    } else {
      showMessage('error', 'Please meet all password requirements and ensure passwords match.');
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-x-hidden py-8 transition-opacity duration-500 ${
        pageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
      }}
    >
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden z-[1] pointer-events-none">
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

      {/* Forgot Password Container */}
      <div
        className="forgot-container relative z-10 w-full max-w-[1000px] mx-8 grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden min-h-[700px]"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Left Side - Branding */}
        <div
          className="flex flex-col justify-center items-center p-12 text-white text-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #c53030, #a02626)' }}
        >
          {/* Logo */}
          <div className="mb-8 logo-float">
            <svg
              width="80"
              height="80"
              viewBox="0 0 100 100"
              style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))' }}
            >
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

          <h1
            className="text-3xl font-bold mb-4"
            style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
          >
            Reset Your Password
          </h1>
          <p className="text-lg opacity-90 leading-relaxed mb-8">
            Securely recover access to your BECS E-Learning account.
          </p>

          <ul className="text-left w-full max-w-[280px] hidden md:block">
            {[
              'Quick OTP Verification',
              'Strong Password Standards',
              'Secure Account Recovery',
              '24/7 Support Available',
            ].map((feature, index) => (
              <li
                key={index}
                className="flex items-center mb-4 opacity-90 feature-item"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <span
                  className="mr-4 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side - Forgot Form */}
        <div className="p-12 flex flex-col justify-center overflow-y-auto max-h-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Forgot Password</h2>
            <p className="text-slate-500">
              {currentStep === 'email' && 'Enter your email to reset your password'}
              {currentStep === 'otp' && 'Enter the OTP sent to your email'}
              {currentStep === 'password' && 'Create a new password'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="p-4 rounded-lg mb-4 text-sm message-slide"
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
              className="p-4 rounded-lg mb-4 text-sm message-slide"
              style={{
                background: '#d1fae5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
              }}
            >
              {successMessage}
            </div>
          )}

          {/* Step 1: Email Form */}
          {currentStep === 'email' && (
            <form onSubmit={handleEmailSubmit} className="w-full">
              <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
                <label htmlFor="email" className="block mb-2 text-slate-800 font-semibold text-sm">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none"
                  style={{
                    border: '2px solid #e2e8f0',
                    background: '#f8fafc',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c53030';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(197, 48, 48, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 mb-6 ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #c53030, #a02626)',
                  fontFamily: 'inherit',
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
                    Sending...
                    <span className="loading-spinner" />
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification Form */}
          {currentStep === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="w-full">
              <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
                <label htmlFor="otp" className="block mb-2 text-slate-800 font-semibold text-sm">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP sent to your email"
                  className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none"
                  style={{
                    border: '2px solid #e2e8f0',
                    background: '#f8fafc',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c53030';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(197, 48, 48, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 mb-6 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #c53030, #a02626)',
                  fontFamily: 'inherit',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(197, 48, 48, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Verify OTP
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                className="w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: '#64748b',
                  fontFamily: 'inherit',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(100, 116, 139, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: New Password Form */}
          {currentStep === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="w-full">
              {/* New Password */}
              <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
                <label htmlFor="newPassword" className="block mb-2 text-slate-800 font-semibold text-sm">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none"
                  style={{
                    border: '2px solid #e2e8f0',
                    background: '#f8fafc',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#c53030';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(197, 48, 48, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />

                {/* Password Strength Bar */}
                <div className="mt-2 h-1 bg-slate-200 rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-300"
                    style={{
                      width: `${passwordStrength.percentage}%`,
                      background: 'linear-gradient(90deg, #ef4444, #f59e0b, #10b981)',
                    }}
                  />
                </div>
                {passwordStrength.text && (
                  <div
                    className={`text-xs mt-1 font-medium ${
                      passwordStrength.class === 'strength-weak'
                        ? 'text-red-500'
                        : passwordStrength.class === 'strength-medium'
                        ? 'text-amber-500'
                        : 'text-green-600'
                    }`}
                  >
                    {passwordStrength.text}
                  </div>
                )}

                {/* Password Requirements */}
                <div
                  className="mt-2 p-4 rounded-lg transition-all duration-300"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                  <div className="text-sm font-semibold text-slate-800 mb-3">Password Requirements:</div>
                  {[
                    { key: 'length', text: 'At least 8 characters long' },
                    { key: 'uppercase', text: 'One uppercase letter (A-Z)' },
                    { key: 'lowercase', text: 'One lowercase letter (a-z)' },
                    { key: 'number', text: 'One number (0-9)' },
                    { key: 'special', text: 'One special character (!@#$%^&*)' },
                  ].map((req) => (
                    <div
                      key={req.key}
                      className={`flex items-center mb-2 text-xs transition-all duration-300 ${
                        passwordRequirements[req.key as keyof typeof passwordRequirements]
                          ? 'text-green-600'
                          : 'text-slate-500'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center text-[10px] font-bold transition-all duration-300 flex-shrink-0 ${
                          passwordRequirements[req.key as keyof typeof passwordRequirements]
                            ? 'bg-green-600 border-green-600 text-white'
                            : 'border-2 border-slate-200'
                        }`}
                      >
                        {passwordRequirements[req.key as keyof typeof passwordRequirements] && '✓'}
                      </div>
                      {req.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
                <label htmlFor="confirmNewPassword" className="block mb-2 text-slate-800 font-semibold text-sm">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none ${
                    confirmFeedback.type === 'success'
                      ? 'border-green-500 bg-green-50'
                      : confirmFeedback.type === 'error'
                      ? 'border-red-500 bg-red-50'
                      : ''
                  }`}
                  style={{
                    border: confirmFeedback.type ? undefined : '2px solid #e2e8f0',
                    background: confirmFeedback.type ? undefined : '#f8fafc',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    if (!confirmFeedback.type) {
                      e.target.style.borderColor = '#c53030';
                      e.target.style.background = 'white';
                      e.target.style.boxShadow = '0 0 0 4px rgba(197, 48, 48, 0.1)';
                    }
                  }}
                  onBlur={(e) => {
                    if (!confirmFeedback.type) {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                  required
                />
                {confirmFeedback.message && (
                  <div
                    className={`text-xs mt-1 ${
                      confirmFeedback.type === 'error' ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    {confirmFeedback.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 mb-6 ${
                  isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
                style={{
                  background: 'linear-gradient(135deg, #c53030, #a02626)',
                  fontFamily: 'inherit',
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
                    Saving...
                    <span className="loading-spinner" />
                  </span>
                ) : (
                  'Save Password'
                )}
              </button>
            </form>
          )}

          {/* Back to Login Link */}
          <p className="text-center text-slate-500 text-sm mt-4">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-semibold transition-all duration-300 hover:underline"
              style={{ color: '#c53030' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#a02626')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#c53030')}
            >
              Sign In
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
        
        .forgot-container {
          animation: slideIn 0.8s ease-out;
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 0.9;
            transform: translateX(0);
          }
        }
        
        .feature-item {
          opacity: 0;
          transform: translateX(-20px);
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        @keyframes logoFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .logo-float {
          animation: logoFloat 3s ease-in-out infinite;
        }
        
        @keyframes messageSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .message-slide {
          animation: messageSlide 0.3s ease-out;
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
        
        @media (max-width: 968px) {
          .forgot-container {
            grid-template-columns: 1fr !important;
            max-width: 500px;
            min-height: auto;
          }
        }
        
        @media (max-width: 480px) {
          .forgot-container {
            margin: 1rem;
            border-radius: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;