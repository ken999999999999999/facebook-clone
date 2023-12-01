import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"

import ListItemText from "@mui/material/ListItemText"
import { Box, Card, CardContent, CardHeader } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import UserListItem from "./UserListItem"
import { Fetcher } from "@/services/fetcher"

interface AddFriendListProps {
  scroll: number
}

export default function AddFriendList({ scroll }: AddFriendListProps) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("lg"))
  const [users, setUsers] = useState<any[]>([])
  const [params, setParams] = useState({ pageIndex: 0, pageSize: 50 })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getFriends = async () => {
      try {
        setIsLoading(true)

        const response = await await Fetcher.GET(
          `/users/list/?page_index=${params.pageIndex}&page_size=${params.pageSize}&order_by=_id&is_asc=true`
        )
        setUsers((prev) => [...prev, ...response])
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    getFriends()
  }, [params])

  return !matches ? (
    <Card>
      <CardHeader title="Suggested Friends" />
      <CardContent>
        <List
          sx={{
            position: scroll > 0 ? "fixed" : "relative",
          }}
        >
          {users.map((user) => (
            <UserListItem
              key={user.id}
              displayName={user.display_name}
              firstName={user.first_name}
              lastName={user.last_name}
            />
          ))}
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
