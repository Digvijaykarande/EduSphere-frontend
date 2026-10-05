"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function PageLoader({ loading }) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] bg-sidebar-bg flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-3 text-white font-display font-semibold text-2xl"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Avatar className="h-10 w-10 bg-amber-500/10 border border-amber-500/30 text-gold">
                <AvatarFallback className="bg-transparent text-[#c99a3f]">
                  <GraduationCap size={18} />
                </AvatarFallback>
              </Avatar>
            </motion.div>
            EduSphere
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}