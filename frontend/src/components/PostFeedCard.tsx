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
  ImageListItem,
} from "@mui/material"
import { Videocam, PhotoLibrary, Mood, CloudUpload } from "@mui/icons-material"
import { Post, usePost } from "@/hooks/usePost"
import ImageIcon from "@mui/icons-material/Image"
import useAuth from "@/hooks/useAuth"
import { stringAvatar } from "./UserListItem"
interface PostFeedCardProps extends HtmlHTMLAttributes<HTMLDivElement> {}

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

const PostFeedCard: React.FC<PostFeedCardProps> = ({}) => {
  const { user } = useAuth()
  const { createPost, getPosts, isLoading } = usePost()
  const [post, setPost] = useState<Post | null>(null)
  const [image, setImage] = useState<string>("")

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev: any) => ({ ...prev, description: event.target.value }))
  }

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        const base64String = reader.result
        if (typeof base64String === "string") {
          setImage(base64String)
          setPost((prev: any) => ({
            ...prev,
            image: base64String,
          }))
        }
      }
    }
  }

  const handleSubmit = async () => {
    try {
      if (post) {
        const res = await createPost(post)
        console.log(res)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = () => {
    handleSubmit()
  }

  return user ? (
    <Card footer={<PostFeedButtons />} style={{ marginBottom: "20px" }}>
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Avatar {...stringAvatar(`${user?.first_name} ${user?.last_name}`)} />
        <Input
          disableUnderline={true}
          placeholder={`What's on your mind,${
            user?.first_name + " " + user?.last_name
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
        <Button component="label">
          <ImageIcon />
          <input type="file" hidden onChange={handleImageFileChange} />
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
      {image ? (
        <ImageListItem sx={{ width: 50, height: 50 }}>
          <img src={image}></img>
        </ImageListItem>
      ) : null}
    </Card>
  ) : (
    <></>
  )
}

export default PostFeedCard
