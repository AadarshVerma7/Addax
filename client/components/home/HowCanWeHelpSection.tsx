"use client"

import { MoveRight } from "lucide-react";
import Link from "next/link";

function HowCanWeHelpSection() {
    return (
        <>
            <div className='md:flex flex-row justify-center items-center md:gap-15 py-12 md:py-20 px-6 sm:px-10 md:px-25 my-10'>

                <div className='flex items-center md:w-1/2 mb-8 md:mb-0'>
                    <p className='font-semibold text-4xl md:text-6xl px-0 md:px-0 text-zinc-800 md:text-left'>
                        How Addax helps<br></br> you Learn
                    </p>
                </div>

                <div className='flex flex-col gap-6 md:w-1/2 md:gap-8'>
                    <p className='text-md text-justify md:text-left font-semibold text-zinc-700'>
                        Addax transforms hours of video into minutes of key insights. By parsing YouTube transcripts and metadata, our intelligent AI extracts core concepts, structures them into clean summaries, and sets up a personal interactive chat so you can ask follow-up questions directly.
                    </p>

                    <p className='text-md text-justify md:text-left text-zinc-600'>
                        Whether you are studying for exams, learning a new programming language, or scanning long tech talks, Addax lets you skip the fluff, save valuable watch time, and build a personalized knowledge base from video content effortlessly.
                    </p>

                    <div>
                        <Link
                        href="/about"
                        className="group inline-flex items-center gap-1 underline underline-offset-4 transition-all duration-300 hover:text-[#3B7597] hover:-translate-y-0.5"
                    >
                        <span className="font-semibold text-zinc-900 group-hover:text-[#3B7597] transition-colors duration-300">
                            Learn More
                        </span>

                        <MoveRight
                            size={18}
                            className="text-zinc-700 transition-transform duration-300 group-hover:translate-x-2 group-hover:text-[#3B7597]"
                        />
                    </Link>
                    </div>
                </div>

            </div>
        </>
    )
}

export default HowCanWeHelpSection