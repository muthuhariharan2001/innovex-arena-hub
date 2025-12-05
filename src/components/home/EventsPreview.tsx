import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    title: "AI & ML Workshop",
    date: "January 15, 2025",
    location: "Virtual Event",
    attendees: "100+ Expected",
    type: "Workshop",
  },
  {
    title: "Cloud Computing Bootcamp",
    date: "January 22-23, 2025",
    location: "Hyderabad",
    attendees: "50 Seats",
    type: "Bootcamp",
  },
  {
    title: "Innovation Hackathon 2025",
    date: "February 10-11, 2025",
    location: "Multiple Colleges",
    attendees: "500+ Participants",
    type: "Hackathon",
  },
];

export const EventsPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-glow opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upcoming <span className="text-gradient">Events</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Join us for transformative workshops, hackathons, and training programs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all duration-300 group"
            >
              {/* Event Type Badge */}
              <div className="bg-gradient-to-r from-primary to-secondary p-3">
                <span className="font-heading text-sm font-semibold text-primary-foreground uppercase tracking-wider">
                  {event.type}
                </span>
              </div>
              
              <div className="p-6">
                <h3 className="font-heading text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{event.attendees}</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-6" asChild>
                  <Link to="/events">Learn More</Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="glow" size="lg" asChild>
            <Link to="/events">
              View All Events
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
