import React, { useState, createContext, ReactNode, useEffect } from "react"
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  User,
} from "firebase/auth"
import { initializeApp } from "firebase/app"
import { destroyCookie, setCookie } from "nookies"
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
  display_name: string
  first_name: string
  last_name: string
  birthdate: string
}

const cookieConfig = {
  maxAge: 30 * 24 * 60 * 60,
  path: "/",
  sameSite: "Strict",
  secure: true,
}
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signIn: (email: string, password: string) => Promise.resolve(),
  signOut: () => Promise.resolve(),
})

export type AuthContextType = {
  user: IUser | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const saveUserToSession = (user: IUser) => {
  if (typeof window !== "undefined")
    sessionStorage.setItem("user", JSON.stringify(user))
}

const getUserFromSession = (): IUser | null => {
  if (typeof window !== "undefined") {
    const userJson = sessionStorage.getItem("user")
    return userJson ? JSON.parse(userJson) : null
  }
  return null
}

const removeUserFromSession = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("user")
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(getUserFromSession())
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const setUpUser = async (user: User) => {
      setCookie(null, "token", await user.getIdToken(), cookieConfig)
      const currentUser = await Fetcher.GET("/users/")
      saveUserToSession(currentUser) // Save the user object to local storage
      setUser(currentUser)
    }

    const cleanUpUser = async () => {
      removeUserFromSession()
      destroyCookie(null, "token")
      router.replace("/login")
    }

    auth.onAuthStateChanged((user) => {
      if (!user && pathname === "/") cleanUpUser()

      if (user) {
        setUpUser(user)
        if (pathname !== "/") router.replace("/")
      }
    })
  }, [router, pathname])

  const signIn = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = async (): Promise<void> => {
    await fbSignOut(auth)
    setUser(null)
  }

  const contextValue = {
    user,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
