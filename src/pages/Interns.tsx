import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  CheckCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Users,
  Rocket,
  Target,
  Heart,
  Code,
  Palette,
  Database,
  Cloud,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const internshipPositions = [
  {
    id: "frontend-intern",
    title: "Frontend Developer Intern",
    type: "Internship",
    duration: "3-6 Months",
    location: "Remote / Hybrid",
    icon: Code,
    description: "Build beautiful, responsive user interfaces using React, TypeScript, and modern CSS frameworks.",
    requirements: [
      "Currently pursuing B.Tech/BE in Computer Science or related field",
      "Proficiency in HTML, CSS, and JavaScript",
      "Experience with React.js or similar frameworks",
      "Understanding of responsive design principles",
      "Basic knowledge of Git version control",
    ],
    responsibilities: [
      "Develop and maintain frontend components",
      "Implement responsive and accessible UI designs",
      "Collaborate with designers and backend developers",
      "Write clean, documented, and testable code",
      "Participate in code reviews",
    ],
  },
  {
    id: "backend-intern",
    title: "Backend Developer Intern",
    type: "Internship",
    duration: "3-6 Months",
    location: "Remote / Hybrid",
    icon: Database,
    description: "Build scalable APIs and backend services using Node.js, Python, and cloud technologies.",
    requirements: [
      "Currently pursuing B.Tech/BE in Computer Science or related field",
      "Proficiency in Python, Node.js, or Java",
      "Understanding of databases (SQL/NoSQL)",
      "Basic knowledge of RESTful APIs",
      "Problem-solving aptitude",
    ],
    responsibilities: [
      "Develop and maintain backend services",
      "Design and implement database schemas",
      "Create RESTful APIs",
      "Optimize application performance",
      "Write unit and integration tests",
    ],
  },
  {
    id: "uiux-intern",
    title: "UI/UX Design Intern",
    type: "Internship",
    duration: "3-6 Months",
    location: "Remote / Hybrid",
    icon: Palette,
    description: "Create stunning user experiences and design systems for web and mobile applications.",
    requirements: [
      "Currently pursuing Design, HCI, or related field",
      "Proficiency in Figma or Adobe XD",
      "Understanding of UI/UX principles",
      "Portfolio showcasing design work",
      "Knowledge of design systems",
    ],
    responsibilities: [
      "Create wireframes and prototypes",
      "Design user interfaces for web and mobile",
      "Conduct user research and testing",
      "Maintain design systems",
      "Collaborate with development teams",
    ],
  },
  {
    id: "cloud-intern",
    title: "Cloud & DevOps Intern",
    type: "Internship",
    duration: "3-6 Months",
    location: "Remote / Hybrid",
    icon: Cloud,
    description: "Learn cloud infrastructure management and DevOps practices with AWS, Azure, and GCP.",
    requirements: [
      "Currently pursuing B.Tech/BE in Computer Science or related field",
      "Basic knowledge of Linux/Unix",
      "Understanding of cloud concepts",
      "Familiarity with Docker",
      "Interest in automation and CI/CD",
    ],
    responsibilities: [
      "Manage cloud infrastructure",
      "Implement CI/CD pipelines",
      "Monitor and optimize cloud resources",
      "Automate deployment processes",
      "Document infrastructure and processes",
    ],
  },
];

const benefits = [
  { icon: GraduationCap, title: "Hands-on Learning", description: "Work with latest technologies" },
  { icon: Users, title: "Expert Mentorship", description: "1-on-1 guidance from industry experts" },
  { icon: Rocket, title: "Real Projects", description: "Work on actual client projects" },
  { icon: Target, title: "Certificate", description: "Internship completion certificate" },
  { icon: Heart, title: "Flexible Work", description: "Remote & hybrid work options" },
  { icon: Briefcase, title: "PPO Opportunity", description: "Full-time offers for top performers" },
];

export default function Interns() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    yearOfStudy: "",
    position: "",
    portfolio: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("internship_applications")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          year_of_study: formData.yearOfStudy,
          position: formData.position,
          portfolio_url: formData.portfolio || null,
          cover_letter: formData.message || null,
        });

      if (error) throw error;

      toast({
        title: "Application Submitted!",
        description: "Thank you for applying. We'll review your application and get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", college: "", yearOfStudy: "", position: "", portfolio: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center pt-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Internship <span className="text-gradient">Program</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Kickstart your tech career with hands-on experience. Learn from industry experts 
              and work on real-world projects that make an impact.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Why <span className="text-gradient">Intern With Us?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer more than just internships – we offer a launchpad for your career.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Internships */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Available <span className="text-gradient">Internships</span>
            </h2>
            <p className="text-muted-foreground">
              Explore our current internship openings and find the right fit for you.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl">
            {internshipPositions.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                <div
                  className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <job.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4 text-primary" />
                            {job.type}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-primary" />
                            {job.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary" />
                            {job.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm" asChild>
                        <a href="#apply-form">Apply Now</a>
                      </Button>
                      {expandedJob === job.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedJob === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border"
                  >
                    <div className="p-6 space-y-6">
                      <p className="text-muted-foreground">{job.description}</p>
                      
                      <div>
                        <h4 className="font-heading text-lg font-semibold text-foreground mb-3">Requirements</h4>
                        <ul className="space-y-2">
                          {job.requirements.map((req, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-heading text-lg font-semibold text-foreground mb-3">Responsibilities</h4>
                        <ul className="space-y-2">
                          {job.responsibilities.map((resp, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
                Apply for <span className="text-gradient">Internship</span>
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll review your application.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                  <Input
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Internship Position *</label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select position</option>
                    {internshipPositions.map((job) => (
                      <option key={job.id} value={job.title}>{job.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">College/University *</label>
                  <Input
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="Your college name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Year of Study *</label>
                  <select
                    required
                    value={formData.yearOfStudy}
                    onChange={(e) => setFormData({ ...formData, yearOfStudy: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Portfolio/LinkedIn URL</label>
                <Input
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Why do you want this internship?</label>
                <Textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about yourself and why you're interested in this internship..."
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
                <Send className="w-5 h-5" />
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
