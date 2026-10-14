"use client";

import { useEffect, useRef, useState } from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
};

export function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";
  const styles = {
    primary: "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800",
    secondary:
      "bg-white text-stone-900 ring-1 ring-inset ring-stone-200 hover:bg-stone-50 active:bg-stone-100",
    ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200",
  } as const;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 ${className}`}
    >
      {children}
    </div>
  );
}

type TextareaProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
};

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextareaProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-xl bg-white px-3.5 py-3 text-sm leading-6 text-stone-900 ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
    />
  );
}

type InputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
};

export function Input({ value, onChange, placeholder, type = "text" }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl bg-white px-3.5 py-3 text-sm text-stone-900 ring-1 ring-inset ring-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-600"
    />
  );
}

type SelectProps = {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
};

export function Select({ value, onChange, options }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl bg-white px-3.5 py-3 text-sm text-stone-900 ring-1 ring-inset ring-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-600"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
      {children}
    </span>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // 复制失败时不抛错，保持安静
    }
  };

  return (
    <Button variant="secondary" onClick={handleCopy} className="px-3 py-1.5 text-xs">
      {copied ? "已复制" : "复制"}
    </Button>
  );
}
