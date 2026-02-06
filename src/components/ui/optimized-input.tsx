import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface OptimizedInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> {
    label?: string;
    multiline?: boolean;
    error?: boolean;
    options?: string[]; // For select/dropdown
}

export const OptimizedInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, OptimizedInputProps>(
    ({ className, label, value, multiline, error, options, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const hasValue = value !== undefined && value !== '' && value !== null;

        const containerClasses = cn(
            "relative group transition-all duration-300",
            className
        );

        const inputClasses = cn(
            "w-full bg-transparent text-2xl md:text-3xl font-medium text-slate-800 placeholder:text-slate-300 border-b-2 py-4 focus:outline-none transition-all duration-300 resize-none appearance-none rounded-none",
            error ? "border-rose-400" : isFocused ? "border-slate-800" : "border-slate-200 group-hover:border-slate-300"
        );

        const labelClasses = cn(
            "absolute left-0 text-lg font-medium transition-all duration-300 pointer-events-none origin-[0]",
            (isFocused || hasValue)
                ? "-top-3 transform scale-75 text-slate-500"
                : "top-4 text-slate-400"
        );

        return (
            <div className={containerClasses}>
                {label && (
                    <label className={labelClasses}>
                        {label}
                        {props.required && <span className="text-rose-500 ml-1">*</span>}
                    </label>
                )}

                {multiline ? (
                    <textarea
                        ref={ref as any}
                        className={inputClasses}
                        value={value}
                        rows={1}
                        placeholder={isFocused ? props.placeholder : ""}
                        onInput={(e) => {
                            e.currentTarget.style.height = 'auto';
                            e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                        }}
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
                    <div className="relative">
                        <select
                            ref={ref as any}
                            className={inputClasses}
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
                                <option key={opt} value={opt} className="text-lg py-2">{opt}</option>
                            ))}
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                    </div>
                ) : (
                    <input
                        ref={ref as any}
                        className={inputClasses}
                        value={value}
                        placeholder={isFocused ? props.placeholder : ""}
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

                {/* Focus Indicator Line */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isFocused ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute bottom-0 left-0 w-full h-[2px] bg-slate-800 origin-left"
                />
            </div>
        );
    }
);

OptimizedInput.displayName = "OptimizedInput";
