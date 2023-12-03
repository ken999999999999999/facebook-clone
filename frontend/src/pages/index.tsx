import { useState, useEffect } from "react"
import FeedCard from "@/components/FeedCard"
import AddFriendList from "@/components/AddFriendList"
import { Post } from "@/hooks/usePost"
import { Grid, Stack } from "@mui/material"
import dynamic from "next/dynamic"
import ContactCard from "@/components/ContactCard"
import { Fetcher } from "@/services/fetcher"
import FeedSkeleton from "@/components/Feed/FeedSkeleton"

const Header = dynamic(() => import("@/components/Navbar"), { ssr: false })
const PostFeedCard = dynamic(() => import("@/components/PostFeedCard"), {
  ssr: false,
})
export default function Home() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await Fetcher.GET("/posts/")
        setPosts(response)
      } catch (err) {
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setIsLoading(true)
    try {
      const response = await Fetcher.GET("/posts/")
      setPosts(response)
    } catch (err) {
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }

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
          <Stack flexDirection={"column-reverse"}>
            {isLoading ? (
              <FeedSkeleton />
            ) : (
              posts?.map((post, index) => (
                <FeedCard
                  post={post}
                  key={post.original_post_id + "-" + index}
                />
              ))
            )}
            <PostFeedCard refresh={fetchPosts} />
          </Stack>
        </Grid>
        <Grid sm={3} sx={{ display: { xs: "none", sm: "block" } }} item>
          <ContactCard />
        </Grid>
      </Grid>
    </>
  )
}
