import React, { useEffect, useState } from "react"
import List from "@mui/material/List"
import { Box, Card, CardContent, CardHeader } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
import { Fetcher } from "@/services/fetcher"
import UserListItem from "./UserListItem"
import useAuth from "@/hooks/useAuth"

interface FriendsMenuProps {
  scroll: number
}

export default function FriendsMenu({ scroll }: FriendsMenuProps) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("md"))
  const { user } = useAuth()
  const [pageIndex, setPageIndex] = useState(0)
  const [relationships, setRelationships] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getRelationships = async () => {
      try {
        setIsLoading(true)
        const response = await Fetcher.GET(
          `/relationships/?page_index=${pageIndex}&page_size=50&order_by=_id&is_asc=true`
        )
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    getRelationships()
  }, [pageIndex])

  return !matches ? (
    <Card>
      <CardHeader title="Contacts" />
      <CardContent>
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
          {/* {relationships?.map((relationship) => (
            <UserListItem
              key={user.id}
              displayName={user.display_name}
              firstName={user.first_name}
              lastName={user.last_name}
            />
          ))} */}
        </List>
      </CardContent>
    </Card>
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
