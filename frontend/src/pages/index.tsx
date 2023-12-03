import { useState, useEffect, useCallback } from "react"
import FeedCard from "@/components/FeedCard"
import AddFriendList from "@/components/AddFriendList"
import useAuth from "../hooks/useAuth"
import { usePost } from "@/hooks/usePost"
import { Grid, Stack } from "@mui/material"
import dynamic from "next/dynamic"
import ContactCard from "@/components/ContactCard"

const Header = dynamic(() => import("@/components/Navbar"), { ssr: false })
const PostFeedCard = dynamic(() => import("@/components/PostFeedCard"), {
  ssr: false,
})
export default function Home() {
  const { user } = useAuth()
  const [scroll, setScroll] = useState<number>(0)
  const { posts, getPosts } = usePost()

  const handleScroll = () => {
    const scrollTop = window.scrollY
    setScroll(scrollTop)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const userTest = {
    userIcon:
      "https://lh3.googleusercontent.com/a/ACg8ocI6_pLarmA49JzoKTq2fEjuCFp7IrZsvMjGaZaBSYsV9w=s96-c",
    lastName: "Doe",
    firstName: "John",
    displayName: "JohnD",
    birthDate: "1990-05-15",
  }

  const comments = [
    {
      postId: "123456",
      description: "This is an amazing post!",
      createdBy: {
        lastName: "Smith",
        firstName: "Alice",
        displayName: "AliceS",
        birthDate: "1988-04-22",
      },
      createdOn: "2023-11-14T08:20:00",
      modifiedOn: "2023-11-14T09:00:00",
      image: "https://example.com/comment-image1.jpg",
    },
    {
      postId: "123456",
      description: "Really love the content you're sharing.",
      createdBy: {
        lastName: "Johnson",
        firstName: "Bob",
        displayName: "BobbyJ",
        birthDate: "1992-07-30",
      },
      createdOn: "2023-11-14T10:15:00",
      modifiedOn: "2023-11-14T11:05:00",
      image: "https://example.com/comment-image2.jpg",
    },
  ]

  useEffect(() => {
    getPosts()
  }, [])

  return (
    <>
      <Header />
      <Grid container sx={{ overflowY: "auto" }} spacing={2}>
        <Grid item xs={3}>
          <AddFriendList scroll={scroll} />
        </Grid>
        <Grid item xs={6}>
          <Stack spacing={1}>
            <PostFeedCard />
            {posts?.map((post, index) => (
              <FeedCard
                post={post}
                key={post.original_post_id + "-" + index}
              ></FeedCard>
            ))}
          </Stack>
        </Grid>
        <Grid xs={3} item>
          <ContactCard scroll={scroll} />
        </Grid>
      </Grid>
    </>
  )
}
