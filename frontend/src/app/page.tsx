import Navbar from '@/components/Navbar';
import HeroSection from '@/components/Hero/HeroSection';
import NarrativeText from '@/components/Story/NarrativeText';
import ScrollStory from '@/components/Showcase/ScrollStory';
import Collections from '@/components/Collections';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import WhatsAppFAB from '@/components/WhatsAppFAB';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <NarrativeText />
        <ScrollStory />
        <Collections />
        <Certifications />
        <Contact />
      </main>
      <WhatsAppFAB />
    </>
  );
}
