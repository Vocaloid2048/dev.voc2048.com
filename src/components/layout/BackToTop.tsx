"use client";

/**
 * 返回頂部浮動按鈕。
 * Back-to-top floating button with spring animation.
 */
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useState } from "react";

export function BackToTop() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 400);
  });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        scale: visible ? 1 : 0.5,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-base-300/50 bg-base-100/60 shadow-lg backdrop-blur-xl transition-colors hover:bg-primary/15"
      aria-label="Back to top"
    >
      <ArrowUp size={20} />
    </motion.button>
  );
}
