// pages/login.tsx
import React, { useState } from "react"
import { Box, Typography, TextField, Button } from "@mui/material"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/router"
import Backdrop from "@/components/Backdrop"
import Link from "next/link"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { signIn, loading, setLoading } = useAuth()
  const router = useRouter()

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signIn(email, password)
      router.replace("/")
    } catch (err) {
      console.log(err)
      window.alert(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Backdrop open={!!loading}>
      <Box
        flexDirection={"row"}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Facebook
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Connect with friends and the world around you on Facebook.
        </Typography>

        <Box component="form" onSubmit={handleSignIn} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email address or phone number"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            onClick={handleSignIn}
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Log in
          </Button>
          <Link href="/sign-up">
            <Button fullWidth sx={{ mt: 3, mb: 2 }} variant="outlined">
              Sign Up
            </Button>
          </Link>
        </Box>
      </Box>
    </Backdrop>
  )
}

export default LoginPage
