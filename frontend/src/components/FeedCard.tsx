import Card from "./Card"
import { CardProps } from "./Card"
import { IconButton, Typography } from "@mui/material"
import { ThumbUp, Comment, Share } from "@mui/icons-material"
import Divider from "@mui/material/Divider"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import { Post } from "@/hooks/usePost"

export interface User {
  lastName: string
  firstName: string
  displayName: string
  birthDate: string
}

export interface Reactions {
  postId?: string
  commentId?: string
  createdBy: string
  emoji: string
}

export interface Comment {
  postId: string
  description: string
  createdBy: User
  createdOn: string
  modifiedOn: string
  image: string
}

export interface FeedCardProps extends CardProps {
  post: Post
}

const FeedCardButtons = () => {
  //create three button named likes, comments and share
  return (
    <>
      <Divider />
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-evenly"
        alignItems="center"
        spacing={0}
      >
        <IconButton className="feed-button">
          <ThumbUp />
        </IconButton>
        <IconButton className="feed-button">
          <Comment />
        </IconButton>
        <IconButton className="feed-button">
          <Share />
        </IconButton>
      </Stack>
    </>
  )
}

const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  return (
    <Card title={"title"} footer={<FeedCardButtons />}>
      {post.description}
    </Card>
  )
}

export default FeedCard
