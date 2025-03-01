import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";
import { Label } from "@/components/ui/label"
import {  } from "lucide-react"

export default function Contact() {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you! Whether you have questions, feedback, or need support, reach out to us anytime.
        </p>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below, and we’ll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your Email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we assist you?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." className="min-h-[120px]" />
                </div>
                <Button type="submit" className="w-full">Send Message</Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8 mx-auto">
            <h2 className="text-3xl font-bold">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Location</h3>
                  <p className="text-muted-foreground">
                    CUSAT P.O., Kalamassery, Kochi, Kerala - 680004
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-muted-foreground">+91 9876543210</p>
                  <p className="text-muted-foreground text-sm">Mon-Fri, 9 AM - 5 PM </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-muted-foreground">contact@mindheal.com</p>
                </div>
              </div>
            </div>
            {/* Social Links */}
            <div>
              <h3 className="font-semibold mb-2">Follow Us</h3>
              <div className="flex gap-4">
                <Button variant="outline"  size="icon" asChild >
                  <Facebook/>
                </Button>
                <Button variant="outline" size="icon" asChild>
                 <Twitter/>
                </Button>
                <Button variant="outline" size="icon" asChild>
                 <Instagram/>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
