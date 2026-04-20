'use client'

import { useEffect, useState } from 'react'
import { api } from './api'

export interface User {
  id: string
  email: string
  name: string
  created_at: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setLoading(true)
      const result = await api.getCurrentUser()
      if (result.data) {
        setUser(result.data)
        setError(null)
      } else {
        setUser(null)
        setError(result.error || 'Not authenticated')
      }
    } catch (err) {
      setUser(null)
      setError(err instanceof Error ? err.message : 'Authentication check failed')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const result = await api.login(email, password)
      if (result.data?.access_token) {
        // Token storage is now handled by the API client internally
        await checkAuth()
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true)
      const result = await api.register(email, password, name)
      if (!result.error) {
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.logout()
      localStorage.removeItem('access_token')
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
  }
}

export function useProtectedRoute(redirectUrl: string = '/login') {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = redirectUrl
    }
  }, [user, loading, redirectUrl])

  return { user, loading }
}