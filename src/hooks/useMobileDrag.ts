import { useState, useRef, useCallback, useEffect } from 'react';

interface UseMobileDragOptions {
    onDragStart?: () => void;
    onDragEnd?: () => void;
    longPressDuration?: number;
    enabled?: boolean;
}

interface UseMobileDragReturn {
    isDragMode: boolean;
    isLongPressing: boolean;
    handlers: {
        onTouchStart: (e: React.TouchEvent) => void;
        onTouchMove: (e: React.TouchEvent) => void;
        onTouchEnd: (e: React.TouchEvent) => void;
        onPointerDown: (e: React.PointerEvent) => void;
    };
    triggerHaptic: () => void;
}

/**
 * Mobile-optimized drag hook with long-press activation and haptic feedback.
 * 
 * Features:
 * - Long-press (400ms default) to enter drag mode
 * - Haptic vibration feedback on drag start
 * - Touch-friendly with proper event handling
 * - Auto-cleanup on unmount
 */
export function useMobileDrag({
    onDragStart,
    onDragEnd,
    longPressDuration = 400,
    enabled = true,
}: UseMobileDragOptions = {}): UseMobileDragReturn {
    const [isDragMode, setIsDragMode] = useState(false);
    const [isLongPressing, setIsLongPressing] = useState(false);

    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const initialTouch = useRef<{ x: number; y: number } | null>(null);
    const hasMoved = useRef(false);

    // Haptic feedback helper
    const triggerHaptic = useCallback(() => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50);
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
            }
        };
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (!enabled) return;

        const touch = e.touches[0];
        initialTouch.current = { x: touch.clientX, y: touch.clientY };
        hasMoved.current = false;

        // Start long-press timer
        longPressTimer.current = setTimeout(() => {
            if (!hasMoved.current) {
                setIsLongPressing(true);
                setIsDragMode(true);
                triggerHaptic();
                onDragStart?.();
            }
        }, longPressDuration);
    }, [enabled, longPressDuration, onDragStart, triggerHaptic]);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!initialTouch.current) return;

        const touch = e.touches[0];
        const deltaX = Math.abs(touch.clientX - initialTouch.current.x);
        const deltaY = Math.abs(touch.clientY - initialTouch.current.y);

        // If moved more than 10px, cancel long-press (allow scrolling)
        if (deltaX > 10 || deltaY > 10) {
            hasMoved.current = true;
            if (longPressTimer.current && !isDragMode) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }
        }
    }, [isDragMode]);

    const handleTouchEnd = useCallback(() => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }

        if (isDragMode) {
            onDragEnd?.();
        }

        setIsLongPressing(false);
        setIsDragMode(false);
        initialTouch.current = null;
        hasMoved.current = false;
    }, [isDragMode, onDragEnd]);

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (!enabled) return;

        // For mouse/stylus, trigger drag immediately on pointer down
        if (e.pointerType !== 'touch') {
            triggerHaptic();
            onDragStart?.();
        }
    }, [enabled, onDragStart, triggerHaptic]);

    return {
        isDragMode,
        isLongPressing,
        handlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
            onPointerDown: handlePointerDown,
        },
        triggerHaptic,
    };
}

export default useMobileDrag;
