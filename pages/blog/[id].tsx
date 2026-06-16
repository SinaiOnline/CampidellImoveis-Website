/* eslint-disable @next/next/no-img-element */
import BlogPostsSection from "@/components/blog-posts-section";
import BlogPost from "@/types/blog-post";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import React from "react";

import * as BlogService from "@/services/blog";
import { Alert, Divider } from "@mui/material";

const BlogPage = () => {
  const router = useRouter()
  const { id: blogPostID } = router.query

  const [blogPost, setBlogPost] = React.useState<BlogPost>()
  const [error, setError] = React.useState<string>()

  React.useEffect(() => {
    async function getBlogPost() {
      try {
        const post = await BlogService.GetBlogPost(Number(blogPostID))
        setBlogPost(post)
      } catch (e) {
        console.error(e)
        setError("Falha ao buscar postagem")
      }
    }

    if (blogPostID) {
      getBlogPost()
    }
  }, [blogPostID])

  return (
    <div id="blog-post-page" style={{marginTop: "var(--navbar-height)", }}>
      <Container maxWidth="md" className="container" 
        style={{padding: "1em", display: "flex", flexDirection: "column", gap: "1em"}}
      >
        {
          error ?
          <Alert severity="error">{error}</Alert>
          :
          blogPost ?
          <>
            <section>
              <h1>{blogPost.title}</h1>
              <p>Publicado em {new Date(blogPost.created_at).toLocaleDateString("pt-BR")}</p>
            </section>
            <img style={{width: "100%"}} src={blogPost.image_url} alt={blogPost.title} />
            <p style={{whiteSpace: "pre-wrap"}}>{blogPost.content}</p>
            <Divider sx={{py: "3em"}} />
            <BlogPostsSection hideIfNoPosts title="Outros posts" hidePost={blogPost.id} />
          </>
          :
          <Alert severity="info">Carregando...</Alert>
        }
      </Container>
    </div>
  )
}

export default BlogPage

