"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const fieldId = id ?? props.name;

    return (
      <div className="w-full">
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={fieldId}
          className={`w-full rounded-xl border bg-white/70 px-4 py-3 text-sm text-[#0d172a] outline-none transition placeholder:text-[#9aa6b8] focus:border-[#5fa3ff] focus:bg-white focus:ring-4 focus:ring-[#5fa3ff]/15 disabled:cursor-not-allowed disabled:bg-[#f2f5f9] disabled:text-[#8a96ab] ${
            error ? "border-[#e5484d]" : "border-[#dfe7f3]"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-[#e5484d]">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = "FormField";
