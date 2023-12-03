import React, { useEffect } from "react"
import Card from "./Card"
import { CardProps } from "./Card"
import { styled } from "@mui/material/styles"
import {
  Avatar,
  Box,
  IconButton,
  Tooltip,
  Typography,
  TooltipProps,
  tooltipClasses,
  Button,
} from "@mui/material"
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
import ReactionPopup from "./Reactions/ReactionPopup"
import ReactionsModal from "./Reactions/ReactionsModal"
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
  id?: string
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
  const [showReactions, setShowReactions] = useState<boolean>(false)

  const openReactionModal = () => {
    setShowReactions(true)
  }

  const closeReactionModal = () => {
    setShowReactions(false)
  }

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

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
  }))

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
            <LightTooltip
              placement="top"
              title={
                <React.Fragment>
                  <ReactionPopup post={post} />
                </React.Fragment>
              }
            >
              <IconButton>
                <ThumbUp />
              </IconButton>
            </LightTooltip>

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

        <img
          style={{ cursor: "pointer" }}
          onClick={openReactionModal}
          height="26"
          role="presentation"
          src="data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"
          width="18"
        />

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
      <ReactionsModal
        post={post}
        isShow={showReactions}
        onClose={closeReactionModal}
      />
    </Card>
  ) : (
    <></>
  )
}

export default FeedCard
