import LandingPageNavbar from '../header/LandingPageNavbar';
import HeroSection from './HeroSection';

function HomePage() {
  return (
    <div className="min-h-screen bg-fixed bg-gradient-to-br from-[#000000] via-[#1a3869] to-[#a3e2de] text-white px-8 pt-32 pb-12 md:px-16 lg:px-24 font-sans overflow-hidden">

      <LandingPageNavbar />
      <HeroSection/>

    </div>
  );
}

export default HomePage;