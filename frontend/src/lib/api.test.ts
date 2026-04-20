import { api } from './api'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
global.fetch = jest.fn()

describe('ApiClient', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('Token handling', () => {
    test('should add Authorization header when token exists', async () => {
      localStorage.setItem('access_token', 'test-token-123')
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' })
      })

      await api.getCurrentUser()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token-123'
          })
        })
      )
    })

    test('should not add Authorization header when no token exists', async () => {
      localStorage.removeItem('access_token')
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'success' })
      })

      await api.getCurrentUser()

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/me'),
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.anything()
          })
        })
      )
    })
  })

  describe('Token refresh', () => {
    test('should attempt token refresh on 401 error', async () => {
      localStorage.setItem('access_token', 'expired-token')
      
      // First call returns 401
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: 401,
          ok: false,
          json: async () => ({ error: 'Unauthorized' })
        })
        // Refresh token call
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ access_token: 'new-token-456' })
        })
        // Second call with new token
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: 'user-data' })
        })

      const result = await api.getCurrentUser()

      expect(fetch).toHaveBeenCalledTimes(3)
      expect(localStorage.getItem('access_token')).toBe('new-token-456')
      expect(result.data).toBe('user-data')
    })

    test('should handle refresh failure gracefully', async () => {
      localStorage.setItem('access_token', 'expired-token')
      
      // First call returns 401
      ;(fetch as jest.Mock)
        .mockResolvedValueOnce({
          status: 401,
          ok: false,
          json: async () => ({ error: 'Unauthorized' })
        })
        // Refresh token call fails
        .mockResolvedValueOnce({
          status: 401,
          ok: false,
          json: async () => ({ error: 'Refresh failed' })
        })

      const result = await api.getCurrentUser()

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(localStorage.getItem('access_token')).toBeNull()
      expect(result.error).toBeDefined()
    })
  })

  describe('Login flow', () => {
    test('should store token after successful login', async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'login-token-789',
          token_type: 'bearer'
        })
      })

      await api.login('test@example.com', 'password123')

      expect(localStorage.getItem('access_token')).toBe('login-token-789')
    })
  })
})