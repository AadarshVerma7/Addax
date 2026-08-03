import AboutPage from "@/components/about/AboutPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Addax",
  description: "Learn more about Addax, our vision, and the creators behind the platform.",
};

export default function About() {
  return <AboutPage />;
}
