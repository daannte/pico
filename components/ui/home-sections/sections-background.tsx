import Image from "next/image"

interface SectionsBackgroundProps {
  image: string | null
  isEmpty: boolean
}

interface SectionsBackgroundImageProps {
  image: string | null
  alt: string
}

export default function SectionsBackground({ image, isEmpty }: SectionsBackgroundProps) {
  const backgroundStyle = image && !isEmpty
    ? { backgroundImage: `url(${image})` }
    : { background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)' }

  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center blur-xs scale-102 z-0"
        style={backgroundStyle}
      />
      <div className="absolute inset-0 bg-black/50" />
    </>
  )
}

SectionsBackground.Image = function SectionsBackgroundImage({ image, alt }: SectionsBackgroundImageProps) {
  if (!image) {
    return <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
  }

  return (
    <Image
      src={image}
      alt={alt}
      className="object-cover"
      fill
      priority
    />
  )
}
