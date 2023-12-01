import React, { useEffect, useState } from "react"
import { Post } from "@/hooks/usePost"
import Dialog from "@mui/material/Dialog"
import { Fetcher } from "@/services/fetcher"
import type { Component, FC } from "react"
import { User } from "../FeedCard"
import {
  Avatar,
  Box,
  Stack,
  Typography,
  Container,
  DialogContent,
  DialogTitle,
  Divider,
  DialogContentText,
} from "@mui/material"
import { stringAvatar } from "../UserListItem"
import Card from "../Card"
import CommentInput from "./CommentInput"

interface CommentModalProps {
  post: Post
  isShow: boolean
  onClose: () => void
}

interface Comment {
  id: string
  description: string
  has_image: boolean
  creator: User
  created: string
  modified: string
}

interface CommentCardProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  comment: Comment
}

const CommentCard: FC<CommentCardProps> = ({ comment }: CommentCardProps) => {
  return (
    <>
      {comment ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Avatar
              {...stringAvatar(
                `${comment?.creator?.first_name ?? ""} ${
                  comment.creator?.last_name ?? ""
                }`
              )}
              sx={{ width: 32, height: 32 }}
            />

            <Stack direction="column" alignItems="start">
              <Typography
                component="p"
                sx={{ display: { xs: "none", sm: "block", color: "black" } }}
              >
                {comment.creator?.display_name +
                  " " +
                  comment.creator?.last_name}
              </Typography>
              <Stack direction="row" alignItems="start">
                <Typography
                  variant="caption"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  {"just now"}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
          <Typography
            component="p"
            sx={{ display: { xs: "none", sm: "block", color: "black" } }}
          >
            {comment.description}
          </Typography>
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

const CommentModal: FC<CommentModalProps> = ({
  post,
  isShow,
  onClose,
}: CommentModalProps) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  useEffect(() => {
    const getComments = async (post: Post) => {
      try {
        const response = await Fetcher.GET(
          `/comments?post_id=${post.id}&page_index=${pageIndex}&page_size=20&order_by=_id&is_asc=true`
        )
        setComments(response.records ?? [])
      } catch (err) {
        console.log(err)
      }
    }
    if (isShow && post) getComments(post)
  }, [post, isShow, pageIndex])

  return (
    <Dialog open={isShow} onClose={onClose} scroll="paper">
      <DialogTitle id="scroll-dialog-title">Comments</DialogTitle>
      <DialogContent dividers sx={{ width: "34rem" }}>
        <DialogContentText>
          <Stack spacing={2} direction="column" alignItems="start">
            {comments.map((comment, index) => (
              <>
                <CommentCard comment={comment} key={index} />
              </>
            ))}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "auto",
          margin: "1rem",
        }}
      >
        <CommentInput post={post} />
      </Box>
    </Dialog>
  )
}
export default CommentModal
