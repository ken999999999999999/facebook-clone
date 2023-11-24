import { userSignUp, userSignIn, IUser } from "../services/users"
import { useState } from "react"

export type { IUser } from "../services/users"

const useUser = (user: IUser) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const signUp = async (user: IUser) => {
    try {
      setIsLoading(true)
      const res = await userSignUp(user)
      console.log(res)
      setData(res)
    } catch (error) {
      setError("Error: " + error)
    } finally {
      setIsLoading(false)
    }
  }

  const signIn = async () => {
    try {
      setIsLoading(true)
      const res = await userSignIn(user)
      setData(res)
    } catch (error) {
      setError("Error: " + error)
    } finally {
      setIsLoading(false)
    }
  }

  return { signUp, signIn, data, error, isLoading }
}

export default useUser
