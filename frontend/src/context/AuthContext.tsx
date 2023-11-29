import React, {
  useState,
  createContext,
  ReactNode,
  useContext,
  useEffect,
} from "react"
import {
  getAuth,
  signInWithEmailAndPassword,
  User,
  AuthError,
  signOut as fbSignOut,
} from "firebase/auth"
import { initializeApp } from "firebase/app"
import { userSignUp } from "../services/users"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export interface IUser {
  email: string
  password: string
  display_name: string
  first_name: string
  last_name: string
  birthdate: string
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string>("")
  const [error, setError] = useState<AuthError | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false)
      if (user) {
        setUser(user)
        console.log(user)
        console.log(user.getIdTokenResult())
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      setUser(userCredential.user)
      setError(null)
    } catch (error) {
      setError(error as AuthError)
      window.alert(error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (user: IUser) => {
    try {
      setLoading(true)
      const res = await userSignUp(user)
      console.log(res)
      setUser(res)
    } catch (error) {
      setError(error as AuthError)
      window.alert(error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<void> => {
    setLoading(true)
    try {
      await fbSignOut(auth)
      setUser(null)
      setError(null)
      window.alert("Signed out")
    } catch (error) {
      setError(error as AuthError)
      console.log(error)
      window.alert(error)
    } finally {
      setLoading(false)
    }
  }

  const contextValue = {
    loading,
    error,
    user,
    token,
    setToken,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
