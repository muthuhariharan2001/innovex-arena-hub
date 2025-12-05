import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Rocket, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-secondary/10" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Rocket className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to <span className="text-gradient">Transform</span> Your Future?
          </h2>
          
          <p className="text-lg text-muted-foreground mb-10">
            Join Innovex Arena and become part of a community that's shaping the next generation 
            of tech leaders. Whether you're looking to learn, build, or innovate — we've got you covered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/careers">
                Join Our Team
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
