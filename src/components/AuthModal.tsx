import React, { useState } from 'react';
import { 
  loginUser, 
  registerStudentAccount, 
  sendStudentPasswordResetLink,
  studentIdToEmail, 
  logoutUser, 
  StudentProfile 
} from '../lib/firebase';
import { Logo } from './Logo';
import { 
  KeyRound, UserCheck, Shield, Lock, AlertCircle, Sparkles, X, Copy, Check, LogOut, UserPlus, GraduationCap, ShieldCheck, Code2, Eye, EyeOff, User, Mail
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: StudentProfile | null;
  onLoginSuccess: (user: StudentProfile) => void;
  onLogout: () => void;
  isMandatory?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  isMandatory = false
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [classSection, setClassSection] = useState('10-A');
  const [school, setSchool] = useState('Karma Academy');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const getAuthErrorMessage = (err: any, fallback: string) => {
    if (err?.code === 'auth/operation-not-allowed') {
      return 'Email/Password sign-in is not enabled in Firebase Authentication yet. Open your Firebase console, go to Authentication > Sign-in method, and enable Email/Password for this project.';
    }

    if (err?.code === 'auth/network-request-failed') {
      return 'Firebase could not be reached from your browser. Check your internet connection, VPN/firewall settings, and try again.';
    }

    if (err?.code === 'auth/request-timeout') {
      return 'Firebase took too long to respond. Please check your connection and Firebase Authentication setup, then try again.';
    }

    return err?.message || fallback;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingNotice(null);
    setResetSuccessNotice(null);
    if (!studentId.trim() || !password.trim()) {
      setError('Please enter both User ID and Password.');
      return;
    }

    setLoading(true);
    try {
      const user = await loginUser(studentId, password);

      if (user) {
        onLoginSuccess(user);
        onClose();
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes('ACCOUNT_PENDING_APPROVAL')) {
        setPendingNotice('⏳ Account Registration Pending Approval! Your account has been created, but your Class 10 ICT teacher or administrator must approve your account before you can log in.');
      } else if (err.message && err.message.includes('ACCOUNT_REJECTED')) {
        setError('❌ Account Registration Declined. Your account registration was not approved. Please speak with your ICT teacher.');
      } else if (err.code === 'auth/user-not-found' || (err.message && err.message.includes('Account not found'))) {
        setError(`ACCOUNT_NOT_FOUND:${studentId.trim()}`);
      } else if (err.code === 'auth/wrong-password') {
        setError(`Incorrect password for "${studentId.trim()}". Please check your password and try again.`);
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid User ID or Password. Please check your credentials and try again.');
      } else {
        setError(getAuthErrorMessage(err, 'Error signing in.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingNotice(null);
    setResetSuccessNotice(null);
    if (!studentId.trim() || !password.trim() || !name.trim() || !email.trim()) {
      setError('Please fill in Student Name, Email, User ID, and Password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await registerStudentAccount(
        studentId,
        password,
        name,
        classSection,
        school,
        'student'
        ,
        {
          email,
          createAuthCredential: true
        }
      );
      setMode('login');
      setPendingNotice(`⏳ Student Account Created for "${studentId}"! Your account registration is PENDING approval. Your ICT teacher must approve your account in the Teacher Portal before you can log in.`);
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError(`User ID "${studentId}" is already registered. Please login instead.`);
      } else if (err.message && err.message.includes('TEACHER_REGISTRATION_DISABLED')) {
        setError('Teacher accounts must be provisioned separately by an administrator.');
      } else {
        setError(getAuthErrorMessage(err, 'Error creating account.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPendingNotice(null);
    setResetSuccessNotice(null);

    if (!studentId.trim()) {
      setError('Please enter your User ID to receive a reset link.');
      return;
    }

    setLoading(true);
    try {
      const result = await sendStudentPasswordResetLink(studentId);

      setMode('login');
      setPassword('');
      setResetSuccessNotice(`✅ Password reset link sent to ${result.emailMasked}. Please check your inbox.`);
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/user-not-found') {
        setError(`No account found for User ID "${studentId.trim()}".`);
      } else if (err?.code === 'auth/operation-not-allowed') {
        setError('Password reset link is unavailable for this account in the current mode.');
      } else if (err?.code === 'auth/invalid-credential') {
        setError('No valid recovery email found for this account. Contact your teacher/admin.');
      } else {
        setError(getAuthErrorMessage(err, 'Could not reset password. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
      onClick={() => {
        if (!isMandatory) onClose();
      }}
      aria-hidden="true"
    >
      <div
        className="bg-[#FDFCF0] border-4 border-[#1A1A1A] rounded-3xl w-full max-w-md p-6 shadow-[8px_8px_0px_0px_#1A1A1A] relative"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Authentication"
      >
        {/* Close Button */}
        {!isMandatory && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-white border-2 border-[#1A1A1A] rounded-full hover:bg-red-100 transition-colors cursor-pointer"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        )}

        {/* If Logged In */}
        {currentUser ? (
          <div className="space-y-5 text-center">
            <div className="w-16 h-16 bg-white border-3 border-[#1A1A1A] rounded-2xl mx-auto flex items-center justify-center shadow-[4px_4px_0px_0px_#1A1A1A] overflow-hidden">
              <Logo />
            </div>

            <div>
              <div className="inline-block bg-[#6D071A] text-amber-200 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase mb-1">
                Active Account
              </div>
              <h3 className="text-xl font-black text-[#1A1A1A] font-serif">{currentUser.name}</h3>
              <p className="text-xs font-bold text-gray-600 mt-0.5">
                User ID: <span className="font-mono text-[#6D071A]">{currentUser.studentId}</span> ({currentUser.classSection} • {currentUser.school})
              </p>
            </div>

            {/* Account Credentials Card */}
            <div className="bg-white border-2 border-[#1A1A1A] rounded-2xl p-4 text-left shadow-[3px_3px_0px_0px_#1A1A1A] space-y-2">
              <div className="flex items-center justify-between text-xs border-b pb-2">
                <span className="font-bold text-gray-500">Account Role:</span>
                <span className={`font-black px-2 py-0.5 rounded text-[10px] uppercase ${currentUser.role === 'teacher' ? 'bg-[#6D071A] text-amber-200' : 'bg-amber-100 text-amber-900'}`}>
                  {currentUser.role === 'teacher' ? '👩‍🏫 Teacher / Educator' : '🎓 Class 10 Student'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-b pb-2">
                <span className="font-bold text-gray-500">Firebase User ID:</span>
                <span className="font-mono text-gray-800 font-semibold">{currentUser.studentId}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-b pb-2">
                <span className="font-bold text-gray-500">Class & Section:</span>
                <span className="font-bold text-gray-800">{currentUser.classSection}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-500">Total Experience:</span>
                <span className="font-extrabold text-[#6D071A]">{currentUser.xp} XP</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  onLogout();
                  onClose();
                }}
                className="flex-1 py-2.5 bg-red-600 text-white font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-amber-400 cursor-pointer"
              >
                Continue Learning
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <div className="space-y-4">
            <div className="text-center">
              {/* Logo Emblem */}
              <div className="w-20 h-20 mx-auto mb-2.5 bg-white rounded-2xl border-2 border-[#1A1A1A] p-2 shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center">
                <Logo />
              </div>
              <div className="inline-flex items-center gap-1.5 bg-[#6D071A] text-amber-200 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-amber-300/30 shadow-xs">
                <GraduationCap className="w-3.5 h-3.5 text-amber-300" /> Class 10 ICT Online Learning Platform
              </div>
              <h3 className="text-2xl font-black text-[#1A1A1A] font-serif tracking-tight">
                {mode === 'login' ? 'Student & Teacher Login' : mode === 'register' ? 'Register New Student' : 'Reset Student Password'}
              </h3>
              <p className="text-xs font-medium text-gray-600 mt-1 max-w-xs mx-auto">
                {mode === 'login'
                  ? 'Access your saved quest progress, XP & badges across devices.'
                  : mode === 'register'
                  ? 'Create a student login account for Class 10 ICT Tutor.'
                  : 'Verify your student account details and set a new password.'}
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); setResetSuccessNotice(null); }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] border border-[#1A1A1A]'
                    : 'text-gray-600 hover:text-[#1A1A1A]'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" /> Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); setResetSuccessNotice(null); }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-[#FFCC33] text-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] border border-[#1A1A1A]'
                    : 'text-gray-600 hover:text-[#1A1A1A]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" /> Create Account
              </button>
            </div>

            {pendingNotice && (
              <div className="p-3.5 bg-amber-100 border-2 border-amber-500 rounded-2xl text-amber-900 text-xs font-bold leading-relaxed flex items-start gap-2 shadow-[2px_2px_0px_0px_#1A1A1A]">
                <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-[#6D071A] uppercase tracking-wider text-[10px]">Admin Approval Required</div>
                  <div>{pendingNotice}</div>
                </div>
              </div>
            )}

            {resetSuccessNotice && (
              <div className="p-3.5 bg-emerald-100 border-2 border-emerald-500 rounded-2xl text-emerald-900 text-xs font-bold leading-relaxed flex items-start gap-2 shadow-[2px_2px_0px_0px_#1A1A1A]">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>{resetSuccessNotice}</div>
              </div>
            )}

            {error && error.startsWith('ACCOUNT_NOT_FOUND:') && (
              <div className="p-3.5 bg-amber-50 border-2 border-amber-500 rounded-2xl text-amber-900 text-xs font-bold space-y-2.5 shadow-[2px_2px_0px_0px_#1A1A1A]">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-extrabold text-[#6D071A] uppercase tracking-wider text-[10px]">Account Not Found</div>
                    <div>No account registered for User ID <span className="font-mono underline text-[#6D071A]">{error.split('ACCOUNT_NOT_FOUND:')[1]}</span>. Would you like to create it now?</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const id = error.split('ACCOUNT_NOT_FOUND:')[1] || studentId;
                    setMode('register');
                    setError(null);
                    setStudentId(id);
                    if (!name) {
                      const cleanName = id.split('.')[0] ? id.split('.')[0].charAt(0).toUpperCase() + id.split('.')[0].slice(1) : id;
                      setName(cleanName);
                    }
                  }}
                  className="w-full py-2 bg-[#FFCC33] text-[#1A1A1A] font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-amber-400 cursor-pointer flex items-center justify-center gap-1.5 transition-transform active:scale-98"
                >
                  <UserPlus className="w-4 h-4" /> Switch to Create Account for "{error.split('ACCOUNT_NOT_FOUND:')[1]}"
                </button>
              </div>
            )}

            {error && !error.startsWith('ACCOUNT_NOT_FOUND:') && (
              <div className="p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-800 text-xs font-bold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={mode === 'login' ? handleLogin : mode === 'register' ? handleRegister : handleForgotPassword} className="space-y-3.5">
              {mode === 'register' && (
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">
                      Student Full Name
                    </label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Tashi Dorji"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border-2 border-[#1A1A1A] pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">
                      Recovery Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border-2 border-[#1A1A1A] pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-black uppercase text-gray-700 mb-1">
                  User ID / Account ID
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={mode === 'register' ? 'e.g. tashi.10a' : 'e.g. tashi.10a or teacher.guna'}
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full bg-white border-2 border-[#1A1A1A] pl-9 pr-3 py-2.5 rounded-xl text-xs font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-500 font-medium mt-1">
                  {mode === 'login'
                    ? 'Use student ID (e.g. tashi.10a) or teacher ID (e.g. teacher.guna)'
                    : mode === 'forgot'
                    ? 'Enter your registered student ID (e.g. tashi.10a).'
                    : 'Unique ID assigned by your ICT teacher.'}
                </p>
              </div>

              {mode === 'forgot' && (
                <div className="text-[11px] text-gray-600 bg-amber-50 border border-amber-300 rounded-xl p-2.5 font-semibold">
                  A password reset link will be sent to your registered recovery email.
                </div>
              )}

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[11px] font-black uppercase text-gray-700">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError(null);
                          setPendingNotice(null);
                          setResetSuccessNotice(null);
                        }}
                        className="text-[11px] font-extrabold text-[#6D071A] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] pl-9 pr-10 py-2.5 rounded-xl text-xs font-bold text-[#1A1A1A] focus:outline-none focus:ring-2 focus:ring-[#FFCC33]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1A1A1A] cursor-pointer transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {mode === 'register' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">
                      Class Section
                    </label>
                    <select
                      value={classSection}
                      onChange={(e) => setClassSection(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] p-2 rounded-xl text-xs font-bold"
                    >
                      <option value="10-A">10-A</option>
                      <option value="10-B">10-B</option>
                      <option value="10-C">10-C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-700 mb-1">
                      School
                    </label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full bg-white border-2 border-[#1A1A1A] p-2 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#6D071A] text-white font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#FFCC33] hover:bg-[#80091F] disabled:opacity-50 cursor-pointer transition-all active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_#FFCC33] flex items-center justify-center gap-2 mt-1"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : mode === 'login' ? (
                  <>
                    <KeyRound className="w-4 h-4 text-amber-300" />
                    <span>Log In to Account</span>
                  </>
                ) : mode === 'forgot' ? (
                  <>
                    <Mail className="w-4 h-4 text-amber-300" />
                    <span>Send Reset Link</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-amber-300" />
                    <span>Register Student Account</span>
                  </>
                )}
              </button>

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="w-full py-2.5 bg-white text-[#1A1A1A] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] hover:bg-amber-50 cursor-pointer"
                >
                  Back to Login
                </button>
              )}
            </form>
          </div>
        )}

        {/* Developer Attribution Footer */}
        <div className="mt-5 pt-3.5 border-t border-gray-300/80 text-center space-y-1">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-white/90 border border-gray-300/80 rounded-full shadow-xs text-xs font-bold text-gray-800">
            <span className="w-2 h-2 rounded-full bg-[#6D071A] animate-pulse"></span>
            <span>Developed by <strong className="text-[#6D071A] font-black">Guna Raj Kuikel</strong></span>
            <span className="text-gray-300">•</span>
            <span className="text-gray-600 font-bold">ICT Teacher</span>
          </div>
          <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest pt-0.5">
            © 2026 Class 10 ICT Quest
          </div>
        </div>
      </div>
    </div>
  );
};
