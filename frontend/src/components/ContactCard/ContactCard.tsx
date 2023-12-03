import React, { useState } from "react"
import { Box, Card, CardContent, CardHeader, Tab, Tabs } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"

import Contact from "./Contact"
import Chatroom from "./Chatroom"
import ChatroomDialog from "./ChatroomDialog"

interface IContactCard {
  scroll: number
}

const ContactCard = ({ scroll }: IContactCard): JSX.Element => {
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

  return !matches ? (
    <>
      <Card
        sx={{
          position: scroll > 0 ? "fixed" : "relative",
        }}
        style={{
          maxHeight: "100vh",
          overflowY: "scroll",
          overflowX: "hidden",
        }}
      >
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
  ) : (
    <Box
      sx={{
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    ></Box>
  )
}

export default ContactCard
