// pages/login.tsx
import React, { useState } from "react"
import { Container, Box, Typography, TextField, Button } from "@mui/material"
import Backdrop from "@/components/Backdrop"
import Link from "next/link"
import { useRouter } from "next/router"
import { Fetcher } from "@/services/fetcher"
import { SubmitHandler, useForm } from "react-hook-form"
import { DateField } from "@mui/x-date-pickers"
import moment from "moment"

interface ICreateUserCommand {
  email: string
  password: string
  confirmedPassword: string
  display_name: string
  first_name: string
  last_name: string
  birthdate: moment.Moment
}

const SignUpPage: React.FC = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)

  const onSubmit: SubmitHandler<ICreateUserCommand> = async (formData) => {
    try {
      setIsLoading(true)
      console.log(formData)
      // await Fetcher.POST("/users/sign-up", formData)
      // router.push("/login")
    } catch (err) {
      console.log(JSON.stringify(err))
    } finally {
      setIsLoading(false)
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<ICreateUserCommand>({
    defaultValues: {
      birthdate: moment(),
    },
  })

  const birthdate = register("birthdate", {
    required: { value: true, message: "Birthdate is required!" },
    validate: (value) =>
      moment(value).isBefore(moment().startOf("day")) || "Invalid Date",
  })

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
          Join us to connect with friends and the world around you on Facebook.
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          style={{ maxWidth: "800px" }}
        >
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            required
            autoFocus
            {...register("email", {
              required: { value: true, message: "Email is required" },
              maxLength: { value: 200, message: "Max Length is 200" },
              validate: (value) => value?.includes("@") || "Invalid Email",
            })}
            error={!!errors?.email}
            helperText={errors?.email?.message ?? ""}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            required
            {...register("password", {
              required: { value: true, message: "password is required" },
              maxLength: { value: 200, message: "Max Length is 200" },
            })}
            error={!!errors?.password}
            helperText={errors?.password?.message ?? ""}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            required
            {...register("confirmedPassword", {
              required: {
                value: true,
                message: "Confirm Password is required",
              },
              maxLength: { value: 200, message: "Max Length is 200" },
            })}
            error={!!errors?.confirmedPassword}
            helperText={errors?.confirmedPassword?.message ?? ""}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Display Name"
            required
            {...register("display_name", {
              required: {
                value: true,
                message: "Display Name is required",
              },
              maxLength: { value: 200, message: "Max Length is 200" },
            })}
            error={!!errors?.display_name}
            helperText={errors?.display_name?.message ?? ""}
          />
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            required
            {...register("first_name", {
              required: {
                value: true,
                message: "First Name is required",
              },
              maxLength: { value: 200, message: "Max Length is 200" },
            })}
            error={!!errors?.first_name}
            helperText={errors?.first_name?.message ?? ""}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            required
            {...register("last_name", {
              required: {
                value: true,
                message: "Last Name is required",
              },
              maxLength: { value: 200, message: "Max Length is 200" },
            })}
            error={!!errors?.last_name}
            helperText={errors?.last_name?.message ?? ""}
          />
          <DateField
            fullWidth
            margin="normal"
            label="Birthdate"
            required
            value={getValues("birthdate")}
            onChange={(newValue: moment.Moment | null) =>
              newValue && setValue("birthdate", newValue)
            }
            slotProps={{
              textField: {
                error: !!errors?.birthdate,
              },
            }}
            helperText={errors?.birthdate?.message ?? ""}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, bgcolor: "green" }}
            disabled={isLoading}
            type="submit"
          >
            Create new account
          </Button>
          <Link href="/login">
            <Button fullWidth variant="outlined" sx={{ mt: 3, mb: 2 }}>
              Already have an account?
            </Button>
          </Link>
        </form>
      </Box>
    </Backdrop>
  )
}

export default SignUpPage
