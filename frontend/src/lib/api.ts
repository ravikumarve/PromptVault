const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}



class ApiClient {
  private baseUrl: string
  private isRefreshing = false
  private refreshQueue: Array<{ resolve: (value: any) => void; reject: (error: any) => void }> = []

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token')
    }
    return null
  }

  private setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    }
  }

  private removeAccessToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.refreshQueue.push({ resolve, reject })
      })
    }

    this.isRefreshing = true

    try {
      const token = this.getAccessToken()
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers,
      })

      if (response.ok) {
        const data = await response.json()
        const newToken = data.access_token
        if (newToken) {
          this.setAccessToken(newToken)
          this.refreshQueue.forEach(({ resolve }) => resolve(newToken))
          this.refreshQueue = []
          return newToken
        }
      }

      // Refresh failed, clear token and queue
      this.removeAccessToken()
      this.refreshQueue.forEach(({ reject }) => reject(new Error('Token refresh failed')))
      this.refreshQueue = []
      return null
    } catch (error) {
      this.removeAccessToken()
      this.refreshQueue.forEach(({ reject }) => reject(error))
      this.refreshQueue = []
      return null
    } finally {
      this.isRefreshing = false
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const token = this.getAccessToken()
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      })

      const data = await response.json().catch(() => ({}))

      // Handle token expiration (401 Unauthorized)
      if (response.status === 401 && retryCount === 0) {
        const refreshedToken = await this.refreshAccessToken()
        if (refreshedToken) {
          // Retry the request with the new token
          return this.request<T>(endpoint, options, retryCount + 1)
        }
      }

      if (!response.ok) {
        return {
          error: data.message || data.detail || `HTTP error ${response.status}`,
          message: data.message,
        }
      }

      return { data }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error',
      }
    }
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    return this.request<{ access_token: string; token_type: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    })
  }

  async getCurrentUser() {
    return this.request<{
      id: string
      email: string
      name: string
      created_at: string
    }>('/api/auth/me')
  }

  async refreshToken() {
    return this.request<{ access_token: string; token_type: string }>('/api/auth/refresh', {
      method: 'POST',
    })
  }

  // Prompt endpoints
  async getPrompts() {
    return this.request<{
      id: number
      user_id: number
      title: string
      description: string | null
      is_public: boolean
      created_at: string
      updated_at: string
      version_count: number
      latest_content: string | null
    }[]>('/api/prompts/')
  }

  async getPrompt(id: string) {
    return this.request<{
      id: number
      user_id: number
      title: string
      description: string | null
      is_public: boolean
      created_at: string
      updated_at: string
      version_count: number
      latest_content: string | null
    }>(`/api/prompts/${id}`)
  }

  async createPrompt(title: string, content: string, description?: string, isPublic?: boolean) {
    return this.request<{ id: number; version_count: number; latest_content: string | null }>('/api/prompts/', {
      method: 'POST',
      body: JSON.stringify({ title, content, description, is_public: isPublic }),
    })
  }

  async updatePrompt(id: string, title?: string, content?: string, description?: string, isPublic?: boolean) {
    return this.request<{ id: number; version_count: number; latest_content: string | null }>(`/api/prompts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content, description, is_public: isPublic }),
    })
  }

  async deletePrompt(id: string) {
    return this.request<{ message: string }>(`/api/prompts/${id}`, {
      method: 'DELETE',
    })
  }

  // Version endpoints
  async getVersions(promptId: string | number) {
    return this.request<{
      id: number
      prompt_id: number
      version_number: number
      content: string
      message: string | null
      model_tested: string | null
      created_at: string
    }[]>(`/api/prompts/${promptId}/versions`)
  }

  async getVersion(promptId: string | number, versionId: string | number) {
    return this.request<{
      id: number
      prompt_id: number
      version_number: number
      content: string
      message: string | null
      model_tested: string | null
      created_at: string
    }>(`/api/prompts/${promptId}/versions/${versionId}`)
  }

  async getLatestVersion(promptId: string | number) {
    return this.request<{
      id: number
      prompt_id: number
      version_number: number
      content: string
      message: string | null
      model_tested: string | null
      created_at: string
    }>(`/api/prompts/${promptId}/versions/latest`)
  }

  async getDiff(promptId: string | number, versionId: string | number, targetVersionId?: string | number) {
    let url = `/api/prompts/${promptId}/versions/${versionId}/diff`
    if (targetVersionId !== undefined) {
      url += `?target_version_id=${targetVersionId}`
    }
    return this.request<{
      source_version_id: number
      source_version_number: number
      target_version_id: number
      target_version_number: number
      diff: string
    }>(url)
  }

  async compareVersions(promptId: string | number, sourceVersionId: string | number, targetVersionId: string | number) {
    return this.request<{
      versions: {
        source: {
          id: number
          prompt_id: number
          version_number: number
          content: string
          message: string | null
          model_tested: string | null
          created_at: string
        }
        target: {
          id: number
          prompt_id: number
          version_number: number
          content: string
          message: string | null
          model_tested: string | null
          created_at: string
        }
      }
      diff: string
    }>(`/api/prompts/${promptId}/versions/${sourceVersionId}/compare/${targetVersionId}`)
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/api/health')
  }
}

export const api = new ApiClient()