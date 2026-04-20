"use client";

export default function Topbar() {
  return (
    <div className="border-b border-[var(--border-default)] bg-[var(--bg-surface)] p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">
            Dashboard
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[var(--accent-muted)] rounded-full flex items-center justify-center">
            <span className="text-[var(--accent)] text-sm font-medium">U</span>
          </div>
        </div>
      </div>
    </div>
  );
}