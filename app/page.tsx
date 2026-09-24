"use client";

import { ReverseStackScroll } from "@/components/ui/ReverseStackScroll";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import HeroSection from "@/components/sections/HeroSection";
import ContactFormSection from "@/components/sections/ContactFormSection";
import Script from "next/script";

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

  // Google One Tap Logic
  useEffect(() => {
    if (status === "unauthenticated" && typeof window !== "undefined") {
      const initializeGsi = () => {
        if (!window.google) return;
        
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            if (response.credential) {
              await signIn("google-one-tap", {
                credential: response.credential,
                redirect: false,
              });
            }
          },
        });
        
        window.google.accounts.id.prompt((notification: any) => {
           if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // The user dismissed it or it failed to display.
              // We do nothing, letting the fallback UI continue seamlessly!
              console.log("Google One Tap dismissed or not displayed. Continuing as guest.");
           }
        });
      };
      
      if (window.google) {
        initializeGsi();
      } else {
        window.addEventListener('google-gsi-loaded', initializeGsi);
        return () => window.removeEventListener('google-gsi-loaded', initializeGsi);
      }
    }
  }, [status]);
  const firstName = session?.user?.firstName || session?.user?.name?.split(" ")[0];

  const slides = [
    <HeroSection key="hero" session={session} loading={loading} firstName={firstName} />,
    <ContactFormSection key="contact" />,
  ];

  return (
    <main className="w-full bg-background font-body selection:bg-primary selection:text-secondary text-foreground relative">
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={() => {
          window.dispatchEvent(new Event('google-gsi-loaded'));
        }}
      />
      <ReverseStackScroll slides={slides} />
      
      {/* Entity SEO + Knowledge Graph Signal Boost */}
      <section 
        className="sr-only" 
        aria-hidden="true"
        style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}
      >
        <p>
          Wauqlé is a space dedicated to individuality, personal meaning, and expression.
          We believe in the relationship between a person and what is personally theirs.
          Discover an experience designed entirely, exclusively for you.
        </p>
      </section>
    </main>
  );
}
