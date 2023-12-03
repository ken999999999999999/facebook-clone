import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material"
import { memo, useCallback, useEffect, useState } from "react"
import SendIcon from "@mui/icons-material/Send"
import { IUser } from "@/context/AuthContext"

interface IChatroomInput {
  chatroomId: string | null
  setChats: (data: any) => void
}
export interface IChat {
  id: string
  message: string
  creator: IUser
  created: string
}

const ChatroomInput = ({
  chatroomId,
  setChats,
}: IChatroomInput): JSX.Element => {
  const [message, setMessage] = useState<string>("")
  const [isSending, setIsSending] = useState(false)
  const [webSocket, setWebSocket] = useState<any>()

  useEffect(() => {
    let ws: any = null

    const connectWs = (id: string) => {
      ws = new WebSocket(`${process.env.NEXT_PUBLIC_CHATROOM_WEBSOCKET}${id}`)
      ws.onopen = () => {}
      ws.onmessage = (e: any) => {
        setChats((prev: IChat[]) => [...prev, JSON.parse(e.data)])
      }
      setWebSocket(ws)
    }

    if (chatroomId) connectWs(chatroomId)

    return () => {
      ws && ws?.close()
      setWebSocket(null)
      setMessage("")
    }
  }, [chatroomId, setChats])

  const sendMessage = useCallback(() => {
    webSocket?.send(message)
    setMessage("")
  }, [webSocket, message])

  return (
    <form style={{ width: "100%" }}>
      <FormControl fullWidth variant="outlined">
        <OutlinedInput
          autoFocus
          value={message}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setMessage(event.target.value)
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                type="submit"
                color="primary"
                disabled={isSending || !message.length}
                onClick={sendMessage}
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </form>
  )
}

export default memo(ChatroomInput)
