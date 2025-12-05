import { motion } from "framer-motion";
import { Target, Eye, Rocket } from "lucide-react";

export const AboutSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            About <span className="text-gradient">Innovex Arena</span>
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
            Innovex Arena is a tech-driven startup focused on building AI-based products, 
            cloud solutions, and emerging technology innovations. We provide a platform where 
            ideas transform into impactful solutions, helping shape the next generation of tech leaders.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-card to-muted/50 rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
              <Eye className="w-7 h-7 text-primary" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed">
              To become a global innovation hub that builds intelligent and scalable technology 
              solutions using Artificial Intelligence, Cloud Computing, and emerging technologies — 
              empowering industries and individuals to create a smarter, connected future.
            </p>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-card to-muted/50 rounded-2xl p-8 border border-border/50 hover:border-secondary/30 transition-all duration-300 group"
          >
            <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
              <Target className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Our Mission</h3>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <Rocket className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>Build next-generation AI and cloud-based products</span>
              </li>
              <li className="flex items-start gap-2">
                <Rocket className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>Provide hands-on learning in trending technologies</span>
              </li>
              <li className="flex items-start gap-2">
                <Rocket className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>Bridge the gap between academic learning and industry needs</span>
              </li>
              <li className="flex items-start gap-2">
                <Rocket className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                <span>Empower students to become industry-ready professionals</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
