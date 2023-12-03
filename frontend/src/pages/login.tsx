// pages/login.tsx
import React, { useState } from "react"
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { useForm, SubmitHandler } from "react-hook-form"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/router"
import Backdrop from "@/components/Backdrop"
import Link from "next/link"
import { Visibility, VisibilityOff } from "@mui/icons-material"

interface ILogin {
  email: string
  password: string
}

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
  }
  const { signIn } = useAuth()
  const router = useRouter()
  const [error, setError] = useState(false)

  const onSubmit: SubmitHandler<ILogin> = async ({ email, password }) => {
    setIsLoading(true)
    try {
      await signIn(email, password)
      router.replace("/")
    } catch (err) {
      setError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>()

  return (
    <Backdrop open={!!isLoading}>
      <Box
        flexDirection="column"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Facebook
        </Typography>
        <Typography sx={{ mb: 2 }}>
          Connect with friends and the world around you on Facebook.
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {error && (
            <Alert
              severity="warning"
              variant="filled"
              style={{ width: "100%" }}
            >
              Email or Password is invalid!
            </Alert>
          )}
          <TextField
            margin="normal"
            {...register("email", {
              required: { value: true, message: "Email is required" },
              maxLength: { value: 200, message: "Max Length is 200" },
            })}
            error={!!errors?.email}
            helperText={errors?.email?.message ?? ""}
            fullWidth
            label="Email"
            required
            autoFocus
          />
          <TextField
            margin="normal"
            fullWidth
            {...register("password", {
              required: { value: true, message: "Email is required" },
              maxLength: { value: 200, message: "Max Length is 200" },
            })}
            error={!!errors?.password}
            helperText={errors?.password?.message ?? ""}
            label="Password"
            type={showPassword ? "text" : "password"}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Log in
          </Button>
          <Link href="/sign-up">
            <Button fullWidth sx={{ mt: 3, mb: 2 }} variant="outlined">
              Sign Up
            </Button>
          </Link>
        </form>
      </Box>
    </Backdrop>
  )
}

export default LoginPage
