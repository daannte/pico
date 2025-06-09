type BackgroundProps = {
  imageUrl: string | null
}

export default function Background({ imageUrl }: BackgroundProps) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center blur-xs scale-102 z-0"
      style={{
        backgroundImage: imageUrl
          ? `url(${imageUrl})`
          : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)"
      }}
    />
  )
}
