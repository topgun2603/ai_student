"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const plans = [
  {
    name: "Basic",
    monthly: 499,
    yearly: 4999,
    features: ["Generate questions", "Export to PDF/DOCX", "5GB storage"],
  },
  {
    name: "Pro",
    monthly: 999,
    yearly: 9999,
    features: [
      "All Basic features",
      "Student module",
      "20GB storage",
      "Custom templates",
    ],
  },
  {
    name: "Institution",
    monthly: 2499,
    yearly: 24999,
    features: [
      "All Pro features",
      "Multi-user access",
      "Admin dashboard",
      "Priority support",
    ],
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="bg-white py-20 px-6">
      <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
      <p className="text-center text-gray-500 mb-8">
        Choose a plan that fits your school or team
      </p>

      {/* Toggle */}
      <div className="flex justify-center mb-12">
        <button
          className={`px-4 py-2 rounded-l-md border ${
            !yearly ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setYearly(false)}
        >
          Monthly
        </button>
        <button
          className={`px-4 py-2 rounded-r-md border ${
            yearly ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
          }`}
          onClick={() => setYearly(true)}
        >
          Yearly
        </button>
      </div>

      {/* Plans */}
      <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <motion.div
            key={idx}
            className="border rounded-xl p-6 shadow hover:shadow-lg transition"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <p className="text-3xl font-semibold text-blue-600 mb-4">
              ₹{yearly ? plan.yearly : plan.monthly}
              <span className="text-base text-gray-500">
                /{yearly ? "year" : "month"}
              </span>
            </p>
            <ul className="text-sm text-gray-600 space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i}>• {feature}</li>
              ))}
            </ul>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Choose {plan.name}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
