import { HtmlHTMLAttributes, useEffect, useState } from "react"
import Card from "./Card"
import { User } from "./FeedCard"
import {
  Divider,
  Box,
  Input,
  Container,
  IconButton,
  Stack,
  Avatar,
  Typography,
  Button,
} from "@mui/material"
import { Videocam, PhotoLibrary, Mood, CloudUpload } from "@mui/icons-material"
import { Post, usePost } from "@/hooks/usePost"
interface PostFeedCardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  user: User
}

const PostFeedButtons = () => {
  return (
    <Container>
      <Divider />

      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-evenly"
        alignItems="center"
        spacing={0}
      >
        <IconButton className="feed-button">
          <Videocam style={{ color: "#fa3e3e" }} />
        </IconButton>
        <IconButton style={{ color: "#88bf4c" }}>
          <PhotoLibrary />
        </IconButton>
        <IconButton style={{ color: "#f8b928" }}>
          <Mood />
        </IconButton>
      </Stack>
    </Container>
  )
}

const PostFeedCard: React.FC<PostFeedCardProps> = ({ user }) => {
  const { createPost, isLoading } = usePost()
  const [post, setPost] = useState<Post>({
    image: null,
    description: "",
    original_post_id: null,
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({ ...prev, description: event.target.value }))
  }

  const handleSubmit = async () => {
    try {
      const res = await createPost(post)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = () => {
    handleSubmit()
  }

  useEffect(() => {
    console.log(post)
  }, [post])

  return (
    <Card footer={<PostFeedButtons />} sx={{ width: "80%" }}>
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Avatar alt={user.displayName} src="/2.jpeg" />
        <Input
          disableUnderline={true}
          placeholder={`What's on your mind,${
            user.firstName + " " + user.lastName
          } ?`}
          onChange={handleInputChange}
          sx={{
            width: "100%",
            borderRadius: 50,
            backgroundColor: "#f0f2f5",
            paddingLeft: 2,
            fontSize: "0.8rem",
          }}
        />
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
        >
          Upload file
          <Input type="file" hidden />
        </Button>
      </Box>
      <Button
        disabled={isLoading}
        onClick={handleClick}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Post
      </Button>
    </Card>
  )
}

export default PostFeedCard
