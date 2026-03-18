"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface HeroSectionProps {
  session: any;
  loading: boolean;
  firstName: string | undefined;
}

export default function HeroSection({ session, loading, firstName }: HeroSectionProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <div
      key="hero"
      onClick={() => window.open("https://www.wauqle.com", "_blank", "noopener,noreferrer")}
      className="w-full h-full flex flex-col justify-center items-center text-center relative overflow-hidden cursor-pointer selection:bg-primary/20"
    >
      <Image
        src="/hero-bg-v3.png"
        alt="Wauqle Hero Background"
        fill
        priority
        className="object-cover"
      />
      
      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      <motion.div 
        className="flex flex-col items-center justify-center h-full z-10 px-4 w-full"
        style={{ y }}
      >
        <AnimatePresence mode="wait">
          {session ? (
            <motion.div
              key="personalized"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-[50vh] flex flex-col items-center justify-center"
            >
              <span 
                className="font-heading text-lg md:text-xl lg:text-2xl font-light tracking-[0.35em] text-foreground uppercase text-center"
              >
                EXCLUSIVELY FOR
              </span>
              <span
                className="font-heading text-primary uppercase leading-none text-center font-medium tracking-tight mt-4"
                style={{ 
                  fontSize: "clamp(3.5rem, 12vw, 16rem)",
                }}
              >
                {firstName}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="h-[50vh] flex flex-col items-center justify-center"
            >
              <span 
                className="font-heading text-lg md:text-xl lg:text-2xl font-light tracking-[0.35em] text-foreground uppercase text-center"
              >
                EXCLUSIVELY FOR
              </span>
              <h1
                className="font-heading text-primary uppercase leading-none text-center font-medium tracking-tight mt-4"
                style={{ 
                  fontSize: "clamp(3.5rem, 12vw, 16rem)",
                }}
              >
                YOU
              </h1>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 text-foreground/20 text-[10px] tracking-[0.4em] uppercase"
                >
                  Authenticating...
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
