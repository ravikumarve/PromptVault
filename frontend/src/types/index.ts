// User types
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at?: string
}

// Prompt types
export interface PromptVersion {
  id: number
  prompt_id: number
  version_number: number
  content: string
  message: string | null
  model_tested: string | null
  created_at: string
}

export interface DiffResponse {
  source_version_id: number
  source_version_number: number
  target_version_id: number
  target_version_number: number
  diff: string
}

export interface CompareResponse {
  versions: {
    source: PromptVersion
    target: PromptVersion
  }
  diff: string
}

export interface Prompt {
  id: number
  user_id: number
  title: string
  description?: string | null
  is_public: boolean
  created_at: string
  updated_at: string
  version_count: number
  latest_content?: string | null
}

export interface CreatePromptRequest {
  title: string
  content: string
  description?: string
  tags?: string[]
}

export interface UpdatePromptRequest {
  title?: string
  content?: string
  description?: string
  tags?: string[]
}

// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Pagination types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  total_pages: number
}

// Form error types
export interface FormErrors {
  [key: string]: string
}

// Component props
export interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

export interface InputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'password' | 'textarea'
  error?: string
  className?: string
  required?: boolean
}