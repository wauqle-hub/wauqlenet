"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, KeyboardEvent } from "react";
import Image from "next/image";
import InteractiveBackground from "@/components/ui/InteractiveBackground";
import { useSession } from "next-auth/react";

export default function ContactFormSection() {
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const executeSend = async () => {
    setSendError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, website, guestName, guestEmail }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'message failed');
      }

      setIsSubmitted(true);
      setIsSubmitting(false);
      setShowAuthModal(false);

      setTimeout(() => {
        setMessage("");
        setWebsite("");
        setGuestName("");
        setGuestEmail("");
        if (textareaRef.current) {
          textareaRef.current.style.height = "40px";
        }
      }, 700);

      setTimeout(() => {
        setIsSubmitted(false);
      }, 4000);

    } catch (err) {
      console.error('Submit error:', err);
      setSendError("Failed to send. Please try again.");
      setIsSubmitting(false);
      setTimeout(() => setSendError(null), 5000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitted) return;

    if (status === "unauthenticated") {
      setShowAuthModal(true);
    } else {
      executeSend();
    }
  };

  const handleModalKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // Validate
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (guestName.trim() && emailRegex.test(guestEmail)) {
        executeSend();
      }
    }
  };

  return (
    <section 
      key="contact" 
      aria-label="Contact Wauqlé"
      className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden selection:bg-primary/20"
    >
      <Image
        src="/contact-bg-v2.png"
        alt=""
        aria-hidden="true"
        fill
        className="object-cover"
      />
      <InteractiveBackground />

      <div className="absolute inset-0 bg-black/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true }}
        className="w-full max-w-2xl px-8 flex flex-col items-center z-10"
      >
        <form className="w-full relative" onSubmit={handleSubmit}>
          <div className="relative w-full max-w-[650px] mx-auto">
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
              autoComplete="off"
            />
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="composer"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${e.target.scrollHeight}px`;
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    rows={1}
                    placeholder="Wauqle reads every message personally..."
                    aria-label="Message"
                    disabled={isSubmitted || isSubmitting}
                    className={`w-full bg-transparent border-none border-b-[1px] border-[#777] outline-none resize-none text-[18px] leading-[1.8] text-left pr-[70px] pt-4 pb-2 transition-all duration-300 placeholder:text-primary/40 placeholder:italic min-h-[40px] whitespace-pre-wrap break-words overflow-hidden ${isSubmitted ? 'text-transparent' : 'text-foreground'}`}
                    style={{ minHeight: "40px" }}
                  />

                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isFocused ? "100%" : "0%" }}
                    className="absolute bottom-0 left-0 h-[2px] bg-primary z-10 pointer-events-none"
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  />

                  <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!message.trim() || isSubmitted || isSubmitting}
                    className="absolute right-0 bottom-[6px] cursor-pointer transition-transform duration-400 ease-out hover:scale-110 active:scale-95 disabled:opacity-0 z-20"
                  >
                    <motion.div
                      animate={isSubmitted ? {
                        x: [0, 200, 450, 600],
                        y: [0, -20, -100, -250],
                        rotate: [0, -10, 10, -15],
                        scale: [1, 1.2, 1.3, 1.4],
                        opacity: [1, 1, 1, 0],
                      } : {
                        x: 0, y: 0, rotate: 0, scale: 1, opacity: 1,
                      }}
                      transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1],
                        times: [0, 0.3, 0.7, 1]
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-primary">
                        <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
                      </svg>
                    </motion.div>
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-col items-center justify-center py-10"
                >
                  <p className="text-[18px] md:text-[22px] tracking-[0.15em] text-foreground font-heading uppercase text-center">
                    We will be in touch with you shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </form>
        {sendError && (
          <p className="mt-4 text-red-500 text-sm">{sendError}</p>
        )}
      </motion.div>

      {/* Guest Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAuthModal(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-primary w-full max-w-md p-12 rounded-tr-[4rem] rounded-bl-[4rem] shadow-2xl flex flex-col gap-8"
            >
              <input
                type="text"
                placeholder="Felix"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyDown={handleModalKeyDown}
                aria-label="Name"
                disabled={isSubmitting}
                autoFocus
                className="w-full bg-transparent border-none border-b border-white/50 text-white placeholder:text-white/40 placeholder:italic outline-none py-2 text-lg transition-colors focus:border-white disabled:opacity-50"
              />
              
              <input
                type="email"
                placeholder="felix@wauqle.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                onKeyDown={handleModalKeyDown}
                aria-label="Email"
                disabled={isSubmitting}
                className="w-full bg-transparent border-none border-b border-white/50 text-white placeholder:text-white/40 placeholder:italic outline-none py-2 text-lg transition-colors focus:border-white disabled:opacity-50"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
