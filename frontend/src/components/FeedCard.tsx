import { useEffect } from "react"
import Card from "./Card"
import { CardProps } from "./Card"
import { Avatar, Box, IconButton, Typography } from "@mui/material"
import { ThumbUp, Comment, Share } from "@mui/icons-material"
import Divider from "@mui/material/Divider"
import Container from "@mui/material/Container"
import Stack from "@mui/material/Stack"
import { Post, usePost } from "@/hooks/usePost"
import { stringAvatar } from "./UserListItem"
import PeopleIcon from "@mui/icons-material/People"
import { useState } from "react"
import { Fetcher } from "@/services/fetcher"
import CommentModal from "./Comments/CommentModal"
export interface User {
  last_name: string
  first_name: string
  display_name: string
  birthDate?: string
  id?: string
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

const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  const [image, setImage] = useState<string | null>(null)
  const [showComment, setShowComment] = useState<boolean>(false)

  const openCommentModal = () => {
    setShowComment(true)
  }

  const closeCommentModal = () => {
    setShowComment(false)
  }

  useEffect(() => {
    const getImage = async (id: string) => {
      const res = await Fetcher.GET(`/posts/${id}/image`)
      setImage(res)
    }

    if (post.id && post.has_image) getImage(post.id)
  }, [post])

  return post ? (
    <Card
      footer={
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
            <IconButton className="feed-button" onClick={openCommentModal}>
              <Comment />
            </IconButton>
            <IconButton className="feed-button">
              <Share />
            </IconButton>
          </Stack>
        </>
      }
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Stack spacing={1} direction="row" alignItems="center">
          <Avatar
            {...stringAvatar(
              `${post.creator?.first_name ?? ""} ${
                post.creator?.last_name ?? ""
              }`
            )}
            sx={{ width: 32, height: 32 }}
          />

          <Stack direction="column" alignItems="start">
            {post.creator?.display_name + " " + post.creator?.last_name}
            <Stack direction="row" alignItems="start">
              <Typography
                variant="caption"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                {"just now"}
              </Typography>
              <span aria-hidden="true">· </span>
              <PeopleIcon sx={{ width: 18, height: 18 }} />
            </Stack>
          </Stack>
        </Stack>
        <Typography component="p" sx={{ display: { xs: "none", sm: "block" } }}>
          {post.description}
        </Typography>
        <Container
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {post.has_image && image ? <img src={image} loading="lazy" /> : null}
        </Container>
      </Box>
      <CommentModal
        post={post}
        isShow={showComment}
        onClose={closeCommentModal}
      />
    </Card>
  ) : (
    <></>
  )
}

export default FeedCard
