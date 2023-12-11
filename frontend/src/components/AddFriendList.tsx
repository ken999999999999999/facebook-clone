import List from "@mui/material/List"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  ListItemButton,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import { useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import UserListItem from "./UserListItem"
import { Fetcher } from "@/services/fetcher"
import AddCircleIcon from "@mui/icons-material/AddCircle"
import ListItemSkeleton from "./ListItemSkeleton"

export default function AddFriendList() {
  const [users, setUsers] = useState<any[]>([])
  const [pageIndex, setPageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingUsers, setIsAddingUsers] = useState<{
    [userId: string]: string
  }>({})

  const [cancelledList, setCancelledList] = useState<{
    [relationshipId: string]: boolean
  }>({})
  const [isNotMore, setIsNotMore] = useState(false)

  const addFriend = async (userId: string) => {
    try {
      const response: string = await Fetcher.POST("/relationships/", {
        receiver_id: userId,
      })
      setIsAddingUsers((prev) => ({ ...prev, [userId]: response }))
    } catch (err) {
    } finally {
    }
  }

  const cancel = async (relationshipId: string) => {
    try {
      setCancelledList((prev) => ({ ...prev, [relationshipId]: true }))
      await Fetcher.DELETE(`/relationships/${relationshipId}`)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const getFriends = async () => {
      try {
        pageIndex > 0
        const response = await Fetcher.GET(
          `/users/list?page_index=${pageIndex}&page_size=20&order_by=_id&is_asc=true`
        )
        setUsers((prev) => [...prev, ...response])
        if (response.length < 20) setIsNotMore(true)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    getFriends()
  }, [pageIndex])

  return (
    <Card style={{ position: "sticky", top: "75px" }}>
      <CardHeader
        title={
          <Tabs value="1">
            <Tab value="1" label="Suggested Friends" />
          </Tabs>
        }
      />

      <CardContent style={{ overflowY: "auto", maxHeight: "80vh" }}>
        {!isLoading ? (
          <List>
            {users.map((user) => (
              <UserListItem
                key={user.id}
                displayName={user.display_name}
                firstName={user.first_name}
                lastName={user.last_name}
                secondaryAction={
                  !isAddingUsers[user.id] ? (
                    <IconButton onClick={() => addFriend(user.id)}>
                      <AddCircleIcon />
                    </IconButton>
                  ) : (
                    <Button
                      color="error"
                      onClick={() => cancel(isAddingUsers[user.id])}
                      disabled={cancelledList[isAddingUsers[user.id]]}
                    >
                      {!cancelledList[isAddingUsers[user.id]]
                        ? "Cancel"
                        : "Cancelled"}
                    </Button>
                  )
                }
              />
            ))}

            {!isNotMore && (
              <ListItemButton
                disabled={isLoading}
                onClick={() => setPageIndex((prev) => prev + 1)}
              >
                <Typography color="primary">More</Typography>
              </ListItemButton>
            )}
          </List>
        ) : (
          <ListItemSkeleton />
        )}
      </CardContent>
    </Card>
  )
}
