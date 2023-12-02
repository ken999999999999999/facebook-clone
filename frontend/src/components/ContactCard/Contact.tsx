import React, { useCallback, useEffect, useState } from "react"
import List from "@mui/material/List"
import { Button, IconButton, Stack } from "@mui/material"
import { Fetcher } from "@/services/fetcher"
import useAuth from "@/hooks/useAuth"
import CancelIcon from "@mui/icons-material/Cancel"

import UserListItem from "../UserListItem"
import UserListItemSkeleton from "../UserListItemSkeleton"

const Contact = (): JSX.Element => {
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

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])

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

  const handleOnClick = (userId: string) => {
    setSelectedUserIds((prev) => {
      let index = prev.indexOf(userId)
      if (index < 0) return [...prev, userId]
      return prev.filter((user) => user !== userId)
    })
  }

  const getRelationships = useCallback(() => {
    const callAPI = async () => {
      try {
        pageIndex > 0 && setIsLoading(true)
        const response = await Fetcher.GET(
          `/relationships/?page_index=${pageIndex}&page_size=50&order_by=_id&is_asc=true`
        )
        setRelationships((prev) => [...prev, ...response?.records])
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

  return !isLoading ? (
    <List>
      <Button
        fullWidth
        variant="outlined"
        disabled={!selectedUserIds.length}
        style={{ marginBottom: "5px" }}
      >
        Chat with friends
      </Button>
      {relationships?.map(({ id, receiver, creator, accepted_on }) => {
        let currentUser = receiver.id !== user?.id ? receiver : creator
        return (
          <UserListItem
            key={id}
            displayName={currentUser.display_name}
            firstName={currentUser.first_name}
            lastName={currentUser.last_name}
            secondary={
              !accepted_on && !acceptedList[id]
                ? "Pending Acceptation"
                : undefined
            }
            selected={selectedUserIds.includes(currentUser.id)}
            onClick={() => handleOnClick(currentUser.id)}
            disabled={!accepted_on && !acceptedList[id]}
            secondaryAction={
              cancelledList[id] ? (
                <Button disabled>Cancelled</Button>
              ) : (
                <Stack direction="row">
                  {receiver.id === user?.id && !accepted_on && (
                    <Button
                      onClick={() => accept(id)}
                      disabled={acceptedList[id]}
                    >
                      {acceptedList[id] ? "Accepted" : "Accept"}
                    </Button>
                  )}
                  <IconButton
                    onClick={() => deleteRelationship(id)}
                    size="small"
                  >
                    <CancelIcon />
                  </IconButton>
                </Stack>
              )
            }
          />
        )
      })}
    </List>
  ) : (
    <UserListItemSkeleton />
  )
}

export default Contact
