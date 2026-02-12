import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, KeyRound, Loader2, Check, AlertCircle, ArrowLeft } from 'lucide-react';
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

export default function ResetPassword() {
    const navigate = useNavigate();
    const { updatePassword, user, loading: authLoading } = useAuth();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState({ password: false, confirmPassword: false });

    useEffect(() => {
        if (!authLoading && !user) {
            // If not authenticated (link invalid or expired), redirect to login
            navigate('/auth', { replace: true });
        }
    }, [user, authLoading, navigate]);

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
    const doPasswordsMatch = password === confirmPassword;

    const confirmPasswordError = !doPasswordsMatch && touched.confirmPassword && confirmPassword.length > 0
        ? 'Passwords do not match'
        : '';

    const isFormValid = isPasswordValid && doPasswordsMatch;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ password: true, confirmPassword: true });

        if (!isPasswordValid) {
            toast({ title: "Weak Password", description: "Password must meet all security criteria.", variant: "destructive" });
            return;
        }
        if (!doPasswordsMatch) {
            toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const { error } = await updatePassword(password);
            if (error) {
                toast({ title: "Error", description: error.message, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Your password has been updated." });
                navigate('/dashboard', { replace: true });
            }
        } catch {
            toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <BackgroundGraphics />
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
                    <p className="text-slate-600">Verifying link...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
            <div className="absolute top-6 left-6 z-20">
                <Link to="/auth">
                    <Button variant="ghost" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-white/40 backdrop-blur-sm transition-all rounded-full pl-3 pr-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Button>
                </Link>
            </div>
            <BackgroundGraphics />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-3xl p-8"
            >
                <div className="mb-6">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Set New Password</h1>
                    <p className="text-gray-600 mt-2 text-sm">
                        Please enter a new password for your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <FloatingInput
                            id="password"
                            label="New Password"
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

                    <AnimatePresence>
                        {password.length > 0 && (
                            <PasswordStrengthIndicator
                                criteria={passwordCriteria}
                                show={true}
                            />
                        )}
                    </AnimatePresence>

                    <FloatingInput
                        id="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setTouched(t => ({ ...t, confirmPassword: true })); }}
                        icon={KeyRound}
                        error={confirmPasswordError}
                        isValid={doPasswordsMatch && confirmPassword.length > 0}
                        showValidation={touched.confirmPassword}
                    />

                    <Button
                        type="submit"
                        disabled={loading || !isFormValid}
                        className="w-full bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-base py-3.5 rounded-xl transition-all mt-4"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating Password...
                            </span>
                        ) : (
                            'Update Password'
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
}
