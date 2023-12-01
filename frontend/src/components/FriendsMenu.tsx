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
        position: scroll > 0 ? "fixed" : "relative",
      }}
      style={{
        maxHeight: "100vh",
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      Contacts
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
