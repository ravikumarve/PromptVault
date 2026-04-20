import Link from "next/link";
import { Code, GitBranch, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[var(--accent)] rounded"></div>
          <span className="font-semibold text-[var(--text-primary)]">PromptVault</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-[var(--accent)] text-[#09090B] font-medium text-sm px-4 py-2 rounded-md hover:bg-[var(--accent-hover)] hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] transition-all duration-150"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] mb-4">
          Git for AI Prompts
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-8">
          Version control, collaboration, and testing for your AI prompts. 
          Like GitHub, but built specifically for prompt engineering.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-[var(--accent)] text-[#09090B] font-medium text-sm px-6 py-3 rounded-md hover:bg-[var(--accent-hover)] hover:shadow-[0_0_16px_rgba(245,158,11,0.4)] transition-all duration-150"
          >
            Start Building
          </Link>
          <Link
            href="/login"
            className="border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] px-6 py-3 rounded-md text-sm transition-all duration-150"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Version Control */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6 hover:border-[var(--border-strong)] hover:shadow-[var(--accent-glow)] transition-all duration-200">
            <div className="w-12 h-12 bg-[var(--accent-muted)] rounded-lg flex items-center justify-center mb-4">
              <GitBranch className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Version Control
            </h3>
            <p className="text-[var(--text-secondary)]">
              Track changes, revert to previous versions, and maintain a complete history of your prompt evolution.
            </p>
          </div>

          {/* Team Sharing */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6 hover:border-[var(--border-strong)] hover:shadow-[var(--accent-glow)] transition-all duration-200">
            <div className="w-12 h-12 bg-[var(--accent-muted)] rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Team Sharing
            </h3>
            <p className="text-[var(--text-secondary)]">
              Collaborate with your team, share prompts, and maintain consistency across your AI applications.
            </p>
          </div>

          {/* Model Testing */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6 hover:border-[var(--border-strong)] hover:shadow-[var(--accent-glow)] transition-all duration-200">
            <div className="w-12 h-12 bg-[var(--accent-muted)] rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-[var(--accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
              Model Testing
            </h3>
            <p className="text-[var(--text-secondary)]">
              Test prompts across different models, track performance, and optimize for the best results.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}