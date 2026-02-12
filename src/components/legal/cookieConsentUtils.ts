// Cookie Consent Utility Functions
// ================================

export interface CookieConsent {
    essential: boolean;
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
    timestamp: number;
}

const CONSENT_KEY = 'cookieConsent';
const CONSENT_EXPIRY_DAYS = 365; // 12 months

/**
 * Get stored cookie consent from localStorage
 */
export const getStoredConsent = (): CookieConsent | null => {
    try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (!stored) return null;

        const consent: CookieConsent = JSON.parse(stored);

        // Check if consent has expired (12 months)
        const expiryTime = consent.timestamp + (CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
        if (Date.now() > expiryTime) {
            localStorage.removeItem(CONSENT_KEY);
            return null;
        }

        return consent;
    } catch {
        return null;
    }
};

/**
 * Store cookie consent in localStorage
 */
export const storeConsent = (consent: Omit<CookieConsent, 'timestamp'>): void => {
    const fullConsent: CookieConsent = {
        ...consent,
        timestamp: Date.now()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(fullConsent));
};

/**
 * Check if user has given consent
 */
export const hasConsent = (): boolean => {
    return getStoredConsent() !== null;
};

/**
 * Check if specific cookie category is allowed
 */
export const isCategoryAllowed = (category: keyof Omit<CookieConsent, 'timestamp'>): boolean => {
    const consent = getStoredConsent();
    if (!consent) return false;
    return consent[category] === true;
};

/**
 * Accept all cookies
 */
export const acceptAllCookies = (): CookieConsent => {
    const consent = {
        essential: true,
        analytics: true,
        functional: true,
        marketing: true
    };
    storeConsent(consent);
    return { ...consent, timestamp: Date.now() };
};

/**
 * Reject non-essential cookies
 */
export const rejectNonEssential = (): CookieConsent => {
    const consent = {
        essential: true,
        analytics: false,
        functional: false,
        marketing: false
    };
    storeConsent(consent);
    return { ...consent, timestamp: Date.now() };
};

/**
 * Save custom preferences
 */
export const savePreferences = (preferences: {
    analytics: boolean;
    functional: boolean;
    marketing: boolean;
}): CookieConsent => {
    const consent = {
        essential: true, // Always required
        ...preferences
    };
    storeConsent(consent);
    return { ...consent, timestamp: Date.now() };
};

/**
 * Clear consent (for testing or user request)
 */
export const clearConsent = (): void => {
    localStorage.removeItem(CONSENT_KEY);
};
