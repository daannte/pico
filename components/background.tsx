import Image from "next/image"

type BackgroundProps = {
  imageUrl: string | null
}

export default function Background({ imageUrl }: BackgroundProps) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
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
    </div>
  )
}
