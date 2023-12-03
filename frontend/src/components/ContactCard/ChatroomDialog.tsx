import {
  Alert,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { IUser } from "@/context/AuthContext"
import { Fetcher } from "@/services/fetcher"
import useAuth from "@/hooks/useAuth"
import ChatroomInput, { IChat } from "./ChatroomInput"
import ListItemSkeleton from "../ListItemSkeleton"
import { stringAvatar } from "../UserListItem"
import React from "react"

interface IChatroomDialog {
  chatroomId: string | null
  handleClose: () => void
}

interface IChatroom {
  id: string
  title: string
  users: IUser[]
}

const ChatroomDialog = ({
  chatroomId,
  handleClose,
}: IChatroomDialog): JSX.Element => {
  const { user } = useAuth()
  const [chatroom, setChatroom] = useState<IChatroom | null>(null)
  const [chats, setChats] = useState<IChat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const listRef = useRef<any>()

  useEffect(() => {
    if (chatroomId)
      listRef?.current?.scrollIntoView({ block: "end", behavior: "smooth" })
  }, [chats, chatroomId])

  useEffect(() => {
    const startChat = async (id: string) => {
      try {
        setIsLoading(true)
        const chatroom = await Fetcher.GET(`/chatrooms/${id}`)
        const chats = await Fetcher.GET(`/chats/?chatroom_id=${id}`)
        setChatroom(chatroom)
        setChats(chats)
      } catch (err) {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (chatroomId) startChat(chatroomId)

    return () => {
      setIsError(false)
      setChats([])
      setChatroom(null)
    }
  }, [chatroomId])

  return (
    <Dialog open={!!chatroomId} onClose={handleClose} fullWidth maxWidth="md">
      {isError && <Alert severity="error">Oops, something goes wrong!</Alert>}
      <DialogTitle>
        {chatroom?.title ?? ""}
        <AvatarGroup max={10} total={chatroom?.users?.length}>
          {chatroom?.users.map((user) => (
            <Avatar
              sizes="small"
              key={user.id}
              {...stringAvatar(`${user.first_name} ${user.last_name}`)}
            />
          ))}
        </AvatarGroup>
      </DialogTitle>
      <DialogContent dividers>
        {!isLoading ? (
          <List ref={listRef}>
            {chats?.map(({ id, message, created, creator }) => (
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
                      <React.Fragment>
                        <Typography
                          style={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color={
                            creator.id === user?.id ? "primary" : "text.primary"
                          }
                        >
                          {`${creator.display_name}${
                            creator.id === user?.id ? " (You)" : ""
                          }`}
                        </Typography>
                        <Typography
                          style={{ display: "inline" }}
                          component="span"
                          variant="caption"
                        >
                          {` — ${created}`}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={<Typography>{message}</Typography>}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        ) : (
          <ListItemSkeleton total={20} showCircle={false} />
        )}
      </DialogContent>
      <DialogActions>
        {!isLoading && (
          <ChatroomInput chatroomId={chatroomId} setChats={setChats} />
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ChatroomDialog
