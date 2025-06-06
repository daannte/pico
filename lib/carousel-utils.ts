// export const getYouTubeVideoId = (url: string): string | null => {
//   const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
//   const match = url.match(regExp)
//   return (match && match[7].length === 11) ? match[7] : null
// }
//
// export const getYouTubeThumbnail = (url: string): string | null => {
//   const videoId = getYouTubeVideoId(url)
//   return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
// }

export const slideVariants = {
  enter: { x: '-100%', opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: '-100%', opacity: 0 }
}

export const slideTransition = {
  duration: 0.5,
  ease: "easeInOut" as const
}

export const AUTO_CYCLE_DELAY = 3000
