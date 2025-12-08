import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  content: string;
  rating: number;
  image_url: string | null;
  event_name: string | null;
}

// Fallback testimonials for when no database entries exist
const fallbackTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "B.Tech Student",
    company: "IIT Delhi",
    content: "The AI/ML workshop by Innovex Arena was incredibly hands-on. I built my first neural network and gained practical skills that helped me secure an internship!",
    rating: 5,
    image_url: null,
    event_name: "AI & ML Workshop",
  },
  {
    id: "2",
    name: "Rahul Verma",
    role: "Software Developer",
    company: "TCS",
    content: "Participated in their hackathon and won second place. The mentorship and problem statements were industry-relevant. Highly recommend their programs!",
    rating: 5,
    image_url: null,
    event_name: "Tech Innovators Hackathon",
  },
  {
    id: "3",
    name: "Anjali Reddy",
    role: "MCA Student",
    company: "JNTU Hyderabad",
    content: "The cloud computing bootcamp gave me hands-on AWS experience. The trainers were experts and the certification prep was thorough.",
    rating: 5,
    image_url: null,
    event_name: "Cloud Computing Bootcamp",
  },
];

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_approved", true)
        .eq("is_featured", true)
        .limit(6);

      if (!error && data && data.length > 0) {
        setTestimonials(data);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Our <span className="text-gradient">Community Says</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hear from students and professionals who have participated in our workshops, hackathons, and training programs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border relative group hover:border-primary/30 transition-all"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20 group-hover:text-primary/30 transition-colors" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <p className="text-muted-foreground mb-6 line-clamp-4">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}{testimonial.company && `, ${testimonial.company}`}
                  </p>
                </div>
              </div>

              {/* Event Tag */}
              {testimonial.event_name && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-primary font-medium">{testimonial.event_name}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
