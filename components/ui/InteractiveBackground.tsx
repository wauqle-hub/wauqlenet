"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function InteractiveBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{ 
          x: mousePos.x,
          y: mousePos.y 
        }}
        style={{ y: y1 }}
        className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-primary/5 blur-[120px]"
      />
      <motion.div
        animate={{ 
          x: -mousePos.x,
          y: -mousePos.y 
        }}
        style={{ y: y2 }}
        className="absolute bottom-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-accent/5 blur-[100px]"
      />
      
      <div className="absolute inset-0 opacity-[0.03] overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-foreground" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-foreground" />
      </div>
    </div>
  );
}
