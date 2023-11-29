import React from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import ListItemText from "@mui/material/ListItemText"
import { Typography } from "@mui/material"
import { Box } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
const users = [
  { name: "Xavier Chan", avatar: "path-to-xavier-avatar.jpg", online: true },
  { name: "不愛運動", avatar: "path-to-avatar.jpg", online: true },
  { name: "Tsz Wai Wong", avatar: "path-to-tsz-avatar.jpg", online: true },
  { name: "Janita Leung", avatar: "path-to-janita-avatar.jpg", online: true },
  { name: "Thebia Tang", avatar: "path-to-thebia-avatar.jpg", online: true },
  { name: "Viola Yeung", avatar: "path-to-viola-avatar.jpg", online: true },
  { name: "Arthur Lam", avatar: "path-to-arthur-avatar.jpg", online: true },
  { name: "Kwong Chi Li", avatar: "path-to-kwong-avatar.jpg", online: false },
  { name: "Pakyin Chu", avatar: "path-to-pakyin-avatar.jpg", online: false },
  { name: "Clio Lee", avatar: "path-to-clio-avatar.jpg", online: false },
  { name: "Frankie Wong", avatar: "path-to-frankie-avatar.jpg", online: false },
  { name: "Anson Leung", avatar: "path-to-anson-avatar.jpg", online: false },
  { name: "Mason Chung", avatar: "path-to-mason-avatar.jpg", online: false },
  { name: "得係霜", avatar: "path-to-avatar.jpg", online: false },
  { name: "Leon Li", avatar: "path-to-leon-avatar.jpg", online: false },
  // ... add other users as needed
]

interface FriendsMenuProps {
  scroll: number
}

export default function FriendsMenu({ scroll }: FriendsMenuProps) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("md"))

  if (matches) {
    // If the screen size is 'md' or smaller
    return (
      <Box
        sx={{
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      ></Box>
    ) // Do not render anything
  }
  return (
    <List
      sx={{
        width: "18rem",
        position: scroll > 0 ? "fixed" : "relative",
      }}
      style={{
        maxHeight: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      Contacts
      {users.map((user, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar src={user.avatar} />
          </ListItemAvatar>
          <ListItemText primary={user.name} />
        </ListItem>
      ))}
    </List>
  )
}
