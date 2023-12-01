import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { parseCookies } from "nookies"

export const FetcherInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  timeout: 10000,
})

export const CommonRequest = async (
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
  return await FetcherInstance({ ...config, headers: newHeaders })
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      console.log(err)
    })
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
