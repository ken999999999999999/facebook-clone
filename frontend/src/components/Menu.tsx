import * as React from "react"
import Box from "@mui/material/Box"
import Avatar from "@mui/material/Avatar"
import { Menu as MuiMenu } from "@mui/material"
import { MenuProps as MuiMenuProps } from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import Typography from "@mui/material/Typography"
import { useUser } from "@/hooks/useUser"
interface MenuItem {
  label: string
  icon: React.ReactNode
  href: string
  description?: string
  onClick?: () => void
}

export interface MenuProps extends MuiMenuProps {
  menuItems: MenuItem[]
  open: boolean
  onClose: () => void
}

const Menu: React.FC<MenuProps> = (props: MenuProps) => {
  const { anchorEl, onClose, menuItems } = props
  const { currentUser } = useUser()

  return (
    <MuiMenu
      anchorEl={anchorEl}
      id="account-menu"
      onClick={onClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      {...props}
    >
      {menuItems.map((item) => (
        <MenuItem onClick={item.onClick ? item.onClick : onClose}>
          {item?.icon ? <ListItemIcon>{item.icon}</ListItemIcon> : null}
          {item.description ? (
            <Box sx={{ flexDirection: "column" }}>
              <Box>{item?.label}</Box>
              <Box>
                <Typography sx={{ fontSize: "0.75rem" }}>
                  {item?.description}
                </Typography>
              </Box>
            </Box>
          ) : (
            <>{item?.label}</>
          )}
        </MenuItem>
      ))}
    </MuiMenu>
  )
}

export default Menu
