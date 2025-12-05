import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Brain,
  Sparkles,
  Cloud,
  Shield,
  Code,
  Database,
  Cpu,
  Blocks,
  Glasses,
  Trophy,
  Lightbulb,
  Mic,
  BookOpen,
  Calendar,
  Award,
  FileText,
  MessageSquare,
  FolderKanban,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

const workshopTopics = [
  { icon: Brain, title: "AI & ML", description: "Artificial Intelligence and Machine Learning fundamentals" },
  { icon: Sparkles, title: "Generative AI", description: "ChatGPT, DALL-E, and creative AI applications" },
  { icon: Cloud, title: "Cloud Computing", description: "AWS, Azure, GCP platforms and services" },
  { icon: Shield, title: "Cybersecurity", description: "Security practices and ethical hacking" },
  { icon: Code, title: "Web/App Dev", description: "Full-stack development with modern frameworks" },
  { icon: Database, title: "Data Science", description: "Data analysis, visualization, and insights" },
  { icon: Cpu, title: "IoT", description: "Internet of Things and embedded systems" },
  { icon: Blocks, title: "Blockchain", description: "Distributed ledger and Web3 technologies" },
  { icon: Glasses, title: "AR/VR", description: "Augmented and Virtual Reality development" },
];

const hackathonTypes = [
  { icon: Trophy, title: "College Hackathons", description: "Campus-wide coding competitions and challenges" },
  { icon: Lightbulb, title: "Innovation Challenges", description: "Problem-solving competitions for real-world issues" },
  { icon: Mic, title: "Idea Pitches", description: "Startup idea presentation and validation events" },
];

const trainingPrograms = [
  { icon: BookOpen, title: "1-2 Day Bootcamps", description: "Intensive short-term skill-building sessions" },
  { icon: Calendar, title: "1-Week Intensives", description: "Deep-dive programs for comprehensive learning" },
  { icon: Award, title: "30-Day Certifications", description: "Complete certification courses with projects" },
];

const studentDevelopment = [
  { icon: FileText, title: "Resume Building", description: "Professional resume creation and optimization" },
  { icon: MessageSquare, title: "Interview Prep", description: "Mock interviews and communication skills" },
  { icon: FolderKanban, title: "Projects", description: "Real-world project experience and portfolio building" },
  { icon: Briefcase, title: "Internships", description: "Industry internship opportunities and placements" },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center pt-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Empowering individuals and organizations with cutting-edge technology education,
              hands-on workshops, and innovation programs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Workshops Section */}
      <section id="workshops" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              <span className="text-gradient">Workshops</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Hands-on workshops covering the latest technologies and industry practices.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshopTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <topic.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{topic.title}</h3>
                <p className="text-sm text-muted-foreground">{topic.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathons Section */}
      <section id="hackathons" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              <span className="text-gradient">Hackathons</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Competitive events that challenge participants to innovate and create solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {hackathonTypes.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-card to-muted/30 rounded-2xl p-8 border border-border hover:border-secondary/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <item.icon className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Programs Section */}
      <section id="training" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              <span className="text-gradient">Training Programs</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Structured programs designed for comprehensive skill development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {trainingPrograms.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 border border-border hover:border-primary/30 transition-all group text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                  <program.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{program.title}</h3>
                <p className="text-muted-foreground">{program.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Development Section */}
      <section id="development" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              <span className="text-gradient">Student Development</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Comprehensive support to prepare students for successful careers.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentDevelopment.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact us to discuss how we can help you or your organization achieve your technology goals.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
