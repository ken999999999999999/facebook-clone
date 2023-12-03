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
import { Comment } from "../FeedCard"
interface ReactionPopupProps extends HTMLAttributes<HTMLButtonElement> {
  post?: Post
  comment?: Comment
}

const ReactionPopup: React.FC<ReactionPopupProps> = ({
  post,
  comment,
}: ReactionPopupProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onClick = async (event: React.MouseEvent<HTMLElement>) => {
    setIsLoading(true)
    try {
      let res = null
      if (post && post.id) {
        res = await Fetcher.POST("/reactions", {
          emoji: event.currentTarget.id,
          post_id: post.id,
        })
      } else if (comment && comment.id) {
        res = await Fetcher.POST("/reactions", {
          emoji: event.currentTarget.id,
          comment_id: comment.id,
        })
      }
      console.log(res)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
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
          <ThumbUp />
        </IconButton>
        <IconButton
          id={"heart"}
          className="feed-button"
          onClick={onClick}
          disabled={isLoading}
        >
          <Favorite />
        </IconButton>
        <IconButton
          id={"haha"}
          className="feed-button"
          onClick={onClick}
          disabled={isLoading}
        >
          <Mood />
        </IconButton>
        <IconButton
          id={"sad"}
          className="feed-button"
          onClick={onClick}
          disabled={isLoading}
        >
          <SentimentDissatisfied />
        </IconButton>
      </Stack>
    )
  )
}

export default ReactionPopup
