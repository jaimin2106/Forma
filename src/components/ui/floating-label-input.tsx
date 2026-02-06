import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ className, label, value, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const hasValue = value !== undefined && value !== '' && value !== null;

        return (
            <div className="relative">
                <input
                    ref={ref}
                    className={cn(
                        "block px-4 pb-2.5 pt-5 w-full text-sm text-gray-900 bg-gray-50 dark:bg-gray-700 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer transition-colors duration-200",
                        className
                    )}
                    placeholder=" "
                    value={value}
                    onFocus={(e) => {
                        setIsFocused(true);
                        props.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        props.onBlur?.(e);
                    }}
                    {...props}
                />
                <label
                    className={cn(
                        "absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4",
                        (isFocused || hasValue) ? "scale-75 -translate-y-4" : "scale-100 translate-y-0"
                    )}
                >
                    {label}
                </label>
            </div>
        );
    }
);

FloatingLabelInput.displayName = "FloatingLabelInput";
