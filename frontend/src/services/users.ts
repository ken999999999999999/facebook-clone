import { Fetcher } from "./fetcher"

export interface IUser {
  email: string
  password: string
  display_name: string
  first_name: string
  last_name: string
  birthdate: string
}

export const userSignUp = async (user: IUser) => {
  const res = await Fetcher.POST("/users/sign-up", user)
    .catch((err) => {
      throw err
    })
    .then((response) => {
      console.log(response)
      return response
    })
  return res.json()
}
