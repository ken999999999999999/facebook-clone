// pages/login.tsx
import { Button } from "@mui/material"
import React, { useEffect, useState } from "react"

const Test: React.FC = () => {
  const [webSocket, setWebSocket] = useState<any>()

  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_CHATROOM_WEBSOCKET + "1234"
    )

    ws.onopen = (event) => {
      ws.send("Connect")
    }

    ws.onmessage = (e) => {
      const message = e.data
      setMessages((prev) => [...prev, message])
    }

    setWebSocket(ws)
    return () => ws.close()
  }, [])

  const sendMessage = () => {
    webSocket?.send("test1234")
    webSocket.onmessage = (e: any) => {
      const message = e.data
      setMessages([...messages, message])
    }
  }

  return (
    <>
      {messages.join(", ")}
      <Button onClick={sendMessage}>Test</Button>
    </>
  )
}

export default Test
