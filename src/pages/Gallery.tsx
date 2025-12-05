import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Image as ImageIcon, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const galleryItems = [
  {
    id: 1,
    type: "image",
    title: "AI & ML Workshop 2024",
    category: "Workshop",
    description: "Participants learning machine learning fundamentals",
    thumbnail: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    type: "image",
    title: "Innovation Hackathon",
    category: "Hackathon",
    description: "Teams brainstorming innovative solutions",
    thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    type: "image",
    title: "Cloud Computing Bootcamp",
    category: "Bootcamp",
    description: "Hands-on AWS training session",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    type: "image",
    title: "Team Collaboration",
    category: "Hackathon",
    description: "Students working on their projects",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    type: "image",
    title: "Cybersecurity Session",
    category: "Workshop",
    description: "Learning about ethical hacking",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    type: "image",
    title: "Award Ceremony",
    category: "Event",
    description: "Recognizing top performers",
    thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
  },
  {
    id: 7,
    type: "video",
    title: "Innovex Arena Introduction",
    category: "Video",
    description: "Watch our journey and mission",
    thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=600&h=400&fit=crop",
    videoUrl: "https://youtube.com/@innovexarena",
  },
  {
    id: 8,
    type: "image",
    title: "Web Development Sprint",
    category: "Workshop",
    description: "Building full-stack applications",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
  },
  {
    id: 9,
    type: "image",
    title: "Networking Session",
    category: "Event",
    description: "Industry experts meeting students",
    thumbnail: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&h=400&fit=crop",
  },
];

const categories = ["All", "Workshop", "Hackathon", "Bootcamp", "Event", "Video"];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);

  const filteredItems = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  const handlePrevious = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : filteredItems.length - 1;
    setSelectedItem(filteredItems[previousIndex]);
  };

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(item => item.id === selectedItem.id);
    const nextIndex = currentIndex < filteredItems.length - 1 ? currentIndex + 1 : 0;
    setSelectedItem(filteredItems[nextIndex]);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center pt-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Gallery</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore moments from our workshops, hackathons, and events. 
              See the innovation and creativity in action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
              >
                {category === "Video" && <Video className="w-4 h-4 mr-1" />}
                {category !== "Video" && category !== "All" && <ImageIcon className="w-4 h-4 mr-1" />}
                {category}
              </Button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-2">
                          {item.category}
                        </span>
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Video Play Icon */}
                    {item.type === "video" && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:bg-primary transition-colors">
                          <Play className="w-7 h-7 text-primary-foreground ml-1" />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-6 right-6 p-2 rounded-lg bg-card border border-border text-foreground hover:text-primary transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
              className="absolute left-4 md:left-8 p-2 rounded-lg bg-card border border-border text-foreground hover:text-primary transition-colors z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 md:right-8 p-2 rounded-lg bg-card border border-border text-foreground hover:text-primary transition-colors z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-4xl w-full"
            >
              {selectedItem.type === "video" ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-card border border-border flex items-center justify-center">
                  <a
                    href={selectedItem.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                      <Play className="w-10 h-10 text-primary-foreground ml-1" />
                    </div>
                    <p className="text-foreground font-heading font-semibold">Watch on YouTube</p>
                  </a>
                </div>
              ) : (
                <img
                  src={selectedItem.thumbnail}
                  alt={selectedItem.title}
                  className="w-full rounded-2xl border border-border"
                />
              )}
              
              <div className="mt-6 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-2">
                  {selectedItem.category}
                </span>
                <h3 className="font-heading text-2xl font-semibold text-foreground">
                  {selectedItem.title}
                </h3>
                <p className="text-muted-foreground mt-2">{selectedItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
