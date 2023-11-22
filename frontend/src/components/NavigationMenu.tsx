import { useState, useEffect } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

import PersonIcon from "@mui/icons-material/Person"
import MemoryIcon from "@mui/icons-material/History"
import SaveIcon from "@mui/icons-material/Save"
import GroupIcon from "@mui/icons-material/Group"
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary"
import StorefrontIcon from "@mui/icons-material/Storefront"
import RssFeedIcon from "@mui/icons-material/RssFeed"
import { Box } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"

interface NavigationMenuProps {
  scroll: number
}

export default function NavigationMenu({ scroll }: NavigationMenuProps) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("lg"))

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
    <Box
      sx={{
        width: "20rem",
        display: "block",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <List
        sx={{
          width: "20rem",
          position: scroll > 0 ? "fixed" : "relative",
        }}
      >
        <ListItem>
          <Avatar>{/* User's avatar */}</Avatar>
          <ListItemText primary="Username" sx={{ marginX: "2rem" }} />
        </ListItem>
        {/* ... other list items ... */}
        <ListItem button>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Friends" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <MemoryIcon />
          </ListItemIcon>
          <ListItemText primary="Memories" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary="Saved" />
        </ListItem>
        {/* ... and so on for each item ... */}
        <ListItem button>
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Groups" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <VideoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Video" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <StorefrontIcon />
          </ListItemIcon>
          <ListItemText primary="Marketplace" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <RssFeedIcon />
          </ListItemIcon>
          <ListItemText primary="Feeds" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <IconButton>
              <ExpandMoreIcon />
            </IconButton>
          </ListItemIcon>
          <ListItemText primary="See more" />
        </ListItem>
      </List>
    </Box>
  )
}
