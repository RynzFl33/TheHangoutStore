"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  Truck,
  CreditCard,
  RefreshCw,
  Shirt,
} from "lucide-react";

const faqCategories = [
  {
    id: "orders",
    name: "Orders & Shipping",
    icon: <Truck className="w-5 h-5" />,
    color: "bg-blue-100 text-blue-600",
    questions: [
      {
        question: "How long does shipping take?",
        answer:
          "Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. Free shipping is available on orders over $50.",
      },
      {
        question: "Can I track my order?",
        answer:
          "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we only ship within the United States. We're working on expanding to international shipping soon!",
      },
      {
        question: "What if my order is damaged or lost?",
        answer:
          "If your order arrives damaged or gets lost in transit, please contact us immediately. We'll replace the item or provide a full refund.",
      },
    ],
  },
  {
    id: "returns",
    name: "Returns & Exchanges",
    icon: <RefreshCw className="w-5 h-5" />,
    color: "bg-green-100 text-green-600",
    questions: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for unworn items in original condition with tags attached. Returns are free for defective items.",
      },
      {
        question: "How do I start a return?",
        answer:
          "Log into your account, go to your order history, and click 'Return Item'. You can also contact our customer service team for assistance.",
      },
      {
        question: "Can I exchange an item for a different size?",
        answer:
          "Yes! You can exchange items for a different size within 30 days. The exchange process is the same as returns - just select 'Exchange' instead.",
      },
      {
        question: "When will I receive my refund?",
        answer:
          "Refunds are processed within 3-5 business days after we receive your returned item. It may take an additional 5-7 days to appear on your statement.",
      },
    ],
  },
  {
    id: "sizing",
    name: "Sizing & Fit",
    icon: <Shirt className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-600",
    questions: [
      {
        question: "How do I find my size?",
        answer:
          "Check our detailed size guide for measurements. Each product page also includes specific sizing information and fit details.",
      },
      {
        question: "Do your clothes run true to size?",
        answer:
          "Most of our items run true to size, but some styles may have a relaxed or fitted cut. Check the product description for specific fit information.",
      },
      {
        question: "What if I'm between sizes?",
        answer:
          "If you're between sizes, we generally recommend sizing up for a more comfortable fit. You can always exchange if needed!",
      },
      {
        question: "Are there size charts for each item?",
        answer:
          "Yes, each product has a size chart available. Click on the 'Size Guide' link on any product page to see detailed measurements.",
      },
    ],
  },
  {
    id: "payment",
    name: "Payment & Pricing",
    icon: <CreditCard className="w-5 h-5" />,
    color: "bg-orange-100 text-orange-600",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay.",
      },
      {
        question: "Is my payment information secure?",
        answer:
          "Absolutely! We use industry-standard SSL encryption to protect your payment information. We never store your credit card details.",
      },
      {
        question: "Do you offer payment plans?",
        answer:
          "Yes, we partner with Klarna and Afterpay to offer buy-now-pay-later options. You can split your purchase into 4 interest-free payments.",
      },
      {
        question: "Can I use multiple discount codes?",
        answer:
          "Only one discount code can be used per order. The system will automatically apply the code that gives you the best savings.",
      },
    ],
  },
];

export default function FAQPage() {
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
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-purple-100 max-w-2xl mx-auto"
          >
            Find answers to common questions about orders, shipping, returns,
            and more.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for answers..."
              className="pl-10 py-3 text-lg bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 focus:border-purple-500"
            />
          </div>
        </motion.div>

        {/* Category Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {faqCategories.map((category) => (
            <Card
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-shadow bg-white dark:bg-slate-900"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex p-3 rounded-full ${category.color} mb-4`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {category.questions.length} questions
                </p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + categoryIndex * 0.1 }}
            >
              <Card className="bg-white dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-gray-900 dark:text-white">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      {category.icon}
                    </div>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${category.id}-${index}`}
                      >
                        <AccordionTrigger className="text-left hover:text-purple-600 transition-colors">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-8 text-center">
              <HelpCircle className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our customer support
                team is here to help you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 cursor-pointer">
                  Contact Support
                </Badge>
                <Badge className="bg-purple-700 hover:bg-purple-800 px-6 py-3 cursor-pointer">
                  Live Chat
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
