import ENDPOINTS from "@/lib/endpoints";
import BlogPost from "@/types/blog-post";

export async function GetBlogPosts() {
  const response = await fetch(ENDPOINTS.getBlogPosts);
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as BlogPost[];
}

export async function GetBlogPost(blogPostID: number) {
  const response = await fetch(ENDPOINTS.getBlogPost(blogPostID));
  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json() as BlogPost;
}