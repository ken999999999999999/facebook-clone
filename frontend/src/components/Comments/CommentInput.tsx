import useAuth from "@/hooks/useAuth"
import { Post } from "@/hooks/usePost"
import { useState, type FC } from "react"
import { Avatar, Box, Stack, Input, Container, IconButton } from "@mui/material"
import { stringAvatar } from "../UserListItem"
import SendIcon from "@mui/icons-material/Send"
import { Fetcher } from "@/services/fetcher"
interface CommentInputProps {
  post: Post
  refresh: () => void
}

const CommentInput: FC<CommentInputProps> = ({
  post,
  refresh,
}: CommentInputProps) => {
  const { user } = useAuth()
  const [description, setDescription] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value)
  }

  const onClick = () => {
    setLoading(true)
    try {
      const response = Fetcher.POST(`/comments`, {
        description: description,
        post_id: post.id,
      })
      setDescription("")
      refresh()
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {post ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Avatar
              {...stringAvatar(
                `${user?.first_name ?? ""} ${user?.last_name ?? ""}`
              )}
              sx={{ width: 32, height: 32 }}
            />
            <Input
              value={description}
              disabled={loading}
              placeholder={"Write a comment..."}
              inputProps={{ "aria-label": "description" }}
              fullWidth
              onChange={onInputChange}
            />
            <IconButton onClick={onClick} disabled={loading}>
              <SendIcon />
            </IconButton>
          </Stack>

          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          ></Container>
        </Box>
      ) : null}
    </>
  )
}
export default CommentInput
