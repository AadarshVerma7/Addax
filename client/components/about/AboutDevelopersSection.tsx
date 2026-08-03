"use client";

import React from "react";

const GithubIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 12 }: { size?: number }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const developers = [
    {
        name: "Aadarsh Verma",
        // role: "Lead AI Engineer",
        quote: '"Addax completely transformed my study flow. Instead of watching 3-hour dev conferences, I get direct vector-powered answers and code insights in seconds."',
        github: "https://github.com/AadarshVerma7",
        linkedin: "https://www.linkedin.com/in/aadarsh-verma-av/",
        avatar: "https://avatars.githubusercontent.com/u/181336759?v=4"
    },
    {
        name: "Abhishek Sharma",
        // role: "Lead UI Designer",
        quote: '"We designed the summarizer to feel clean and visual. Learning technical concepts is hard enough; the user interface should be fluid, fast, and completely out of the way."',
        github: "https://github.com/abhishekkksharma",
        linkedin: "https://www.linkedin.com/in/abhish3k-sharma/",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQFDcgiBqmGweg/profile-displayphoto-crop_800_800/B56ZqqIqbbHIAI-/0/1763790989742?e=1787184000&v=beta&t=Ih7ERCli6opn5IujtBysV2tYOq2paFDg7KTUo6zvMPQ"
    }
];

function AboutDevelopersSection() {
    return (
        <section className="py-16 md:py-24 px-6 sm:px-10 md:px-20 lg:px-32 max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
                <div className="inline-block bg-zinc-250/60 text-zinc-600 text-[10px] md:text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider mb-4">
                    Developers
                </div>
                
                <h2 className="text-3xl md:text-5xl font-normal text-zinc-950 tracking-tight leading-tight">
                    The minds behind Addax
                </h2>
                
                <p className="text-zinc-500 text-sm max-w-2xl mx-auto mt-3 leading-relaxed font-light">
                    Meet the engineering and design team responsible for building the video summarization engine.
                </p>
            </div>

            <div className="flex justify-center items-center gap-6 px-40 mt-8">
                {developers.map((dev) => (
                    <div 
                        key={dev.name}
                        className="bg-[#F3F4F6] rounded-3xl p-6 flex flex-col justify-between min-h-60 hover:shadow-md transition-all duration-300"
                    >
                        <p className="text-zinc-700 text-xs md:text-sm font-light leading-relaxed mb-6 italic">
                            {dev.quote}
                        </p>
                        
                        <div className="flex items-center justify-between w-full mt-auto border-t border-zinc-200/50 pt-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={dev.avatar}
                                    alt={dev.name}
                                    className="h-9 w-9 rounded-full object-cover border border-zinc-250/30"
                                />
                                <div className="text-left">
                                    <h4 className="font-semibold text-zinc-900 text-xs leading-none">{dev.name}</h4>
                                    {/* <span className="text-[10px] text-zinc-500 mt-1 block">{dev.role}</span> */}
                                </div>
                            </div>
                            
                            <div className="flex gap-2 text-zinc-400">
                                <a 
                                    href={dev.github} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-zinc-900 transition-colors p-1"
                                >
                                    <GithubIcon size={12} />
                                </a>
                                <a 
                                    href={dev.linkedin} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:text-blue-600 transition-colors p-1"
                                >
                                    <LinkedinIcon size={12} />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default AboutDevelopersSection;
