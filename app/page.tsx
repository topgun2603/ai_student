"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaChartBar,
  FaLayerGroup,
} from "react-icons/fa";

const features = [
  {
    icon: <FaUserGraduate className="text-indigo-500 text-3xl" />,
    title: "Smart Student Module",
    description:
      "Evaluate answers from handwritten sheets or typed input using GPT + OCR. Track subject mastery and give personalized feedback.",
  },
  {
    icon: <FaChartBar className="text-indigo-500 text-3xl" />,
    title: "Performance Dashboards",
    description:
      "Visualize student growth, identify weak areas, and guide them with AI-suggested improvements.",
  },
  {
    icon: <FaChalkboardTeacher className="text-indigo-500 text-3xl" />,
    title: "Teacher-Friendly Builder",
    description:
      "Auto-generate question papers from textbooks or uploaded PDFs — export to PDF/DOCX instantly.",
  },
  {
    icon: <FaLayerGroup className="text-indigo-500 text-3xl" />,
    title: "Notion-Style Folders",
    description:
      "Organize content by class, subject, archive year-wise — intuitive and powerful file management.",
  },
];

export default function Home() {
  const [yearly, setYearly] = useState(true);

  return (
    <main className="bg-gradient-to-b from-white to-indigo-50 min-h-screen text-gray-800 font-sans">
      {/* Hero */}
      <section className="text-center px-6 py-24 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Empower Students with Smart Evaluation
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl mb-6 text-indigo-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Typewriter
            words={[
              "AI-based student feedback",
              "Track subject mastery over time",
              "Auto-evaluate answer sheets",
              "Designed for classrooms of the future",
            ]}
            loop={true}
            cursor
            cursorStyle="_"
            typeSpeed={60}
            deleteSpeed={40}
            delaySpeed={1800}
          />
        </motion.p>
        <Link href="/auth">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white text-indigo-700 font-medium px-6 py-3 rounded-lg shadow hover:bg-indigo-100 transition"
          >
            Try Now - It&apos;s Free
          </motion.button>
        </Link>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          What Makes It Powerful
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Demo Video */}
      <section className="bg-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Watch a Demo</h2>
        <p className="text-gray-600 mb-6">
          See how our AI-powered student module and paper builder works in
          action
        </p>
        <div className="aspect-video max-w-5xl mx-auto bg-black/10 rounded-xl flex items-center justify-center text-gray-400 text-xl">
          [ Video Demo Placeholder ]
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Simple, Transparent Pricing
        </h2>
        <p className="text-gray-500 mb-8">
          Flexible plans for individuals and institutions
        </p>

        {/* Toggle */}
        <div className="flex justify-center mb-10">
          <button
            onClick={() => setYearly(false)}
            className={`px-4 py-2 border rounded-l ${
              !yearly ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-4 py-2 border rounded-r ${
              yearly ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            Yearly
          </button>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Basic",
              monthly: 499,
              yearly: 4999,
              highlight: false,
              features: [
                "Create question papers (MCQs only)",
                "PDF/DOCX export",
                "Up to 5 GB file storage",
                "Text-based extraction",
                "Single user access",
              ],
            },
            {
              name: "Pro",
              monthly: 999,
              yearly: 9999,
              highlight: true,
              features: [
                "All Basic features",
                "AI-powered question generation (all types)",
                "Student Module (auto evaluation)",
                "20 GB cloud storage",
                "Multi-format input (PDF, DOCX, Image)",
                "Progress dashboards for students",
                "Parent & teacher view",
                "Email/chat support",
              ],
            },
            {
              name: "Institution",
              monthly: 2499,
              yearly: 24999,
              highlight: false,
              features: [
                "All Pro features",
                "Admin dashboard for school management",
                "Unlimited staff & students",
                "Custom branding + domains",
                "Priority support (24/7)",
                "Dedicated onboarding team",
              ],
            },
          ].map((plan, idx) => (
            <motion.div
              key={idx}
              className={`rounded-xl shadow-lg border p-6 transition hover:shadow-xl relative bg-white ${
                plan.highlight ? "border-2 border-indigo-500" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-3xl font-semibold text-indigo-600 mb-4">
                ₹{yearly ? plan.yearly : plan.monthly}
                <span className="text-sm text-gray-500">
                  /{yearly ? "year" : "month"}
                </span>
              </p>
              <ul className="text-sm text-left text-gray-600 space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-indigo-500 mr-2 mt-1">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded font-medium ${
                  plan.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                } transition`}
              >
                Choose {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-sm text-gray-500">
        © {new Date().getFullYear()} Question Paper Builder. Built for better
        classrooms.
      </footer>
    </main>
  );
}
