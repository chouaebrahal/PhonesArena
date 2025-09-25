"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const AnimatedText = ({ text , className }: { text: string ,className:string }) => {
  const letters = Array.from(text);
  

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
      repeat:Infinity
    }),
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  

  return (
    <motion.span
      className={`${className}`} 
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default AnimatedText;
