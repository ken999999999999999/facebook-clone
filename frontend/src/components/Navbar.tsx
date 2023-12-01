import React, { useCallback, useEffect } from "react"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"

import Typography from "@mui/material/Typography"
import SettingsIcon from "@mui/icons-material/Settings"
import PersonAdd from "@mui/icons-material/PersonAdd"
import Logout from "@mui/icons-material/Logout"
import FacebookIcon from "@mui/icons-material/Facebook"
import Menu from "./Menu"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/router"
import { usePathname } from "next/navigation"
import { stringAvatar } from "./UserListItem"
import { IconButton, Stack } from "@mui/material"

const Navbar = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)

  const handleProfileMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    },
    []
  )

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const pathname = usePathname()

  useEffect(() => {
    if (!user && pathname === "/") {
      router.push("/login")
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return <div>Loading...</div>
  }

  return user ? (
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
            <Avatar />
            <Typography>{user?.displayName}</Typography>
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
  ) : (
    <></>
  )
}

export default Navbar
