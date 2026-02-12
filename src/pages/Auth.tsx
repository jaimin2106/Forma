import { useState, useMemo, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import {
    Eye, EyeOff, CheckCircle, XCircle, Mail, KeyRound, ArrowLeft,
    Edit3, BarChart2, GitMerge, Shield, CreditCard, Clock, Loader2,
    Check, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- SVG Background Component ---
const BackgroundGraphics = () => (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
        <style>{`
            @keyframes breathing {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `}</style>
        <svg width="100%" height="100%" viewBox="0 0 1440 1024" preserveAspectRatio="xMidYMid slice" className="opacity-40">
            <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: 'rgba(139, 92, 246, 0.4)' }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(139, 92, 246, 0)' }} />
                </radialGradient>
                <radialGradient id="grad2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{ stopColor: 'rgba(59, 130, 246, 0.3)' }} />
                    <stop offset="100%" style={{ stopColor: 'rgba(59, 130, 246, 0)' }} />
                </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="#F7F9FC" />
            <motion.circle
                cx="200" cy="300" r="400" fill="url(#grad1)"
                style={{ animation: 'breathing 12s ease-in-out infinite' }}
            />
            <motion.circle
                cx="1200" cy="800" r="500" fill="url(#grad2)"
                style={{ animation: 'breathing 15s ease-in-out infinite alternate' }}
            />
        </svg>
    </div>
);

// --- Floating Label Input with Validation ---
interface FloatingInputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ElementType;
    error?: string;
    isValid?: boolean;
    showValidation?: boolean;
    ariaLabel?: string;
}

