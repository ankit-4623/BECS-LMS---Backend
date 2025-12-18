import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Key, CheckCircle, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Please enter a valid email' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateOtp = () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = () => {
    if (!validateEmail()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (!validateOtp()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
    }, 1500);
  };

  const handleResetPassword = () => {
    if (!validatePassword()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden py-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full opacity-10 top-[10%] left-[10%] animate-pulse" />
        <div className="absolute w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full opacity-10 top-[70%] right-[20%] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-full opacity-10 bottom-[20%] left-[20%] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute w-28 h-28 bg-gradient-to-br from-red-600 to-red-700 rounded-full opacity-10 top-[30%] right-[10%] animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Container */}
      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden w-full max-w-[1000px] m-8 grid grid-cols-1 md:grid-cols-2 min-h-[700px]">
        {/* Left Side - Branding */}
        <div className="bg-gradient-to-br from-red-600 to-red-700 flex flex-col justify-center items-center p-12 text-white">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3 text-center">Reset Password</h1>
          <p className="text-white/80 text-center text-lg mb-8">Secure your admin account</p>

          {/* Steps */}
          <div className="space-y-4 w-full max-w-xs">
            <div className={`flex items-center gap-3 p-3 rounded-xl ${step >= 1 ? 'bg-white/20' : 'bg-white/5'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > 1 ? 'bg-green-500' : step === 1 ? 'bg-white text-red-600' : 'bg-white/20'}`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className={step >= 1 ? 'font-medium' : 'opacity-60'}>Enter Email</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${step >= 2 ? 'bg-white/20' : 'bg-white/5'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > 2 ? 'bg-green-500' : step === 2 ? 'bg-white text-red-600' : 'bg-white/20'}`}>
                {step > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className={step >= 2 ? 'font-medium' : 'opacity-60'}>Verify OTP</span>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-xl ${step >= 3 ? 'bg-white/20' : 'bg-white/5'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step > 3 ? 'bg-green-500' : step === 3 ? 'bg-white text-red-600' : 'bg-white/20'}`}>
                {step > 3 ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <span className={step >= 3 ? 'font-medium' : 'opacity-60'}>New Password</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 flex flex-col justify-center">
          {/* Step 1: Email */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Forgot Password?</h2>
              <p className="text-slate-500 mb-8">Enter your email to receive a verification code</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-slate-800 transition-all duration-300 focus:outline-none ${
                    errors.email
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  }`}
                  placeholder="admin@becs.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <button
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>

              <Link to="/login" className="flex items-center justify-center gap-2 mt-6 text-slate-600 hover:text-red-600">
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Key className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Verify OTP</h2>
              <p className="text-slate-500 mb-8">Enter the 6-digit code sent to {email}</p>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-slate-800 text-center text-2xl tracking-[0.5em] font-mono transition-all duration-300 focus:outline-none ${
                    errors.otp
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  }`}
                  placeholder="000000"
                  maxLength={6}
                />
                {errors.otp && <p className="text-red-500 text-sm mt-1 text-center">{errors.otp}</p>}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button onClick={() => setStep(1)} className="flex items-center justify-center gap-2 mt-6 text-slate-600 hover:text-red-600 w-full">
                <ArrowLeft className="w-4 h-4" />
                Change Email
              </button>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Key className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Create New Password</h2>
              <p className="text-slate-500 mb-8">Your new password must be at least 8 characters</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-slate-800 transition-all duration-300 focus:outline-none ${
                      errors.password
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    }`}
                    placeholder="Enter new password"
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-slate-800 transition-all duration-300 focus:outline-none ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-slate-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    }`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="animate-fadeIn text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Reset!</h2>
              <p className="text-slate-500 mb-8">Your password has been successfully reset. You can now log in with your new password.</p>

              <Link
                to="/login"
                className="inline-block w-full py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 text-center"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
