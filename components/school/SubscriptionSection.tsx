// Updated SubscriptionSection with subscription countdown and plan upgrade lock
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface SubscriptionSectionProps {
  yearly: boolean;
  setYearly: (val: boolean) => void;
  handleSubscription: (
    plan: string,
    amount: number,
    duration: "monthly" | "yearly"
  ) => void;
  subscriptionPlan: string;
  subscriptionAt?: Date | null;
  subscriptionDuration?: string | null;
}

const plans = [
  {
    name: "Basic",
    monthly: 499,
    yearly: 4999,
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
    features: [
      "All Pro features",
      "Admin dashboard for school management",
      "Unlimited staff & students",
      "Custom branding + domains",
      "Priority support (24/7)",
      "Dedicated onboarding team",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SubscriptionSection({
  yearly,
  setYearly,
  handleSubscription,
  subscriptionPlan,
  subscriptionAt,
  subscriptionDuration,
}: SubscriptionSectionProps) {
  const [remaining, setRemaining] = useState<string>("");

  useEffect(() => {
    if (!subscriptionAt || !subscriptionDuration) return;
    const endDate = new Date(subscriptionAt);
    if (subscriptionDuration === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const interval = setInterval(() => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) {
        setRemaining("Expired");
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        setRemaining(`${days}d ${hours}h left`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [subscriptionAt, subscriptionDuration]);

  const canUpgrade = (current: string, target: string) => {
    const rank = { Basic: 1, Pro: 2, Institution: 3 };
    return rank[target] > rank[current];
  };

  return (
    <motion.section
      className="bg-white py-12 px-4 text-center rounded-xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h2 className="text-3xl font-bold mb-4 text-gray-800">
        Simple, Transparent Pricing
      </motion.h2>
      <motion.p className="text-gray-600 mb-8">
        Flexible plans for individuals and institutions
      </motion.p>

      <div className="flex justify-center mb-10">
        <motion.button
          onClick={() => setYearly(false)}
          className={`px-4 py-2 border shadow-lg rounded-l cursor-pointer transition-all duration-200 ${
            !yearly ? "bg-indigo-600 text-white" : "bg-white text-gray-800"
          }`}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.04 }}
        >
          Monthly
        </motion.button>
        <motion.button
          onClick={() => setYearly(true)}
          className={`px-4 py-2 border shadow-lg rounded-r cursor-pointer transition-all duration-200 ${
            yearly ? "bg-indigo-600 text-white" : "bg-white text-gray-800"
          }`}
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.04 }}
        >
          Yearly
        </motion.button>
      </div>

      <motion.div
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
      >
        {plans.map((plan, idx) => {
          const isSelected = plan.name === subscriptionPlan;
          const currentDuration = subscriptionDuration;
          const thisDuration = yearly ? "yearly" : "monthly";

          const isSameDuration = thisDuration === currentDuration;
          const isSamePlan = plan.name === subscriptionPlan;
          const allowUpgrade = canUpgrade(subscriptionPlan, plan.name);
          const showSubscribe = !isSamePlan || (isSamePlan && !isSameDuration);

          return (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ scale: isSelected ? 1.03 : 1.02 }}
              className={`flex flex-col justify-between h-full rounded-xl shadow-lg border p-6 transition-all bg-white relative ${
                isSelected ? "ring-2 ring-indigo-400" : ""
              }`}
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {plan.name}
              </h3>
              {isSelected && (
                <div className="absolute top-3 right-3 text-green-500">
                  <CheckCircle size={20} />
                </div>
              )}

              <p className="text-3xl font-semibold text-indigo-600 mb-4">
                ₹{yearly ? plan.yearly : plan.monthly}
                <span className="text-sm text-gray-600">
                  /{yearly ? "year" : "month"}
                </span>
              </p>
              <ul className="text-sm text-left text-gray-700 space-y-2 mb-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-indigo-500 mr-2 mt-1">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              {isSelected && remaining && (
                <p className="text-green-600 font-bold mb-2">{remaining}</p>
              )}
              {showSubscribe ? (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={!allowUpgrade}
                  onClick={() =>
                    handleSubscription(
                      plan.name,
                      yearly ? plan.yearly : plan.monthly,
                      yearly ? "yearly" : "monthly"
                    )
                  }
                  className={`w-full py-2 rounded font-medium transition mt-auto  ${
                    allowUpgrade
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {allowUpgrade
                    ? `Choose ${plan.name}`
                    : "Not allowed"}
                </motion.button>
              ) : (
                <motion.button
                  disabled
                  className="w-full py-2 rounded font-medium transition mt-auto bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  Subscribed
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
