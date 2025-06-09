"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

type AnimatedBackgroundProps = {
  imageUrl: string | null
  index: number
}

export default function AnimatedBackground({ imageUrl, index }: AnimatedBackgroundProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`bg-${index}`}
        className="absolute inset-0 z-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Background"
            fill
            priority
            className="object-cover blur-xs scale-102"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
