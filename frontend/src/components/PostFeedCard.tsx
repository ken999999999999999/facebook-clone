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
  Button,
  ImageListItem,
  Typography,
  FormControl,
  InputAdornment,
} from "@mui/material"
import { Videocam, PhotoLibrary, Mood, Cancel, Send } from "@mui/icons-material"
import { Post, usePost } from "@/hooks/usePost"
import ImageIcon from "@mui/icons-material/Image"
import useAuth from "@/hooks/useAuth"
import { stringAvatar } from "./UserListItem"
interface PostFeedCardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  refresh: () => Promise<void>
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

const PostFeedCard: React.FC<PostFeedCardProps> = ({
  refresh,
}: PostFeedCardProps) => {
  const { user } = useAuth()
  const { createPost } = usePost()
  const [post, setPost] = useState<Post | null>(null)
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
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

  const clearImage = () => {
    setImage(null)
    setPost((prev: any) => ({
      ...prev,
      image: null,
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      if (post && post?.description !== "") {
        console.log(post)
        const res = await createPost(post)

        refresh()
      } else if (post?.description === "") {
        window.alert("post is empty")
        throw new Error("post is empty")
      }
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return user ? (
    <Card style={{ marginBottom: "20px" }}>
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Avatar {...stringAvatar(`${user?.first_name} ${user?.last_name}`)} />
        <form style={{ width: "100%" }}>
          <FormControl fullWidth variant="outlined">
            <Input
              disableUnderline
              placeholder={`What's on your mind,${
                user?.first_name + " " + user?.last_name
              } ?`}
              autoFocus
              value={post?.description}
              onChange={handleInputChange}
              sx={{
                width: "100%",
                borderRadius: 50,
                backgroundColor: "#f0f2f5",
                paddingLeft: 2,
                fontSize: "0.8rem",
              }}
            />
          </FormControl>
        </form>

        <Button component="label">
          <ImageIcon />
          <input type="file" hidden onChange={handleImageFileChange} />
        </Button>
      </Box>
      {image ? (
        <Box sx={{ padding: "10px" }}>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography component={"footer"} sx={{ color: "#616161" }}>
              Image to be uploaded:
            </Typography>
            <IconButton onClick={clearImage}>
              <Cancel />
            </IconButton>
          </Stack>
          <ImageListItem sx={{ width: "auto", height: "auto" }}>
            <img src={image}></img>
          </ImageListItem>
        </Box>
      ) : null}
      <Button
        disabled={isLoading}
        onClick={handleSubmit}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Post
      </Button>
    </Card>
  ) : (
    <></>
  )
}

export default PostFeedCard
