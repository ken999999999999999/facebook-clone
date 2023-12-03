import { useState, useEffect } from "react"
import { Fetcher } from "../services/fetcher"
import { AxiosError } from "axios"
import { User } from "@/components/FeedCard"

export interface Post {
  original_post_id?: string | null
  description?: string
  image?: string | null
  creator: User | undefined
  created?: string | null
  has_image?: boolean
  id?: string | null
}

export interface PostError extends AxiosError {}

interface UsePostHook {
  posts: Post[] | null
  isLoading: boolean
  error: PostError | null
  getPosts: () => Promise<void>
  getPost: (id: string) => Promise<void>
  createPost: (post: Post) => Promise<void>
  updatePost: (id: string, post: Post) => Promise<void>
  deletePost: (id: string) => Promise<void>
}

export const usePost = (): UsePostHook => {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<PostError | null>(null)

  const getPosts = async () => {
    setIsLoading(true)
    try {
      const response = await Fetcher.GET("/posts/")
      setPosts(response)
      setError(null)
    } catch (err) {
      setError(err as PostError)
    } finally {
      setIsLoading(false)
    }
  }

  const getPost = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await Fetcher.GET(`/posts/${id}`)
      // Assuming response returns a single Post object
      setPosts([response])
      setError(null)
    } catch (err) {
      setError(err as PostError)
    } finally {
      setIsLoading(false)
    }
  }

  const createPost = async (post: Post) => {
    setIsLoading(true)
    try {
      const res = await Fetcher.POST("/posts/", post)
    } catch (err) {
      setError(err as PostError)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePost = async (id: string, post: Post) => {
    setIsLoading(true)
    try {
      await Fetcher.PUT(`/posts/${id}`, post)
      getPosts() // Refresh the list of posts
    } catch (err) {
      setError(err as PostError)
    } finally {
      setIsLoading(false)
    }
  }

  const deletePost = async (id: string) => {
    setIsLoading(true)
    try {
      await Fetcher.DELETE(`/posts/${id}`)
      getPosts() // Refresh the list of posts
    } catch (err) {
      setError(err as PostError)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    posts,
    isLoading,
    error,
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
  }
}
