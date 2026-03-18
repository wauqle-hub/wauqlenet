"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ReverseStackScrollProps {
    slides: ReactNode[];
}

export function ReverseStackScroll({ slides }: ReverseStackScrollProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const numSlides = slides.length;

    const { scrollYProgress } = useScroll({
        container: scrollContainerRef,
    });

    return (
        <div
            ref={scrollContainerRef}
            className="h-screen w-full overflow-y-scroll snap-y snap-mandatory relative"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
        div::-webkit-scrollbar {
          display: none;
        }
      `}} />

            <div
                className="relative w-full"
                style={{ height: `${numSlides * 100}vh` }}
            >
                <div className="sticky top-0 h-screen w-full overflow-hidden pointer-events-none">
                    {slides.map((slide, i) => {
                        const segment = 1 / Math.max(1, numSlides - 1);
                        const progressPoints = Array.from({ length: numSlides }, (_, step) => step * segment);
                        
                        const yOutputs = progressPoints.map((_, step) => step < i ? "-100%" : "0%");
                        const scaleOutputs = progressPoints.map((_, step) => step >= i ? 1 - (step - i) * 0.05 : 1);
                        const brOutputs = progressPoints.map((_, step) => step > i ? 2 : 0);

                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const y = useTransform(scrollYProgress, progressPoints, yOutputs);
                        const finalY = i === 0 ? "0%" : y;
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const scale = useTransform(scrollYProgress, progressPoints, scaleOutputs);
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const br = useTransform(scrollYProgress, progressPoints, brOutputs);
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const borderRadius = useTransform(br, val => `${val}rem`);

                        return (
                            <motion.div
                                key={i}
                                style={{
                                    y: finalY,
                                    scale,
                                    zIndex: i * 10,
                                    transformOrigin: "top"
                                }}
                                className="absolute top-0 left-0 w-full h-[100vh] flex flex-col justify-center items-center shadow-[0_-20px_50px_rgba(105,17,24,0.12)] bg-background pointer-events-auto transition-transform duration-200 ease-out"
                            >
                                <motion.div style={{ borderRadius }} className="w-full h-full overflow-hidden absolute inset-0 transition-all duration-200 ease-out">
                                    {slide}
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col">
                    {slides.map((_, i) => (
                        <div key={`snap-${i}`} className="h-[100vh] w-full snap-start" />
                    ))}
                </div>
            </div>
        </div>
    );
}
