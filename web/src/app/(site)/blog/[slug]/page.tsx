import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getBlogPostBySlug } from "@/data/blogs";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog Not Found",
      description: "This blog post is not available.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="w-full bg-white pb-24 font-sans text-[#1c2331]">
      {/* Full-width Hero */}
      <section className={`w-full pt-32 pb-24 bg-gradient-to-br ${post.coverGradient} relative border-b border-[#dfe7f3]`}>
        <div className="absolute inset-0 bg-black/5" />
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col items-center text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#084ba7] bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#084ba7]/10 mb-6">
              {post.category}
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-[#0d172a] sm:text-5xl md:text-6xl mb-8 leading-[1.15] max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-sm text-[#4a5871]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#e2e8f0] border border-white overflow-hidden shadow-sm">
                   <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author}`} alt={post.author} className="h-full w-full object-cover" />
                </div>
                <span className="font-semibold text-[#0d172a]">{post.author}</span>
              </div>
              <span>•</span>
              <span className="font-medium">{post.publishedAt}</span>
              <span>•</span>
              <span className="font-medium text-[#084ba7]">{post.readTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="mx-auto max-w-3xl px-5 pt-16 sm:px-8">
        {/* Content Summary */}
        <div className="bg-[#f8f9fc] border-l-4 border-[#084ba7] p-6 rounded-r-2xl mb-12 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#084ba7] mb-2">In Summary</h3>
          <p className="text-lg font-medium leading-relaxed text-[#2e3c54]">
            {post.excerpt}
          </p>
        </div>

        {/* Body */}
        <div className="space-y-8 text-xl leading-9 text-[#334155] prose prose-lg">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-20 flex flex-wrap gap-4 pt-10 border-t border-[#f1f5f9]">
          <Link
            href="/blogs"
            className="rounded-full border border-[#dfe7f3] bg-white px-8 py-4 text-sm font-bold text-[#0d172a] shadow-sm transition hover:bg-[#f8fafc] hover:border-[#cbd5e1]"
          >
            ← Back to Journal
          </Link>
          <Link
            href="/spaces"
            className="rounded-full bg-[#084ba7] px-8 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#063c8f]"
          >
            Explore Spaces
          </Link>
        </div>
      </article>
    </main>
  );
}
