// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";
// Define a `type` and `schema` for each collection
const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      pubDate: z.date(),
      description: z.string(),
      author: z.string(),
      sortOrder: z.number(),
      excerpt: z.string().max(90),
      image: z.object({
        url: z.string(),
        alt: z.string()
      }),
      tags: z.array(z.string())
    })
});
const caseStudiesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    title2: z.string(),
    location: z.string(),
    client: z.string(),
    quote: z.string(),
    sector: z.string(),
    heroImage: z.object({
      url: z.string(),
      alt: z.string()
    }),
    quoteImage: z.object({
      url: z.string(),
      alt: z.string()
    }),
    tags: z.array(z.string())
  })
});
// Export a single `collections` object to register your collection(s)
export const collections = {
  posts: postsCollection,
  casestudies: caseStudiesCollection,
};