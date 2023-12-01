import React, { useState } from "react"

interface CommentBoxProps {
  label: string
  placeholder?: string
  onSubmit: (comment: string) => void
}

// const CommentBox: React.FC<CommentBoxProps> = ({
//   label,
//   placeholder = "Type something here…",
//   onSubmit,
// }) => {
//   const [comment, setComment] = useState<string>("")

//   return
// }

// export default CommentBox
