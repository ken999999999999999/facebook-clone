import { Box, Skeleton } from "@mui/material"

interface IUserListItemSkeleton {
  showCircle?: boolean
  total?: number
}

const UserListItemSkeleton = ({
  total = 5,
  showCircle = true,
}: IUserListItemSkeleton): JSX.Element => {
  return (
    <>
      {[...Array(10).keys()].map((item) => (
        <Box display="flex" gap={1} mb={1} key={item}>
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
      ))}
    </>
  )
}

export default UserListItemSkeleton
