"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DEMO_ACCOUNTS = [
  { role: "Admin", username: "admin", password: "admin" },
  { role: "Teacher", username: "teacher", password: "teacher" },
  { role: "Parent", username: "parent", password: "parent" },
  { role: "Student", username: "student", password: "student" },
];

const copyToClipboard = async (value: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fall through to the legacy path below
  }

  // Fallback for non-secure contexts (e.g. a plain-http preview deployment)
  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
};

const DemoCredentials = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async (key: string, value: string) => {
    const ok = await copyToClipboard(value);
    if (!ok) return;

    setCopied(key);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setCopied(null), 1500);
  };

  const renderField = (
    key: string,
    label: string,
    value: string
  ) => {
    const isCopied = copied === key;

    return (
      <button
        type="button"
        onClick={() => handleCopy(key, value)}
        title={`Copy ${label.toLowerCase()}`}
        aria-label={`Copy ${label.toLowerCase()} ${value}`}
        className="group w-full flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-gray-50 transition-colors duration-150"
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] text-gray-400 w-8 shrink-0 text-left">
            {label}
          </span>
          <span className="font-mono text-xs text-gray-700 truncate">
            {value}
          </span>
        </span>
        {isCopied ? (
          <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-600 transition-colors duration-150 shrink-0" />
        )}
      </button>
    );
  };

  return (
    <div className="px-10 pb-6 pt-6 border-t border-gray-100">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h2 className="text-sm font-medium text-gray-900">Demo credentials</h2>
        <span className="text-[11px] text-gray-400">Click to copy</span>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-4">
        Explore the dashboard without signing up.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEMO_ACCOUNTS.map(({ role, username, password }) => (
          <div
            key={role}
            className="border border-gray-200 rounded-lg p-2.5 hover:border-gray-300 transition-colors duration-150"
          >
            <p className="text-xs font-medium text-gray-900 px-2 mb-1.5">
              {role}
            </p>
            <div className="space-y-0.5">
              {renderField(`${role}-user`, "User", username)}
              {renderField(`${role}-pass`, "Pass", password)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemoCredentials;
