"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import InteractiveBackground from "@/components/ui/InteractiveBackground";

export default function ContactInfoSection() {
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);
  const [isRightMenuOpen, setIsRightMenuOpen] = useState(false);

  useEffect(() => {
    let leftTimeoutId: NodeJS.Timeout;
    let rightTimeoutId: NodeJS.Timeout;

    if (isLeftMenuOpen) {
      leftTimeoutId = setTimeout(() => setIsLeftMenuOpen(false), 10000);
    }
    if (isRightMenuOpen) {
      rightTimeoutId = setTimeout(() => setIsRightMenuOpen(false), 10000);
    }

    const handleGlobalClick = () => {
      if (isLeftMenuOpen) setIsLeftMenuOpen(false);
      if (isRightMenuOpen) setIsRightMenuOpen(false);
    };
    window.addEventListener("click", handleGlobalClick);

    return () => {
      clearTimeout(leftTimeoutId);
      clearTimeout(rightTimeoutId);
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [isLeftMenuOpen, isRightMenuOpen]);

  return (
    <div 
      key="contact-info" 
      className="w-full h-full flex justify-center items-center relative overflow-hidden selection:bg-primary/20"
    >
      <Image
        src="/contact-info-bg.png"
        alt="Contact Info Background"
        fill
        className="object-cover"
      />
      <InteractiveBackground />

      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
      <div className="flex flex-row items-center justify-center gap-6 relative z-50 pointer-events-auto">
        {/* Left Circle Wrapper */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {isLeftMenuOpen && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <MenuButton 
                  x={-75} y={-65} 
                  label="info@wauqle.com" 
                  onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=info@wauqle.com", "_blank")}
                  icon={<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />}
                />
                <MenuButton 
                  x={-105} y={0} 
                  label="support@wauqle.net" 
                  onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=support@wauqle.net", "_blank")}
                  scale={1.1}
                  delay={0.05}
                  icon={<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />}
                />
                <MenuButton 
                  x={-75} y={65} 
                  label="contact@wauqle.com" 
                  onClick={() => window.open("https://mail.google.com/mail/?view=cm&fs=1&to=contact@wauqle.com", "_blank")}
                  rotate={-15}
                  delay={0.1}
                  icon={
                    <>
                      <path d="M12 2C11.45 2 11 2.45 11 3V4.08C7.61 4.57 5 7.47 5 11V17H4C3.45 17 3 17.45 3 18C3 18.55 3.45 19 4 19H20C20.55 19 21 18.55 21 18C21 17.45 20.55 17 20 17H19V11C19 7.47 16.39 4.57 13 4.08V3C13 2.45 12.55 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" />
                      <rect x="3" y="20.5" width="18" height="1.5" rx="0.75" />
                    </>
                  }
                />
              </div>
            )}
          </AnimatePresence>

          <ToggleButton 
            isOpen={isLeftMenuOpen} 
            onClick={() => {
              setIsLeftMenuOpen(!isLeftMenuOpen);
              setIsRightMenuOpen(false);
            }}
            icon={
              <>
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </>
            }
          />
        </div>

        {/* Center: CEO Button */}
        <motion.a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=felix@wauqle.net"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative px-24 h-[60px] bg-primary border-[2px] border-primary rounded-full flex items-center justify-center shadow-lg cursor-pointer overflow-hidden"
        >
          <span className="absolute inset-0 rounded-full bg-[#f5c5a3] scale-0 group-hover:scale-100 transition-transform duration-300 ease-out z-0" />
          <span className="relative z-10 text-secondary transition-colors duration-300 group-hover:text-primary font-sans tracking-widest uppercase text-[14px] font-bold pointer-events-none">
            CEO
          </span>
        </motion.a>

        {/* Right Circle Wrapper */}
        <div className="relative flex items-center justify-center">
          <AnimatePresence>
            {isRightMenuOpen && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <MenuButton 
                  x={35} y={-95} 
                  label="YouTube" 
                  onClick={() => window.open("https://www.youtube.com/@wauqle_fashion", "_blank")}
                  rotate={5}
                  side="left"
                  icon={
                    <>
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
                    </>
                  }
                />
                <MenuButton 
                  x={110} y={-40} 
                  label="Instagram" 
                  onClick={() => window.open("https://instagram.com/wauqle_fashion", "_blank")}
                  rotate={-5}
                  scale={1.1}
                  delay={0.05}
                  side="left"
                  icon={<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />}
                />
                <MenuButton 
                  x={110} y={40} 
                  label="Facebook" 
                  onClick={() => window.open("https://www.facebook.com/wauqlefashion/", "_blank")}
                  rotate={5}
                  scale={1.1}
                  delay={0.1}
                  side="left"
                  icon={<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />}
                />
                <MenuButton 
                  x={35} y={95} 
                  label="Snapchat" 
                  onClick={() => window.open("https://www.snapchat.com/add/wauqle_fashion", "_blank")}
                  rotate={-5}
                  delay={0.15}
                  side="left"
                  icon={<path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />}
                />
              </div>
            )}
          </AnimatePresence>

          <ToggleButton 
            isOpen={isRightMenuOpen} 
            onClick={() => {
              setIsRightMenuOpen(!isRightMenuOpen);
              setIsLeftMenuOpen(false);
            }}
            icon={
              <>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}

function MenuButton({ x, y, label, onClick, scale = 1, rotate = 0, delay = 0, side = "right", icon }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
      animate={{ opacity: 1, scale, x, y }}
      exit={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay }}
      className="absolute pointer-events-auto"
    >
      <motion.button
        whileHover={{ scale: 1.2, rotate: rotate + (side === "right" ? 15 : 5) }}
        whileTap={{ scale: 0.9 }}
        className="group/menuitem relative flex items-center justify-center text-primary drop-shadow-md cursor-pointer transition-all duration-300 outline-none hover:text-[#f5c5a3]"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <span className={`absolute ${side === "right" ? "right-full mr-3" : "left-full ml-3"} text-[12px] font-heading tracking-[0.2em] text-foreground uppercase opacity-0 ${side === "right" ? "-translate-x-2" : "translate-x-2"} group-hover/menuitem:opacity-100 group-hover/menuitem:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap`}>
          {label}
        </span>
        <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor">
          {icon}
        </svg>
      </motion.button>
    </motion.div>
  );
}

function ToggleButton({ isOpen, onClick, icon }: any) {
  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative bg-background w-[60px] h-[60px] border-[3px] border-primary rounded-full flex items-center justify-center cursor-pointer overflow-hidden shadow-sm z-10 transition-colors duration-300"
    >
      <span className={`absolute inset-0 rounded-full bg-[#f5c5a3] transition-transform duration-300 ease-out z-0 ${isOpen ? "scale-100" : "scale-0 group-hover:scale-100"}`} />
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative z-10 text-primary transition-colors duration-300 group-hover:text-primary"
      >
        {icon}
      </svg>
    </motion.button>
  );
}
