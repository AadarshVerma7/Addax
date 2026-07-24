import Logo from "../../public/logo.png"

function LandingPageNavbar() {
    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 md:px-16 lg:px-24 bg-transparent ">
                <div className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                    <img 
                    className="h-12"
                    src={Logo.src} alt="Addax" />
                    <p className='font-semibold font-mono'>Addax</p>
                </div>

                <ul className="hidden md:flex gap-10 text-sm font-medium text-gray-200">
                    <li className="hover:text-white cursor-pointer transition-colors">Home</li>
                    <li className="hover:text-white cursor-pointer transition-colors">About</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Services</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
                    <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
                </ul>
            </nav>
        </>
    )
}

export default LandingPageNavbar