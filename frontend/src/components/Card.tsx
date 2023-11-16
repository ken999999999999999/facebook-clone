import * as React from "react"
import Box from "@mui/material/Box"
import { Card as MuiCard } from "@mui/material"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "content"> {
  title?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
}

export default function Card({ title, content, children, footer }: CardProps) {
  return (
    <MuiCard sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2">{children}</Typography>
      </CardContent>
      <CardActions>{footer}</CardActions>
    </MuiCard>
  )
}
