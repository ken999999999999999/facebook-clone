import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { ThemeProvider } from "@mui/material/styles"
import { AuthProvider } from "../context/AuthContext"
import { Container, CssBaseline } from "@mui/material"
import Head from "next/head"
import theme from "@/styles/theme"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Facebook Clone</title>
        <meta name="description" content="Facebook Clone" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
              maxWidth="xl"
              style={{ marginTop: "64px" }}
              disableGutters
              sx={{ padding: "12px 24px" }}
            >
              <Component {...pageProps} />
            </Container>
          </ThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </>
  )
}
