"use client";

import LandingPageNavbar from "../header/LandingPageNavbar";
import Footer from "../footer/Footer";
import AboutHero from "./AboutHero";
import AboutBentoGrid from "./AboutBentoGrid";
import AboutDevelopersSection from "./AboutDevelopersSection";
import ContactForm from "../contact/ContactForm";

function AboutPage() {
    return (
        <div className=" text-zinc-950 min-h-screen font-sans">
            <LandingPageNavbar theme="light" />
            <AboutHero />
            <AboutBentoGrid />
            <AboutDevelopersSection />
            <div id="contact">
            <ContactForm />
            </div>
            <Footer />
        </div>
    );
}

export default AboutPage;
