import { useEffect, useCallback, useRef } from 'react';

interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    description?: string;
}

interface UseKeyboardShortcutsOptions {
    enabled?: boolean;
    // Prevent shortcuts when focus is in these elements
    ignoreFormElements?: boolean;
}

/**
 * Custom hook for centralized keyboard shortcut handling in the form builder.
 * Prevents conflicts with input fields and provides a clean API for registering shortcuts.
 */
export function useKeyboardShortcuts(
    shortcuts: ShortcutConfig[],
    options: UseKeyboardShortcutsOptions = {}
) {
    const { enabled = true, ignoreFormElements = true } = options;
    const shortcutsRef = useRef(shortcuts);

    // Keep shortcuts ref updated
    useEffect(() => {
        shortcutsRef.current = shortcuts;
    }, [shortcuts]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (!enabled) return;

        // Ignore when typing in form elements
        if (ignoreFormElements) {
            const target = event.target as HTMLElement;
            const tagName = target.tagName.toLowerCase();
            const isEditable = target.isContentEditable;
            const isFormElement = ['input', 'textarea', 'select'].includes(tagName);

            if (isEditable || isFormElement) {
                // Allow Escape and some shortcuts even in form elements
                if (event.key !== 'Escape' && !(event.ctrlKey || event.metaKey)) {
                    return;
                }
            }
        }

        for (const shortcut of shortcutsRef.current) {
            const ctrlMatch = shortcut.ctrl
                ? (event.ctrlKey || event.metaKey)
                : !(event.ctrlKey || event.metaKey);
            const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
            const altMatch = shortcut.alt ? event.altKey : !event.altKey;
            const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

            if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                event.preventDefault();
                event.stopPropagation();
                shortcut.action();
                return;
            }
        }
    }, [enabled, ignoreFormElements]);

    useEffect(() => {
        if (enabled) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [enabled, handleKeyDown]);

    return { enabled };
}

/**
 * Hook specifically for builder question shortcuts
 */
export function useBuilderShortcuts({
    onAddQuestion,
    onDeleteQuestion,
    onDuplicateQuestion,
    onMoveUp,
    onMoveDown,
    onUndo,
    onRedo,
    activeQuestionIndex,
    questionsCount,
    enabled = true,
}: {
    onAddQuestion: () => void;
    onDeleteQuestion: () => void;
    onDuplicateQuestion: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onUndo: () => void;
    onRedo: () => void;
    activeQuestionIndex: number;
    questionsCount: number;
    enabled?: boolean;
}) {
    const shortcuts: ShortcutConfig[] = [
        {
            key: 'a',
            action: onAddQuestion,
            description: 'Add new question',
        },
        {
            key: 'd',
            ctrl: true,
            action: () => {
                if (activeQuestionIndex >= 0) {
                    onDuplicateQuestion();
                }
            },
            description: 'Duplicate selected question',
        },
        {
            key: 'Delete',
            action: () => {
                if (activeQuestionIndex >= 0) {
                    onDeleteQuestion();
                }
            },
            description: 'Delete selected question',
        },
        {
            key: 'Backspace',
            action: () => {
                if (activeQuestionIndex >= 0) {
                    onDeleteQuestion();
                }
            },
            description: 'Delete selected question',
        },
        {
            key: 'ArrowUp',
            shift: true,
            action: () => {
                if (activeQuestionIndex > 0) {
                    onMoveUp();
                }
            },
            description: 'Move question up',
        },
        {
            key: 'ArrowDown',
            shift: true,
            action: () => {
                if (activeQuestionIndex < questionsCount - 1) {
                    onMoveDown();
                }
            },
            description: 'Move question down',
        },
        {
            key: 'z',
            ctrl: true,
            action: onUndo,
            description: 'Undo',
        },
        {
            key: 'z',
            ctrl: true,
            shift: true,
            action: onRedo,
            description: 'Redo',
        },
    ];

    return useKeyboardShortcuts(shortcuts, { enabled });
}

export default useKeyboardShortcuts;
