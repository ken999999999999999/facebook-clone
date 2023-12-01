import { Fetcher } from "./fetcher"

export interface ICreateUserCommand {
  email: string
  password: string
  display_name: string
  first_name: string
  last_name: string
  birthdate: string
}

export const userSignUp = async (user: ICreateUserCommand) => {
  const res = await Fetcher.POST("/users/sign-up", user)
    .catch((err) => {
      throw err
    })
    .then((response) => {
      console.log(response)
      return response
    })
  console.log(res)
  return res
}
