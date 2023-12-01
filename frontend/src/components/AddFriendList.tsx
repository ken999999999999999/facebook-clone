import List from "@mui/material/List"
import { Box, Card, CardContent, CardHeader, IconButton } from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import UserListItem from "./UserListItem"
import { Fetcher } from "@/services/fetcher"
import AddCircleIcon from "@mui/icons-material/AddCircle"

interface AddFriendListProps {
  scroll: number
}

export default function AddFriendList({ scroll }: AddFriendListProps) {
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down("lg"))
  const [users, setUsers] = useState<any[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingUsers, setIsAddingUsers] = useState<string[]>([])

  const addFriend = async (userId: string) => {
    try {
      setIsAddingUsers((prev) => [...prev, userId])
      await Fetcher.POST("relationships", { receiver_id: userId })
    } catch (err) {
    } finally {
    }
  }

  useEffect(() => {
    const getFriends = async () => {
      try {
        setIsLoading(true)
        const response = await await Fetcher.GET(
          `/users/list/?page_index=${pageIndex}&page_size=20&order_by=_id&is_asc=true`
        )
        setUsers((prev) => [...prev, ...response])
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    getFriends()
  }, [pageIndex])

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
              secondaryAction={
                !isAddingUsers.includes(user.id) ? (
                  <IconButton onClick={() => addFriend(user.id)}>
                    <AddCircleIcon />
                  </IconButton>
                ) : (
                  <>Sent Invitation</>
                )
              }
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
