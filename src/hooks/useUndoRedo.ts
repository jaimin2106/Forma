import { useState, useCallback, useRef } from 'react';

interface HistoryEntry<T> {
    state: T;
    timestamp: number;
    action: string;
}

interface UseUndoRedoOptions {
    maxHistory?: number;
}

/**
 * Custom hook for undo/redo history management.
 * Stores up to maxHistory states and provides undo/redo functionality.
 */
export function useUndoRedo<T>(
    initialState: T,
    options: UseUndoRedoOptions = {}
) {
    const { maxHistory = 50 } = options;

    const [state, setState] = useState<T>(initialState);
    const historyRef = useRef<HistoryEntry<T>[]>([
        { state: initialState, timestamp: Date.now(), action: 'initial' }
    ]);
    const indexRef = useRef(0);
    const isUndoRedoRef = useRef(false);

    const pushState = useCallback((newState: T, action: string = 'update') => {
        if (isUndoRedoRef.current) {
            isUndoRedoRef.current = false;
            return;
        }

        // Trim any redo history
        historyRef.current = historyRef.current.slice(0, indexRef.current + 1);

        // Add new entry
        historyRef.current.push({
            state: newState,
            timestamp: Date.now(),
            action,
        });

        // Limit history size
        if (historyRef.current.length > maxHistory) {
            historyRef.current = historyRef.current.slice(-maxHistory);
        }

        indexRef.current = historyRef.current.length - 1;
        setState(newState);
    }, [maxHistory]);

    const undo = useCallback(() => {
        if (indexRef.current > 0) {
            isUndoRedoRef.current = true;
            indexRef.current -= 1;
            const previousState = historyRef.current[indexRef.current].state;
            setState(previousState);
            return previousState;
        }
        return state;
    }, [state]);

    const redo = useCallback(() => {
        if (indexRef.current < historyRef.current.length - 1) {
            isUndoRedoRef.current = true;
            indexRef.current += 1;
            const nextState = historyRef.current[indexRef.current].state;
            setState(nextState);
            return nextState;
        }
        return state;
    }, [state]);

    const canUndo = indexRef.current > 0;
    const canRedo = indexRef.current < historyRef.current.length - 1;

    const reset = useCallback((newInitialState: T) => {
        historyRef.current = [
            { state: newInitialState, timestamp: Date.now(), action: 'reset' }
        ];
        indexRef.current = 0;
        setState(newInitialState);
    }, []);

    return {
        state,
        pushState,
        undo,
        redo,
        canUndo,
        canRedo,
        reset,
        historyLength: historyRef.current.length,
        currentIndex: indexRef.current,
    };
}

export default useUndoRedo;
