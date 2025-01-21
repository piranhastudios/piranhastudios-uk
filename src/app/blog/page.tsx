import Link from "next/link";
import Image from "next/image";
import {type SanityDocument} from "next-sanity";
import {client} from "@/sanity/client";
import type {SanityImageSource} from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import Navigation from "@/components/blog/navigation";
import BlogCard from "@/components/blog/blog-card";


const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id, title, image, slug, publishedAt, author, description
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
        <main className="min-h-screen flex flex-col items-center">
            <div className={"max-w-screen-lg"}>
                <h1 className="text-4xl mb-8 px-4">Piranha Studios Blog</h1>
                {/*
             TODO: add when we have more blog posts in different categories
            <Navigation/>
            */}

                {/* Featured Section */}
                <section className="px-4 py-8 md:px-6 lg:px-8">
                    <h2 className="text-3xl mb-6">Featured</h2>
                    <BlogCard
                        key={posts[0]._id}
                        featured
                        //@ts-ignore
                        imageUrl={posts[0].image ? urlFor(posts[0].image).width(150).height(100).url() : null}
                        date={new Date(posts[0].publishedAt).toLocaleDateString()}
                        title={posts[0].title}
                        description={posts[0].description}
                        slug={posts[0].slug.current}
                        author={{
                            name: posts[0].author,
                            avatar: "https://placehold.co/600x400?text=placeholder",
                        }}
                        tags={["Featured"]}
                    />
                </section>
            </div>
            <div className={"lg:max-w-[75%]"}>

                {/* Latest Posts Section */}
                <section className="px-4 py-8 md:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold mb-6">Latests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.slice(1).map((post) => (
                            <BlogCard
                                key={post._id}
                                //@ts-ignore
                                imageUrl={post.image ? urlFor(post.image).width(150).height(100).url() : null}
                                date={new Date(post.publishedAt).toLocaleDateString()}
                                title={post.title}
                                slug={post.slug.current}
                                author={{
                                    name: post.author,
                                    avatar: "https://placehold.co/600x400?text=placeholder",
                                }}
                                tags={["Featured"]}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </main>
);
}