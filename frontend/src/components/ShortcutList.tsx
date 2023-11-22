import React, { useState, useEffect } from "react"
import { List, Theme } from "@mui/material"
import InfoIcon from "@mui/icons-material/Info"
import PeopleIcon from "@mui/icons-material/People"
import MessageIcon from "@mui/icons-material/Message"
import { theme } from "../pages/index"
import ListItem from "./ListItem" // assuming GenericListItem is in the same directory

const MyList: React.FC = () => {
  const [isSticky, setSticky] = useState(false)

  return (
    <List>
      <ListItem
        icon={<InfoIcon />}
        sx={{
          background: "white",
          position: "sticky",
          zIndex: 5,
        }}
        primaryText="COVID-19 Information Center"
        secondaryText="Latest updates and information about COVID-19."
      />
      <ListItem
        icon={<PeopleIcon />}
        primaryText="Friends"
        secondaryText="Connect and share with people in your life."
      />
      <ListItem
        icon={<MessageIcon />}
        primaryText="Messenger"
        secondaryText="Send and receive messages instantly."
      />
      {/* ... other list items ... */}
    </List>
  )
}

export default MyList
