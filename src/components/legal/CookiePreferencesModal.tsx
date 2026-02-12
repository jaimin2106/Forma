import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield, BarChart3, Settings, Megaphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CookiePreferencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (preferences: {
        analytics: boolean;
        functional: boolean;
        marketing: boolean;
    }) => void;
    initialPreferences?: {
        analytics: boolean;
        functional: boolean;
        marketing: boolean;
    };
}

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    disabled?: boolean;
    label: string;
}

const ToggleSwitch = ({ enabled, onChange, disabled = false, label }: ToggleSwitchProps) => (
    <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!enabled)}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${disabled
                ? 'bg-violet-400 cursor-not-allowed'
                : enabled
                    ? 'bg-violet-600 hover:bg-violet-700'
                    : 'bg-gray-200 hover:bg-gray-300'
            }`}
    >
        <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
        />
    </button>
);

interface CookieCategoryProps {
    icon: React.ElementType;
    title: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
    required?: boolean;
    color: string;
}

const CookieCategory = ({
    icon: Icon,
    title,
    description,
    enabled,
    onChange,
    required = false,
    color
}: CookieCategoryProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border-2 transition-all duration-200 ${enabled || required
                ? 'border-violet-200 bg-violet-50/50'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
    >
        <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3 flex-1">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900">{title}</h4>
                        {required && (
                            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-medium">
                                Required
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                </div>
            </div>
            <div className="flex-shrink-0">
                {required ? (
                    <div className="flex items-center gap-1.5 text-violet-600">
                        <Check className="w-4 h-4" />
                        <span className="text-xs font-medium">Always On</span>
                    </div>
                ) : (
                    <ToggleSwitch
                        enabled={enabled}
                        onChange={onChange}
                        label={`Toggle ${title}`}
                    />
                )}
            </div>
        </div>
    </motion.div>
);

export const CookiePreferencesModal = ({
    isOpen,
    onClose,
    onSave,
    initialPreferences = { analytics: false, functional: false, marketing: false }
}: CookiePreferencesModalProps) => {
    const [preferences, setPreferences] = useState(initialPreferences);
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Focus trap and keyboard handling
    useEffect(() => {
        if (isOpen) {
            closeButtonRef.current?.focus();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Reset preferences when modal opens
    useEffect(() => {
        if (isOpen) {
            setPreferences(initialPreferences);
        }
    }, [isOpen, initialPreferences]);

    const handleSave = () => {
        onSave(preferences);
        onClose();
    };

    const handleAcceptAll = () => {
        onSave({ analytics: true, functional: true, marketing: true });
        onClose();
    };

    const handleRejectAll = () => {
        onSave({ analytics: false, functional: false, marketing: false });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cookie-preferences-title"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-violet-600 to-violet-700 p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                        <Cookie className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h2 id="cookie-preferences-title" className="text-xl font-bold">
                                            Cookie Preferences
                                        </h2>
                                        <p className="text-violet-100 text-sm">
                                            Customize your privacy settings
                                        </p>
                                    </div>
                                </div>
                                <button
                                    ref={closeButtonRef}
                                    onClick={onClose}
                                    className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                    aria-label="Close cookie preferences"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 max-h-[50vh] overflow-y-auto">
                            <p className="text-sm text-gray-600 mb-5">
                                We use cookies to enhance your browsing experience. Essential cookies are always
                                active as they're necessary for the site to function properly.
                            </p>

                            <div className="space-y-3">
                                <CookieCategory
                                    icon={Shield}
                                    title="Essential Cookies"
                                    description="Required for authentication, security, and core functionality."
                                    enabled={true}
                                    onChange={() => { }}
                                    required
                                    color="#7c3aed"
                                />
                                <CookieCategory
                                    icon={BarChart3}
                                    title="Analytics Cookies"
                                    description="Help us understand how you use our site to improve your experience."
                                    enabled={preferences.analytics}
                                    onChange={(enabled) => setPreferences(p => ({ ...p, analytics: enabled }))}
                                    color="#3b82f6"
                                />
                                <CookieCategory
                                    icon={Settings}
                                    title="Functional Cookies"
                                    description="Remember your preferences and settings across visits."
                                    enabled={preferences.functional}
                                    onChange={(enabled) => setPreferences(p => ({ ...p, functional: enabled }))}
                                    color="#10b981"
                                />
                                <CookieCategory
                                    icon={Megaphone}
                                    title="Marketing Cookies"
                                    description="Used to measure campaigns and personalize advertising."
                                    enabled={preferences.marketing}
                                    onChange={(enabled) => setPreferences(p => ({ ...p, marketing: enabled }))}
                                    color="#f59e0b"
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={handleRejectAll}
                                    variant="ghost"
                                    className="flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
                                >
                                    Reject All
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    variant="outline"
                                    className="flex-1 rounded-xl border-violet-200 text-violet-700 hover:bg-violet-50"
                                >
                                    Save Preferences
                                </Button>
                                <Button
                                    onClick={handleAcceptAll}
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-lg shadow-violet-200"
                                >
                                    Accept All
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
