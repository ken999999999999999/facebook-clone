import { FC, HTMLAttributes, useState } from "react"
import { IconButton, Stack, Divider, ButtonProps } from "@mui/material"
import {
  Favorite,
  ThumbUp,
  Mood,
  SentimentDissatisfied,
} from "@mui/icons-material"
import { Fetcher } from "@/services/fetcher"
import { Post } from "@/hooks/usePost"
import { Comment, Reactions } from "../FeedCard"
import useAuth from "@/hooks/useAuth"
import theme from "@/styles/theme"
interface ReactionPopupProps extends HTMLAttributes<HTMLButtonElement> {
  post?: Post
  comment?: Comment
  reactions: Reactions[]
  refresh: () => Promise<void>
}

const ReactionPopup: React.FC<ReactionPopupProps> = ({
  post,
  comment,
  reactions: initialReactions,
  refresh,
}: ReactionPopupProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { user } = useAuth()

  const currentReaction: Reactions = initialReactions.filter(
    (r) => r.emoji !== undefined && r.creator.id === user?.id
  )[0]

  const hasReacted = currentReaction?.emoji

  const postReactions = async (emoji: string) => {
    setIsLoading(true)
    try {
      let res = null
      if (post && post.id) {
        res = await Fetcher.POST("/reactions/", {
          emoji: emoji,
          post_id: post.id,
        })
      } else if (comment && comment.id) {
        res = await Fetcher.POST("/reactions/", {
          emoji: emoji,
          comment_id: comment.id,
        })
      }
      refresh()
      console.log(res)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelReactions = async () => {
    setIsLoading(true)
    try {
      let res = null
      if (post && post.id)
        res = await Fetcher.DELETE(`/reactions/${currentReaction.id}`)
      refresh()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const updateReactions = async (emoji: string) => {
    setIsLoading(true)
    try {
      let res = null
      if (post && post.id)
        res = await Fetcher.PUT(`/reactions/${currentReaction.id}`, {
          id: currentReaction.id,
          emoji: emoji,
        })
      refresh()
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

  const onClick = async (event: React.MouseEvent<HTMLElement>) => {
    const emoji = event.currentTarget.id
    if (!hasReacted) {
      await postReactions(emoji)
    } else if (currentReaction.emoji !== emoji) {
      await updateReactions(emoji)
    } else {
      await cancelReactions()
    }
  }

  console.log(hasReacted)

  return (
    post && (
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem />}
        justifyContent="space-evenly"
        alignItems="center"
        spacing={0}
      >
        <IconButton
          id={"thumbUp"}
          className="feed-button"
          onClick={onClick}
          disabled={isLoading}
        >
          <ThumbUp
            sx={{
              color:
                hasReacted === "thumbUp"
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
            }}
          />
        </IconButton>
        <IconButton
          id={"heart"}
          className="feed-button"
          onClick={onClick}
          disabled={isLoading}
        >
          <Favorite
            sx={{
              color:
                hasReacted === "heart"
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
            }}
          />
        </IconButton>
        <IconButton
          id={"haha"}
          className="feed-button"
          onClick={onClick}
          disabled={isLoading}
        >
          <Mood
            sx={{
              color:
                hasReacted === "haha"
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
            }}
          />
        </IconButton>
        <IconButton
          id={"sad"}
          className="feed-button"
          onClick={onClick}
          disabled={isLoading}
        >
          <SentimentDissatisfied
            sx={{
              color:
                hasReacted === "sad"
                  ? theme.palette.primary.main
                  : theme.palette.secondary.main,
            }}
          />
        </IconButton>
      </Stack>
    )
  )
}

export default ReactionPopup
