import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Cpu, Rocket, Box } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  description: string;
  short_description: string | null;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  technologies: string[];
  category: string;
  is_featured: boolean;
}

// Fallback products for when no database entries exist
const fallbackProducts: Product[] = [
  {
    id: "1",
    name: "AI Content Generator",
    description: "An intelligent content generation platform powered by advanced language models. Create blog posts, social media content, and marketing copy in seconds.",
    short_description: "AI-powered content creation platform",
    image_url: null,
    demo_url: null,
    github_url: null,
    technologies: ["Python", "OpenAI", "React", "FastAPI"],
    category: "ai",
    is_featured: true,
  },
  {
    id: "2",
    name: "CloudSync Dashboard",
    description: "A unified cloud management dashboard that integrates with AWS, Azure, and GCP. Monitor resources, manage costs, and optimize performance across multiple cloud providers.",
    short_description: "Multi-cloud management solution",
    image_url: null,
    demo_url: null,
    github_url: null,
    technologies: ["TypeScript", "AWS", "Azure", "Next.js"],
    category: "cloud",
    is_featured: true,
  },
  {
    id: "3",
    name: "Smart Campus IoT",
    description: "An IoT solution for smart campus management. Includes automated attendance, energy management, and real-time monitoring of campus facilities.",
    short_description: "IoT-based campus automation",
    image_url: null,
    demo_url: null,
    github_url: null,
    technologies: ["Arduino", "MQTT", "Node.js", "MongoDB"],
    category: "iot",
    is_featured: false,
  },
  {
    id: "4",
    name: "Resume Analyzer AI",
    description: "AI-powered resume analysis tool that provides actionable feedback, skill gap analysis, and job matching recommendations for job seekers.",
    short_description: "AI resume optimization tool",
    image_url: null,
    demo_url: null,
    github_url: null,
    technologies: ["Python", "NLP", "React", "PostgreSQL"],
    category: "ai",
    is_featured: true,
  },
];

const categories = [
  { id: "all", label: "All Products", icon: Box },
  { id: "ai", label: "AI Solutions", icon: Cpu },
  { id: "cloud", label: "Cloud Tools", icon: Rocket },
  { id: "iot", label: "IoT Projects", icon: Box },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false });

      if (!error && data && data.length > 0) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center pt-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Products</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore the innovative solutions we've built using AI, cloud computing, 
              and emerging technologies.
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
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center text-muted-foreground">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-muted-foreground">No products found in this category.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-card rounded-2xl border border-border overflow-hidden group hover:border-primary/30 transition-all ${
                    product.is_featured ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  {/* Product Image */}
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <Cpu className="w-10 h-10 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    {/* Featured Badge */}
                    {product.is_featured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="font-heading text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      {product.short_description || product.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {product.demo_url && (
                        <Button variant="glow" size="sm" asChild>
                          <a href={product.demo_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Live Demo
                          </a>
                        </Button>
                      )}
                      {product.github_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={product.github_url} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {!product.demo_url && !product.github_url && (
                        <span className="text-sm text-muted-foreground italic">Coming Soon</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Have a Project Idea?
            </h2>
            <p className="text-muted-foreground mb-8">
              Let's collaborate and build something amazing together. We're always looking for 
              innovative projects to work on.
            </p>
            <Button variant="hero" size="lg" asChild>
              <a href="/contact">
                Get in Touch
              </a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
