'use client'

import { useAuth } from '@/lib/auth'
import { User, Key, AlertTriangle, Mail } from 'lucide-react'
import Avatar from '@/components/ui/avatar'

export default function SettingsPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent-amber)]" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
          Settings
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-[var(--radius-btn)] bg-[var(--accent-amber-dim)] flex items-center justify-center">
            <User className="h-5 w-5 text-[var(--accent-amber)]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">Profile</h2>
            <p className="text-xs text-[var(--text-secondary)]">Your personal information</p>
          </div>
        </div>

        <div className="flex items-center gap-5 mb-6">
          {user && <Avatar name={user.name} size="lg" />}
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name || 'User'}</p>
            <p className="text-xs text-[var(--text-tertiary)] font-mono mt-0.5">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 font-mono">
              Name
            </label>
            <div className="bg-[var(--surface-panel)] border border-[var(--border-dim)] rounded-[var(--radius-btn)] px-3 py-2 text-sm text-[var(--text-primary)] font-mono">
              {user?.name || '—'}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1 font-mono">
              Email
            </label>
            <div className="bg-[var(--surface-panel)] border border-[var(--border-dim)] rounded-[var(--radius-btn)] px-3 py-2 text-sm text-[var(--text-primary)] font-mono flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[var(--text-tertiary)]" />
              {user?.email || '—'}
            </div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-[var(--radius-btn)] bg-[var(--accent-amber-dim)] flex items-center justify-center">
            <Key className="h-5 w-5 text-[var(--accent-amber)]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--text-primary)]">API Keys</h2>
            <p className="text-xs text-[var(--text-secondary)]">Manage your API access tokens</p>
          </div>
        </div>

        <div className="bg-[var(--surface-panel)] border border-[var(--border-dim)] rounded-[var(--radius-card)] p-6 text-center">
          <Key className="h-6 w-6 text-[var(--text-tertiary)] mx-auto mb-2" />
          <p className="text-sm text-[var(--text-secondary)]">No API keys yet</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">API key management coming soon.</p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card p-6 border border-[var(--error-border)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-[var(--radius-btn)] bg-[var(--error-bg)] flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-[var(--error)]" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[var(--error)]">Danger Zone</h2>
            <p className="text-xs text-[var(--text-secondary)]">Irreversible actions</p>
          </div>
        </div>

        <div className="bg-[var(--surface-panel)] border border-[var(--error-border)] rounded-[var(--radius-card)] p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Delete account</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Permanently delete your account and all associated data
            </p>
          </div>
          <button
            disabled
            className="px-4 py-2 text-sm font-medium text-[var(--error)] border border-[var(--error-border)] rounded-[var(--radius-btn)] opacity-50 cursor-not-allowed"
            title="Coming soon"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
