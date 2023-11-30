import { useState, useEffect } from "react"
import { Fetcher } from "../services/fetcher"
import { AxiosError } from "axios"
import useAuth from "./useAuth"

export interface UserDto {
  id: string
  email: string
  display_name: string
  first_name: string
  last_name: string
  birthdate: string // Considering the date is in ISO format, otherwise you may want to use Date or another appropriate type
}

interface UserListParams {
  pageIndex?: number
  pageSize?: number
  orderBy?: string
  isAsc?: boolean
}

interface HTTPValidationError extends AxiosError {}

interface UseUserHook {
  currentUser: UserDto | null
  usersList: UserDto[] | null
  isLoading: boolean
  error: HTTPValidationError | null
  getCurrentUser: () => Promise<void>
  getUsersList: (params?: UserListParams) => Promise<void>
}

export const useUser = (): UseUserHook => {
  const { user } = useAuth()
  const [currentUser, setCurrentUser] = useState<UserDto | null>(null)
  const [usersList, setUsersList] = useState<UserDto[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<HTTPValidationError | null>(null)

  const getCurrentUser = async () => {
    setIsLoading(true)
    try {
      const response = await Fetcher.GET("/users/")
      setCurrentUser(response)
      setError(null)
    } catch (err) {
      setError(err as HTTPValidationError)
    } finally {
      setIsLoading(false)
    }
  }

  const getUsersList = async (params?: UserListParams) => {
    setIsLoading(true)
    try {
      const response = await Fetcher.GET("/users/list", params)
      setUsersList(response)
      setError(null)
    } catch (err) {
      setError(err as HTTPValidationError)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCurrentUser()
  }, [])

  return {
    currentUser,
    usersList,
    isLoading,
    error,
    getCurrentUser,
    getUsersList,
  }
}
