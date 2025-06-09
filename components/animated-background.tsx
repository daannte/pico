"use client"

import { motion, AnimatePresence } from "motion/react"

type AnimatedBackgroundProps = {
  imageUrl: string | null
  index: number
}

export default function AnimatedBackground({ imageUrl, index }: AnimatedBackgroundProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`bg-${index}`}
        className="absolute inset-0 bg-cover bg-center blur-xs scale-102 z-0"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </AnimatePresence>
  )
}
