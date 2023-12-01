import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import FeedCard from "@/components/FeedCard"
import { Post } from "@/hooks/usePost"
import PostFeedCard from "@/components/PostFeedCard"
import AddFriendList from "@/components/AddFriendList"
import UserList from "@/components/FriendsMenu"
import useAuth from "../hooks/useAuth"
import { usePost } from "@/hooks/usePost"
import { Grid } from "@mui/material"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const { user } = useAuth()
  const [scroll, setScroll] = useState<number>(0)
  const { getPosts, posts } = usePost()

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

  useEffect(() => {
    if (!user) {
      getPosts()
    }
  }, [getPosts, user])

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

  const post = {
    id: "123456",
    likes: 87,
    comments: comments,
    image: "https://example.com/image123.jpg",
    description:
      "Exploring the beautiful landscapes of the Rocky Mountains #NatureLover #HikingAdventures",
    createdBy: userTest,
    createdOn: "2023-11-10T09:00:00",
    modifiedOn: "2023-11-12T10:15:00",
  } as Post

  return (
    <Grid container sx={{ overflowY: "auto" }} spacing={2}>
      <Grid item xs={3}>
        <AddFriendList scroll={scroll} />
      </Grid>
      <Grid item xs={6}>
        <PostFeedCard user={userTest}></PostFeedCard>
        {posts?.map((post, index) => (
          <FeedCard
            post={post}
            key={post.original_post_id + "-" + index}
          ></FeedCard>
        ))}
        <FeedCard post={post}></FeedCard>
      </Grid>
      <Grid xs={3} item>
        <UserList scroll={scroll} />
      </Grid>
    </Grid>
  )
}
