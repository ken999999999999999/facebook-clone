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
import moment from "moment"

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
      setIsLoading(true)
    }
  }, [chatroomId])

  return (
    <Dialog open={!!chatroomId} onClose={handleClose} fullWidth maxWidth="md">
      {isError && <Alert severity="error">Oops, something goes wrong!</Alert>}
      <DialogTitle>
        <Typography variant="h5"> {chatroom?.title ?? ""}</Typography>
        <Typography variant="caption" style={{ display: "inline" }}>
          Who&apos;s in this chatroom:
        </Typography>
        <Typography variant="body2" style={{ display: "inline" }}>
          {chatroom?.users.map((user) => user.display_name).join(",")}
        </Typography>
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
                      <Typography
                        color={
                          creator.id === user?.id ? "primary" : "text.primary"
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
                          {message}
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
