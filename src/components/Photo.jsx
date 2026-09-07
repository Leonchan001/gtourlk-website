import { MEDIA } from '../data/media'
import { useLanguage } from '../i18n'

export default function Photo({
  slot,
  className = '',
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
}) {
  const { lang } = useLanguage()
  const media = MEDIA[slot]
  if (!media) return null
  return (
    <picture className={`photograph ${className}`}>
      <source type="image/avif" srcSet={media.sources.avif} sizes={sizes} />
      <source type="image/webp" srcSet={media.sources.webp} sizes={sizes} />
      <img
        src={media.src}
        alt={media.alt[lang]}
        width={media.width}
        height={media.height}
        style={{ objectPosition: media.position }}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding={priority ? 'sync' : 'async'}
      />
    </picture>
  )
}
