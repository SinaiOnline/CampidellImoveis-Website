import React from "react";

import { BlogPostOrSkeleton } from "@/components/blog-posts-section";

import * as BlogService from "@/services/blog";
import BlogPost from "@/types/blog-post";
import { Alert } from "@mui/material";
import Container from "@mui/material/Container";

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = React.useState<(BlogPost | undefined)[]>([undefined, undefined, undefined])
  const [error, setError] = React.useState<string>()

  React.useEffect(() => {
    (async () => {
      try {
        const posts = await BlogService.GetBlogPosts()

        if (posts.length === 0) {
          setError("Nenhuma postagem foi encontrada")
          return
        }

        setBlogPosts(posts)
      } catch (e) {
        console.error(e)
        setError("Ocorreu um erro ao buscar postagens")
      }
    })()
  }, [])

  return (
    <div className="blog-page">
      <Container className="blog-page-container">
        <h1>Blog</h1>
        {
          error ?
          <Alert severity="error">{error}</Alert>
          :
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
        }
      </Container>
    </div>
  )
}

export default BlogPage
