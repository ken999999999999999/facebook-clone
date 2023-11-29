import React, { useState } from "react"
import {
  List,
  ListItem as MuiListItem,
  ListItemProps as MuiListItemProps,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Typography,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import ExpandLessIcon from "@mui/icons-material/ExpandLess"
import { SvgIconComponent } from "@mui/icons-material"

interface GenericListItemProps extends MuiListItemProps {
  icon: React.ReactElement<SvgIconComponent>
  primaryText: string
  secondaryText: string
}

const ListItem: React.FC<GenericListItemProps> = ({
  icon,
  primaryText,
  secondaryText,
  ...props
}) => {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <>
      <MuiListItem onClick={handleClick} {...props}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primaryText} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </MuiListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Typography variant="body2" sx={{ paddingLeft: 7 }}>
          {secondaryText}
        </Typography>
      </Collapse>
    </>
  )
}

export default ListItem
