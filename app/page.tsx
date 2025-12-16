import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Announcements } from "@/components/announcements";
import { About } from "@/components/about";
import { Programs } from "@/components/programs";
import { Gallery } from "@/components/gallery";
import { PPDB } from "@/components/ppdb";
import { Contact } from "@/components/contact";
import { LandingTestimonials } from "@/components/landing-testimonials";
import { Footer } from "@/components/footer";

export default async function Home() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return (
    <main className="w-full">
      <Header />
      <Hero />
      <About />
      <Announcements />
      <Programs />
      <Gallery />
      <PPDB />
      <Contact />
      <LandingTestimonials />
      <Footer />
    </main>
  );
}
