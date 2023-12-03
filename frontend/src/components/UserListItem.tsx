import {
  Avatar,
  Badge,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import { ReactNode } from "react"

interface IUserListItem {
  displayName: string
  firstName: string
  lastName: string
  secondaryAction?: ReactNode
  badgeContent?: ReactNode
  secondary?: string
  selected?: boolean
  onClick?: () => void
  disabled?: boolean
}

const stringToColor = (string: string) => {
  let hash = 0
  let i

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }

  let color = "#"

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.slice(-2)
  }
  /* eslint-enable no-bitwise */

  return color
}

export const stringAvatar = (name: string) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  }
}

const UserListItem = ({
  displayName,
  firstName,
  lastName,
  secondaryAction,
  secondary,
  badgeContent,
  selected,
  onClick,
  disabled,
}: IUserListItem): JSX.Element => {
  return (
    <ListItem secondaryAction={secondaryAction} disableGutters disablePadding>
      <ListItemButton
        selected={selected}
        onClick={onClick && onClick}
        disabled={disabled}
      >
        <ListItemAvatar>
          <Badge
            color="primary"
            badgeContent={badgeContent}
            invisible={!badgeContent}
          >
            <Avatar {...stringAvatar(`${firstName} ${lastName}`)} />
          </Badge>
        </ListItemAvatar>
        <ListItemText primary={displayName} secondary={secondary} />
      </ListItemButton>
    </ListItem>
  )
}

export default UserListItem
