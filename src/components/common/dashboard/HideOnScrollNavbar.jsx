"use client";
import { motion } from "framer-motion";
import useHideOnScroll from "@/hooks/useHideOnScroll";

export default function HideOnScrollNavbar({ children }) {
  const hidden = useHideOnScroll();

  return (
    <motion.div
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {children}
    </motion.div>
  );
}