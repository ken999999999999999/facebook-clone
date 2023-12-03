import { Post } from "@/hooks/usePost"
import { useEffect, useState, type FC } from "react"
import { Comment, User } from "../FeedCard"
import { Fetcher } from "@/services/fetcher"
import { Reactions as MUIReactions } from "@/components/FeedCard"
import {
  Avatar,
  Box,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Grid,
  Typography,
} from "@mui/material"
import { stringAvatar } from "../UserListItem"
import {
  Favorite,
  Mood,
  SentimentDissatisfied,
  ThumbUp,
} from "@mui/icons-material"
interface ReactionsModalProps {
  post?: Post
  comment?: Comment
  isShow: boolean
  onClose?: (event: Event) => void
}

interface Reactions extends MUIReactions {
  id: string
  emoji: string
  creator: User
}

interface ReactionRecordCardProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  reaction?: Reactions
}

const ReactionRecordCard: FC<ReactionRecordCardProps> = ({
  reaction,
}: ReactionRecordCardProps) => {
  console.log("item", reaction)
  return (
    <>
      {reaction ? (
        <Grid container>
          <Grid item xs={8}>
            <Stack spacing={1} direction="row" alignItems="center">
              <Avatar
                {...stringAvatar(
                  `${reaction?.creator?.first_name ?? ""} ${
                    reaction.creator?.last_name ?? ""
                  }`
                )}
                sx={{ width: 32, height: 32 }}
              />

              <Stack direction="column" alignItems="start">
                <Typography
                  component="p"
                  sx={{ display: { xs: "none", sm: "block", color: "black" } }}
                >
                  {reaction.creator?.display_name +
                    " " +
                    reaction.creator?.last_name}
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
          </Grid>
          <Grid item xs={4}>
            <Stack direction="row" alignItems="center" justifyContent={"end"}>
              <Typography
                component="p"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                    color: "black",
                    textAlign: "center",
                  },
                }}
              >
                {reaction.emoji === "thumbUp" ? (
                  <ThumbUp />
                ) : reaction.emoji === "heart" ? (
                  <Favorite />
                ) : reaction.emoji === "haha" ? (
                  <Mood />
                ) : reaction.emoji === "sad" ? (
                  <SentimentDissatisfied />
                ) : null}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : null}
    </>
  )
}

const ReactionsModal: FC<ReactionsModalProps> = ({
  post,
  comment,
  isShow,
  onClose,
}: ReactionsModalProps) => {
  const [reactions, setReactions] = useState<Reactions[]>([])

  useEffect(() => {
    const getReactions = async () => {
      try {
        if (post?.id) {
          const response = await Fetcher.GET(`/reactions?post_id=${post.id}`)
          setReactions(response)
          console.log(response)
        } else if (comment?.id) {
          const response = await Fetcher.GET(
            `/reactions?comment_id=${comment.id}`
          )
          setReactions(response)
        } else {
          throw new Error("No post or comment")
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (isShow && (comment || post)) getReactions()
  }, [isShow, post, comment])

  return (
    <Dialog open={isShow} onClose={onClose} scroll="paper">
      <DialogTitle id="scroll-dialog-title">Reactions</DialogTitle>
      <DialogContent dividers sx={{ width: "34rem" }}>
        <DialogContentText>
          <Stack spacing={2} direction="column-reverse" alignItems="start">
            {reactions.map((reaction, index) => (
              <ReactionRecordCard
                key={`${index}-reaction`}
                reaction={reaction}
              />
            ))}
          </Stack>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  )
}
export default ReactionsModal
