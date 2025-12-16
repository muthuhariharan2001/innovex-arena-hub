import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ResumeUpload } from "@/components/ResumeUpload";

const openPositions = [
  {
    id: "tpm-intern",
    title: "Technical Project Manager Intern",
    type: "Internship",
    duration: "3-6 Months",
    location: "Remote / Hybrid",
    description: "Join our team as a TPM Intern and learn to manage technical projects, coordinate with development teams, and deliver results.",
    requirements: [
      "Currently pursuing B.Tech/BE in Computer Science or related field",
      "Strong communication and organizational skills",
      "Basic understanding of software development lifecycle",
      "Ability to work in a fast-paced environment",
      "Proficiency in tools like Jira, Trello, or similar",
    ],
    responsibilities: [
      "Assist in project planning and timeline management",
      "Coordinate between development and stakeholder teams",
      "Track project milestones and prepare status reports",
      "Help organize team meetings and documentation",
      "Support in risk identification and mitigation",
    ],
  },
  {
    id: "dev-intern",
    title: "Software Developer Intern",
    type: "Internship",
    duration: "3-6 Months",
    location: "Remote / Hybrid",
    description: "Build real-world applications and gain hands-on experience with modern technologies in our development team.",
    requirements: [
      "Currently pursuing B.Tech/BE in Computer Science or related field",
      "Proficiency in at least one programming language (Python/JavaScript/Java)",
      "Basic knowledge of web development (HTML, CSS, React/Angular)",
      "Understanding of databases (SQL/NoSQL)",
      "Problem-solving aptitude and willingness to learn",
    ],
    responsibilities: [
      "Develop and maintain web applications",
      "Write clean, documented, and testable code",
      "Participate in code reviews and team discussions",
      "Collaborate with designers and product team",
      "Debug and resolve technical issues",
    ],
  },
];

const benefits = [
  { icon: GraduationCap, title: "Learning", description: "Hands-on training with latest technologies" },
  { icon: Users, title: "Mentorship", description: "Guidance from industry experts" },
  { icon: Rocket, title: "Real Projects", description: "Work on actual client projects" },
  { icon: Target, title: "Certificate", description: "Internship completion certificate" },
  { icon: Heart, title: "Flexibility", description: "Remote & hybrid work options" },
  { icon: Briefcase, title: "Full-time Opportunity", description: "PPO for top performers" },
];

export default function Careers() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    yearOfStudy: "",
    position: "",
    portfolio: "",
    resume: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting career application:", formData);
      
      const { data, error } = await supabase
        .from("internship_applications")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          year_of_study: formData.yearOfStudy,
          position: formData.position,
          portfolio_url: formData.portfolio || null,
          resume_url: formData.resume || null,
          cover_letter: formData.message || null,
        })
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Application saved successfully:", data);

      // Send email notification
      try {
        await supabase.functions.invoke("notify-application", {
          body: {
            type: "career",
            applicantName: formData.name,
            applicantEmail: formData.email,
            position: formData.position,
            college: formData.college,
            phone: formData.phone,
          },
        });
      } catch (emailError) {
        console.log("Email notification failed, but application was saved:", emailError);
      }

      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", college: "", yearOfStudy: "", position: "", portfolio: "", resume: "", message: "" });
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: error?.message || "Something went wrong. Please check all fields and try again.",
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
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center pt-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Join <span className="text-gradient">Innovex Arena</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Start your career journey with us. We're looking for passionate individuals 
              who want to make an impact in the tech world.
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

      {/* Open Positions */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Open <span className="text-gradient">Positions</span>
            </h2>
            <p className="text-muted-foreground">
              Explore our current openings and find the right fit for you.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-4xl">
            {openPositions.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                {/* Job Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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

                {/* Expanded Content */}
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
                Apply <span className="text-gradient">Now</span>
              </h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you shortly.
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
                  <label className="block text-sm font-medium text-foreground mb-2">Position *</label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select position</option>
                    {openPositions.map((job) => (
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
                <label className="block text-sm font-medium text-foreground mb-2">Resume *</label>
                <ResumeUpload
                  value={formData.resume}
                  onChange={(url) => setFormData({ ...formData, resume: url })}
                />
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
                <label className="block text-sm font-medium text-foreground mb-2">Why do you want to join?</label>
                <Textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about yourself and why you're interested..."
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
