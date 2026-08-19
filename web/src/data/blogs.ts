export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  coverGradient: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "asdsas",
    title: "How We Design Spaces For Better Meetings",
    excerpt:
      "A practical look at scheduling rituals, room design, and social signals for 2D metaverse communities.",
    category: "Product",
    readTime: "6 min read",
    publishedAt: "Aug 18, 2026",
    author: "Orbis Team",
    coverGradient: "from-[#ebf4ff] via-white to-[#f2ffd1]",
    content: [
      "Communities need rhythm. In Orbis, meetings are not just calendar blocks; they are rituals that blend identity, context, and shared intent.",
      "The most successful spaces pair lightweight scheduling with clear room purpose. A voice room for daily standups should feel very different from one used for launch reviews.",
      "We design for discoverability first. Members should know what is happening now, what starts next, and what they can join with one click.",
      "Static structure creates confidence: recurring events, role-based channels, and visible history make every new member feel oriented.",
      "As 2D metaverse products evolve, the best meeting UX will feel less like booking software and more like moving through a living neighborhood.",
    ],
  },
  {
    slug: "orbit-culture-playbook",
    title: "The Orbit Culture Playbook",
    excerpt:
      "Five patterns that turn silent servers into active, high-trust collaborative spaces.",
    category: "Community",
    readTime: "4 min read",
    publishedAt: "Aug 12, 2026",
    author: "Community Lab",
    coverGradient: "from-[#f2ffd1] via-white to-[#ebf4ff]",
    content: [
      "Culture scales when defaults are obvious. Welcome flows, recurring sessions, and short meeting notes reduce friction immediately.",
      "Healthy communities reward contribution with visibility. Meeting highlights and community updates help members feel momentum.",
      "Treat each space like a living city block: clear entrances, active zones, and regular events that anchor participation.",
    ],
  },
  {
    slug: "discord-to-orbis-workflows",
    title: "From Discord Habits To Orbis Workflows",
    excerpt:
      "Map familiar Discord patterns into richer space-and-meeting workflows built for metaverse teams.",
    category: "Guides",
    readTime: "7 min read",
    publishedAt: "Aug 04, 2026",
    author: "Orbis Team",
    coverGradient: "from-[#eef2ff] via-white to-[#ebf4ff]",
    content: [
      "People already understand channels, rooms, and roles. Orbis extends those habits with spatial context and meeting-first dashboards.",
      "The goal is continuity, not novelty. Preserve what works, then add richer meeting flows and clearer community navigation.",
      "When migration feels familiar, adoption is faster and teams keep their social energy intact.",
    ],
  },
];

export const getBlogPostBySlug = (slug: string) => {
  return blogPosts.find((post) => post.slug === slug) ?? null;
};
