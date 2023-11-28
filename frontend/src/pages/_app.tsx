import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Navbar from "@/components/Navbar"
import useAuth from "@/hooks/useAuth"

export default function App({ Component, pageProps }: AppProps) {
  const { user } = useAuth()
  return user ? (
    <Navbar logo="/2.jpeg">
      <Component {...pageProps} />
    </Navbar>
  ) : (
    <Component {...pageProps} />
  )
}
