import useAuth from "@/hooks/useAuth"
import { Post } from "@/hooks/usePost"
import { useState, type FC } from "react"
import {
  Box,
  Stack,
  IconButton,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from "@mui/material"
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

  // const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setDescription(e.target.value)
  // }

  const onClick = async () => {
    setLoading(true)
    try {
      const response = await Fetcher.POST(`/comments`, {
        description: description,
        post_id: post.id,
      })
      setDescription("")
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
      refresh()
    }
  }

  return (
    <>
      {post ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Stack spacing={1} direction="row" alignItems="center">
            <form style={{ width: "100%" }}>
              <FormControl fullWidth variant="outlined">
                <OutlinedInput
                  placeholder="Message.."
                  autoFocus
                  value={description}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDescription(event.target.value)
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        type="submit"
                        color="primary"
                        disabled={loading || !description.length}
                        onClick={onClick}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </form>
          </Stack>
        </Box>
      ) : null}
    </>
  )
}
export default CommentInput
