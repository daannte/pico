"use client"
import { motion } from "motion/react"
import { getItemImageUrl } from "@/lib/jellyfin"
import { useJellyfin } from "@/contexts/jellyfin-context"
import { getDisplayItem, getSectionEmptyMessage } from "@/types/sections"
import type { SectionsCardProps } from "@/types/sections"
import Header from "@/components/header"
import SectionsBackground from "./sections-background"
import SectionsButton from "./sections-button"
import { useRouter } from "next/navigation"
import { useMedia } from "@/contexts/media-context"

export default function SectionsCard({
  title,
  items,
  totalCount,
  type
}: SectionsCardProps) {
  const { api } = useJellyfin()
  const { setCurrentSection } = useMedia()
  const router = useRouter()
  const displayItem = getDisplayItem(items, type)
  const image = displayItem ? getItemImageUrl({ item: displayItem, api: api! }) : null
  const isEmpty = !displayItem || totalCount === 0
  const emptyMessage = getSectionEmptyMessage(type)

  const slideUpVariants = {
    hidden: {
      y: 100,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  const buttonVariants = {
    hidden: {
      y: 50,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2
      }
    }
  }

  const handleClick = () => {
    if (totalCount > 0) {
      setCurrentSection(type)
      router.push("/media")
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <SectionsBackground image={image} isEmpty={isEmpty} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-16">
        <Header title={title} count={totalCount} />

        <motion.div
          className="relative w-full h-full overflow-hidden shadow-2xl"
          variants={slideUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
        >
          {isEmpty ? (
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center h-full">
              <div className="text-white/60 text-2xl">{emptyMessage}</div>
            </div>
          ) : (
            <SectionsBackground.Image
              image={image}
              alt={displayItem?.Name || "Backdrop"}
            />
          )}
        </motion.div>

        <motion.div
          className="mt-8 w-full"
          variants={buttonVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.3 }}
        >
          <SectionsButton
            disabled={totalCount === 0}
            text={totalCount === 0 ? "Nothing to show" : "See All"}
            onClick={handleClick}
          />
        </motion.div>
      </div>
    </section>
  )
}
