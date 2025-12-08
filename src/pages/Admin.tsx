import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Mail,
  Box,
  Star,
  LogOut,
  Menu,
  X,
  Zap,
  Eye,
  Check,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type TabType = "overview" | "events" | "applications" | "contacts" | "newsletter" | "blog" | "products" | "testimonials";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    events: 0,
    applications: 0,
    contacts: 0,
    subscribers: 0,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }

      // Check if user is admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roles) {
        setIsAdmin(true);
        fetchStats();
      } else {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges. Contact an administrator.",
          variant: "destructive",
        });
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/admin/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const fetchStats = async () => {
    const [eventsRes, applicationsRes, contactsRes, subscribersRes] = await Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("internship_applications").select("id", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("newsletter_subscriptions").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

    setStats({
      events: eventsRes.count || 0,
      applications: applicationsRes.count || 0,
      contacts: contactsRes.count || 0,
      subscribers: subscribersRes.count || 0,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "applications", label: "Applications", icon: Users },
    { id: "contacts", label: "Messages", icon: MessageSquare },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "blog", label: "Blog Posts", icon: FileText },
    { id: "products", label: "Products", icon: Box },
    { id: "testimonials", label: "Testimonials", icon: Star },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-4">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have admin privileges. If you believe this is an error, please contact an administrator.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Go Home
            </Button>
            <Button variant="glow" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <span className="font-heading font-bold text-foreground">Admin</span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Sign Out"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar */}
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-muted-foreground hover:text-foreground lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-heading text-xl font-bold text-foreground capitalize">
              {activeTab}
            </h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank">View Site</a>
          </Button>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeTab === "overview" && (
            <OverviewTab stats={stats} />
          )}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "applications" && <ApplicationsTab />}
          {activeTab === "contacts" && <ContactsTab />}
          {activeTab === "newsletter" && <NewsletterTab />}
          {activeTab === "blog" && <BlogTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "testimonials" && <TestimonialsTab />}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ stats }: { stats: { events: number; applications: number; contacts: number; subscribers: number } }) {
  const statCards = [
    { label: "Total Events", value: stats.events, icon: Calendar, color: "text-primary" },
    { label: "Applications", value: stats.applications, icon: Users, color: "text-secondary" },
    { label: "Unread Messages", value: stats.contacts, icon: MessageSquare, color: "text-destructive" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-6 border border-border"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("w-8 h-8", stat.color)} />
            </div>
            <p className="font-heading text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h2 className="font-heading text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <Calendar className="w-6 h-6" />
            <span>Add Event</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <FileText className="w-6 h-6" />
            <span>New Blog Post</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <Box className="w-6 h-6" />
            <span>Add Product</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col gap-2">
            <Star className="w-6 h-6" />
            <span>Review Testimonials</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Simple data table components for each tab
function EventsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
      setEvents(data || []);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading events...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Events</h2>
        <Button variant="glow" size="sm">Add Event</Button>
      </div>
      {events.length === 0 ? (
        <p className="p-6 text-muted-foreground text-center">No events yet. Add your first event!</p>
      ) : (
        <div className="divide-y divide-border">
          {events.map((event) => (
            <div key={event.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{event.title}</p>
                <p className="text-sm text-muted-foreground">{event.event_type} • {new Date(event.event_date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${event.is_published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {event.is_published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationsTab() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data } = await supabase.from("internship_applications").select("*").order("created_at", { ascending: false });
      setApplications(data || []);
      setLoading(false);
    };
    fetchApplications();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading applications...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-heading font-semibold text-foreground">Internship Applications</h2>
      </div>
      {applications.length === 0 ? (
        <p className="p-6 text-muted-foreground text-center">No applications yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {applications.map((app) => (
            <div key={app.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{app.name}</p>
                <p className="text-sm text-muted-foreground">{app.position} • {app.email}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                app.status === "accepted" ? "bg-primary/20 text-primary" :
                app.status === "rejected" ? "bg-destructive/20 text-destructive" :
                "bg-muted text-muted-foreground"
              }`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactsTab() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
      setContacts(data || []);
      setLoading(false);
    };
    fetchContacts();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading messages...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-heading font-semibold text-foreground">Contact Messages</h2>
      </div>
      {contacts.length === 0 ? (
        <p className="p-6 text-muted-foreground text-center">No messages yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{contact.name}</p>
                <span className={`w-2 h-2 rounded-full ${contact.is_read ? "bg-muted" : "bg-primary"}`} />
              </div>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
              <p className="text-sm text-foreground mt-2">{contact.subject}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{contact.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NewsletterTab() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      const { data } = await supabase.from("newsletter_subscriptions").select("*").order("subscribed_at", { ascending: false });
      setSubscribers(data || []);
      setLoading(false);
    };
    fetchSubscribers();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading subscribers...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Newsletter Subscribers ({subscribers.length})</h2>
      </div>
      {subscribers.length === 0 ? (
        <p className="p-6 text-muted-foreground text-center">No subscribers yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {subscribers.map((sub) => (
            <div key={sub.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{sub.email}</p>
                <p className="text-sm text-muted-foreground">Subscribed: {new Date(sub.subscribed_at).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${sub.is_active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {sub.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading posts...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Blog Posts</h2>
        <Button variant="glow" size="sm">New Post</Button>
      </div>
      {posts.length === 0 ? (
        <p className="p-6 text-muted-foreground text-center">No blog posts yet. Create your first post!</p>
      ) : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{post.title}</p>
                <p className="text-sm text-muted-foreground">{post.category}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${post.is_published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {post.is_published ? "Published" : "Draft"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading products...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Products</h2>
        <Button variant="glow" size="sm">Add Product</Button>
      </div>
      {products.length === 0 ? (
        <p className="p-6 text-muted-foreground text-center">No products yet. Add your first product!</p>
      ) : (
        <div className="divide-y divide-border">
          {products.map((product) => (
            <div key={product.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${product.is_published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {product.is_published ? "Published" : "Draft"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
      setTestimonials(data || []);
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  if (loading) return <div className="text-muted-foreground">Loading testimonials...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-heading font-semibold text-foreground">Testimonials</h2>
      </div>
      {testimonials.length === 0 ? (
        <p className="p-6 text-muted-foreground text-center">No testimonials yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-foreground">{testimonial.name}</p>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${testimonial.is_approved ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {testimonial.is_approved ? "Approved" : "Pending"}
                  </span>
                  {testimonial.is_featured && (
                    <span className="px-2 py-1 rounded text-xs bg-secondary/20 text-secondary">Featured</span>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              <p className="text-sm text-foreground mt-2 line-clamp-2">{testimonial.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
