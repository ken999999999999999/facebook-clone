import Card from "./Card"
import { CardProps } from "./Card"
import { IconButton, Typography } from "@mui/material"
import { ThumbUp, Comment, Share } from "@mui/icons-material"
import Divider from "@mui/material/Divider"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"

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

export interface Post {
  id: string
  likes: number
  comments: Comment[]
  image: string
  description: string
  createdBy: User
  createdOn: string
  modifiedOn: string
  originalPost?: Post | null
}

export interface FeedCardProps extends CardProps {
  post: Post
}

const FeedCardButtons = () => {
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
          <ThumbUp />
        </IconButton>
        <IconButton className="feed-button">
          <Comment />
        </IconButton>
        <IconButton className="feed-button">
          <Share />
        </IconButton>
      </Stack>
    </Container>
  )
}

const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  const {
    id,
    likes,
    comments,
    image,
    description,
    createdBy,
    createdOn,
    modifiedOn,
    originalPost,
  } = post
  return (
    <Card
      title={createdBy.displayName}
      footer={<FeedCardButtons />}
      sx={{ width: "80%" }}
    >
      {description}
    </Card>
  )
}

export default FeedCard
