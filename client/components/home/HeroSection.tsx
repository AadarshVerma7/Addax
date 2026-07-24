import React from 'react'

function HeroSection() {
    return (
        <>
            <main className="flex flex-col lg:flex-row justify-between items-end pt-20 gap-16 lg:gap-8">

                {/* Left Column */}
                <div className="flex-1 w-full">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
                        {/* <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span> */}
                        <span className="text-xs font-medium text-gray-200 tracking-wide">Addax</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium leading-[1.1] tracking-tight text-white">
                        Automate & <br />
                        elevate your <br />
                        learning with ease
                    </h1>
                </div>

                {/* Right Column */}
                <div className="flex-1 w-full max-w-lg lg:pb-6">
                    <p className="text-gray-200 text-sm md:text-base leading-relaxed mb-8">
                        Transform YouTube playlists, lectures, and educational videos into concise summaries instantly. Automate your learning workflow and save hours of watch time with powerful AI tools.
                    </p>

                    <div className="flex flex-wrap items-center gap-6">
                        <button className="bg-white text-black px-7 py-3 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                            Explore Now
                        </button>

                        <div className="flex items-center gap-3">
                            {/* Overlapping Avatars */}
                            <div className="flex -space-x-3">
                                <img className="w-9 h-9 rounded-full border-[2.5px] border-[#366894] object-cover" src="https://i.pravatar.cc/100?img=33" alt="Client 1" />
                                <img className="w-9 h-9 rounded-full border-[2.5px] border-[#366894] object-cover" src="https://i.pravatar.cc/100?img=12" alt="Client 2" />
                                <img className="w-9 h-9 rounded-full border-[2.5px] border-[#366894] object-cover" src="https://i.pravatar.cc/100?img=59" alt="Client 3" />
                            </div>

                            {/* Trust Score */}
                            <div className="flex items-center gap-1.5 text-sm font-medium text-white">
                                <svg className="w-5 h-5 text-[#f59e0b]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                4.8 Trust Score
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default HeroSection