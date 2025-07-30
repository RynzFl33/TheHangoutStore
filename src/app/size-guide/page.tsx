"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ruler, User, Shirt, AlertCircle } from "lucide-react";

const sizeCharts = {
  mens: {
    title: "Men's Sizing",
    sizes: [
      { size: "XS", chest: "32-34", waist: "26-28", length: "26" },
      { size: "S", chest: "34-36", waist: "28-30", length: "27" },
      { size: "M", chest: "36-38", waist: "30-32", length: "28" },
      { size: "L", chest: "38-40", waist: "32-34", length: "29" },
      { size: "XL", chest: "40-42", waist: "34-36", length: "30" },
      { size: "XXL", chest: "42-44", waist: "36-38", length: "31" },
    ],
  },
  womens: {
    title: "Women's Sizing",
    sizes: [
      { size: "XS", chest: "30-32", waist: "24-26", length: "24" },
      { size: "S", chest: "32-34", waist: "26-28", length: "25" },
      { size: "M", chest: "34-36", waist: "28-30", length: "26" },
      { size: "L", chest: "36-38", waist: "30-32", length: "27" },
      { size: "XL", chest: "38-40", waist: "32-34", length: "28" },
      { size: "XXL", chest: "40-42", waist: "34-36", length: "29" },
    ],
  },
  hoodies: {
    title: "Hoodies & Sweatshirts",
    sizes: [
      { size: "XS", chest: "34-36", length: "25", sleeve: "32" },
      { size: "S", chest: "36-38", length: "26", sleeve: "33" },
      { size: "M", chest: "38-40", length: "27", sleeve: "34" },
      { size: "L", chest: "40-42", length: "28", sleeve: "35" },
      { size: "XL", chest: "42-44", length: "29", sleeve: "36" },
      { size: "XXL", chest: "44-46", length: "30", sleeve: "37" },
    ],
  },
};

const measurementTips = [
  {
    title: "Chest/Bust",
    description:
      "Measure around the fullest part of your chest, keeping the tape horizontal.",
    icon: <User className="w-5 h-5" />,
  },
  {
    title: "Waist",
    description:
      "Measure around your natural waistline, keeping the tape comfortably loose.",
    icon: <User className="w-5 h-5" />,
  },
  {
    title: "Length",
    description:
      "Measure from the highest point of your shoulder down to where you want the garment to end.",
    icon: <Ruler className="w-5 h-5" />,
  },
  {
    title: "Sleeve Length",
    description:
      "Measure from your shoulder point to your wrist with your arm slightly bent.",
    icon: <Shirt className="w-5 h-5" />,
  },
];

function SizeChart({ chart }: { chart: typeof sizeCharts.mens }) {
  return (
    <Card className="bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900 dark:text-white">
          {chart.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Size
                </th>
                <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Chest (in)
                </th>
                {chart.sizes[0].waist && (
                  <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">
                    Waist (in)
                  </th>
                )}
                <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">
                  Length (in)
                </th>
                {chart.sizes[0].sleeve && (
                  <th className="text-left py-3 px-2 font-semibold text-gray-900 dark:text-white">
                    Sleeve (in)
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {chart.sizes.map((size, index) => (
                <tr
                  key={size.size}
                  className={
                    index % 2 === 0 ? "bg-gray-50 dark:bg-slate-800" : ""
                  }
                >
                  <td className="py-3 px-2 font-medium text-gray-900 dark:text-white">
                    {size.size}
                  </td>
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-300">
                    {size.chest}
                  </td>
                  {size.waist && (
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300">
                      {size.waist}
                    </td>
                  )}
                  <td className="py-3 px-2 text-gray-600 dark:text-gray-300">
                    {size.length}
                  </td>
                  {size.sleeve && (
                    <td className="py-3 px-2 text-gray-600 dark:text-gray-300">
                      {size.sleeve}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SizeGuidePage() {
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
            Size Guide
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-purple-100 max-w-2xl mx-auto"
          >
            Find your perfect fit with our comprehensive sizing charts and
            measurement guide.
          </motion.p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* How to Measure */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How to Measure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {measurementTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full bg-white dark:bg-slate-900">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
                      {tip.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Size Charts */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <SizeChart chart={sizeCharts.mens} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <SizeChart chart={sizeCharts.womens} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <SizeChart chart={sizeCharts.hoodies} />
          </motion.div>
        </div>

        {/* Fit Guide */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Fit Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-600">
                    Slim Fit
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Close to the body with minimal ease. Perfect for a tailored,
                  modern look.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-600">
                    Regular Fit
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Comfortable fit with room to move. Our most popular fit for
                  everyday wear.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-600">
                    Oversized
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300">
                  Relaxed, loose fit for a casual streetwear aesthetic. Great
                  for layering.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-16"
        >
          <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Important Sizing Notes
                  </h3>
                  <ul className="text-yellow-700 dark:text-yellow-300 space-y-1 text-sm">
                    <li>
                      • All measurements are in inches and represent garment
                      measurements, not body measurements
                    </li>
                    <li>
                      • For the best fit, compare these measurements to a
                      similar garment you own
                    </li>
                    <li>
                      • If you're between sizes, we recommend sizing up for a
                      more comfortable fit
                    </li>
                    <li>
                      • Hoodies and sweatshirts are designed with a relaxed fit
                      for comfort and layering
                    </li>
                    <li>
                      • Contact us if you need help choosing the right size -
                      we're here to help!
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