const FloatingInput = ({
    id,
    label,
    type = 'text',
    value,
    onChange,
    icon: Icon,
    error,
    isValid,
    showValidation = false,
    ariaLabel
}: FloatingInputProps) => {
    const showError = showValidation && error && value.length > 0;
    const showSuccess = showValidation && isValid && value.length > 0;

    return (
        <div className="relative">
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder=" "
                aria-label={ariaLabel || label}
                aria-invalid={showError ? "true" : "false"}
                aria-describedby={showError ? `${id}-error` : undefined}
                className={`block w-full px-4 py-3 text-sm text-gray-900 bg-transparent rounded-lg border-2 appearance-none focus:outline-none focus:ring-0 peer pl-11 pr-10 transition-colors ${showError
                    ? 'border-red-400 focus:border-red-500'
                    : showSuccess
                        ? 'border-green-400 focus:border-green-500'
                        : 'border-slate-300 focus:border-violet-600'
                    }`}
            />
            <label
                htmlFor={id}
                className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-9 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 ${showError
                    ? 'text-red-500 peer-focus:text-red-500'
                    : showSuccess
                        ? 'text-green-600 peer-focus:text-green-600'
                        : 'text-gray-500 peer-focus:text-violet-600'
                    }`}
            >
                {label}
            </label>
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />

            {/* Validation Icon */}
            {showSuccess && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
            )}
            {showError && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-400" />
            )}

            {/* Error Message */}
            {showError && (
                <p id={`${id}-error`} className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {error}
                </p>
            )}
        </div>
    );
};

// --- Password Strength Indicator ---
interface PasswordCriteria {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
}

const PasswordStrengthIndicator = ({ criteria, show }: { criteria: PasswordCriteria; show: boolean }) => {
    if (!show) return null;

    const items = [
        { key: 'length', label: 'At least 8 characters', met: criteria.length },
        { key: 'uppercase', label: 'One uppercase letter', met: criteria.uppercase },
        { key: 'lowercase', label: 'One lowercase letter', met: criteria.lowercase },
        { key: 'number', label: 'One number', met: criteria.number },
        { key: 'special', label: 'One special character', met: criteria.special },
    ];

    const metCount = Object.values(criteria).filter(Boolean).length;
    const strengthPercent = (metCount / 5) * 100;

    let strengthColor = 'bg-red-400';
    let strengthLabel = 'Weak';
    if (metCount >= 4) {
        strengthColor = 'bg-green-500';
        strengthLabel = 'Strong';
    } else if (metCount >= 3) {
        strengthColor = 'bg-yellow-500';
        strengthLabel = 'Medium';
    }

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
        >
            {/* Strength Bar */}
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-600">Password Strength</span>
                    <span className={`text-xs font-semibold ${metCount >= 4 ? 'text-green-600' : metCount >= 3 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {strengthLabel}
                    </span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        className={`h-full ${strengthColor} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${strengthPercent}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Criteria Checklist */}
            <div className="grid grid-cols-1 gap-1.5">
                {items.map(item => (
                    <div key={item.key} className="flex items-center gap-2">
                        {item.met ? (
                            <Check className="h-3.5 w-3.5 text-green-500" />
                        ) : (
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-slate-300" />
                        )}
                        <span className={`text-xs ${item.met ? 'text-green-600' : 'text-slate-500'}`}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

// --- Trust Signals Component ---
const TrustSignals = () => (
    <div className="mt-8 pt-6 border-t border-slate-200/50">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-green-500" />
                No credit card required
            </span>
            <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-violet-500" />
                14-day free trial
            </span>
            <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-blue-500" />
                SOC 2 Compliant
            </span>
        </div>
    </div>
);

// --- Main Auth Component ---
export default function Auth() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });

    const { user, signIn, signUp, resetPassword, loading: authLoading } = useAuth();

    // Handle redirect when user is authenticated
    useEffect(() => {
        if (user && !authLoading) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, authLoading, navigate]);

    // Show loading while checking initial auth state
    if (authLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <BackgroundGraphics />
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    <p className="text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is already logged in, show loading while redirecting
    if (user) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <BackgroundGraphics />
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    <p className="text-slate-600">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    // Validation functions
    const getPasswordCriteria = (): PasswordCriteria => ({
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });

    const passwordCriteria = getPasswordCriteria();
    const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const doPasswordsMatch = password === confirmPassword;

    // Form validation state
    const emailError = !isEmailValid && touched.email ? 'Please enter a valid email address' : '';
    const confirmPasswordError = !doPasswordsMatch && touched.confirmPassword && confirmPassword.length > 0
        ? 'Passwords do not match'
        : '';

    // Submit button state
    const isFormValid = useMemo(() => {
        if (isForgotPassword) {
            return isEmailValid;
        }
        if (isLogin) {
            return isEmailValid && password.length > 0;
        }
        return isEmailValid && isPasswordValid && doPasswordsMatch;
    }, [isLogin, isForgotPassword, isEmailValid, isPasswordValid, doPasswordsMatch, password.length]);

    // Handle forgot password
    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isEmailValid) {
            toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const { error } = await resetPassword(email);
            if (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } else {
                setResetEmailSent(true);
            }
        } catch {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Handle main form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true, confirmPassword: true });

        if (!isEmailValid) {
            toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
            return;
        }

        if (!isLogin) {
            if (!isPasswordValid) {
                toast({ title: "Weak Password", description: "Password must meet all security criteria.", variant: "destructive" });
                return;
            }
            if (!doPasswordsMatch) {
                toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
                return;
            }
        }

        setLoading(true);
        try {
            const { error } = isLogin
                ? await signIn(email, password)
                : await signUp(email, password);

            if (error) {
                toast({ title: "Authentication Error", description: error.message, variant: "destructive" });
            } else {
                if (isLogin) {
                    toast({ title: "Welcome back!", description: "You have successfully signed in." });
                    // Navigate directly instead of waiting for state change
                    navigate('/dashboard', { replace: true });
                } else {
                    setEmailSent(true);
                }
            }
        } catch {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const formVariants = {
        initial: { opacity: 0, x: isLogin ? -50 : 50 },
        animate: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 25 } },
        exit: { opacity: 0, x: isLogin ? 50 : -50, transition: { duration: 0.2 } }
    };

    // Reset Password Email Sent View
    if (resetEmailSent) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
                <BackgroundGraphics />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-8 text-center"
                >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
                    <p className="text-gray-600 mb-6">
                        We've sent a password reset link to <strong>{email}</strong>.
                        Click the link in the email to reset your password.
                    </p>
                    <Button
                        onClick={() => { setResetEmailSent(false); setIsForgotPassword(false); }}
                        className="w-full bg-gray-900 text-white hover:bg-gray-800"
                    >
                        Back to Login
                    </Button>
                </motion.div>
            </div>
        );
    }

    // Email Verification Sent View (for signup)
    if (emailSent) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
                <BackgroundGraphics />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-8 text-center"
                >
                    <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-violet-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your email</h2>
                    <p className="text-gray-600 mb-6">
                        We've sent a verification link to <strong>{email}</strong>.
                        Please check your inbox and click the link to activate your account.
                    </p>
                    <Button
                        onClick={() => { setEmailSent(false); setIsLogin(true); }}
                        className="w-full bg-gray-900 text-white hover:bg-gray-800"
                    >
                        Back to Login
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
            <div className="absolute top-6 left-6 z-20">
                <Link to="/">
                    <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/40 backdrop-blur-sm transition-all rounded-full pl-3 pr-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Button>
                </Link>
            </div>
            <BackgroundGraphics />

            <div className="w-full flex justify-center lg:gap-16 items-center">
                {/* Main Auth Form Card */}
                <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 150, damping: 25 }}
                    className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-8"
                >
                    <Link to="/" className="flex items-center space-x-2 mb-6">
                        <div className="w-9 h-9 bg-violet-500 rounded-lg flex items-center justify-center shadow-inner">
                            <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                        </div>
                        <span className="text-xl font-bold text-gray-800">Forma</span>
                    </Link>

                    <AnimatePresence mode="wait">
                        {isForgotPassword ? (
                            // Forgot Password Form
                            <motion.div
                                key="forgot"
                                variants={formVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className="mb-6">
                                    <h1 className="text-3xl font-serif font-bold text-gray-900">Reset Password</h1>
                                    <p className="text-gray-600 mt-2 text-sm">
                                        Enter your email and we'll send you a link to reset your password.
                                    </p>
                                </div>

                                <form onSubmit={handleForgotPassword} className="space-y-6">
                                    <FloatingInput
                                        id="reset-email"
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        icon={Mail}
                                        error={emailError}
                                        isValid={isEmailValid}
                                        showValidation={touched.email}
                                    />

                                    <Button
                                        type="submit"
                                        disabled={loading || !isEmailValid}
                                        className="w-full bg-violet-600 text-white hover:bg-violet-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-base py-3.5 rounded-xl transition-all"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            'Send Reset Link'
                                        )}
                                    </Button>
                                </form>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setIsForgotPassword(false)}
                                        className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                    >
                                        ← Back to Login
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            // Login / Signup Form
                            <motion.div
                                key={isLogin ? 'login' : 'signup'}
                                variants={formVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                            >
                                <div className="mb-6">
                                    <h1 className="text-3xl font-serif font-bold text-gray-900">
                                        {isLogin ? 'Welcome Back!' : 'Create Your Account'}
                                    </h1>
                                    <p className="text-gray-600 mt-2 text-sm">
                                        {isLogin ? 'Log in to access your dashboard.' : 'Get started in seconds — no credit card required.'}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <FloatingInput
                                        id="email"
                                        label="Email Address"
                                        type="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value); setTouched(t => ({ ...t, email: true })); }}
                                        icon={Mail}
                                        error={emailError}
                                        isValid={isEmailValid}
                                        showValidation={touched.email}
                                    />

                                    <div className="relative">
                                        <FloatingInput
                                            id="password"
                                            label="Password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => { setPassword(e.target.value); setTouched(t => ({ ...t, password: true })); }}
                                            icon={KeyRound}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>

                                    {/* Forgot Password Link - Login Only */}
                                    {isLogin && (
                                        <div className="text-right -mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setIsForgotPassword(true)}
                                                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}

                                    {/* Password Strength Indicator - Signup Only */}
                                    <AnimatePresence>
                                        {!isLogin && password.length > 0 && (
                                            <PasswordStrengthIndicator
                                                criteria={passwordCriteria}
                                                show={true}
                                            />
                                        )}
                                    </AnimatePresence>

                                    {/* Confirm Password - Signup Only */}
                                    {!isLogin && (
                                        <FloatingInput
                                            id="confirmPassword"
                                            label="Confirm Password"
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value); setTouched(t => ({ ...t, confirmPassword: true })); }}
                                            icon={KeyRound}
                                            error={confirmPasswordError}
                                            isValid={doPasswordsMatch && confirmPassword.length > 0}
                                            showValidation={touched.confirmPassword}
                                        />
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={loading || !isFormValid}
                                        className="w-full bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-base py-3.5 rounded-xl transition-all mt-2"
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                {isLogin ? 'Signing in...' : 'Creating account...'}
                                            </span>
                                        ) : (
                                            isLogin ? 'Log in' : 'Create Account'
                                        )}
                                    </Button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Toggle Login/Signup */}
                    {!isForgotPassword && (
                        <div className="mt-6 text-center">
                            <span className="text-sm text-gray-500">
                                {isLogin ? "Don't have an account? " : "Already have an account? "}
                            </span>
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                            >
                                {isLogin ? 'Sign up' : 'Log in'}
                            </button>
                        </div>
                    )}

                    {/* Trust Signals */}
                    <TrustSignals />
                </motion.div>

                {/* Right Side "Benefits" Panel - Desktop Only */}
                <div className="hidden lg:block w-full max-w-md">
                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                        <h2 className="text-4xl font-serif font-bold text-gray-900 leading-tight">
                            More than a form. It's a conversation.
                        </h2>
                        <div className="mt-8 space-y-6">
                            {[
                                { icon: Edit3, title: 'Intuitive Builder', text: 'Create beautiful, logic-driven forms in minutes.' },
                                { icon: BarChart2, title: 'Powerful Analytics', text: 'Turn your data into actionable, easy-to-understand insights.' },
                                { icon: GitMerge, title: 'Seamless Integrations', text: 'Connect with the tools you already use and love.' },
                            ].map(item => (
                                <div key={item.title} className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-md flex-shrink-0 flex items-center justify-center">
                                        <item.icon className="w-6 h-6 text-violet-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                                        <p className="text-gray-600 text-sm">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Additional Trust Signals for Desktop */}
                        <div className="mt-10 p-5 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80">
                            <div className="flex items-center gap-3 mb-3">
                                <Shield className="h-5 w-5 text-green-600" />
                                <span className="font-semibold text-gray-800">Enterprise Security</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                SOC 2 Type II certified, GDPR compliant, and trusted by 10,000+ companies worldwide.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}