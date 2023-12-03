import { Box, Skeleton, Stack } from "@mui/material"
import Card from "../Card"
import { IconButton } from "@mui/material"
interface ICommentSkeleton {
  showCircle?: boolean
  total?: number
}

const CommentSkeleton = ({
  total = 1,
  showCircle = true,
}: ICommentSkeleton): JSX.Element => {
  return (
    <Stack spacing={2} flexDirection={"column"} justifyContent={"start"}>
      {[...Array(3).keys()].map((item) => (
        <Box key={item}>
          {showCircle && (
            <Stack spacing={2} flexDirection={"row"} justifyContent={"start"}>
              <Skeleton
                sx={{ padding: "1rem" }}
                animation="wave"
                variant="circular"
                width={40}
                height={40}
              />
              <Stack
                spacing={2}
                flexDirection={"column"}
                justifyContent={"center"}
                sx={{ width: 1 }}
              >
                <Skeleton animation="wave" height={10} width="80%" />
                <Skeleton animation="wave" height={10} width="40%" />
              </Stack>
            </Stack>
          )}
        </Box>
      ))}
    </Stack>
  )
}

export default CommentSkeleton
