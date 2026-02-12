import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label?: string;
    multiline?: boolean;
    error?: boolean;
    options?: string[]; // For select/dropdown
    helperText?: string;
    startAdornment?: React.ReactNode;
    containerClassName?: string;
}

export const OptimizedInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, OptimizedInputProps>(
    ({ className, containerClassName, label, value, multiline, error, options, helperText, startAdornment, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const hasValue = value !== undefined && value !== '' && value !== null;

        // Container styles: Enterprise white box with refined border & focus ring
        const inputContainerClasses = cn(
            "relative flex items-center transition-all duration-200 rounded-xl bg-white border overflow-hidden",
            error
                ? "border-rose-300 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-500/10"
                : "border-slate-200 hover:border-slate-300 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10",
            containerClassName
        );

        // Input styles: Clear text, specific placeholder color
        const baseInputClasses = cn(
            "w-full bg-transparent text-base md:text-lg text-slate-900 placeholder:text-slate-400 border-none px-4 py-3 focus:outline-none transition-all duration-200 resize-none appearance-none rounded-none",
            startAdornment ? "pl-0" : "", // Padding handled by container if adornment exists
            className
        );

        return (
            <div className="group space-y-1.5 w-full">
                {/* 1. Label Structure: Static, above input */}
                {label && (
                    <label className="block text-sm font-medium text-slate-700 ml-1">
                        {label}
                        {props.required && <span className="text-violet-600 ml-0.5">*</span>}
                    </label>
                )}

                {/* Input Container */}
                <div className={inputContainerClasses}>
                    {/* 3. Icon Handling */}
                    {startAdornment && (
                        <div className={cn(
                            "flex items-center justify-center pl-4 pr-3 text-slate-400 select-none transition-colors duration-200",
                            isFocused ? "text-violet-600" : ""
                        )}>
                            {startAdornment}
                        </div>
                    )}

                    {multiline ? (
                        <textarea
                            ref={ref as any}
                            className={baseInputClasses}
                            value={value}
                            rows={3}
                            onFocus={(e) => {
                                setIsFocused(true);
                                props.onFocus?.(e as any);
                            }}
                            onBlur={(e) => {
                                setIsFocused(false);
                                props.onBlur?.(e as any);
                            }}
                            {...props as any}
                        />
                    ) : options ? (
                        <div className="relative w-full">
                            <select
                                ref={ref as any}
                                className={cn(baseInputClasses, "pr-10")}
                                value={value}
                                onFocus={(e) => {
                                    setIsFocused(true);
                                    props.onFocus?.(e as any);
                                }}
                                onBlur={(e) => {
                                    setIsFocused(false);
                                    props.onBlur?.(e as any);
                                }}
                                {...props as any}
                            >
                                <option value="" disabled hidden></option>
                                {options.map((opt) => (
                                    <option key={opt} value={opt} className="py-2">{opt}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    ) : (
                        <input
                            ref={ref as any}
                            className={baseInputClasses}
                            value={value}
                            onFocus={(e) => {
                                setIsFocused(true);
                                props.onFocus?.(e);
                            }}
                            onBlur={(e) => {
                                setIsFocused(false);
                                props.onBlur?.(e);
                            }}
                            {...props as any}
                        />
                    )}
                </div>

                {/* Helper Text */}
                {helperText && (
                    <motion.p
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "text-xs text-slate-500 ml-1",
                            error && "text-rose-500"
                        )}
                    >
                        {helperText}
                    </motion.p>
                )}
            </div>
        );
    }
);

OptimizedInput.displayName = "OptimizedInput";
