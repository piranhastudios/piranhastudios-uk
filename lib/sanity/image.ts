import imageUrlBuilder, { type SanityImageSource } from "@sanity/image-url"
import { sanityClient } from "./client"

const builder = imageUrlBuilder(sanityClient)

export const urlForImage = (source: SanityImageSource) => builder.image(source)
