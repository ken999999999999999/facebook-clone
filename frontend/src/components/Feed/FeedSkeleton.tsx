import { Box, Skeleton, Stack } from "@mui/material"
import Card from "../Card"
import { IconButton } from "@mui/material"
interface IFeedSkeleton {
  showCircle?: boolean
  total?: number
}

const FeedSkeleton = ({
  total = 1,
  showCircle = true,
}: IFeedSkeleton): JSX.Element => {
  return (
    <>
      {[...Array(10).keys()].map((item) => (
        <Card
          style={{ marginBottom: "20px" }}
          key={item}
          footer={
            <Stack
              spacing={1}
              flexDirection={"row"}
              justifyContent={"space-around"}
              alignItems={"center"}
            >
              <IconButton aria-label="like">
                <Skeleton variant="text" width={24} height={24} />
              </IconButton>
              <IconButton aria-label="comment">
                <Skeleton variant="text" width={24} height={24} />
              </IconButton>
              <IconButton aria-label="share">
                <Skeleton variant="text" width={24} height={24} />
              </IconButton>
            </Stack>
          }
        >
          <Box display="flex-row" gap={1} mb={1} key={item}>
            {showCircle && (
              <Stack spacing={1}>
                {/* For other variants, adjust the size with `width` and `height` */}
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 1 }} />
                <Skeleton variant="text" sx={{ fontSize: "1rem", width: 1 }} />
              </Stack>
            )}
          </Box>
        </Card>
      ))}
    </>
  )
}

export default FeedSkeleton
