import { createClient } from "@sanity/client"

// Public read client for published content from the Piranha Studios dataset.
export const sanityClient = createClient({
  projectId: "r9c54rmo",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
})
