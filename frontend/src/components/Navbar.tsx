import React, { useCallback, useEffect } from "react"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import SettingsIcon from "@mui/icons-material/Settings"
import PersonAdd from "@mui/icons-material/PersonAdd"
import Logout from "@mui/icons-material/Logout"
import FacebookIcon from "@mui/icons-material/Facebook"
import MoreIcon from "@mui/icons-material/MoreVert"
import Menu from "./Menu"
import CreateMenu from "./CreateMenu"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/router"
import { usePathname } from "next/navigation"

const Navbar = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const [createAnchorEl, setCreateAnchorEl] =
    React.useState<null | HTMLElement>(null)
  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const isCreateMenuOpen = Boolean(createAnchorEl)

  const handleProfileMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    },
    []
  )

  const handleMobileMenuClose = useCallback(() => {
    setMobileMoreAnchorEl(null)
  }, [])

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }, [handleMobileMenuClose])

  const handleCreateMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setCreateAnchorEl(event.currentTarget)
    },
    []
  )

  const handleCreateMenuClose = useCallback(() => {
    setCreateAnchorEl(null)
  }, [])

  const handleMobileMenuOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setMobileMoreAnchorEl(event.currentTarget)
    },
    []
  )
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

  const ItemList = [
    { label: "Profile", icon: <Avatar />, href: "/profile" },
    { label: "My Account", icon: <SettingsIcon />, href: "/settings" },
    { label: "Add another account", icon: <PersonAdd />, href: "/personadd" },
    {
      label: "Logout",
      icon: <Logout />,
      onClick: signOut,
      href: "/logout",
    },
    { label: "Settings", icon: <SettingsIcon />, href: "/settings" },
  ]

  const createMenuId = "primary-search-create-menu"
  const renderCreateMenu = (
    <CreateMenu
      id={createMenuId}
      open={isCreateMenuOpen}
      anchorEl={createAnchorEl}
      onClose={handleCreateMenuClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "bottom", // This can remain "top" since it refers to the part of the menu that will be aligned to the anchor.
        horizontal: "right",
      }}
    ></CreateMenu>
  )
  const menuId = "primary-search-account-menu"
  const renderMenu = (
    <Menu
      menuItems={ItemList}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  )

  const mobileMenuId = "primary-search-account-menu-mobile"
  const renderMobileMenu = (
    <Menu
      menuItems={ItemList}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    ></Menu>
  )

  return (
    <Box sx={{ display: !user ? "none" : "block" }}>
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
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderCreateMenu}
    </Box>
  )
}

export default Navbar
