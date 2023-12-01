import React, { useEffect, useState } from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemAvatar from "@mui/material/ListItemAvatar"
import Avatar from "@mui/material/Avatar"
import ListItemText from "@mui/material/ListItemText"
import { Box } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
import { Fetcher } from "@/services/fetcher"

interface FriendsMenuProps {
  scroll: number
}

const stringToColor = (string: string) => {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = "#"

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  }
}

export default function FriendsMenu({ scroll }: FriendsMenuProps) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("md"))
  const [params, setParams] = useState({ pageIndex: 0, pageSize: 10 })
  const [relationships, setRelationships] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getRelationships = async () => {
      try {
        setIsLoading(true)
        const response = await Fetcher.GET(
          `/relationships/?page_index=${params.pageIndex}&page_size=${params.pageSize}&order_by=_id&is_asc=true`
        )
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    getRelationships()
  }, [params])

  return !matches ? (
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
      {relationships.map((relationship, index) => (
        <ListItem key={index}>
          <ListItemAvatar>
            <Avatar {...stringAvatar(`${relationship.displayName}`)} />
          </ListItemAvatar>
          <ListItemText primary={relationship.displayName} />
        </ListItem>
      ))}
    </List>
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
