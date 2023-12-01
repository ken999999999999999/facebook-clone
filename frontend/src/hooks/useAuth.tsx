import { useContext } from "react"
import { AuthContext, AuthProvider } from "../context/AuthContext"
import { User } from "firebase/auth"
import { IUser } from "../services/users"

type AuthContextType = {
  loading: boolean
  error: unknown
  user: User | null
  token: string
  setToken: (token: string) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (user: IUser) => Promise<void>
  signOut: () => Promise<void>
}

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default useAuth
