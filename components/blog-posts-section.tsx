/* eslint-disable @next/next/no-img-element */
import React from "react"

import siteConfig from "@/config"
import BlogPost from "@/types/blog-post"
import ChevronRight from "@mui/icons-material/ChevronRight"
import Button from "@mui/material/Button"
import Container from "@mui/material/Container"
import Skeleton from "@mui/material/Skeleton"

import * as BlogService from "@/services/blog"

const BlogPostsSection = ({ hideTitle, title = "Blog", hidePost, hideIfNoPosts }: { hideTitle?: boolean, title?: string, hidePost?: number, hideIfNoPosts?: boolean}) => {
  const [blogPosts, setBlogPosts] = React.useState<(BlogPost | undefined)[]>([undefined, undefined, undefined])

  React.useEffect(() => {
    (async () => {
      try {
        const posts = await BlogService.GetBlogPosts()
        setBlogPosts(posts.filter(x => !hidePost || x && x.id !== hidePost))
      } catch (e) {
        console.error(e)
        setBlogPosts([])
      }
    })()
  }, [hidePost])

  if (!siteConfig.showBlog || blogPosts.length === 0) {
    return
  }

  if (hideIfNoPosts && blogPosts.length === 0) {
    return
  }

  return (
    <section id="blog-posts-section" className="blog-posts" style={{padding: "2em 0"}}>
      <Container>
        {
          !hideTitle &&
          <h3 style={{textAlign: "center", marginBottom: "1em"}}>
            {title}
          </h3>
        }
        <div 
          style={{
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(20em, 1fr))",
            gap: "1em"
          }}
        >
        {
          blogPosts.map((bp, index) => (
            <BlogPostOrSkeleton blogPost={bp} key={index} />
          ))
        }
        </div>
      </Container>
    </section>
  )
}

export const BlogPostOrSkeleton = ({ blogPost }:{ blogPost?: BlogPost }) => {
  return (
    <>
    {
      blogPost ?
      <a
        href={`/blog/${blogPost.id}`}
        style={{
          width: "100%", 
          display: "flex", 
          flexDirection: "column", 
          backgroundColor: "var(--card-background-color)",
          boxShadow: "2px 2px 1em #00000030",
          borderRadius: "0.2em",
          overflow: "hidden",
          textDecoration: "none",
        }}
      >
        <img style={{width: "100%", objectFit: "cover", aspectRatio: "14/10"}} src={blogPost.image_url} alt={blogPost.title} />
        <div style={{height: "100%", padding: "0.5em", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "1em"}}>
          <div>
            <h5>{ blogPost.title }</h5>
            <p>Publicado em {new Date(blogPost.created_at).toLocaleDateString("pt-BR")}</p>
          </div>
          <Button variant="contained" endIcon={<ChevronRight />}>
            Ler
          </Button>
        </div>
      </a>
      :
      <Skeleton sx={{width: "100%", aspectRatio: "11/10", height: "unset"}} animation="wave" variant="rectangular" />
    }
    </>
  )
}

export default BlogPostsSection
