"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const messageData = {
      name: `${formData.get("firstName")} ${formData.get("lastName")}`,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const { error } = await supabase.from("messages").insert([messageData]);

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });

      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <Input
            name="firstName"
            type="text"
            required
            className="bg-white dark:bg-slate-800"
            placeholder="John"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <Input
            name="lastName"
            type="text"
            required
            className="bg-white dark:bg-slate-800"
            placeholder="Doe"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <Input
          name="email"
          type="email"
          required
          className="bg-white dark:bg-slate-800"
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subject
        </label>
        <Input
          name="subject"
          type="text"
          required
          className="bg-white dark:bg-slate-800"
          placeholder="How can we help you?"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Tell us more about your inquiry..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
      >
        <Send className="w-4 h-4 mr-2" />
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
