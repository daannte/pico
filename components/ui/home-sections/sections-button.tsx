"use client"

import { Button } from "../button"

interface SectionsButtonProps {
  disabled?: boolean
  text: string
  onClick?: () => void
}

export default function SectionsButton({
  disabled = false,
  text,
  onClick
}: SectionsButtonProps) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 rounded-sm transition-all duration-300 opacity-0 group-hover:opacity-100" />
      <Button
        size="lg"
        className="relative w-full py-6 px-8 bg-black/20 hover:bg-white/95 hover:text-black border-2 border-white/80 hover:border-white uppercase text-xl lg:text-2xl font-bold text-white tracking-widest transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.98] rounded-sm"
        disabled={disabled}
        onClick={onClick}
      >
        <span className="relative z-10">{text}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-sm" />
      </Button>
    </div>
  )
}
