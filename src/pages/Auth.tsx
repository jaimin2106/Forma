import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Eye, EyeOff, CheckCircle, Mail, KeyRound, User, Edit3, BarChart2, GitMerge, ArrowLeft } from 'lucide-react';
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


// --- Floating Label Input ---
const FloatingInput = ({ id, label, type = 'text', value, onChange, icon: Icon }: { id: string, label: string, type?: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, icon: React.ElementType }) => (
    <div className="relative">
        <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder=" " // Important: needs a space for the CSS to work
            className="block w-full px-4 py-3 text-sm text-gray-900 bg-transparent rounded-lg border-2 border-slate-300 appearance-none focus:outline-none focus:ring-0 focus:border-violet-600 peer pl-11"
        />
        <label
            htmlFor={id}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 left-9 peer-focus:px-2 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
            {label}
        </label>
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
    </div>
);


// --- Main Auth Component ---
export default function Auth() {
    // ... All state and logic remains the same ...
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { user, signIn, signUp } = useAuth();
    if (user) { return <Navigate to="/dashboard" replace />; }
    const getPasswordCriteria = () => ({ length: password.length >= 8, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /\d/.test(password), special: /[!@#$%^&*(),.?":{}|<>]/.test(password) });
    const isPasswordValid = () => Object.values(getPasswordCriteria()).every(Boolean);
    const isEmailValid = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!isEmailValid()) { toast({ title: "Invalid Email", description: "Please enter a valid email.", variant: "destructive" }); return; } if (!isLogin) { if (!isPasswordValid()) { toast({ title: "Weak Password", description: "Password must meet all criteria.", variant: "destructive" }); return; } if (password !== confirmPassword) { toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" }); return; } } setLoading(true); try { const { error } = isLogin ? await signIn(email, password) : await signUp(email, password); if (error) { toast({ title: "Authentication Error", description: error.message, variant: "destructive" }); } else { isLogin ? toast({ title: "Welcome back!", description: "You have successfully signed in." }) : setEmailSent(true); } } catch (error) { toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" }); } finally { setLoading(false); } };


    const formVariants = {
        initial: { opacity: 0, x: isLogin ? -50 : 50 },
        animate: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 200, damping: 25 } },
        exit: { opacity: 0, x: isLogin ? 50 : -50, transition: { duration: 0.2 } }
    };

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
                        <div className="w-9 h-9 bg-violet-500 rounded-lg flex items-center justify-center shadow-inner"><div className="w-4 h-4 border-2 border-white rounded-sm"></div></div>
                        <span className="text-xl font-bold text-gray-800">Forma</span>
                    </Link>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            variants={formVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <div className="mb-6">
                                <h1 className="text-3xl font-serif font-bold text-gray-900">{isLogin ? 'Welcome Back!' : 'Create Your Account'}</h1>
                                <p className="text-gray-600 mt-2 text-sm">{isLogin ? 'Log in to access your dashboard.' : 'Get started in seconds.'}</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <FloatingInput id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} />
                                <div className="relative">
                                    <FloatingInput id="password" label="Password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} icon={KeyRound} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><AnimatePresence mode="wait">{showPassword ? <EyeOff key="off" size={20} /> : <Eye key="on" size={20} />}</AnimatePresence></button>
                                </div>

                                {!isLogin && (
                                    <div className="relative">
                                        <FloatingInput id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={KeyRound} />
                                    </div>
                                )}

                                <Button type="submit" disabled={loading} className="w-full bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400 text-base py-3.5 rounded-xl">
                                    {loading ? 'Processing...' : (isLogin ? 'Log in' : 'Create Account')}
                                </Button>
                            </form>
                        </motion.div>
                    </AnimatePresence>

                    <div className="mt-6 text-center">
                        <button onClick={() => setIsLogin(!isLogin)} className="text-sm text-gray-600 hover:text-gray-900">
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
                        </button>
                    </div>
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
                    </motion.div>
                </div>
            </div>
        </div>
    );
}