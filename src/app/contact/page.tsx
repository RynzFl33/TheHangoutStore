"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import ContactForm from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-purple-100 max-w-2xl mx-auto"
          >
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Contact Details */}
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Email
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      support@thehangout.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Phone
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Address
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      123 Fashion Street
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Business Hours
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Mon - Fri: 9:00 AM - 6:00 PM
                      <br />
                      Sat - Sun: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Quick Links */}
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900 dark:text-white">
                  Quick Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Looking for quick answers? Check out these popular topics:
                </p>

                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="w-full justify-start p-3 cursor-pointer hover:bg-purple-50 hover:border-purple-300"
                  >
                    Order Status & Tracking
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-start p-3 cursor-pointer hover:bg-purple-50 hover:border-purple-300"
                  >
                    Returns & Exchanges
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-start p-3 cursor-pointer hover:bg-purple-50 hover:border-purple-300"
                  >
                    Size Guide
                  </Badge>
                  <Badge
                    variant="outline"
                    className="w-full justify-start p-3 cursor-pointer hover:bg-purple-50 hover:border-purple-300"
                  >
                    Shipping Information
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">
                  We're Here to Help!
                </h3>
                <p className="text-purple-100">
                  Average response time: <strong>2-4 hours</strong>
                </p>
                <p className="text-purple-100 text-sm mt-2">
                  We typically respond to all inquiries within 24 hours during
                  business days.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
