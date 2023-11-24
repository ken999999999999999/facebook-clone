// pages/login.tsx
import React, { useState } from "react"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CssBaseline,
} from "@mui/material"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import useAuth from "@/hooks/useAuth"
const theme = createTheme()
import useUser, { IUser } from "@/hooks/useUser"
import { Router, useRouter } from "next/router"

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formData, setFormData] = useState<IUser>({
    email: "",
    password: "",
    display_name: "",
    first_name: "",
    last_name: "",
    birthdate: "",
  })
  const { signUp } = useUser(formData)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      signIn(email, password)
      console.log(email, password)
      router.replace("/")
    } catch (err) {
      console.log(err)
      window.alert(err)
    }
  }

  const handleCreate = async () => {
    const res = await signUp(formData)
    console.log(res)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
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

          <Box
            component="form"
            onSubmit={handleSignIn}
            noValidate
            sx={{ mt: 1 }}
          >
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
              sx={{ mt: 3, mb: 2 }}
            >
              Log in
            </Button>
          </Box>
          <hr></hr>
          <Box
            component="form"
            onSubmit={handleCreate}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Display Name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Birthdate"
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              onClick={handleCreate}
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, bgcolor: "green" }}
            >
              Create new account
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 5 }}
          >
            Create a Page for a celebrity, brand or business.
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default LoginPage
