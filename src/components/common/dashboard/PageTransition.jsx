"use client";

import React from "react";
import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 15 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -15, transition: { duration: 0.3, ease: "easeInOut" } },
};

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}