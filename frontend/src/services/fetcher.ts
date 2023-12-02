import axios, { AxiosRequestConfig } from "axios"
import { parseCookies } from "nookies"

const FetcherInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
})

const CommonRequest = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
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
  const cookies = parseCookies()
  const token = cookies.token // Get the token from cookies
  const newHeaders = {
    ...customConfig?.headers,
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add the token in the Authorization header
  }
  const response = await FetcherInstance({ ...config, headers: newHeaders })
  return response.data
}

export const Fetcher = {
  GET: (url: string, params?: any, customConfig?: AxiosRequestConfig) =>
    CommonRequest("GET", url, undefined, params, customConfig),

  POST: (url: string, data?: any, customConfig?: AxiosRequestConfig) =>
    CommonRequest("POST", url, data, undefined, customConfig),

  PUT: (url: string, data?: any, customConfig?: AxiosRequestConfig) =>
    CommonRequest("PUT", url, data, undefined, customConfig),

  DELETE: (url: string, customConfig?: AxiosRequestConfig) =>
    CommonRequest("DELETE", url, undefined, undefined, customConfig),
}
