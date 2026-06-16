'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    const result = await register(email, password, username)

    if (result.success) {
      router.push('/dashboard')
    } else {
      setError(result.error || 'Registration failed')
    }

    setIsLoading(false)
  }

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 border-2 border-[var(--accent-amber)] rounded-sm relative">
            <div className="absolute top-1.5 left-1.5 w-3 h-3 bg-[var(--text-primary)]" />
          </div>
          <span className="text-xl font-semibold text-[var(--text-primary)] tracking-tight">
            PromptVault
          </span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
          Create account
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1.5">
          Get started with PromptVault
        </p>
      </div>

      {/* Form card */}
      <div className="card-elevated p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-[var(--error-bg)] border border-[var(--error-border)] text-[var(--error)] px-4 py-3 rounded-[var(--radius-btn)] text-sm flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
              placeholder="yourusername"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] px-3 py-2 text-sm pr-10 focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5 font-mono">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[var(--surface-panel)] border border-[var(--border-dim)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] rounded-[var(--radius-btn)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--accent-amber)] focus:ring-2 focus:ring-[var(--accent-amber-dim)] transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn btn-primary text-sm !py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-4 w-4" />
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-6 pt-5 border-t border-[var(--border-dim)]">
          <p className="text-center text-sm text-[var(--text-secondary)]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[var(--accent-amber)] hover:text-[var(--accent-hover)] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <p className="text-xs text-[var(--text-tertiary)] font-mono">
          © PromptVault. Git for AI prompts.
        </p>
      </div>
    </div>
  )
}
