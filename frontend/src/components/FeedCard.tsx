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
  CardHeader,
  CardMedia,
  CardContent,
} from "@mui/material"
import { ThumbUp, Comment, Share } from "@mui/icons-material"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import { Post } from "@/hooks/usePost"
import { stringAvatar } from "./UserListItem"
import PeopleIcon from "@mui/icons-material/People"
import { useState } from "react"
import { Fetcher } from "@/services/fetcher"
import CommentModal from "./Comments/CommentModal"
import ReactionPopup from "./Reactions/ReactionPopup"
import ReactionsModal from "./Reactions/ReactionsModal"
import { IUser } from "@/context/AuthContext"
import useAuth from "@/hooks/useAuth"
import theme from "@/styles/theme"
import moment from "moment"
export interface User {
  last_name: string
  first_name: string
  display_name: string
  birthDate?: string
  id?: string
}

export interface Reactions {
  id?: string
  postId?: string
  commentId?: string
  creator: User
  emoji: string
}

export interface Comment {
  id?: string
  postId: string
  description: string
  createdBy: IUser
  createdOn: string
  modifiedOn: string
  image: string
}

export interface FeedCardProps extends CardProps {
  post: Post
}

const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  const { user } = useAuth()
  const [image, setImage] = useState<string | null>(null)
  const [reactions, setReactions] = useState<Reactions[]>([])
  const [showComment, setShowComment] = useState<boolean>(false)
  const [showReactions, setShowReactions] = useState<boolean>(false)

  const haveReactions =
    reactions.filter((r) => r.emoji !== undefined).length > 0

  const currentReaction: Reactions = reactions.filter(
    (r) => r.emoji !== undefined && r.creator.id === user?.id
  )[0]

  const hasLiked = currentReaction?.emoji !== undefined

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

  const updateReactions = async (id: string, emoji: string) => {
    try {
      const res = await Fetcher.PUT(`/reactions/${id}`, {
        id: currentReaction.id,
        emoji: emoji,
      })
      await getReactions()
    } catch (err) {
      console.log(err)
    }
  }

  const postReactions = async (id: string, emoji: string) => {
    try {
      const res = await Fetcher.POST("/reactions/", {
        emoji: emoji,
        post_id: id,
      })
      await getReactions()
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const getReactions = async () => {
    try {
      if (post.id) {
        const response = await Fetcher.GET(`/reactions/?post_id=${post.id}`)
        setReactions(response)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const cancelReactions = async (id: string) => {
    try {
      const response = await Fetcher.DELETE(`/reactions/${id}`)
      console.log(response)
      await getReactions()
    } catch (err) {
      console.log(err)
    }
  }

  const toggleLikeButton = async () => {
    console.log(currentReaction, hasLiked, post.id)
    if (currentReaction?.id && hasLiked === true) {
      await cancelReactions(currentReaction.id)
    } else if (
      currentReaction?.id &&
      hasLiked === false &&
      hasLiked !== undefined
    ) {
      await updateReactions(currentReaction.id, "thumbUp")
    } else if (post.id && hasLiked === false) {
      await postReactions(post.id, "thumbUp")
    }
    console.log(hasLiked)
  }

  useEffect(() => {
    const getImage = async (id: string) => {
      const res = await Fetcher.GET(`/posts/${id}/image`)
      setImage(res)
    }

    const getReactions = async (id: string) => {
      try {
        if (id) {
          const response = await Fetcher.GET(`/reactions/?post_id=${id}`)
          setReactions(response)
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (post.id && post.has_image) getImage(post.id)
    if (post.id) getReactions(post.id)
  }, [post])

  return (
    <Card
      style={{ marginBottom: "20px" }}
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
                  <ReactionPopup
                    post={post}
                    reactions={reactions}
                    refresh={getReactions}
                  />
                </React.Fragment>
              }
            >
              <IconButton onClick={toggleLikeButton}>
                <ThumbUp
                  sx={{
                    color: hasLiked
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                  }}
                />
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
      <CardHeader
        style={{ padding: "0" }}
        avatar={
          <Avatar
            {...stringAvatar(
              `${post.creator?.first_name ?? ""} ${
                post.creator?.last_name ?? ""
              }`
            )}
          />
        }
        title={post.creator?.display_name}
        subheader={moment(post.created).format("YYYY-MM-DD HH:mm:ss")}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {post.description}
        </Typography>
      </CardContent>
      {post.has_image && image && (
        <CardMedia component="img" image={image} alt="image" />
      )}
      {haveReactions && (
        <Stack
          style={{ margin: "10px 0px" }}
          flexDirection={"row"}
          justifyContent={"start"}
          alignItems={"center"}
        >
          <img
            style={{ cursor: "pointer", marginRight: "0.25rem" }}
            height="26"
            role="presentation"
            src="data:image/svg+xml,%3Csvg fill='none' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint0_linear_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint1_radial_15251_63610)'/%3E%3Cpath d='M16.0001 7.9996c0 4.418-3.5815 7.9996-7.9995 7.9996S.001 12.4176.001 7.9996 3.5825 0 8.0006 0C12.4186 0 16 3.5815 16 7.9996Z' fill='url(%23paint2_radial_15251_63610)' fill-opacity='.5'/%3E%3Cpath d='M7.3014 3.8662a.6974.6974 0 0 1 .6974-.6977c.6742 0 1.2207.5465 1.2207 1.2206v1.7464a.101.101 0 0 0 .101.101h1.7953c.992 0 1.7232.9273 1.4917 1.892l-.4572 1.9047a2.301 2.301 0 0 1-2.2374 1.764H6.9185a.5752.5752 0 0 1-.5752-.5752V7.7384c0-.4168.097-.8278.2834-1.2005l.2856-.5712a3.6878 3.6878 0 0 0 .3893-1.6509l-.0002-.4496ZM4.367 7a.767.767 0 0 0-.7669.767v3.2598a.767.767 0 0 0 .767.767h.767a.3835.3835 0 0 0 .3835-.3835V7.3835A.3835.3835 0 0 0 5.134 7h-.767Z' fill='%23fff'/%3E%3Cdefs%3E%3CradialGradient id='paint1_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(90 .0005 8) scale(7.99958)'%3E%3Cstop offset='.5618' stop-color='%230866FF' stop-opacity='0'/%3E%3Cstop offset='1' stop-color='%230866FF' stop-opacity='.1'/%3E%3C/radialGradient%3E%3CradialGradient id='paint2_radial_15251_63610' cx='0' cy='0' r='1' gradientUnits='userSpaceOnUse' gradientTransform='rotate(45 -4.5257 10.9237) scale(10.1818)'%3E%3Cstop offset='.3143' stop-color='%2302ADFC'/%3E%3Cstop offset='1' stop-color='%2302ADFC' stop-opacity='0'/%3E%3C/radialGradient%3E%3ClinearGradient id='paint0_linear_15251_63610' x1='2.3989' y1='2.3999' x2='13.5983' y2='13.5993' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%2302ADFC'/%3E%3Cstop offset='.5' stop-color='%230866FF'/%3E%3Cstop offset='1' stop-color='%232B7EFF'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E"
            width="18"
          />
          <Typography
            sx={{ margin: 0, cursor: "pointer" }}
            onClick={openReactionModal}
          >
            {reactions[0].creator.display_name} and others liked
          </Typography>
        </Stack>
      )}

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
  )
}

export default FeedCard
