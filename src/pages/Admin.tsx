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
  Download,
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ImageUpload";
import { exportToExcel } from "@/lib/exportToExcel";

type TabType = "overview" | "events" | "interns" | "careers" | "contacts" | "newsletter" | "blog" | "products" | "testimonials" | "registrations";

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    events: 0,
    interns: 0,
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
    const [eventsRes, internsRes, contactsRes, subscribersRes] = await Promise.all([
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("internship_applications").select("id", { count: "exact", head: true }),
      supabase.from("contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false),
      supabase.from("newsletter_subscriptions").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

    setStats({
      events: eventsRes.count || 0,
      interns: internsRes.count || 0,
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
    { id: "registrations", label: "Event Registrations", icon: Users },
    { id: "interns", label: "Intern Applications", icon: GraduationCap },
    { id: "careers", label: "Career Applications", icon: Briefcase },
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
            <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
            <Button variant="glow" onClick={handleLogout}>Sign Out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}>
        <div className="h-20 flex items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            {sidebarOpen && <span className="font-heading font-bold text-foreground">Admin</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm",
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

        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            {sidebarOpen && "Sign Out"}
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen">
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-heading text-xl font-bold text-foreground capitalize">{activeTab.replace("-", " ")}</h1>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank">View Site</a>
          </Button>
        </header>

        <div className="p-6">
          {activeTab === "overview" && <OverviewTab stats={stats} />}
          {activeTab === "events" && <EventsTab />}
          {activeTab === "registrations" && <EventRegistrationsTab />}
          {activeTab === "interns" && <InternsTab />}
          {activeTab === "careers" && <CareersTab />}
          {activeTab === "contacts" && <ContactsTab />}
          {activeTab === "newsletter" && <NewsletterTab />}
          {activeTab === "blog" && <BlogTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "testimonials" && <TestimonialsTab />}
        </div>
      </main>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}

function OverviewTab({ stats }: { stats: { events: number; interns: number; contacts: number; subscribers: number } }) {
  const statCards = [
    { label: "Total Events", value: stats.events, icon: Calendar, color: "text-primary" },
    { label: "Intern Applications", value: stats.interns, icon: GraduationCap, color: "text-secondary" },
    { label: "Unread Messages", value: stats.contacts, icon: MessageSquare, color: "text-destructive" },
    { label: "Subscribers", value: stats.subscribers, icon: Mail, color: "text-primary" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={cn("w-8 h-8", stat.color)} />
            </div>
            <p className="font-heading text-3xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EventsTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    setEvents(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Event deleted" });
    fetchEvents();
  };

  const handleSave = async (formData: any) => {
    if (editingEvent?.id) {
      await supabase.from("events").update(formData).eq("id", editingEvent.id);
      toast({ title: "Event updated" });
    } else {
      await supabase.from("events").insert(formData);
      toast({ title: "Event created" });
    }
    setIsDialogOpen(false);
    setEditingEvent(null);
    fetchEvents();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Events</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="glow" size="sm" onClick={() => setEditingEvent(null)}><Plus className="w-4 h-4 mr-2" />Add Event</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingEvent ? "Edit Event" : "Add Event"}</DialogTitle></DialogHeader>
            <EventForm initialData={editingEvent} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {events.length === 0 ? (
        <p className="p-6 text-muted-foreground text-center">No events yet.</p>
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
                <Button variant="ghost" size="icon" onClick={() => { setEditingEvent(event); setIsDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(event.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventForm({ initialData, onSave, onCancel }: { initialData: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    event_type: initialData?.event_type || "workshop",
    event_date: initialData?.event_date ? new Date(initialData.event_date).toISOString().slice(0, 16) : "",
    location: initialData?.location || "",
    max_participants: initialData?.max_participants || "",
    image_url: initialData?.image_url || null,
    is_published: initialData?.is_published || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, max_participants: formData.max_participants ? Number(formData.max_participants) : null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium mb-2">Title *</label><Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Description *</label><Textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Event Type</label>
          <select value={formData.event_type} onChange={(e) => setFormData({ ...formData, event_type: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background">
            <option value="workshop">Workshop</option><option value="hackathon">Hackathon</option><option value="bootcamp">Bootcamp</option><option value="masterclass">Masterclass</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-2">Event Date *</label><Input type="datetime-local" required value={formData.event_date} onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Location</label><Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Online or venue" /></div>
        <div><label className="block text-sm font-medium mb-2">Max Participants</label><Input type="number" value={formData.max_participants} onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })} /></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Event Image</label><ImageUpload value={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} folder="events" /></div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} /><label className="text-sm">Publish immediately</label></div>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit" variant="glow">Save</Button></div>
    </form>
  );
}

function EventRegistrationsTab() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("event_registrations").select("*, events(title)").order("created_at", { ascending: false });
      setRegistrations(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleExport = () => {
    const exportData = registrations.map(r => ({
      Name: r.name, Email: r.email, Phone: r.phone || "", College: r.college || "", Event: r.events?.title || "", Status: r.status, Date: new Date(r.created_at).toLocaleDateString()
    }));
    exportToExcel(exportData, "event-registrations");
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Event Registrations ({registrations.length})</h2>
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>
      {registrations.length === 0 ? <p className="p-6 text-muted-foreground text-center">No registrations yet.</p> : (
        <div className="divide-y divide-border">
          {registrations.map((reg) => (
            <div key={reg.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{reg.name}</p>
                <p className="text-sm text-muted-foreground">{reg.email} • {reg.events?.title}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${reg.status === "accepted" ? "bg-primary/20 text-primary" : reg.status === "rejected" ? "bg-destructive/20 text-destructive" : "bg-muted text-muted-foreground"}`}>{reg.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InternsTab() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("internship_applications").select("*").order("created_at", { ascending: false });
    setApplications(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleExport = () => {
    const exportData = applications.map(a => ({
      Name: a.name, Email: a.email, Phone: a.phone, College: a.college, Year: a.year_of_study, Position: a.position, Portfolio: a.portfolio_url || "", Status: a.status, AppliedOn: new Date(a.created_at).toLocaleDateString()
    }));
    exportToExcel(exportData, "intern-applications");
  };

  const updateStatus = async (id: string, status: "pending" | "reviewed" | "accepted" | "rejected") => {
    await supabase.from("internship_applications").update({ status }).eq("id", id);
    toast({ title: `Application ${status}` });
    fetch();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Intern Applications ({applications.length})</h2>
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>
      {applications.length === 0 ? <p className="p-6 text-muted-foreground text-center">No applications yet.</p> : (
        <div className="divide-y divide-border">
          {applications.map((app) => (
            <div key={app.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{app.name}</p>
                  <p className="text-sm text-muted-foreground">{app.position} • {app.email}</p>
                  <p className="text-sm text-muted-foreground">{app.college} • {app.year_of_study}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as "pending" | "reviewed" | "accepted" | "rejected")} className="h-8 px-2 rounded border border-input bg-background text-sm">
                    <option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              {app.cover_letter && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{app.cover_letter}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CareersTab() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("internship_applications").select("*").order("created_at", { ascending: false });
    setApplications(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleExport = () => {
    const exportData = applications.map(a => ({
      Name: a.name, Email: a.email, Phone: a.phone, College: a.college, Year: a.year_of_study, Position: a.position, Portfolio: a.portfolio_url || "", Status: a.status, AppliedOn: new Date(a.created_at).toLocaleDateString()
    }));
    exportToExcel(exportData, "career-applications");
  };

  const updateStatus = async (id: string, status: "pending" | "reviewed" | "accepted" | "rejected") => {
    await supabase.from("internship_applications").update({ status }).eq("id", id);
    toast({ title: `Application ${status}` });
    fetch();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Career Applications ({applications.length})</h2>
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>
      {applications.length === 0 ? <p className="p-6 text-muted-foreground text-center">No applications yet.</p> : (
        <div className="divide-y divide-border">
          {applications.map((app) => (
            <div key={app.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{app.name}</p>
                  <p className="text-sm text-muted-foreground">{app.position} • {app.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as "pending" | "reviewed" | "accepted" | "rejected")} className="h-8 px-2 rounded border border-input bg-background text-sm">
                    <option value="pending">Pending</option><option value="reviewed">Reviewed</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
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
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false });
    setContacts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    toast({ title: "Marked as read" });
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await supabase.from("contact_submissions").delete().eq("id", id);
    toast({ title: "Message deleted" });
    fetch();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border"><h2 className="font-heading font-semibold text-foreground">Contact Messages ({contacts.length})</h2></div>
      {contacts.length === 0 ? <p className="p-6 text-muted-foreground text-center">No messages yet.</p> : (
        <div className="divide-y divide-border">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${contact.is_read ? "bg-muted" : "bg-primary"}`} />
                  <p className="font-medium text-foreground">{contact.name}</p>
                </div>
                <div className="flex gap-2">
                  {!contact.is_read && <Button variant="ghost" size="sm" onClick={() => markAsRead(contact.id)}>Mark Read</Button>}
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(contact.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{contact.email}</p>
              <p className="text-sm font-medium text-foreground mt-2">{contact.subject}</p>
              <p className="text-sm text-muted-foreground mt-1">{contact.message}</p>
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
    const fetch = async () => {
      const { data } = await supabase.from("newsletter_subscriptions").select("*").order("subscribed_at", { ascending: false });
      setSubscribers(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleExport = () => {
    const exportData = subscribers.map(s => ({ Email: s.email, Status: s.is_active ? "Active" : "Inactive", SubscribedOn: new Date(s.subscribed_at).toLocaleDateString() }));
    exportToExcel(exportData, "newsletter-subscribers");
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Newsletter Subscribers ({subscribers.length})</h2>
        <Button variant="outline" size="sm" onClick={handleExport}><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>
      {subscribers.length === 0 ? <p className="p-6 text-muted-foreground text-center">No subscribers yet.</p> : (
        <div className="divide-y divide-border">
          {subscribers.map((sub) => (
            <div key={sub.id} className="p-4 flex items-center justify-between">
              <div><p className="font-medium text-foreground">{sub.email}</p><p className="text-sm text-muted-foreground">Subscribed: {new Date(sub.subscribed_at).toLocaleDateString()}</p></div>
              <span className={`px-2 py-1 rounded text-xs ${sub.is_active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{sub.is_active ? "Active" : "Inactive"}</span>
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
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("blog_posts").delete().eq("id", id);
    toast({ title: "Post deleted" });
    fetch();
  };

  const handleSave = async (formData: any) => {
    if (editingPost?.id) {
      await supabase.from("blog_posts").update(formData).eq("id", editingPost.id);
      toast({ title: "Post updated" });
    } else {
      await supabase.from("blog_posts").insert(formData);
      toast({ title: "Post created" });
    }
    setIsDialogOpen(false);
    setEditingPost(null);
    fetch();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Blog Posts</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button variant="glow" size="sm" onClick={() => setEditingPost(null)}><Plus className="w-4 h-4 mr-2" />New Post</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingPost ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
            <BlogForm initialData={editingPost} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {posts.length === 0 ? <p className="p-6 text-muted-foreground text-center">No posts yet.</p> : (
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <div key={post.id} className="p-4 flex items-center justify-between">
              <div><p className="font-medium text-foreground">{post.title}</p><p className="text-sm text-muted-foreground">{post.category}</p></div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${post.is_published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{post.is_published ? "Published" : "Draft"}</span>
                <Button variant="ghost" size="icon" onClick={() => { setEditingPost(post); setIsDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogForm({ initialData, onSave, onCancel }: { initialData: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    category: initialData?.category || "news",
    cover_image: initialData?.cover_image || null,
    is_published: initialData?.is_published || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || formData.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    onSave({ ...formData, slug, published_at: formData.is_published ? new Date().toISOString() : null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium mb-2">Title *</label><Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Slug</label><Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="auto-generated from title" /></div>
      <div><label className="block text-sm font-medium mb-2">Excerpt</label><Input value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Content *</label><Textarea required rows={6} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Category</label>
        <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background">
          <option value="news">News</option><option value="tech">Technology</option><option value="events">Events</option><option value="tutorials">Tutorials</option>
        </select>
      </div>
      <div><label className="block text-sm font-medium mb-2">Cover Image</label><ImageUpload value={formData.cover_image} onChange={(url) => setFormData({ ...formData, cover_image: url })} folder="blog" /></div>
      <div className="flex items-center gap-2"><input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} /><label className="text-sm">Publish immediately</label></div>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit" variant="glow">Save</Button></div>
    </form>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    fetch();
  };

  const handleSave = async (formData: any) => {
    if (editingProduct?.id) {
      await supabase.from("products").update(formData).eq("id", editingProduct.id);
      toast({ title: "Product updated" });
    } else {
      await supabase.from("products").insert(formData);
      toast({ title: "Product created" });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
    fetch();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Products</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button variant="glow" size="sm" onClick={() => setEditingProduct(null)}><Plus className="w-4 h-4 mr-2" />Add Product</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle></DialogHeader>
            <ProductForm initialData={editingProduct} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {products.length === 0 ? <p className="p-6 text-muted-foreground text-center">No products yet.</p> : (
        <div className="divide-y divide-border">
          {products.map((product) => (
            <div key={product.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {product.image_url && <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded object-cover" />}
                <div><p className="font-medium text-foreground">{product.name}</p><p className="text-sm text-muted-foreground">{product.category}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${product.is_published ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>{product.is_published ? "Published" : "Draft"}</span>
                <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(product); setIsDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductForm({ initialData, onSave, onCancel }: { initialData: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    short_description: initialData?.short_description || "",
    category: initialData?.category || "ai",
    technologies: initialData?.technologies?.join(", ") || "",
    demo_url: initialData?.demo_url || "",
    github_url: initialData?.github_url || "",
    image_url: initialData?.image_url || null,
    is_published: initialData?.is_published || false,
    is_featured: initialData?.is_featured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div><label className="block text-sm font-medium mb-2">Name *</label><Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Short Description</label><Input value={formData.short_description} onChange={(e) => setFormData({ ...formData, short_description: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Description *</label><Textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Category</label>
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-input bg-background">
            <option value="ai">AI Solutions</option><option value="cloud">Cloud Tools</option><option value="iot">IoT Projects</option><option value="web">Web Apps</option>
          </select>
        </div>
        <div><label className="block text-sm font-medium mb-2">Technologies</label><Input value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} placeholder="React, Python, etc." /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Demo URL</label><Input value={formData.demo_url} onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">GitHub URL</label><Input value={formData.github_url} onChange={(e) => setFormData({ ...formData, github_url: e.target.value })} /></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Product Image</label><ImageUpload value={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} folder="products" /></div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2"><input type="checkbox" checked={formData.is_published} onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })} /><label className="text-sm">Published</label></div>
        <div className="flex items-center gap-2"><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} /><label className="text-sm">Featured</label></div>
      </div>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit" variant="glow">Save</Button></div>
    </form>
  );
}

function TestimonialsTab() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setTestimonials(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    toast({ title: "Testimonial deleted" });
    fetch();
  };

  const handleSave = async (formData: any) => {
    if (editingTestimonial?.id) {
      await supabase.from("testimonials").update(formData).eq("id", editingTestimonial.id);
      toast({ title: "Testimonial updated" });
    } else {
      await supabase.from("testimonials").insert(formData);
      toast({ title: "Testimonial created" });
    }
    setIsDialogOpen(false);
    setEditingTestimonial(null);
    fetch();
  };

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    await supabase.from("testimonials").update({ is_approved: !currentStatus }).eq("id", id);
    toast({ title: currentStatus ? "Testimonial unapproved" : "Testimonial approved" });
    fetch();
  };

  if (loading) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-heading font-semibold text-foreground">Testimonials</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button variant="glow" size="sm" onClick={() => setEditingTestimonial(null)}><Plus className="w-4 h-4 mr-2" />Add Testimonial</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
            <TestimonialForm initialData={editingTestimonial} onSave={handleSave} onCancel={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      {testimonials.length === 0 ? <p className="p-6 text-muted-foreground text-center">No testimonials yet.</p> : (
        <div className="divide-y divide-border">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {testimonial.image_url && <img src={testimonial.image_url} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />}
                  <div><p className="font-medium text-foreground">{testimonial.name}</p><p className="text-sm text-muted-foreground">{testimonial.role}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant={testimonial.is_approved ? "outline" : "glow"} size="sm" onClick={() => toggleApproval(testimonial.id, testimonial.is_approved)}>
                    {testimonial.is_approved ? "Unapprove" : "Approve"}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => { setEditingTestimonial(testimonial); setIsDialogOpen(true); }}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(testimonial.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{testimonial.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TestimonialForm({ initialData, onSave, onCancel }: { initialData: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    role: initialData?.role || "",
    company: initialData?.company || "",
    content: initialData?.content || "",
    rating: initialData?.rating || 5,
    event_name: initialData?.event_name || "",
    image_url: initialData?.image_url || null,
    is_approved: initialData?.is_approved || false,
    is_featured: initialData?.is_featured || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Name *</label><Input required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Role *</label><Input required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="Student, Developer, etc." /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><label className="block text-sm font-medium mb-2">Company/College</label><Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} /></div>
        <div><label className="block text-sm font-medium mb-2">Event Name</label><Input value={formData.event_name} onChange={(e) => setFormData({ ...formData, event_name: e.target.value })} /></div>
      </div>
      <div><label className="block text-sm font-medium mb-2">Testimonial *</label><Textarea required rows={4} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} /></div>
      <div><label className="block text-sm font-medium mb-2">Rating</label>
        <select value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="w-full h-10 px-3 rounded-lg border border-input bg-background">
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
        </select>
      </div>
      <div><label className="block text-sm font-medium mb-2">Photo</label><ImageUpload value={formData.image_url} onChange={(url) => setFormData({ ...formData, image_url: url })} folder="testimonials" /></div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2"><input type="checkbox" checked={formData.is_approved} onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })} /><label className="text-sm">Approved</label></div>
        <div className="flex items-center gap-2"><input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} /><label className="text-sm">Featured</label></div>
      </div>
      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onCancel}>Cancel</Button><Button type="submit" variant="glow">Save</Button></div>
    </form>
  );
}
