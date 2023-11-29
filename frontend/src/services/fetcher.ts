import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export const FetcherInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  timeout: 10000,
})

FetcherInstance.interceptors.request.use(
  async (config) => {
    const { token } = useContext(AuthContext)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const CommonRequest = async (
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  data?: any,
  params?: any,
  customConfig?: AxiosRequestConfig
) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    data,
    params,
    ...customConfig,
  }
  return await FetcherInstance(config).then((res) => res.data)
}

export const Fetcher = {
  GET: (url: string, params?: any, customConfig?: AxiosRequestConfig) =>
    CommonRequest("GET", url, undefined, params, customConfig),

  POST: (url: string, data?: any, customConfig?: AxiosRequestConfig) =>
    CommonRequest("POST", url, data, undefined, customConfig),

  PATCH: (url: string, data?: any, customConfig?: AxiosRequestConfig) =>
    CommonRequest("PATCH", url, data, undefined, customConfig),

  DELETE: (url: string, customConfig?: AxiosRequestConfig) =>
    CommonRequest("DELETE", url, undefined, undefined, customConfig),
}
