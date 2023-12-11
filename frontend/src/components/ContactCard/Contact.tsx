import React, { useCallback, useEffect, useState } from "react"
import List from "@mui/material/List"
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  ListItemButton,
  OutlinedInput,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material"
import { Fetcher } from "@/services/fetcher"
import useAuth from "@/hooks/useAuth"
import CancelIcon from "@mui/icons-material/Cancel"

import UserListItem from "../UserListItem"
import ListItemSkeleton from "../ListItemSkeleton"
import SendIcon from "@mui/icons-material/Send"

interface IContact {
  handleCreateChatroom: (chatroomId: string) => void
}

const Contact = ({ handleCreateChatroom }: IContact): JSX.Element => {
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
  const [isCreating, setIsCreating] = useState(false)
  const [isError, setIsError] = useState(false)
  const [chatroomTitle, setChatroomTitle] = useState("")
  const [isNotMore, setIsNotMore] = useState(false)

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

  const createChatroom = useCallback(() => {
    const callAPI = async (userIds: string[], title: string) => {
      try {
        setIsCreating(true)
        const response = await Fetcher.POST("/chatrooms/", {
          title: title,
          users: userIds,
        })
        handleCreateChatroom(response)
      } catch (err) {
        setIsError(true)
      } finally {
        setIsCreating(false)
      }
    }

    callAPI(selectedUserIds, chatroomTitle)
  }, [selectedUserIds, handleCreateChatroom, chatroomTitle])

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
        pageIndex > 0
        const response = await Fetcher.GET(
          `/relationships/?page_index=${pageIndex}&page_size=50&order_by=_id&is_asc=true`
        )
        setRelationships((prev) => [...prev, ...response?.records])
        if (response?.records.length < 50) setIsNotMore(true)
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
      <FormControl
        style={{ width: "100%", marginBottom: "10px" }}
        variant="outlined"
      >
        <OutlinedInput
          placeholder="Message"
          id="create-chatroom"
          value={chatroomTitle}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setChatroomTitle(event.target.value)
          }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={createChatroom}
                color="primary"
                disabled={
                  !selectedUserIds.length || isCreating || !chatroomTitle.length
                }
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Box style={{ overflowY: "auto", maxHeight: "60vh" }}>
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
        {!isNotMore && (
          <ListItemButton
            disabled={isLoading}
            onClick={() => setPageIndex((prev) => prev + 1)}
          >
            <Typography color="primary">More</Typography>
          </ListItemButton>
        )}
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isError}
        onClose={() => setIsError(false)}
      >
        <Alert severity="error" style={{ width: "100%" }}>
          Something goes wrong!
        </Alert>
      </Snackbar>
    </List>
  ) : (
    <ListItemSkeleton />
  )
}

export default Contact
