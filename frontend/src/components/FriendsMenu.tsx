import React, { useCallback, useEffect, useState } from "react"
import List from "@mui/material/List"
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material"
import { useMediaQuery, useTheme } from "@mui/material"
import { Fetcher } from "@/services/fetcher"
import UserListItem from "./UserListItem"
import useAuth from "@/hooks/useAuth"
import CancelIcon from "@mui/icons-material/Cancel"
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"
import HourglassTopIcon from "@mui/icons-material/HourglassTop"
import CachedIcon from "@mui/icons-material/Cached"

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
  const [cancelledList, setCancelledList] = useState<{
    [relationshipId: string]: boolean
  }>({})
  const [acceptedList, setAcceptedList] = useState<{
    [relationshipId: string]: boolean
  }>({})

  const deleteRelationship = async (relationshipId: string) => {
    try {
      setCancelledList((prev) => ({ ...prev, [relationshipId]: true }))
      await Fetcher.DELETE(`/relationships/${relationshipId}`)
    } catch (err) {
      console.log(err)
    }
  }

  const accept = async (relationshipId: string) => {
    try {
      setAcceptedList((prev) => ({ ...prev, [relationshipId]: true }))
      await Fetcher.PUT(`/relationships/${relationshipId}/accept`)
    } catch (err) {
      console.log(err)
    }
  }

  const getRelationships = useCallback(() => {
    const callAPI = async () => {
      try {
        setIsLoading(true)
        const response = await Fetcher.GET(
          `/relationships/?page_index=${pageIndex}&page_size=50&order_by=_id&is_asc=true`
        )
        setRelationships((prev) => [...prev, ...response.records])
      } catch (err) {
      } finally {
        setIsLoading(false)
      }
    }

    callAPI()
  }, [pageIndex])

  useEffect(() => {
    getRelationships()
  }, [getRelationships])

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
          {relationships?.map(({ id, receiver, creator, accepted_on }) => {
            let currentUser = receiver.id !== user?.id ? receiver : creator
            return (
              <UserListItem
                key={id}
                displayName={currentUser.display_name}
                firstName={currentUser.first_name}
                lastName={currentUser.last_name}
                badgeContent={
                  !accepted_on &&
                  !acceptedList[id] && (
                    <HourglassTopIcon style={{ fontSize: "10px" }} />
                  )
                }
                secondaryAction={
                  cancelledList[id] ? (
                    <Button disabled>Cancelled</Button>
                  ) : (
                    <>
                      {receiver.id === user?.id && !accepted_on && (
                        <Button
                          onClick={() => accept(id)}
                          disabled={acceptedList[id]}
                        >
                          {acceptedList[id] ? "Accepted" : "Accept"}
                        </Button>
                      )}

                      <IconButton onClick={() => deleteRelationship(id)}>
                        {!accepted_on ? <CancelIcon /> : <DeleteForeverIcon />}
                      </IconButton>
                    </>
                  )
                }
              />
            )
          })}
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
