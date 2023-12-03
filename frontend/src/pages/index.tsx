import { useState, useEffect } from "react"
import FeedCard from "@/components/FeedCard"
import AddFriendList from "@/components/AddFriendList"
import { Post } from "@/hooks/usePost"
import { Button, Grid, Stack } from "@mui/material"
import dynamic from "next/dynamic"
import ContactCard from "@/components/ContactCard"
import { Fetcher } from "@/services/fetcher"
import FeedSkeleton from "@/components/Feed/FeedSkeleton"

const Header = dynamic(() => import("@/components/Navbar"), { ssr: false })
const PostFeedCard = dynamic(() => import("@/components/PostFeedCard"), {
  ssr: false,
})
export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [isMore, setIsMore] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await Fetcher.GET(
          `/posts/?page_index=${pageIndex}&sort_by=created&is_asc=false`
        )
        setPosts((prev) => [...prev, ...response])
        if (response.length < 1) setIsMore(false)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [pageIndex])

  return (
    <>
      <Header />
      <Grid container spacing={2} columns={{ xs: 6, sm: 9, md: 12 }}>
        <Grid
          item
          md={3}
          sx={{ display: { xs: "none", sm: "none", md: "block" } }}
        >
          <AddFriendList />
        </Grid>
        <Grid item xs={6}>
          <Stack>
            {!isLoading && (
              <PostFeedCard
                afterCreate={(post) => setPosts((prev) => [post, ...prev])}
              />
            )}
            {!isLoading ? (
              posts?.map((post) => <FeedCard post={post} key={post.id} />)
            ) : (
              <FeedSkeleton />
            )}
            {isMore && (
              <Button
                onClick={() => setPageIndex((prev) => prev + 1)}
                style={{ marginBottom: "20px" }}
              >
                More ...
              </Button>
            )}
          </Stack>
        </Grid>
        <Grid sm={3} sx={{ display: { xs: "none", sm: "block" } }} item>
          <ContactCard />
        </Grid>
      </Grid>
    </>
  )
}
