import React from "react"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"

import Meta from "./meta"
import Nav from "./nav"
import MDXTheme from "./mdx-theme"

import traverse from "./utils/traverse"

import getTags from "./utils/get-tags"
import sortDate from "./utils/sort-date"
import { NextraThemeLayoutProps } from "nextra"
import Image from "next/image"
import styles from "./theme.module.css"
import Script from "next/script"

const Layout = ({
  config,
  frontMatter,
  navPages,
  postList,
  back,
  title,
  children,
}) => {
  const type = frontMatter.type || "post"
  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
        {config.head || null}
      </Head>
      <Script async src="/mailerlite.js" />
      <header className={styles.header}>
        <Link href="/" className={styles.logoContainer}>
          <Image
            alt="b&w gnosis guild logo"
            width={30}
            height={30}
            src="/bw-logo.svg"
          />
          <h1>Gnosis Guild Engineering</h1>
        </Link>
      </header>
      <article className={styles.main}>
        {type === "post" && <h1 className={styles.title}>{title}</h1>}
        {type === "post" && (
          <Meta {...frontMatter} back={back} config={config} />
        )}
        <MDXTheme>
          {children}
          {type === "post" ? config.postFooter : null}
        </MDXTheme>
        {postList}
        <div className={styles.footer}>
          <a
            href="https://discord.gg/r3zruFh6GK"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/discordicon.svg"
              alt="Gnosis Guild Discord"
              width="20"
              height="20"
            />
          </a>
          <a
            href="https://twitter.com/gnosisguild"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/twittericon.svg"
              alt="Gnosis Guild Twitter"
              width="20"
              height="20"
            />
          </a>
          <a
            className={styles.builtBy}
            href="https://www.gnosisguild.org/"
            target="_blank"
          >
            <Image
              src="/gnosisguild.png"
              alt="Gnosis Guild Logo"
              className={styles.logo}
              width={20}
              height={20}
            />
          </a>
        </div>
      </article>
    </React.Fragment>
  )
}

export default (props: NextraThemeLayoutProps) => {
  const { themeConfig, pageOpts } = props
  const config = Object.assign(
    {
      postFooter: null,
    },
    themeConfig
  )

  // gather info for tag/posts pages
  let posts = null
  let navPages = []
  const type = pageOpts.frontMatter.type || "post"
  const route = pageOpts.route
  // This only renders once per page

  if (type === "posts" || type === "tag" || type === "page") {
    posts = []
    // let's get all posts
    traverse(pageOpts.pageMap, (page) => {
      if (
        page.frontMatter &&
        ["page", "posts"].includes(page.frontMatter.type)
      ) {
        if (page.route === route) {
          navPages.push({ ...page, active: true })
        } else {
          navPages.push(page)
        }
      }

      if (
        type !== "page" &&
        page.frontMatter &&
        page.route &&
        page.route.startsWith("/posts/")
      ) {
        posts.push(page)
      }
    })
    posts = posts.sort(sortDate)
    navPages = navPages.sort(sortDate)
  }

  // back button
  let back = null
  if (type !== "post") {
    back = null
  } else {
    const parentPages = []
    traverse(pageOpts.pageMap, (page) => {
      if (
        route !== page.route &&
        (route + "/").startsWith(page.route === "/" ? "/" : page.route + "/")
      ) {
        parentPages.push(page)
      }
    })
    const parentPage = parentPages
      .reverse()
      .find((page) => page.frontMatter && page.frontMatter.type === "posts")
    if (parentPage) {
      back = parentPage.route
    }
  }

  const router = useRouter()
  const { query } = router

  const tagName = type === "tag" ? query.tag : null
  const title = props.pageOpts.frontMatter.title || "Untitled post"

  const postList = posts ? (
    <ul className={styles.postList}>
      {posts.map((post) => {
        if (tagName) {
          const tags = getTags(post)
          if (!tags.includes(tagName)) {
            return null
          }
        } else if (type === "tag") {
          return null
        }

        const postTitle =
          (post.frontMatter ? post.frontMatter.title : null) || post.name
        const postDate = post.frontMatter ? (
          <time className={styles.postDate}>
            {new Date(post.frontMatter.date).toDateString()}
          </time>
        ) : null
        const postDescription =
          post.frontMatter && post.frontMatter.description ? (
            <div className={styles.postDescription}>
              <p>{post.frontMatter.description}</p>
              {config.readMore ? (
                <Link href={post.route}>{config.readMore}</Link>
              ) : null}
            </div>
          ) : null

        return (
          <div key={post.route} className={styles.postItem}>
            <h3>
              <Link href={post.route}>{postTitle}</Link>
            </h3>
            {postDate}
            {postDescription}
          </div>
        )
      })}
    </ul>
  ) : null

  return (
    <Layout
      config={config}
      postList={postList}
      navPages={navPages}
      back={back}
      title={title}
      {...pageOpts}
      {...props}
    />
  )
}
