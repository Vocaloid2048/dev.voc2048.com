"use client";

/**
 * 閱讀進度條 — 頂部進度指示器。
 * Reading progress bar — top progress indicator.
 */
import { motion, useScroll, useSpring } from "motion/react";

export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-primary"
      style={{ scaleX }}
    />
  );
}
