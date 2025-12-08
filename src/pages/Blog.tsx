import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Tag, Clock } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  category: string;
  published_at: string | null;
  created_at: string;
}

// Fallback posts for when no database entries exist
const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with Generative AI: A Beginner's Guide",
    slug: "getting-started-generative-ai",
    excerpt: "Learn the fundamentals of generative AI, including how models like GPT and DALL-E work, and how to start building your own AI applications.",
    cover_image: null,
    category: "AI",
    published_at: "2024-12-01",
    created_at: "2024-12-01",
  },
  {
    id: "2",
    title: "Cloud Computing Trends for 2025",
    slug: "cloud-computing-trends-2025",
    excerpt: "Explore the latest trends in cloud computing, from serverless architectures to multi-cloud strategies that will shape the industry in 2025.",
    cover_image: null,
    category: "Cloud",
    published_at: "2024-11-25",
    created_at: "2024-11-25",
  },
  {
    id: "3",
    title: "How to Prepare for Your First Hackathon",
    slug: "prepare-first-hackathon",
    excerpt: "Tips and strategies to help you succeed in your first hackathon, from team formation to project ideation and presentation.",
    cover_image: null,
    category: "Events",
    published_at: "2024-11-20",
    created_at: "2024-11-20",
  },
  {
    id: "4",
    title: "Building Scalable Web Applications with React",
    slug: "scalable-web-apps-react",
    excerpt: "Best practices for building large-scale React applications, including state management, code splitting, and performance optimization.",
    cover_image: null,
    category: "Development",
    published_at: "2024-11-15",
    created_at: "2024-11-15",
  },
];

const categories = ["All", "AI", "Cloud", "Events", "Development", "News"];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackPosts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, cover_image, category, published_at, created_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.category.toLowerCase() === selectedCategory.toLowerCase());

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center pt-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Blog & <span className="text-gradient">News</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest tech articles, event announcements, 
              industry insights, and company updates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading posts...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-muted-foreground">No posts found in this category.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/30 transition-all"
                >
                  {/* Cover Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    {post.cover_image ? (
                      <img 
                        src={post.cover_image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <Tag className="w-8 h-8 text-primary" />
                        </div>
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.published_at || post.created_at)}
                      </span>
                    </div>

                    <h2 className="font-heading text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <Link 
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
                    >
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
