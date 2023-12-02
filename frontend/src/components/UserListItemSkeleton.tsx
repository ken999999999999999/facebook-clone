import { Box, Skeleton } from "@mui/material"

interface IUserListItemSkeleton {
  showCircle?: boolean
}

const UserListItemSkeleton = ({
  showCircle = true,
}: IUserListItemSkeleton): JSX.Element => {
  return (
    <>
      <Box display="flex" gap={1} mb={1}>
        {showCircle && (
          <Skeleton
            variant="circular"
            animation="wave"
            width={56}
            height={40}
          />
        )}
        <Skeleton animation="wave" width="100%" />
      </Box>
      <Box display="flex" gap={1} mb={1}>
        {showCircle && (
          <Skeleton
            variant="circular"
            animation="wave"
            width={56}
            height={40}
          />
        )}
        <Skeleton animation="wave" width="100%" />
      </Box>
      <Box display="flex" gap={1} mb={1}>
        {showCircle && (
          <Skeleton
            variant="circular"
            animation="wave"
            width={56}
            height={40}
          />
        )}
        <Skeleton animation="wave" width="100%" />
      </Box>
      <Box display="flex" gap={1} mb={1}>
        {showCircle && (
          <Skeleton
            variant="circular"
            animation="wave"
            width={56}
            height={40}
          />
        )}
        <Skeleton animation="wave" width="100%" />
      </Box>
      <Box display="flex" gap={1} mb={1}>
        {showCircle && (
          <Skeleton
            variant="circular"
            animation="wave"
            width={56}
            height={40}
          />
        )}
        <Skeleton animation="wave" width="100%" />
      </Box>
    </>
  )
}

export default UserListItemSkeleton
