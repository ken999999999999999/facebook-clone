import React, { useEffect } from "react"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Logout from "@mui/icons-material/Logout"
import FacebookIcon from "@mui/icons-material/Facebook"
import useAuth from "@/hooks/useAuth"
import { stringAvatar } from "./UserListItem"
import { IconButton, Stack } from "@mui/material"

const Navbar = (): JSX.Element => {
  const { user, signOut } = useAuth()

  return (
    <AppBar position="fixed">
      <Toolbar>
        <FacebookIcon fontSize="large" style={{ marginRight: "10px" }} />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          Welcome to Facebook Clone!
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Stack spacing={1} direction="row" alignItems="center">
            <Avatar
              {...stringAvatar(
                `${user?.first_name ?? ""} ${user?.last_name ?? ""}`
              )}
            />
            <Typography>{user?.display_name ?? ""}</Typography>
          </Stack>
          <IconButton
            onClick={signOut}
            style={{ marginLeft: "20px", color: "white" }}
          >
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
