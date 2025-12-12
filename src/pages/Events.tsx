import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { EventRegistrationModal } from "@/components/EventRegistrationModal";
import { supabase } from "@/integrations/supabase/client";

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  end_date: string | null;
  location: string | null;
  event_type: string;
  max_participants: number | null;
  registration_deadline: string | null;
  image_url: string | null;
}

const fallbackEvents = [
  {
    id: "1",
    title: "AI & Machine Learning Workshop",
    description: "Deep dive into neural networks, TensorFlow, and practical ML applications.",
    event_date: "2025-01-15T10:00:00",
    end_date: null,
    location: "Virtual Event",
    event_type: "Workshop",
    max_participants: 100,
    registration_deadline: "2025-01-14T23:59:59",
    image_url: null,
  },
  {
    id: "2",
    title: "Cloud Computing Bootcamp",
    description: "Hands-on AWS certification prep with real-world projects.",
    event_date: "2025-01-22T09:00:00",
    end_date: "2025-01-23T18:00:00",
    location: "Hyderabad, India",
    event_type: "Bootcamp",
    max_participants: 50,
    registration_deadline: "2025-01-20T23:59:59",
    image_url: null,
  },
  {
    id: "3",
    title: "Innovation Hackathon 2025",
    description: "48-hour hackathon with prizes worth ₹5 Lakhs. Build solutions for real problems.",
    event_date: "2025-02-10T00:00:00",
    end_date: "2025-02-11T23:59:59",
    location: "Multiple Colleges",
    event_type: "Hackathon",
    max_participants: 500,
    registration_deadline: null,
    image_url: null,
  },
  {
    id: "4",
    title: "Generative AI Masterclass",
    description: "Learn to build applications with ChatGPT API, DALL-E, and other Gen AI tools.",
    event_date: "2025-02-25T14:00:00",
    end_date: null,
    location: "Online",
    event_type: "Masterclass",
    max_participants: 200,
    registration_deadline: "2025-02-24T23:59:59",
    image_url: null,
  },
];

const pastEventsData = [
  {
    title: "Cybersecurity Workshop",
    date: "December 2024",
    attendees: "150+",
    location: "Bangalore",
  },
  {
    title: "Tech Innovators Hackathon",
    date: "November 2024",
    attendees: "300+",
    location: "Multiple Cities",
  },
  {
    title: "Data Science Bootcamp",
    date: "October 2024",
    attendees: "80+",
    location: "Chennai",
  },
  {
    title: "IoT Workshop Series",
    date: "September 2024",
    attendees: "120+",
    location: "Hyderabad",
  },
];

export default function Events() {
  const [events, setEvents] = useState<Event[]>(fallbackEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .gte("event_date", new Date().toISOString())
        .order("event_date", { ascending: true });

      if (!error && data && data.length > 0) {
        setEvents(data);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const isRegistrationOpen = (event: Event) => {
    if (!event.registration_deadline) return true;
    return new Date(event.registration_deadline) > new Date();
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-12 pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[128px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center pt-12"
          >
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              Events & <span className="text-gradient">Programs</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our workshops, hackathons, and training programs to learn, build, and grow 
              with the tech community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Upcoming <span className="text-gradient">Events</span>
            </h2>
            <p className="text-muted-foreground">
              Don't miss out on these exciting opportunities to learn and grow.
            </p>
          </motion.div>

          <div className="space-y-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-all"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Event Type Badge */}
                  <div className="lg:w-48 bg-gradient-to-br from-primary to-secondary p-6 flex flex-col justify-center items-center text-center">
                    <span className="font-heading text-sm font-bold text-primary-foreground uppercase tracking-wider mb-2">
                      {event.event_type}
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      isRegistrationOpen(event) 
                        ? "bg-primary-foreground/20 text-primary-foreground" 
                        : "bg-primary-foreground/10 text-primary-foreground/70"
                    }`}>
                      {isRegistrationOpen(event) ? "Registration Open" : "Coming Soon"}
                    </span>
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                          {event.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">{event.description}</p>
                        
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{new Date(event.event_date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 text-primary" />
                            <span>{new Date(event.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary" />
                            <span>{event.location || "Online"}</span>
                          </div>
                          {event.max_participants && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4 text-primary" />
                              <span>{event.max_participants} Seats</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex lg:flex-col gap-3">
                        <Button 
                          variant={isRegistrationOpen(event) ? "glow" : "outline"} 
                          disabled={!isRegistrationOpen(event)}
                          onClick={() => handleRegister(event)}
                        >
                          {isRegistrationOpen(event) ? "Register Now" : "Coming Soon"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Past <span className="text-gradient">Events</span>
            </h2>
            <p className="text-muted-foreground">
              A look back at our successful events and programs.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pastEventsData.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">{event.title}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{event.attendees} Attendees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
              Want to Host an Event?
            </h2>
            <p className="text-muted-foreground mb-8">
              Partner with us to bring workshops, hackathons, or training programs to your institution or organization.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Get in Touch
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Registration Modal */}
      <EventRegistrationModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        event={selectedEvent}
      />
    </Layout>
  );
}
