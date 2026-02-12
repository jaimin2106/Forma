import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CookiePreferencesModal } from './CookiePreferencesModal';
import {
    hasConsent,
    acceptAllCookies,
    rejectNonEssential,
    savePreferences,
    getStoredConsent
} from './cookieConsentUtils';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Check consent on mount
    useEffect(() => {
        // Small delay to prevent flash on page load
        const timer = setTimeout(() => {
            if (!hasConsent()) {
                setIsVisible(true);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const handleAcceptAll = () => {
        acceptAllCookies();
        setIsVisible(false);
        // Trigger analytics initialization if needed
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: { analytics: true, functional: true, marketing: true }
        }));
    };

    const handleReject = () => {
        rejectNonEssential();
        setIsVisible(false);
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', {
            detail: { analytics: false, functional: false, marketing: false }
        }));
    };

    const handleSavePreferences = (preferences: {
        analytics: boolean;
        functional: boolean;
        marketing: boolean;
    }) => {
        savePreferences(preferences);
        setIsVisible(false);
        window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: preferences }));
    };

    const getCurrentPreferences = () => {
        const consent = getStoredConsent();
        if (consent) {
            return {
                analytics: consent.analytics,
                functional: consent.functional,
                marketing: consent.marketing
            };
        }
        return { analytics: false, functional: false, marketing: false };
    };

    return (
        <>
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        role="dialog"
                        aria-label="Cookie consent banner"
                        aria-describedby="cookie-banner-description"
                        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                    >
                        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                            <div className="p-6 md:p-8">
                                {/* Header */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Cookie className="w-6 h-6 text-violet-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-1">
                                            We value your privacy
                                        </h2>
                                        <p id="cookie-banner-description" className="text-gray-600 text-sm">
                                            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.
                                            You can choose to accept all cookies or customize your preferences.{' '}
                                            <Link
                                                to="/privacy"
                                                className="text-violet-600 hover:text-violet-700 inline-flex items-center gap-1 font-medium"
                                            >
                                                Learn more
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </p>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                                    <Button
                                        onClick={() => setIsModalOpen(true)}
                                        variant="ghost"
                                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl order-3 sm:order-1"
                                        aria-haspopup="dialog"
                                    >
                                        Manage Preferences
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        variant="outline"
                                        className="rounded-xl order-2"
                                    >
                                        Reject Non-Essential
                                    </Button>
                                    <Button
                                        onClick={handleAcceptAll}
                                        className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl order-1 sm:order-3"
                                    >
                                        Accept All Cookies
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Preferences Modal */}
            <CookiePreferencesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePreferences}
                initialPreferences={getCurrentPreferences()}
            />
        </>
    );
};

// Hook to check if a specific cookie category is allowed
export const useCookieConsent = () => {
    const [consent, setConsent] = useState(getStoredConsent());

    useEffect(() => {
        const handleConsentUpdate = (e: CustomEvent) => {
            setConsent(getStoredConsent());
        };

        window.addEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
        return () => window.removeEventListener('cookieConsentUpdated', handleConsentUpdate as EventListener);
    }, []);

    return {
        hasConsent: consent !== null,
        analytics: consent?.analytics ?? false,
        functional: consent?.functional ?? false,
        marketing: consent?.marketing ?? false,
        essential: true // Always true
    };
};
