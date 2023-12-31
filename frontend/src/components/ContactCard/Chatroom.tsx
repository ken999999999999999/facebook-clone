import React, { useCallback, useEffect, useState } from "react"
import { Fetcher } from "@/services/fetcher"
import ListItemSkeleton from "../ListItemSkeleton"
import {
  ListItem,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material"
import Comment from "@mui/icons-material/Comment"
import { IUser } from "@/context/AuthContext"

interface IChatroom {
  handleOnClick: (chatroomId: string) => void
}

const Chatroom = ({ handleOnClick }: IChatroom): JSX.Element => {
  const [pageIndex, setPageIndex] = useState(0)
  const [chatrooms, setChatrooms] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isNotMore, setIsNotMore] = useState(false)

  const getChatrooms = useCallback(() => {
    const callAPI = async () => {
      try {
        pageIndex > 0
        const response = await Fetcher.GET(
          `/chatrooms/?page_index=${pageIndex}&page_size=50&order_by=_id&is_asc=true`
        )
        setChatrooms((prev) => [...prev, ...response])
        if (response.length < 50) setIsNotMore(true)
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    callAPI()
  }, [pageIndex])

  useEffect(() => {
    getChatrooms()
  }, [getChatrooms])

  return !isLoading ? (
    <List style={{ overflowY: "auto", maxHeight: "70vh" }}>
      {chatrooms.map((chatroom) => (
        <ListItem
          key={chatroom.id}
          disableGutters
          disablePadding
          secondaryAction={
            <IconButton>
              <Comment />
            </IconButton>
          }
          onClick={() => handleOnClick(chatroom.id)}
        >
          <ListItemButton>
            <ListItemText
              primary={chatroom.title}
              secondary={chatroom.users
                .map((user: IUser) => user.display_name)
                .join(",")}
            />
          </ListItemButton>
        </ListItem>
      ))}
      {!isNotMore && (
        <ListItemButton
          disabled={isLoading}
          onClick={() => setPageIndex((prev) => prev + 1)}
        >
          <Typography color="primary">More</Typography>
        </ListItemButton>
      )}
    </List>
  ) : (
    <ListItemSkeleton showCircle={false} />
  )
}

export default Chatroom
