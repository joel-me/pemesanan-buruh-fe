import React, { createContext, useContext, useState, ReactNode } from "react"
import axios from "axios"

// Definisikan tipe untuk User
interface User {
  id: string
  username: string
  role: "farmer" | "worker"
}

interface LoginResponse {
  token: string
  user: User
}

type AuthContextType = {
  token: string | null
  user: User | null
  isLoading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post<LoginResponse>("http://localhost:3000/auth/login", {
        username,
        password,
      })

      const { token, user } = response.data
      localStorage.setItem("token", token)
      setToken(token)
      setUser(user)
    } catch (err: unknown) {
      // Menggunakan instance dari Error untuk memeriksa tipe error
      if (err instanceof Error) {
        setError(err.message || "Login gagal")
      } else {
        setError("Terjadi kesalahan yang tidak terduga.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
