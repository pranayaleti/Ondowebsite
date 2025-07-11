"use client"

import { useRef } from "react"
import { motion } from "framer-motion"

export default function AnimatedCharacter() {
  const svgRef = useRef<SVGSVGElement>(null)

  // Animation variants for different parts
  const bodyVariants = {
    idle: {
      y: [0, -10, 0],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        ease: "easeInOut",
      },
    },
  }

  const armVariants = {
    typing: {
      rotate: [-2, 2, -2],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1,
        ease: "easeInOut",
      },
    },
  }

  const headVariants = {
    thinking: {
      rotate: [0, 1, 0, -1, 0],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 3,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial="idle"
        animate="idle"
      >
        {/* Base/Shadow */}
        <motion.ellipse cx="200" cy="340" rx="120" ry="20" fill="rgba(0,0,0,0.1)" />

        {/* Body */}
        <motion.g variants={bodyVariants}>
          {/* Desk */}
          <rect x="100" y="240" width="200" height="80" rx="5" fill="#6366F1" />
          <rect x="110" y="240" width="180" height="10" rx="2" fill="#4F46E5" />

          {/* Computer */}
          <rect x="150" y="180" width="100" height="70" rx="5" fill="#E5E7EB" />
          <rect x="155" y="185" width="90" height="55" rx="2" fill="#1E293B" />
          <rect x="180" y="250" width="40" height="10" rx="2" fill="#E5E7EB" />
          <rect x="160" y="260" width="80" height="5" rx="2" fill="#E5E7EB" />

          {/* Character body */}
          <rect x="185" y="220" width="30" height="40" rx="5" fill="#FB7185" />

          {/* Character head */}
          <motion.g variants={headVariants}>
            <circle cx="200" cy="205" r="20" fill="#FDA4AF" />
            <circle cx="193" cy="200" r="2" fill="#1E293B" />
            <circle cx="207" cy="200" r="2" fill="#1E293B" />
            <path d="M195 210 Q200 215 205 210" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M190 195 Q193 192 196 195" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M204 195 Q207 192 210 195" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          </motion.g>

          {/* Arms */}
          <motion.g variants={armVariants}>
            <path d="M185 230 Q175 240 170 250" stroke="#FB7185" strokeWidth="8" strokeLinecap="round" />
            <path d="M215 230 Q225 240 230 250" stroke="#FB7185" strokeWidth="8" strokeLinecap="round" />
          </motion.g>
        </motion.g>

        {/* Code particles */}
        <motion.g
          animate={{
            opacity: [0, 1, 0],
            y: [0, -30],
            transition: { repeat: Number.POSITIVE_INFINITY, duration: 2, staggerChildren: 0.2 },
          }}
        >
          <circle cx="170" cy="170" r="3" fill="#6366F1" />
          <circle cx="180" cy="160" r="3" fill="#6366F1" />
          <circle cx="190" cy="150" r="3" fill="#6366F1" />
          <circle cx="210" cy="150" r="3" fill="#6366F1" />
          <circle cx="220" cy="160" r="3" fill="#6366F1" />
          <circle cx="230" cy="170" r="3" fill="#6366F1" />
        </motion.g>

        {/* Floating elements */}
        <motion.g
          animate={{
            y: [0, -10, 0],
            transition: { repeat: Number.POSITIVE_INFINITY, duration: 5, ease: "easeInOut" },
          }}
        >
          <circle cx="130" cy="180" r="15" fill="#A855F7" opacity="0.6" />
        </motion.g>

        <motion.g
          animate={{
            y: [0, -15, 0],
            transition: { repeat: Number.POSITIVE_INFINITY, duration: 7, ease: "easeInOut", delay: 0.5 },
          }}
        >
          <circle cx="270" cy="190" r="20" fill="#6366F1" opacity="0.6" />
        </motion.g>

        {/* Code symbols */}
        <motion.g
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1, 0.8],
            transition: { repeat: Number.POSITIVE_INFINITY, duration: 3, staggerChildren: 0.3 },
          }}
        >
          <text x="120" y="160" fill="#6366F1" fontSize="12">
            &lt;/&gt;
          </text>
          <text x="260" y="150" fill="#6366F1" fontSize="12">{`{}`}</text>
          <text x="240" y="200" fill="#A855F7" fontSize="12">
            ()
          </text>
        </motion.g>
      </motion.svg>
    </div>
  )
}
