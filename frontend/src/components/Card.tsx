import * as React from "react"
import Box from "@mui/material/Box"
import { Card as MuiCard, CardProps as MuiCardProps } from "@mui/material"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"

export interface CardProps extends Omit<MuiCardProps, "title" | "content"> {
  title?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
}

export default function Card({
  title,
  content,
  children,
  footer,
  ...props
}: CardProps) {
  return (
    <MuiCard {...props}>
      <CardContent>
        <Typography variant="h5" component="div">
          {title}
        </Typography>
        {children}
      </CardContent>
      {footer}
    </MuiCard>
  )
}
