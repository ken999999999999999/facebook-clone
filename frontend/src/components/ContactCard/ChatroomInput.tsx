import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material"
import { memo, useEffect, useState } from "react"
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
  created: moment.Moment
}

const ChatroomInput = ({
  chatroomId,
  setChats,
}: IChatroomInput): JSX.Element => {
  const [message, setMessage] = useState<string>("")
  const [isSending, setIsSending] = useState(false)
  const [webSocket, setWebSocket] = useState<any>()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let ws: any = null

    const connectWs = (id: string) => {
      ws = new WebSocket(`${process.env.NEXT_PUBLIC_CHATROOM_WEBSOCKET}${id}`)
      ws.onopen = () => {}
      ws.onmessage = (e: any) => {
        setChats((prev: IChat[]) => [...prev, e.data])
      }
      setWebSocket(ws)
    }

    if (chatroomId) connectWs(chatroomId)

    return () => {
      ws && ws?.close()
      setIsError(false)
      setWebSocket(null)
      setMessage("")
    }
  }, [chatroomId, setChats])

  return (
    <FormControl style={{ width: "100%" }} variant="outlined">
      <OutlinedInput
        value={message}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setMessage(event.target.value)
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton color="primary" disabled={isSending || !message.length}>
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  )
}

export default memo(ChatroomInput)
