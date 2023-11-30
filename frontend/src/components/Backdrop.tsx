import React from "react"
import { Backdrop as MuiBackdrop, BackdropProps } from "@mui/material"
import CircularProgress from "@mui/material/CircularProgress"

interface IBackdropProps extends BackdropProps {
  open: boolean
  onClose?: () => void
  children?: React.ReactNode
}

const Backdrop: React.FC<IBackdropProps> = ({ open, onClose, children }) => {
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
