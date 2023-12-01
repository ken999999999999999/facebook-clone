import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Navbar from "@/components/Navbar"
import { AuthProvider } from "../context/AuthContext"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Navbar logo="/2.jpeg">
        <Component {...pageProps} />
      </Navbar>
    </AuthProvider>
  )
}
