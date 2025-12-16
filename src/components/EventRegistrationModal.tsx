import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";

interface EventRegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: {
    id: string;
    title: string;
    event_date: string;
    location: string | null;
  } | null;
}

export function EventRegistrationModal({ open, onOpenChange, event }: EventRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    
    setLoading(true);

    try {
      console.log("Submitting event registration:", { event: event.title, ...formData });
      
      const { data, error } = await supabase
        .from("event_registrations")
        .insert({
          event_id: event.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          college: formData.college || null,
        })
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Event registration saved successfully:", data);

      toast({
        title: "Registration Successful!",
        description: `You've registered for ${event.title}. Check your email for details.`,
      });
      
      setFormData({ name: "", email: "", phone: "", college: "" });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Event registration error:", error);
      toast({
        title: "Registration Failed",
        description: error?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Register for Event
          </DialogTitle>
        </DialogHeader>
        
        {event && (
          <div className="mb-4 p-4 rounded-lg bg-muted/50 border border-border">
            <h3 className="font-semibold text-foreground">{event.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(event.event_date).toLocaleDateString()} • {event.location || "Online"}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <Input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email *
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              College/University
            </label>
            <Input
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
              placeholder="Your college name"
            />
          </div>

          <Button type="submit" variant="glow" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Complete Registration"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
