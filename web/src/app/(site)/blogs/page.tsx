import Link from "next/link";
import { blogPosts } from "@/data/blogs";
import { FiArrowRight } from "react-icons/fi";

export const metadata = {
  title: "Blogs",
  description: "Ideas and guides for building social 2D metaverse spaces.",
  alternates: {
    canonical: "/blogs",
  },
};

export default function BlogsPage() {
  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  return (
    <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 lg:px-10">
      
      {/* Page Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#084ba7]/20 bg-[#ebf4ff] px-4 py-1.5 text-xs font-bold tracking-[0.18em] text-[#084ba7] uppercase mb-6">
          <span className="h-2 w-2 rounded-full bg-[#d3f625]" />
          Orbis Journal
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-[#0d172a] sm:text-6xl mb-6">
          Stories from the frontier of digital connection.
        </h1>
        <p className="text-lg leading-8 text-[#46536a]">
          Product notes, community experiments, and practical frameworks for meetings, rituals, and social identity in a modern workspace.
        </p>
      </div>

      {/* Featured Post */}
      {featuredPost && (
        <Link href={`/blog/${featuredPost.slug}`} className="group block mb-16">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-[#dfe7f3] shadow-[0_20px_60px_rgba(8,75,167,0.08)] flex flex-col md:flex-row min-h-[400px]">
            <div className={`md:w-3/5 relative overflow-hidden bg-gradient-to-br ${featuredPost.coverGradient}`}>
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center">
              <p className="text-sm font-bold uppercase tracking-widest text-[#084ba7] mb-4">{featuredPost.category}</p>
              <h2 className="text-3xl font-bold tracking-tight text-[#0d172a] mb-4 group-hover:text-[#084ba7] transition-colors">
                {featuredPost.title}
              </h2>
              <p className="text-base text-[#4a5871] mb-8 line-clamp-3">
                {featuredPost.excerpt}
              </p>
              <div className="mt-auto flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-[#e2e8f0] border border-[#cbd5e1] overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${featuredPost.author}`} alt={featuredPost.author} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0d172a]">{featuredPost.author}</p>
                    <p className="text-[#6a7892] text-xs">{featuredPost.publishedAt} • {featuredPost.readTime}</p>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-full border border-[#dfe7f3] flex items-center justify-center text-[#084ba7] group-hover:bg-[#084ba7] group-hover:text-white transition-colors duration-300">
                  <FiArrowRight />
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Post Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {regularPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col overflow-hidden rounded-[2rem] border border-[#dfe7f3] bg-white shadow-[0_10px_30px_rgba(8,75,167,0.04)] hover:shadow-[0_20px_40px_rgba(8,75,167,0.08)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className={`h-48 w-full relative overflow-hidden bg-gradient-to-br ${post.coverGradient}`}>
              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
            </div>
            <div className="flex flex-1 flex-col p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#084ba7] mb-3">{post.category}</p>
              <h3 className="text-xl font-bold tracking-tight text-[#0d172a] group-hover:text-[#084ba7] transition-colors mb-3">
                {post.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#4a5871] mb-6 line-clamp-3">
                {post.excerpt}
              </p>
              
              <div className="mt-auto flex items-center justify-between pt-6 border-t border-[#f1f5f9]">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-[#e2e8f0] overflow-hidden">
                     <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author}`} alt={post.author} className="h-full w-full object-cover" />
                  </div>
                  <span className="text-xs font-semibold text-[#0d172a]">{post.author}</span>
                </div>
                <p className="text-[10px] font-medium text-[#6a7892] uppercase tracking-wider">
                  {post.readTime}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
