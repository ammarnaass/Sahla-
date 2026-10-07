"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MaterialTextFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  containerClassName?: string;
}

export const MaterialTextField = React.forwardRef<
  HTMLInputElement,
  MaterialTextFieldProps
>(
  (
    {
      className,
      containerClassName,
      label,
      error,
      helperText,
      startIcon,
      endIcon,
      id,
      value,
      defaultValue,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(
      Boolean(value || defaultValue)
    );

    const isFloating = isFocused || hasValue || Boolean(value);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(Boolean(e.target.value));
      onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value));
      props.onChange?.(e);
    };

    return (
      <div className={cn("relative w-full text-right", containerClassName)}>
        <div
          className={cn(
            "group relative flex items-center w-full min-h-[56px] rounded-2xl border transition-all duration-200 bg-card/60 backdrop-blur-xs",
            error
              ? "border-destructive ring-2 ring-destructive/20"
              : isFocused
              ? "border-primary ring-3 ring-primary/15 shadow-sm"
              : "border-input hover:border-muted-foreground/40 shadow-2xs"
          )}
        >
          {/* Start Icon (e.g. Mail, Lock) */}
          {startIcon && (
            <div
              className={cn(
                "flex items-center justify-center ps-4 pe-2 transition-colors shrink-0",
                error
                  ? "text-destructive"
                  : isFocused
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {startIcon}
            </div>
          )}

          {/* Input field */}
          <input
            id={inputId}
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              "w-full bg-transparent px-4 pt-4 pb-1 text-sm text-foreground focus:outline-none placeholder:opacity-0 transition-all font-sans",
              startIcon && "ps-1",
              endIcon && "pe-1",
              className
            )}
            placeholder={label}
            {...props}
          />

          {/* Floating Label (Material 3 Outlined Style) */}
          <label
            htmlFor={inputId}
            className={cn(
              "pointer-events-none absolute right-4 transition-all duration-200 select-none",
              startIcon && "right-11",
              isFloating
                ? "top-2 text-[10px] font-bold"
                : "top-4 text-xs font-medium text-muted-foreground",
              error
                ? "text-destructive"
                : isFocused
                ? "text-primary font-bold"
                : "text-muted-foreground"
            )}
          >
            {label}
          </label>

          {/* End Icon (e.g. toggle password visibility) */}
          {endIcon && (
            <div className="flex items-center justify-center pe-4 ps-2 shrink-0">
              {endIcon}
            </div>
          )}
        </div>

        {/* Error or Helper text */}
        {(error || helperText) && (
          <p
            className={cn(
              "text-[11px] mt-1.5 px-1 leading-none font-medium flex items-center gap-1",
              error ? "text-destructive font-semibold" : "text-muted-foreground"
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);
MaterialTextField.displayName = "MaterialTextField";
