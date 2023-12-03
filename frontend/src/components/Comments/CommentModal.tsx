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
  Container,
  DialogContent,
  DialogTitle,
  DialogContentText,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Divider,
  List,
} from "@mui/material"
import { stringAvatar } from "../UserListItem"
import CommentInput from "./CommentInput"
import CommentSkeleton from "./CommentSkeleton"
import moment from "moment"
import useAuth from "@/hooks/useAuth"
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
  loading: boolean
  comment: Comment
}

const CommentCard: FC<CommentCardProps> = ({
  loading,
  comment,
}: CommentCardProps) => {
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
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isInit, setIsInit] = useState(true)

  useEffect(() => {
    const getComments = async (post: Post) => {
      setIsInit(true)
      try {
        const response = await Fetcher.GET(
          `/comments/?post_id=${post.id}&page_index=${pageIndex}&page_size=20&order_by=_id&is_asc=true`
        )
        setComments(response.records ?? [])
      } catch (err) {
        console.log(err)
      } finally {
        setIsInit(false)
      }
    }
    if (isShow) getComments(post)
  }, [post, isShow, pageIndex])

  const refresh = async () => {
    setIsLoading(true)
    try {
      const response = await Fetcher.GET(
        `/comments/?post_id=${post.id}&page_index=${pageIndex}&page_size=20&order_by=_id&is_asc=true`
      )
      setComments(response.records)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isShow} onClose={onClose} scroll="paper">
      <DialogTitle id="scroll-dialog-title">Comments</DialogTitle>
      <DialogContent dividers sx={{ width: "34rem" }}>
        <DialogContentText>
          {isInit ? (
            <CommentSkeleton />
          ) : (
            <List>
              <Stack spacing={2} direction="column-reverse" alignItems="start">
                {comments?.map(({ id, description, created, creator }) => (
                  <React.Fragment key={id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar
                          {...stringAvatar(
                            `${creator.first_name} ${creator.last_name}`
                          )}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            color={
                              creator.id === user?.id
                                ? "primary"
                                : "text.primary"
                            }
                          >
                            {`${creator.display_name}${
                              creator.id === user?.id ? " (You)" : ""
                            }`}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography style={{ display: "inline" }}>
                              {description}
                            </Typography>
                            <Typography
                              style={{ display: "inline" }}
                              component="span"
                              variant="caption"
                            >
                              {` — ${moment(created).format(
                                "YYYY-MM-DD hh:mm:ss"
                              )}`}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </Stack>
            </List>
          )}
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
        <CommentInput post={post} refresh={refresh} />
      </Box>
    </Dialog>
  )
}
export default CommentModal
