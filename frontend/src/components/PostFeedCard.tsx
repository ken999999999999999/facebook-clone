import { useCallback, useState } from "react"
import Card from "./Card"
import {
  Box,
  Input,
  Avatar,
  Button,
  CardMedia,
  IconButton,
  Badge,
  Snackbar,
  Alert,
} from "@mui/material"
import { Post } from "@/hooks/usePost"
import ImageIcon from "@mui/icons-material/Image"
import useAuth from "@/hooks/useAuth"
import { stringAvatar } from "./UserListItem"
import { Fetcher } from "@/services/fetcher"

interface IPostFeedCard {
  afterCreate: (post: Post) => void
}

const PostFeedCard = ({ afterCreate }: IPostFeedCard): JSX.Element => {
  const { user } = useAuth()
  const [message, setMessage] = useState<string>("")
  const [image, setImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!!event?.target?.files?.length) {
      const file = event.target.files?.[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        const base64String = reader.result
        if (typeof base64String === "string") {
          setImage(base64String)
        }
      }
    }
  }

  const handleSubmit = useCallback(() => {
    const callAPI = async () => {
      setIsLoading(true)
      try {
        const res = await Fetcher.POST("/posts/", {
          description: message,
          image,
        })
        afterCreate({
          description: message,
          image,
          creator: user,
          has_image: !!image,
          id: res,
        })
        setIsSuccess(true)
      } catch (err) {
        console.log(err)
      } finally {
        setMessage("")
        setImage(null)
        setIsLoading(false)
      }
    }

    callAPI()
  }, [message, image, afterCreate, user])

  return (
    <Card style={{ marginBottom: "20px" }}>
      <Snackbar
        open={isSuccess}
        onClose={() => setIsSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success">Post Successfully!</Alert>
      </Snackbar>
      <Box display="flex" gap={1} mb="10px">
        <Avatar {...stringAvatar(`${user?.first_name} ${user?.last_name}`)} />
        <Input
          disableUnderline
          value={message}
          placeholder={`What's on your mind? ${user?.display_name ?? ""}`}
          onChange={(event) => setMessage(event.target.value)}
          fullWidth
          autoFocus
          style={{
            borderRadius: 50,
            backgroundColor: "#f0f2f5",
            paddingLeft: "10px",
            fontSize: "0.8rem",
          }}
        />
        <IconButton component="label">
          <ImageIcon />
          <input
            type="file"
            hidden
            onChange={handleImageFileChange}
            onClick={(event: any) => {
              event.target.value = null
            }}
            accept="image/*"
          />
        </IconButton>
      </Box>
      {image && <CardMedia component="img" image={image} alt="image" />}
      {image && (
        <Button
          style={{ marginTop: "20px" }}
          onClick={() => setImage(null)}
          fullWidth
          variant="outlined"
          color="error"
        >
          Remove Image
        </Button>
      )}
      <Button
        style={{ marginTop: "20px" }}
        disabled={isLoading || !message.length}
        onClick={handleSubmit}
        fullWidth
        variant="contained"
      >
        Post
      </Button>
    </Card>
  )
}

export default PostFeedCard
