"use client";

import Link from "next/link";
import { ClockArrowRight, Handshake } from "lucide-react";
import Image from "next/image";
import HandShake from "../../assets/about/handshake.png";
import Computer from "../../assets/about/computer.png";

function AboutBentoGrid() {
  return (
    <section className="max-w-6xl mx-auto px-5 sm:px-6 md:px-8 lg:px-10 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Card */}
        <div className="lg:row-span-2 bg-[#F5F5F4] rounded-3xl p-5 flex flex-col">
          <div className="rounded-2xl overflow-hidden h-50">
            <Image
              src={Computer}
              alt="Workspace"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="mt-6 flex flex-col flex-1 justify-between">
            <h2 className="text-2xl font-medium leading-snug text-zinc-900">
              Handcrafted by AI models to deliver structured summaries and key
              learning points.
            </h2>

            <Link
              href="/videosummary"
              className="mt-7 inline-flex items-center gap-3 bg-black text-white rounded-full px-5 py-2.5 w-fit hover:bg-zinc-800 transition-all"
            >
              <span className="text-sm font-medium">Explore Summaries</span>

              <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-sm">
                →
              </div>
            </Link>
          </div>
        </div>

        {/* Top Middle */}
        <div className="bg-[#F5F5F4] rounded-3xl overflow-hidden hover:shadow-md transition-all">
          <div className="h-52 object-contain overflow-hidden">
            <Image
              src={HandShake}
              alt="Handshake"
              className="object-cover object-top"
            />
          </div>

          <div className="p-5">
            <h3 className="text-2xl font-medium leading-snug">
              Trusted by{" "}
              <span className="text-zinc-400">
                students and creators worldwide.
              </span>
            </h3>
          </div>
        </div>

        {/* Top Right */}
        <div className="bg-[#F5F5F4] rounded-3xl p-5 flex justify-between items-center overflow-hidden hover:shadow-md transition-all">
          <div>
            <h2 className="text-5xl font-semibold text-zinc-900">95%</h2>

            <p className="mt-2 text-xs text-zinc-500 leading-relaxed max-w-32">
              Reduction in learning watch time.
            </p>
          </div>

          <ClockArrowRight className="w-20 h-20 mr-10 object-contain" />
        </div>

        {/* Bottom Card */}
        <div className="lg:col-span-2 bg-[#F5F5F4] rounded-3xl relative overflow-hidden min-h-52 flex items-center hover:shadow-md transition-all">
          <div className="p-6 lg:w-3/5 z-10">
            <h2 className="text-2xl font-medium leading-snug text-zinc-900">
              Elevates your learning experience and{" "}
              <span className="text-zinc-400">
                transforms every video into clear, actionable knowledge.
              </span>
            </h2>
          </div>

          <img
            src="/about_chat_screen.png"
            alt="Chat"
            className="absolute right-0 bottom-0 h-[105%] w-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default AboutBentoGrid;
