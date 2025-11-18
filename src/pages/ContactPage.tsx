import React from 'react';
import { H1, P, H2 } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your message has been sent!");
    // In a real application, you would handle form submission here (e.g., send to an API)
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-8">
      <div className="text-center">
        <H1 className="mb-4">Contact Us</H1>
        <P className="text-xl text-muted-foreground">
          We'd love to hear from you. Reach out with any questions or feedback.
        </P>
      </div>

      <section className="space-y-6">
        <H2 className="text-center">Get in Touch</H2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@example.com" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Subject of your message" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Your message..." rows={5} required />
          </div>
          <Button type="submit" className="w-full py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
            Send Message
          </Button>
        </form>
      </section>

      <section className="text-center space-y-4">
        <H2>Our Location</H2>
        <P className="text-lg text-muted-foreground">
          123 Luxe Avenue, Fashion City, FL 12345
        </P>
        <P className="text-lg text-muted-foreground">
          Email: info@modernluxe.com | Phone: (123) 456-7890
        </P>
      </section>
    </div>
  );
};

export default ContactPage;