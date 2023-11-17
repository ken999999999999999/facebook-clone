import { Html, Head, Main, NextScript } from "next/document"
import Navbar from "@/components/Navbar"

export default function Document() {
  return (
    <Html lang="en">
      <Head />

      <body>
        <Navbar logo="/logo.png">
          <Main />
        </Navbar>
        <NextScript />
      </body>
    </Html>
  )
}
