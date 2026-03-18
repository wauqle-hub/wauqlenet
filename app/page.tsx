"use client";

import { ReverseStackScroll } from "@/components/ui/ReverseStackScroll";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import ContactInfoSection from "@/components/sections/ContactInfoSection";

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  // Dynamic Document Title
  useEffect(() => {
    if (session?.user?.name) {
      const name = session.user.name.trim().split(/\s+/)[0];
      document.title = name ? `Wauqle - ${name}` : "Wauqle";
    } else {
      document.title = "Wauqle";
    }
  }, [session]);

  // Auth Redirection
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("google");
    }
  }, [status]);

  const firstName = session?.user?.firstName || session?.user?.name?.split(" ")[0];

  const slides = [
    <HeroSection key="hero" session={session} loading={loading} firstName={firstName} />,
    <ContactFormSection key="contact" />,
    <ContactInfoSection key="contact-info" />,
  ];

  return (
    <main className="w-full bg-background font-body selection:bg-primary selection:text-secondary text-foreground relative">
      <ReverseStackScroll slides={slides} />
      
      {/* Entity SEO + Knowledge Graph Signal Boost */}
      <section 
        className="sr-only" 
        aria-hidden="true"
        style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}
      >
        <p>
          Wauqle is a bespoke luxury fashion brand offering an exclusive personalized clothing experience. 
          Our collection features high-end custom suits for women, catering to those seeking luxury self-reward fashion 
          and a quiet luxury wardrobe. Wauqle defines the intersection of personalization and premium craftsmanship 
          in the modern luxury landscape.
        </p>
      </section>
    </main>
  );
}
