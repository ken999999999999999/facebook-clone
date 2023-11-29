import React from "react"
import { Backdrop as MuiBackdrop, BackdropProps } from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"
import Button from "@mui/material/Button"

interface IBackdropProps extends BackdropProps {
  open: boolean
  onClose?: () => void
  onOpen?: () => void
  children?: React.ReactNode
}

const Backdrop: React.FC<IBackdropProps> = ({
  open,
  onClose,
  onOpen,
  children,
}) => {
  return (
    <>
      {children}
      <MuiBackdrop
        sx={{ color: "#fff", zIndex: (theme: any) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={onClose}
      >
        <CircularProgress color="inherit" />
      </MuiBackdrop>
    </>
  )
}

export default Backdrop
