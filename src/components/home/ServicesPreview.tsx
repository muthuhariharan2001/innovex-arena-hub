import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Cloud, 
  Code, 
  Trophy, 
  GraduationCap, 
  Users,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Brain,
    title: "AI & ML Workshops",
    description: "Hands-on learning in Artificial Intelligence, Machine Learning, and Generative AI technologies.",
    color: "primary",
  },
  {
    icon: Cloud,
    title: "Cloud Computing",
    description: "Master cloud platforms and build scalable solutions with AWS, Azure, and GCP.",
    color: "secondary",
  },
  {
    icon: Code,
    title: "Web & App Dev",
    description: "Full-stack development training covering modern frameworks and best practices.",
    color: "primary",
  },
  {
    icon: Trophy,
    title: "Hackathons",
    description: "College hackathons, innovation challenges, and idea pitch competitions.",
    color: "secondary",
  },
  {
    icon: GraduationCap,
    title: "Training Programs",
    description: "1-day bootcamps to 30-day certification programs for comprehensive learning.",
    color: "primary",
  },
  {
    icon: Users,
    title: "Student Development",
    description: "Resume building, interview prep, projects, and internship opportunities.",
    color: "secondary",
  },
];

export const ServicesPreview = () => {
  return (
    <section className="py-24 bg-card/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our <span className="text-gradient">Services</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Empowering the next generation with cutting-edge technology education and real-world experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300 group hover:shadow-[0_0_40px_hsl(187_100%_50%/0.1)]"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  service.color === "primary"
                    ? "bg-primary/10 group-hover:bg-primary/20"
                    : "bg-secondary/10 group-hover:bg-secondary/20"
                }`}
              >
                <service.icon
                  className={`w-6 h-6 ${
                    service.color === "primary" ? "text-primary" : "text-secondary"
                  }`}
                />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <Link to="/services">
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
