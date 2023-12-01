import React, { useState, createContext, ReactNode, useEffect } from "react"
import {
  getAuth,
  signInWithEmailAndPassword,
  AuthError,
  signOut as fbSignOut,
} from "firebase/auth"
import { initializeApp } from "firebase/app"
import { ICreateUserCommand, userSignUp } from "../services/users"
import { setCookie } from "nookies"
import { useRouter } from "next/router"
import { Fetcher } from "@/services/fetcher"
import { usePathname } from "next/navigation"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export interface IUser {
  id: string
  email: string
  password: string
  display_name: string
  first_name: string
  last_name: string
  birthdate: string
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const AuthContext = createContext<AuthContextType>({
  loading: false,
  error: null,
  user: null,
  token: "",
  setToken: (token: string) => null,
  signIn: (email: string, password: string) => Promise.resolve(),
  signUp: (user: ICreateUserCommand) => Promise.resolve(),
  signOut: () => Promise.resolve(),
  setLoading: (loading: boolean) => null,
})

export type AuthContextType = {
  loading: boolean
  error: unknown
  user: IUser | null
  token: string
  setToken: (token: string) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (user: ICreateUserCommand) => Promise<void>
  signOut: () => Promise<void>
  setLoading: (loading: boolean) => void
}

const saveUserToLocal = (user: IUser) => {
  if (typeof window !== "undefined")
    localStorage.setItem("user", JSON.stringify(user))
}

const getUserFromLocal = (): IUser | null => {
  if (typeof window !== "undefined") {
    const userJson = localStorage.getItem("user")
    return userJson ? JSON.parse(userJson) : null
  }
  return null
}

const removeUserFromLocal = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(getUserFromLocal())
  const [token, setToken] = useState<string>("")
  const [error, setError] = useState<AuthError | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user && pathname === "/") {
        window.alert("Login Session Expired!")
        router.push("/login")
      }
    })
  }, [router, pathname])

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true)
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      const token = await userCredential.user.getIdToken() // Get the token
      setCookie(null, "token", token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })

      const currentUser = await Fetcher.GET("/users/")
      saveUserToLocal(currentUser) // Save the user object to local storage
      setUser(currentUser)
      setError(null)
    } catch (error) {
      setError(error as AuthError)
      window.alert(error)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (user: ICreateUserCommand) => {
    try {
      setLoading(true)
      const res = await userSignUp(user)
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
      removeUserFromLocal()
      setUser(null)
      setError(null)
      router.push("/login")
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
    setLoading,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
