import Head from "next/head"
import Image from "next/image"
import { Inter } from "next/font/google"
import styles from "@/styles/Home.module.css"
import Card from "@components/Card"
import FeedCard from "@/components/FeedCard"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
  const user = {
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
    createdBy: user,
    createdOn: "2023-11-10T09:00:00",
    modifiedOn: "2023-11-12T10:15:00",
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <div>
          <Card title={"Username0123"} footer={"testing"}>
            testing
          </Card>
          <FeedCard post={post}></FeedCard>
          <p>
            Get started by editing&nbsp;
            <code className={styles.code}>pages/index.tsx</code>
          </p>
          <div>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              By{" "}
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                className={styles.vercelLogo}
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>
        {/* 
        <div className={styles.center}>
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js Logo"
            width={180}
            height={37}
            priority
          />
        </div> */}

        <div className={styles.grid}>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Docs <span>-&gt;</span>
            </h2>
            <p>
              Find in-depth information about Next.js features and&nbsp;API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Learn <span>-&gt;</span>
            </h2>
            <p>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>

          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Templates <span>-&gt;</span>
            </h2>
            <p>
              Discover and deploy boilerplate example Next.js&nbsp;projects.
            </p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2>
              Deploy <span>-&gt;</span>
            </h2>
            <p>
              Instantly deploy your Next.js site to a shareable URL
              with&nbsp;Vercel.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
