import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Navbar from "@/components/Navbar"
import { Html, Head, Main, NextScript } from "next/document"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Navbar logo="/2.jpeg">
      <Component {...pageProps} />
    </Navbar>
  )
}
