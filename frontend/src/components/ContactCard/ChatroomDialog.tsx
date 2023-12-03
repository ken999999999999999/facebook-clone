import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { useEffect, useState } from "react"
import { IUser } from "@/context/AuthContext"
import { Fetcher } from "@/services/fetcher"
import useAuth from "@/hooks/useAuth"
import ChatroomInput, { IChat } from "./ChatroomInput"

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
    <Dialog open={!!chatroomId} onClose={handleClose} fullWidth maxWidth="sm">
      {isError && <Alert severity="error">Oops, something goes wrong!</Alert>}
      <DialogTitle>{chatroom?.title ?? ""}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {chats.join(",")}
        </DialogContentText>
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
