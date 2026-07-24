"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "What is Vintar?",
    answer:
      "Vintar is an online learning platform offering industry-focused courses taught by experienced mentors.",
  },
  {
    question: "Are the courses self-paced?",
    answer:
      "Yes, you can learn at your own pace and access the content whenever you want.",
  },
  {
    question: "Do I get a certificate after completing a course?",
    answer:
      "Yes, you'll receive a certificate after successfully completing the course requirements.",
  },
  {
    question: "Can I access the courses on mobile devices?",
    answer:
      "Absolutely. Our platform is fully responsive and works across desktop, tablet, and mobile.",
  },
  {
    question: "Who are the mentors on Vintar?",
    answer:
      "Our mentors are experienced professionals from leading companies and industries.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept major credit/debit cards and other supported online payment methods.",
  },
];

export default function FaqSection() {
  const [active, setActive] = useState<number | null>(0);

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 md:p-14">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Left */}
          <div className="max-w-sm">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Find quick answers to common questions about our courses,
              learning experience, and platform features.
            </p>
          </div>

          {/* Right */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = active === index;

              return (
                <div
                  key={faq.question}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50"
                >
                  <button
                    onClick={() =>
                      setActive(isOpen ? null : index)
                    }
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>

                    {isOpen ? (
                      <Minus className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Plus className="h-5 w-5 text-blue-600" />
                    )}
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? "grid-rows-[1fr]"
                        : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-6 text-gray-600">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}