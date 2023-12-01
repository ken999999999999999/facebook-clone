import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import { User } from "firebase/auth"
import { ICreateUserCommand } from "../services/users"

type AuthContextType = {
  loading: boolean
  error: unknown
  user: User | null
  token: string
  setToken: (token: string) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (user: ICreateUserCommand) => Promise<void>
  signOut: () => Promise<void>
  setLoading: (loading: boolean) => void
}

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default useAuth
