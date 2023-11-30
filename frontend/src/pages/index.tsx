import { useState, useEffect, use } from "react"
import Head from "next/head"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import Card from "@components/Card"
import FeedCard from "@/components/FeedCard"
import { Post } from "@/hooks/usePost"
import PostFeedCard from "@/components/PostFeedCard"

import Grid from "@mui/material/Unstable_Grid2"
import { createTheme } from "@mui/material/styles"
import NavigationMenu from "@/components/NavigationMenu"
import UserList from "@/components/FriendsMenu"
import { useRouter } from "next/navigation"
import useAuth from "../hooks/useAuth"
import { useUser } from "@/hooks/useUser"

import nookies from "nookies"
import { usePost } from "@/hooks/usePost"
const inter = Inter({ subsets: ["latin"] })
export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { currentUser, isLoading } = useUser()
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
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <Grid
          container
          columns={{ sm: 6, md: 9, lg: 12 }}
          sx={{ overflowY: "auto" }}
        >
          <Grid sm={false} md={false} lg={3}>
            <NavigationMenu currentUser={currentUser} scroll={scroll} />
          </Grid>
          <Grid
            container
            xs={true}
            sx={{ gap: "1rem" }}
            alignItems="center"
            justifyContent="start"
            direction="column"
          >
            <PostFeedCard user={userTest}></PostFeedCard>
            {posts?.map((post, index) => (
              <FeedCard
                post={post}
                key={post.original_post_id + "-" + index}
              ></FeedCard>
            ))}
            <FeedCard post={post}></FeedCard>
          </Grid>
          <Grid
            sm={false}
            md={3}
            lg={3}
            alignItems="flex-end"
            justifyContent="flex-end"
            direction="row"
          >
            <UserList scroll={scroll} />
          </Grid>
        </Grid>
      </main>
    </>
  )
}
