import React, { useState } from "react"
import { Box, Card, CardContent, CardHeader, Tab, Tabs } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
import Contact from "./Contact"
import Chatroom from "./Chatroom"
import ChatroomDialog from "./ChatroomDialog"

const ContactCard = (): JSX.Element => {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("md"))

  const [activeTab, setActiveTab] = useState<"contact" | "chatroom">("contact")
  const [currentChatroomId, setCurrentChatroomId] = useState<string | null>(
    null
  )

  const handleCreateChatroom = (chatroomId: string) => {
    setActiveTab("chatroom")
    setCurrentChatroomId(chatroomId)
  }

  return (
    <>
      <Card style={{ position: "sticky", top: "75px" }}>
        <CardHeader
          title={
            <Tabs
              value={activeTab}
              onChange={(_, value: "contact" | "chatroom") =>
                setActiveTab(value)
              }
            >
              <Tab value="contact" label="Friends" />
              <Tab value="chatroom" label="Chatroom" />
            </Tabs>
          }
        />
        <CardContent>
          {activeTab === "contact" && (
            <Contact handleCreateChatroom={handleCreateChatroom} />
          )}
          {activeTab === "chatroom" && (
            <Chatroom handleOnClick={setCurrentChatroomId} />
          )}
        </CardContent>
      </Card>
      <ChatroomDialog
        chatroomId={currentChatroomId}
        handleClose={() => setCurrentChatroomId(null)}
      />
    </>
  )
}

export default ContactCard
