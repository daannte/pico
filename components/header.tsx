import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  count?: number
  className?: string
  variant?: "light" | "dark"
}

export default function Header({
  title,
  count,
  className,
  variant = "light",
}: HeaderProps) {
  const isDark = variant === "dark"

  return (
    <header
      className={cn(
        "flex items-end justify-between mb-8 pb-3 border-b-2 font-semibold",
        count ? "w-full" : "w-fit",
        isDark ? "border-black/80" : "border-white/80",
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <h2
          className={cn(
            "text-3xl font-semibold uppercase tracking-wide leading-none",
            isDark ? "text-black" : "text-white"
          )}
        >
          {title}
        </h2>
        <div className={cn("h-0.5 w-12", isDark ? "bg-black/60" : "bg-white/60")} />
      </div>

      {count && (
        <div
          className={cn(
            "flex items-center gap-2 text-2xl",
            isDark ? "text-black/90" : "text-white/90"
          )}
        >
          {count.toLocaleString()}
        </div>
      )}
    </header>
  )
}
