import axios, { AxiosError, AxiosRequestConfig } from "axios"

export const FetcherInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  timeout: 10000,
})

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
