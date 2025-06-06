interface SectionsHeaderProps {
  title: string
  count: number
}

export default function SectionsHeader({ title, count }: SectionsHeaderProps) {
  return (
    <header className="flex items-end justify-between w-full mb-8 pb-3 border-b-2 border-white/80 font-semibold">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-white uppercase tracking-wide leading-none">
          {title}
        </h2>
        <div className="h-0.5 bg-white/60 w-12" />
      </div>

      <div className="flex items-center gap-2 text-white/90 text-2xl">
        {count.toLocaleString()}
      </div>
    </header>
  )
}
