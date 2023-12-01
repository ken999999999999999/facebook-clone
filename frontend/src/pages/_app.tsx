import "@/styles/globals.css"
import type { AppProps } from "next/app"
import Navbar from "@/components/Navbar"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { AuthProvider } from "../context/AuthContext"
import { Container, CssBaseline } from "@mui/material"
import Head from "next/head"

const theme = createTheme()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Facebook Clone</title>
        <meta name="description" content="Facebook Clone" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <Container
            maxWidth={false}
            style={{ marginTop: "64px" }}
            disableGutters
            sx={{ padding: "12px 24px" }}
          >
            <Component {...pageProps} />
          </Container>
        </ThemeProvider>
      </AuthProvider>
    </>
  )
}
