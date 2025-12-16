import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ValidationState {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phone: boolean;
  course: boolean;
  password: boolean;
  confirmPassword: boolean;
  terms: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  course: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

const Signup = () => {
  const navigate = useNavigate();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    course: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });

  const [validationState, setValidationState] = useState<ValidationState>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    course: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const [fieldFeedback, setFieldFeedback] = useState<Record<string, { message: string; type: 'error' | 'success' | '' }>>({
    firstName: { message: '', type: '' },
    lastName: { message: '', type: '' },
    email: { message: '', type: '' },
    phone: { message: '', type: '' },
    course: { message: '', type: '' },
    confirmPassword: { message: '', type: '' },
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [passwordStrength, setPasswordStrength] = useState({ percentage: 0, text: '', class: '' });

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

  const validateField = (name: string, value: string): boolean => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return value.trim().length > 0;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case 'phone':
        return /^\d{10}$/.test(value.trim());
      case 'course':
        return value !== '';
      default:
        return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (name === 'terms') {
      setValidationState((prev) => ({ ...prev, terms: checked }));
      return;
    }

    if (name === 'password') {
      const isValid = validatePassword(value);
      setValidationState((prev) => ({ ...prev, password: isValid }));

      // Re-validate confirm password if it has a value
      if (formData.confirmPassword) {
        const confirmValid = value === formData.confirmPassword;
        setValidationState((prev) => ({ ...prev, confirmPassword: confirmValid }));
        setFieldFeedback((prev) => ({
          ...prev,
          confirmPassword: {
            message: confirmValid ? 'Passwords match' : 'Passwords do not match',
            type: confirmValid ? 'success' : 'error',
          },
        }));
      }
      return;
    }

    if (name === 'confirmPassword') {
      const isValid = value === formData.password;
      setValidationState((prev) => ({ ...prev, confirmPassword: isValid }));
      setFieldFeedback((prev) => ({
        ...prev,
        confirmPassword: {
          message: value === '' ? '' : isValid ? 'Passwords match' : 'Passwords do not match',
          type: value === '' ? '' : isValid ? 'success' : 'error',
        },
      }));
      return;
    }

    // Other fields validation
    const isValid = validateField(name, value);
    setValidationState((prev) => ({ ...prev, [name]: isValid }));

    if (value === '') {
      setFieldFeedback((prev) => ({
        ...prev,
        [name]: { message: '', type: '' },
      }));
    } else {
      setFieldFeedback((prev) => ({
        ...prev,
        [name]: {
          message: isValid ? '' : 'This field is required',
          type: isValid ? 'success' : 'error',
        },
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      const allValid = Object.values(validationState).every(Boolean);
      if (allValid) {
        setSuccessMessage('Account created successfully!');
        setErrorMessage('');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          course: '',
          password: '',
          confirmPassword: '',
          terms: false,
        });
        setValidationState({
          firstName: false,
          lastName: false,
          email: false,
          phone: false,
          course: false,
          password: false,
          confirmPassword: false,
          terms: false,
        });
        setPasswordRequirements({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        });
        setPasswordStrength({ percentage: 0, text: '', class: '' });
        setFieldFeedback({
          firstName: { message: '', type: '' },
          lastName: { message: '', type: '' },
          email: { message: '', type: '' },
          phone: { message: '', type: '' },
          course: { message: '', type: '' },
          confirmPassword: { message: '', type: '' },
        });

        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setErrorMessage('Please fix the errors in the form.');
        setSuccessMessage('');
      }
    }, 1500);
  };

  const isFormValid = Object.values(validationState).every(Boolean);

  const getInputClassName = (fieldName: string) => {
    const feedback = fieldFeedback[fieldName];
    if (!feedback || feedback.type === '') return '';
    return feedback.type === 'success' ? 'success' : 'error';
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

      {/* Back to Home Button */}
      <div className="fixed top-8 left-8 z-20">
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

      {/* Signup Container */}
      <div
        className="signup-container relative z-10 w-full max-w-[1000px] mx-8 grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden min-h-[700px]"
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
            Join BECS E-Learning
          </h1>
          <p className="text-lg opacity-90 leading-relaxed mb-8">
            Start your educational journey with premium learning resources and expert guidance.
          </p>

          <ul className="text-left w-full max-w-[280px] hidden md:block">
            {[
              'Access Premium Study Notes',
              'Expert Video Lectures',
              'Technical Programming Courses',
              'Board Examination Preparation',
              'Personalized Learning Dashboard',
              '24/7 Student Support',
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

        {/* Right Side - Signup Form */}
        <div className="p-12 flex flex-col justify-center overflow-y-auto max-h-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
            <p className="text-slate-500">Fill in your details to get started</p>
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

          <form onSubmit={handleSubmit} className="w-full" noValidate>
            {/* Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="form-group transition-all duration-300 focus-within:-translate-y-0.5">
                <label htmlFor="firstName" className="block mb-2 text-slate-800 font-semibold text-sm">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  autoComplete="given-name"
                  className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none ${getInputClassName('firstName')}`}
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
                {fieldFeedback.firstName.message && (
                  <div className={`text-xs mt-1 ${fieldFeedback.firstName.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {fieldFeedback.firstName.message}
                  </div>
                )}
              </div>

              <div className="form-group transition-all duration-300 focus-within:-translate-y-0.5">
                <label htmlFor="lastName" className="block mb-2 text-slate-800 font-semibold text-sm">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  autoComplete="family-name"
                  className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none ${getInputClassName('lastName')}`}
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
                {fieldFeedback.lastName.message && (
                  <div className={`text-xs mt-1 ${fieldFeedback.lastName.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {fieldFeedback.lastName.message}
                  </div>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
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
                autoComplete="email"
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none ${getInputClassName('email')}`}
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
              {fieldFeedback.email.message && (
                <div className={`text-xs mt-1 ${fieldFeedback.email.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {fieldFeedback.email.message}
                </div>
              )}
            </div>

            {/* Phone */}
            <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
              <label htmlFor="phone" className="block mb-2 text-slate-800 font-semibold text-sm">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none ${getInputClassName('phone')}`}
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
              {fieldFeedback.phone.message && (
                <div className={`text-xs mt-1 ${fieldFeedback.phone.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                  {fieldFeedback.phone.message}
                </div>
              )}
            </div>

            {/* Course Selection */}
            <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
              <label htmlFor="course" className="block mb-2 text-slate-800 font-semibold text-sm">
                Primary Interest
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none cursor-pointer"
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
              >
                <option value="">Select your primary interest</option>
                <option value="notes">Study Notes</option>
                <option value="lectures">Video Lectures</option>
                <option value="board-prep">Board Preparation</option>
                <option value="iot">IoT & Robotics</option>
                <option value="c-cpp">C & C++ Programming</option>
                <option value="python">Python Programming</option>
                <option value="other-tech">Other Technical Courses</option>
              </select>
            </div>

            {/* Password */}
            <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
              <label htmlFor="password" className="block mb-2 text-slate-800 font-semibold text-sm">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
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

            {/* Confirm Password */}
            <div className="form-group mb-6 transition-all duration-300 focus-within:-translate-y-0.5">
              <label htmlFor="confirmPassword" className="block mb-2 text-slate-800 font-semibold text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className={`w-full px-5 py-4 rounded-xl text-base transition-all duration-300 outline-none ${
                  fieldFeedback.confirmPassword.type === 'success'
                    ? 'border-green-500 bg-green-50'
                    : fieldFeedback.confirmPassword.type === 'error'
                    ? 'border-red-500 bg-red-50'
                    : ''
                }`}
                style={{
                  border: fieldFeedback.confirmPassword.type ? undefined : '2px solid #e2e8f0',
                  background: fieldFeedback.confirmPassword.type ? undefined : '#f8fafc',
                  fontFamily: 'inherit',
                }}
                onFocus={(e) => {
                  if (!fieldFeedback.confirmPassword.type) {
                    e.target.style.borderColor = '#c53030';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 4px rgba(197, 48, 48, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  if (!fieldFeedback.confirmPassword.type) {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                    e.target.style.boxShadow = 'none';
                  }
                }}
                required
              />
              {fieldFeedback.confirmPassword.message && (
                <div
                  className={`text-xs mt-1 ${
                    fieldFeedback.confirmPassword.type === 'error' ? 'text-red-500' : 'text-green-600'
                  }`}
                >
                  {fieldFeedback.confirmPassword.message}
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 my-6">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                className="w-[18px] h-[18px] mt-0.5 cursor-pointer accent-red-700"
                required
              />
              <label htmlFor="terms" className="text-sm text-slate-500 leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Terms of Service content would be displayed here.');
                  }}
                  className="font-medium hover:underline"
                  style={{ color: '#c53030' }}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Privacy Policy content would be displayed here.');
                  }}
                  className="font-medium hover:underline"
                  style={{ color: '#c53030' }}
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 mb-6 relative ${
                !isFormValid || isSubmitting
                  ? 'opacity-60 cursor-not-allowed'
                  : 'hover:-translate-y-0.5'
              }`}
              style={{
                background: 'linear-gradient(135deg, #c53030, #a02626)',
                fontFamily: 'inherit',
              }}
              onMouseOver={(e) => {
                if (isFormValid && !isSubmitting) {
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(197, 48, 48, 0.3)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  Creating Account...
                  <span className="loading-spinner" />
                </span>
              ) : (
                'Create Account'
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

          {/* Login Link */}
          <p className="text-center text-slate-500 text-sm">
            Already have an account?{' '}
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
        
        .signup-container {
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
        
        .success {
          border-color: #10b981 !important;
          background: #f0fdf4 !important;
        }
        
        .error {
          border-color: #ef4444 !important;
          background: #fef2f2 !important;
        }
        
        @media (max-width: 968px) {
          .signup-container {
            grid-template-columns: 1fr !important;
            max-width: 500px;
            min-height: auto;
          }
        }
        
        @media (max-width: 480px) {
          .signup-container {
            margin: 1rem;
            border-radius: 16px;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .floating-shape,
          .logo-float,
          .feature-item {
            animation: none;
          }
          .signup-container {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Signup;