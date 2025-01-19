import Link from "next/link";
import Image from "next/image";
import {type SanityDocument} from "next-sanity";
import {client} from "@/sanity/client";
import type {SanityImageSource} from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";


const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id, title, image, slug, publishedAt, author
}`;

const options = {next: {revalidate: 30}};

const {projectId, dataset} = client.config();
const urlFor = (source: SanityImageSource) =>
    projectId && dataset
        ? imageUrlBuilder({projectId, dataset}).image(source)
        : null;

export default async function IndexPage() {
    const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

    return (
        <main className="container mx-auto min-h-screen max-w-3xl p-8">
            <h1 className="text-4xl font-bold mb-8">Piranha Studios Blog</h1>
            <ul className="flex flex-col gap-y-4">
                {posts.map((post) => (
                    <li className="hover:underline" key={post._id}>
                        <Link href={`/blog/${post.slug.current}`} className="flex items-start gap-4">
                            {
                                post.image && (
                                    <img
                                        //@ts-ignore
                                        src={urlFor(post.image).width(150).height(100).url()} // Generate image URL
                                        alt={post.title}
                                        width={150}
                                        height={100}
                                        className="rounded-md"
                                    />
                                )}
                            <div>
                                <h2 className="text-xl font-semibold">{post.title}</h2>
                                <p className="text-sm text-gray-600">{new Date(post.publishedAt).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-600">{post.author}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}