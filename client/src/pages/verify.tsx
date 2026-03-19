import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { verifyOtp, registerUser } from '../services/auth.service';

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prefillEmail = (location.state as any)?.email || '';

  const [email, setEmail] = useState(prefillEmail);
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  // passwordForResend is optional now — resend no longer requires user to enter password
  const [passwordForResend] = useState((location.state as any)?.password || '');
  const [prefillName] = useState((location.state as any)?.userName || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Refs for OTP inputs (declare early so effects/handlers can use them)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    // If no email was passed, leave it empty so user can type
    setEmail(prefillEmail);

    // If we have password passed from signup, start cooldown because register was just called
    if ((location.state as any)?.password) {
      // start short cooldown so resend isn't immediately available
      setResendCountdown(60);
    }

    // Autofocus the first OTP input when the component mounts
    setTimeout(() => {
      inputsRef.current[0]?.focus();
    }, 50);
  }, [prefillEmail, location.state]);

  useEffect(() => {
    let timer: number | undefined;
    if (resendCountdown > 0) {
      timer = window.setInterval(() => {
        setResendCountdown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCountdown]);

  // Refs and handlers for animated 6-digit OTP inputs

  const handleOtpInputChange = (index: number, value: string) => {
    // allow only single digit (take last typed digit)
    const digit = value.replace(/\D/g, '').slice(-1);
    const chars = otp.split('');
    while (chars.length < 6) chars.push('');
    chars[index] = digit || '';
    setOtp(chars.join(''));

    if (digit && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const chars = otp.split('');
      while (chars.length < 6) chars.push('');
      if (chars[index]) {
        chars[index] = '';
        setOtp(chars.join(''));
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const prev = otp.split('');
        while (prev.length < 6) prev.push('');
        prev[index - 1] = '';
        setOtp(prev.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // prevent the browser default so we control filling
    const paste = e.clipboardData.getData('text').trim();
    const digits = paste.replace(/\D/g, '').slice(0, 6).split('');
    if (digits.length) {
      const chars = [...digits];
      while (chars.length < 6) chars.push('');
      setOtp(chars.join(''));
      const focusIndex = Math.min(digits.length, 5);
      // update DOM and focus the next empty slot
      inputsRef.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email');
      return;
    }
    if (!otp || !/^\d{6}$/.test(otp)) {
      setErrorMessage('Please enter the 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyOtp({ userEmail: email, otp });
      if (response.success) {
        setSuccessMessage('Registration complete! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setErrorMessage(response.message || 'Verification failed');
      }
    } catch (err: any) {
      console.error('[Verify] verification error:', err);
      if (!err?.response) {
        setErrorMessage('Unable to reach the server. Please check your network or try again later.');
      } else {
        setErrorMessage(err?.response?.data?.message || err.message || 'Verification failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8" style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif" }}>
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
        <p className="text-sm text-slate-500 mb-6">Enter the 6-digit code we sent to your email to complete registration.</p>

        {errorMessage && (
          <div className="p-3 mb-4 rounded text-sm" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-3 mb-4 rounded text-sm" style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0' }}>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="email" className="text-sm block mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200"
              placeholder="you@example.com"
              required
            />
          </div>



          <div className="mb-6">
            <label className="text-sm block mb-1">OTP</label>
            <div className="flex gap-3 justify-center" onPaste={handleOtpPaste} role="group" aria-label="OTP input">
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const value = otp[i] || '';
                return (
                  <input
                    key={i}
                    
                    aria-label={`Digit ${i + 1}`}
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleOtpInputChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={(e) => handleOtpPaste(e)}
                    className="otp-box w-12 h-14 flex items-center justify-center text-lg font-medium text-center rounded-lg border border-slate-200 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                );
              })}
            </div>
            {/* Animated styles for OTP boxes */}
            <style>{`\n              .otp-box { transition: transform .15s ease, box-shadow .15s ease; text-align: center; }\n              .otp-box:focus { transform: translateY(-6px) scale(1.02); box-shadow: 0 10px 30px rgba(0,0,0,0.08); outline: none; }\n            `}</style>
          </div>

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying...' : 'Verify'}
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={async () => {
                  setErrorMessage('');
                  setSuccessMessage('');
                  // Need email and password or ask the user to enter password
                  const p = passwordForResend;
                  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setErrorMessage('Please enter a valid email to resend OTP');
                    return;
                  }

                  setIsResending(true);
                  try {
                    // Call register route to resend OTP. Password is optional — server will generate one if missing.
                    const body: any = { userName: prefillName || email.split('@')[0], userEmail: email };
                    if (p) {
                      body.password = p;
                      body.confirmPassword = p;
                    }
                    await registerUser(body);
                    setSuccessMessage('OTP resent to your email');
                    // Clear OTP boxes and focus first box
                    setOtp('');
                    setTimeout(() => inputsRef.current[0]?.focus(), 50);
                    // Start 60s cooldown
                    setResendCountdown(60);
                  } catch (err: any) {
                    const msg = err?.response?.data?.message || err.message || 'Resend failed';
                    setErrorMessage(msg);
                    // If server rate-limited, start cooldown
                    if (err?.response?.status === 429) {
                      setResendCountdown(60);
                    }
                  } finally {
                    setIsResending(false);
                  }
                }}
                className={`text-sm px-4 py-2 rounded ${resendCountdown > 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                disabled={resendCountdown > 0 || isResending}
              >
                {isResending ? 'Resending...' : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend OTP'}
              </button>

              <Link to="/signup" className="text-sm text-slate-500">Back to Signup</Link>
            </div>
          </div>
        </form>

        <p className="text-sm text-slate-400 mt-4">Didn't get the code? Check your spam folder or try signing up again after a minute.</p>
      </div>
    </div>
  );
};

export default Verify;
