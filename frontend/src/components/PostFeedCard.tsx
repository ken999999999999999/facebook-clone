import { HtmlHTMLAttributes } from "react"
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
} from "@mui/material"
import { Videocam, PhotoLibrary, Mood } from "@mui/icons-material"
interface PostFeedCardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  user: User
}

const PostFeedButtons = () => {
  //create three button named likes, comments and share
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
  return (
    <Card footer={<PostFeedButtons />}>
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Avatar alt={user.displayName} src="/2.jpeg" />
        <Input
          disableUnderline={true}
          placeholder={`What's on your mind,${
            user.firstName + " " + user.lastName
          } ?`}
          sx={{
            width: "100%",
            borderRadius: 50,
            backgroundColor: "#f0f2f5",
            paddingLeft: 2,
            fontSize: "0.8rem",
          }}
        />
      </Box>
    </Card>
  )
}

export default PostFeedCard
