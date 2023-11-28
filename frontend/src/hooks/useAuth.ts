import { initializeApp } from "firebase/app"
import { useState, useEffect } from "react"
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  AuthError,
  signOut as fbSignOut,
} from "firebase/auth"
import { userSignUp, IUser } from "../services/users"
export type { IUser } from "../services/users"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

interface IUseAuth {
  user: User | null
  error: AuthError | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (user: IUser) => Promise<void>
  signOut: () => Promise<void>
}

const useAuth = (): IUseAuth => {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<AuthError | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(false)
      if (user) {
        setUser(user)
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

  return { user, error, loading, signIn, signUp, signOut }
}

export default useAuth
