"use client"

import LandingPageNavbar from '../header/LandingPageNavbar';
import HeroSection from './HeroSection';
import { Metadata } from 'next'
import HowCanWeHelpSection from './HowCanWeHelpSection';
import FeaturesSection from './FeaturesSection';
import FaqSection from './FaqSection';
import ContactForm from '../contact/ContactForm';
import Footer from '../footer/Footer';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to our homepage.',
  openGraph: {
    title: 'Home',
    description: '.',
    url: 'https://example.com',
  },
}

function HomePage() {
  return (
    <>
      <LandingPageNavbar />
      <div className="min-h-screen bg-fixed bg-linear-to-br from-[#000000] via-[#1a3869] to-[#a3e2de] text-white px-8 pt-32 pb-12 md:px-16 lg:px-24 font-sans overflow-hidden">
        <HeroSection />
      </div>

        <HowCanWeHelpSection />
        <FeaturesSection/>
        <div id='faqs'>
        <FaqSection/>
        </div>
        <ContactForm/>
        <Footer/>
    </>
  );
}

export default HomePage;