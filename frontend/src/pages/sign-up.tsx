// pages/login.tsx
import React, { useState } from "react"
import { Container, Box, Typography, TextField, Button } from "@mui/material"
import useAuth from "@/hooks/useAuth"
import { ICreateUserCommand } from "../services/users"
import Backdrop from "@/components/Backdrop"
import Link from "next/link"

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState<ICreateUserCommand>({
    email: "",
    password: "",
    display_name: "",
    first_name: "",
    last_name: "",
    birthdate: "",
  })
  const { signUp, loading } = useAuth()

  const handleCreate = async () => {
    await signUp(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <Backdrop open={!!loading}>
      <Container component="main" maxWidth="xs">
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
              sx={{ mt: 2, bgcolor: "green" }}
            >
              Create new account
            </Button>
            <Link href="/login">
              <Button fullWidth variant="outlined" sx={{ mt: 2, mb: 2 }}>
                Already have an account?
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Backdrop>
  )
}

export default SignUpPage
