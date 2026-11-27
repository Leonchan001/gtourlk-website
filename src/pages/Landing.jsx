// Static sight and route pages: build-time HTML only, no client JavaScript.
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { BUSINESS, lineMessageUrl } from '../data/business.js'
import { SITE_COPY } from '../data/siteCopy.js'
import { getTourPlans } from '../data/tours.js'
import {
  BUSINESS_ID,
  PAGE_COPY,
  PLACES,
  absolute,
  homePath,
  nearbyPlaces,
  placeById,
  placePath,
  placesPath,
  tourPath,
  tourPhoto,
  tourPrices,
  tourStops,
  toursIncluding,
} from '../data/pages.js'
import { PLACE_GUIDES } from '../data/placeGuides.js'
import { SPECULATION_RULES, landingAnalytics } from '../pagePerf.js'

const other = (lang) => (lang === 'en' ? 'zh' : 'en')
const json = (data) => JSON.stringify(data).replaceAll('<', '\\u003c')

const HERO_SIZES = '(min-width: 900px) 56vw, 100vw'
const CARD_SIZES = '(min-width: 900px) 30vw, 100vw'

// Lets the browser start the LCP photo before it parses the body and the fonts.
function PreloadPhoto({ preload }) {
  const photo = preload?.photo
  if (!photo) return null
  if (!photo.sources) return <link rel="preload" as="image" href={photo.src} fetchpriority="high" />
  return <link rel="preload" as="image" type="image/avif" imageSrcSet={photo.sources.avif} imageSizes={preload.sizes} fetchpriority="high" />
}

function Picture({ photo, lang, priority, eager, sizes = HERO_SIZES }) {
  if (!photo) return null
  return (
    <picture className="lp-photo">
      {photo.sources && (
        <>
          <source type="image/avif" srcSet={photo.sources.avif} sizes={sizes} />
          <source type="image/webp" srcSet={photo.sources.webp} sizes={sizes} />
        </>
      )}
      <img
        src={photo.src}
        alt={photo.alt[lang]}
        width={photo.width}
        height={photo.height}
        style={{ objectPosition: photo.position || 'center' }}
        loading={priority || eager ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : undefined}
        decoding="async"
      />
    </picture>
  )
}

function Credit({ photo, lang }) {
  const credit = photo?.credit
  if (!credit) return null
  const copy = PAGE_COPY[lang]
  if (credit.text)
    return (
      <figcaption>
        <a href={credit.source} target="_blank" rel="noreferrer">
          {credit.text[lang]}
        </a>
      </figcaption>
    )
  return (
    <figcaption>
      {copy.photo}
      <a href={credit.source} target="_blank" rel="noreferrer">
        {credit.author}
      </a>
      {' · '}
      {copy.license}
      <a href={credit.licenseUrl} target="_blank" rel="noreferrer">
        {credit.license}
      </a>
    </figcaption>
  )
}

function Header({ lang, alternate }) {
  const copy = PAGE_COPY[lang]
  return (
    <header className="lp-header">
      <div className="page-width lp-header-inner">
        <a className="lp-brand" href={homePath(lang)}>
          <img src="/media/logo-header.webp" width="34" height="40" alt="" />
          <span>
            GtourLK<small lang="zh-Hant">導 鹿</small>
          </span>
        </a>
        <nav aria-label={copy.home}>
          <a href={placesPath(lang)}>{copy.places}</a>
          <a href={`${homePath(lang)}#routes`}>{copy.routes}</a>
          <a href={alternate} lang={copy.switchLang} hrefLang={copy.switchLang}>
            {copy.switchLabel}
          </a>
          <a className="lp-book" href={lineMessageUrl(copy.lineHello)} target="_blank" rel="noreferrer">
            {copy.book} <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  )
}

function Breadcrumbs({ lang, trail }) {
  return (
    <nav className="lp-breadcrumb" aria-label={PAGE_COPY[lang].breadcrumb}>
      <ol>
        {trail.map(([name, path], i) => (
          <li key={path}>
            {i < trail.length - 1 ? <a href={path}>{name}</a> : <span aria-current="page">{name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

function Cta({ lang, title, lineText, showPrice = true }) {
  const copy = PAGE_COPY[lang]
  const phone = BUSINESS.phones[0]
  return (
    <section className="lp-cta">
      <h2>{title}</h2>
      <p>{copy.ctaBody}</p>
      {showPrice && <p className="lp-cta-price">{copy.priceFrom}</p>}
      <p className="lp-cta-note">{copy.lineDiscount}</p>
      <div className="lp-actions">
        <a className="button" href={lineMessageUrl(lineText || copy.lineHello)} target="_blank" rel="noreferrer">
          {copy.book} <span aria-hidden="true">↗</span>
        </a>
        <a className="lp-text-link" href={`tel:${phone.tel}`}>
          {phone.display}
        </a>
        <a className="lp-text-link" href={`${homePath(lang)}#contact`}>
          {copy.plan} <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  )
}

function Footer({ lang, year }) {
  const copy = PAGE_COPY[lang]
  return (
    <footer className="lp-footer">
      <div className="page-width lp-footer-inner">
        <div>
          <a className="lp-footer-brand" href={homePath(lang)}>GtourLK</a>
          <p>{copy.footerNote}</p>
        </div>
        <nav aria-label={copy.routes}>
          {getTourPlans(lang).map((plan) => (
            <a key={plan.minutes} href={tourPath(lang, plan.minutes)}>
              {copy.tourHeading(plan)}
            </a>
          ))}
          <a href={placesPath(lang)}>{copy.allPlaces}</a>
        </nav>
        <div>
          <p>{BUSINESS.address[lang]}</p>
          <a href={BUSINESS.lineUrl} target="_blank" rel="noreferrer">
            LINE / {BUSINESS.lineId} ↗
          </a>
          {BUSINESS.phones.map((phone, i) => (
            <a key={phone.tel} href={`tel:${phone.tel}`}>
              {SITE_COPY[lang].header.phoneLabels[i]}・{phone.display}
            </a>
          ))}
        </div>
      </div>
      <p className="page-width lp-copyright">
        © {year} {BUSINESS.name}. All rights reserved.
      </p>
    </footer>
  )
}

function breadcrumbSchema(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: absolute(path),
    })),
  }
}

const provider = (lang) => ({
  '@type': 'LocalBusiness',
  '@id': BUSINESS_ID,
  name: lang === 'en' ? 'GtourLK' : '導鹿 GtourLK',
  url: absolute(homePath(lang)),
  telephone: BUSINESS.phones[0].tel,
})

function placeView(lang, id) {
  const place = placeById(id)
  const guide = PLACE_GUIDES[id]
  const p = place[lang]
  const copy = PAGE_COPY[lang]
  const trail = [
    [copy.home, homePath(lang)],
    [copy.places, placesPath(lang)],
    [p.name, placePath(lang, id)],
  ]
  const tours = toursIncluding(id, lang)
  const [longitude, latitude] = place.coordinates
  const schema = [
    {
      '@type': 'TouristAttraction',
      '@id': `${absolute(placePath('zh', id))}#place`,
      name: p.name,
      alternateName: place[other(lang)].name,
      description: p.story || p.detail,
      url: absolute(placePath(lang, id)),
      ...(place.photo && { image: absolute(place.photo.src) }),
      geo: { '@type': 'GeoCoordinates', latitude, longitude },
      address: {
        '@type': 'PostalAddress',
        addressLocality: lang === 'en' ? 'Lukang Township' : '鹿港鎮',
        addressRegion: lang === 'en' ? 'Changhua County' : '彰化縣',
        addressCountry: 'TW',
      },
      ...(place.source && { sameAs: place.source }),
    },
    breadcrumbSchema(trail),
  ]
  const body = (
    <>
      <Breadcrumbs lang={lang} trail={trail} />
      <article className="lp-hero">
        <div className="lp-hero-copy">
          <p className="eyebrow">{copy.places}</p>
          <h1>{p.name}</h1>
          {p.highlight && <p className="lp-lede">{p.highlight}</p>}
          <p className="body-copy">{p.detail}</p>
        </div>
        {place.photo && (
          <figure className="lp-hero-figure">
            <Picture photo={place.photo} lang={lang} priority />
            <Credit photo={place.photo} lang={lang} />
          </figure>
        )}
      </article>
      <div className="lp-columns">
        <section>
          <h2>{copy.story}</h2>
          <p className="body-copy">{p.story || p.detail}</p>
          {guide && (
            <>
              <h2>{copy.history}</h2>
              {guide[lang].history.map((text) => (
                <p className="body-copy" key={text}>{text}</p>
              ))}
              <h2>{copy.highlights}</h2>
              <dl className="lp-highlights">
                {guide[lang].highlights.map(([title, text]) => (
                  <div key={title}>
                    <dt>{title}</dt>
                    <dd>{text}</dd>
                  </div>
                ))}
              </dl>
              <h2>{copy.tips}</h2>
              {guide[lang].tips.map((text) => (
                <p className="body-copy" key={text}>{text}</p>
              ))}
            </>
          )}
          <p className="small-copy lp-sources">
            {copy.sources}
            {(guide?.sources || [{ url: place.source, name: copy.source }])
              .filter((source) => source.url)
              .map((source, i) => (
                <React.Fragment key={source.url}>
                  {i > 0 && '・'}
                  <a href={source.url} target="_blank" rel="noreferrer">
                    {source.name[lang] || source.name}
                  </a>
                </React.Fragment>
              ))}
          </p>
        </section>
        <aside>
          {guide?.official && (
            <div className="lp-official">
              <h2>{copy.official}</h2>
              <p className="body-copy">{guide.official.note[lang]}</p>
              <a className="lp-text-link" href={guide.official.url} target="_blank" rel="noreferrer">
                {guide.official.label[lang]} <span aria-hidden="true">↗</span>
              </a>
            </div>
          )}
          <h2>{copy.inTours}</h2>
          {tours.length ? (
            <ul className="lp-link-list">
              {tours.map((plan) => (
                <li key={plan.minutes}>
                  <a href={tourPath(lang, plan.minutes)}>
                    <strong>{copy.minutes(plan.minutes)}</strong>
                    <span>{plan.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="body-copy">{copy.notInTours}</p>
          )}
          <h2>{copy.nearby}</h2>
          <ul className="lp-link-list">
            {nearbyPlaces(id).map(({ place: near, meters }) => (
              <li key={near.id}>
                <a href={placePath(lang, near.id)}>
                  <strong>{near[lang].name}</strong>
                  <span>{copy.walk(meters)}</span>
                </a>
              </li>
            ))}
          </ul>
          <p className="small-copy lp-walk-note">{copy.walkNote}</p>
        </aside>
      </div>
      <Cta lang={lang} title={copy.ctaTitle(p.name)} lineText={copy.linePlace(p.name)} />
    </>
  )
  return {
    title: copy.placeTitle(p),
    description: copy.placeDescription(p),
    image: place.photo?.src,
    imageAlt: place.photo?.alt[lang],
    preload: { photo: place.photo, sizes: HERO_SIZES },
    alternates: { zh: placePath('zh', id), en: placePath('en', id) },
    schema,
    body,
  }
}

function tourView(lang, minutes) {
  const copy = PAGE_COPY[lang]
  const plan = getTourPlans(lang).find((t) => t.minutes === minutes)
  const stops = tourStops(minutes, lang)
  const prices = tourPrices(minutes)
  const photo = tourPhoto(plan)
  const heading = copy.tourHeading(plan)
  const trail = [
    [copy.home, homePath(lang)],
    [heading, tourPath(lang, minutes)],
  ]
  const schema = [
    {
      '@type': 'TouristTrip',
      '@id': `${absolute(tourPath('zh', minutes))}#trip`,
      name: heading,
      description: `${plan.tagline} ${copy.note}`,
      url: absolute(tourPath(lang, minutes)),
      ...(photo && { image: absolute(photo.src) }),
      touristType: plan.fit,
      provider: provider(lang),
      itinerary: {
        '@type': 'ItemList',
        itemListElement: stops.map((stop, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: stop.place
            ? {
                '@type': 'TouristAttraction',
                '@id': `${absolute(placePath('zh', stop.id))}#place`,
                name: stop.place[lang].name,
                url: absolute(placePath(lang, stop.id)),
              }
            : { '@type': 'Place', name: stop.label },
        })),
      },
      offers: [
        {
          '@type': 'Offer',
          name: copy.pair(prices.pair),
          price: String(prices.pair),
          priceCurrency: 'TWD',
          url: absolute(tourPath(lang, minutes)),
        },
        {
          '@type': 'Offer',
          name: copy.perPerson(prices.perPerson),
          price: String(prices.perPerson),
          priceCurrency: 'TWD',
          url: absolute(tourPath(lang, minutes)),
        },
      ],
    },
    breadcrumbSchema(trail),
  ]
  const body = (
    <>
      <Breadcrumbs lang={lang} trail={trail} />
      <article className="lp-hero">
        <div className="lp-hero-copy">
          <p className="eyebrow">
            {plan.no} · {plan.durationLabel}
          </p>
          <h1>{heading}</h1>
          <p className="lp-lede">{plan.tagline}</p>
          <p className="body-copy">
            {copy.fit}
            {plan.fit}
          </p>
        </div>
        {photo && (
          <figure className="lp-hero-figure">
            <Picture photo={photo} lang={lang} priority />
          </figure>
        )}
      </article>
      <div className="lp-columns">
        <section>
          <h2>{copy.tourStops}</h2>
          <ol className="lp-stops">
            {stops.map((stop) => (
              <li key={stop.id}>
                {stop.place ? (
                  <a href={placePath(lang, stop.id)}>
                    <strong>{stop.place[lang].name}</strong>
                    <span>{stop.place[lang].highlight || stop.place[lang].detail}</span>
                  </a>
                ) : (
                  <div>
                    <strong>{stop.label}</strong>
                  </div>
                )}
              </li>
            ))}
          </ol>
          <p className="small-copy">{copy.note}</p>
        </section>
        <aside>
          <h2>{copy.price}</h2>
          <ul className="lp-price">
            <li>{copy.pair(prices.pair)}</li>
            <li>{copy.perPerson(prices.perPerson)}</li>
          </ul>
          <p className="small-copy">{copy.lineDiscount}</p>
          <h2>{copy.otherTours}</h2>
          <ul className="lp-link-list">
            {getTourPlans(lang)
              .filter((t) => t.minutes !== minutes)
              .map((t) => (
                <li key={t.minutes}>
                  <a href={tourPath(lang, t.minutes)}>
                    <strong>{copy.minutes(t.minutes)}</strong>
                    <span>{t.title}</span>
                  </a>
                </li>
              ))}
          </ul>
        </aside>
      </div>
      <Cta lang={lang} title={copy.bookTour} lineText={copy.lineTour(plan)} showPrice={false} />
    </>
  )
  return {
    title: copy.tourTitle(plan),
    description: copy.tourDescription(
      plan,
      stops.map((s) => s.place?.[lang].name || s.label),
    ),
    image: plan.photo,
    imageAlt: photo?.alt[lang],
    preload: { photo, sizes: HERO_SIZES },
    alternates: { zh: tourPath('zh', minutes), en: tourPath('en', minutes) },
    schema,
    body,
  }
}

function placesView(lang) {
  const copy = PAGE_COPY[lang]
  const trail = [
    [copy.home, homePath(lang)],
    [copy.places, placesPath(lang)],
  ]
  // The first cards sit in the first screen, so they load eagerly (the first one is the LCP).
  const group = (title, places, firstGroup) => (
    <section className="lp-group">
      <h2>{title}</h2>
      <ul className="lp-cards">
        {places.map((place, index) => (
          <li key={place.id}>
            <a href={placePath(lang, place.id)}>
              <Picture photo={place.photo} lang={lang} priority={firstGroup && index === 0} eager={firstGroup && index < 3} sizes={CARD_SIZES} />
              <strong>{place[lang].name}</strong>
              <span>{place[lang].highlight || place[lang].detail}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
  const schema = [
    {
      '@type': 'ItemList',
      name: copy.placesHeading,
      itemListElement: PLACES.map((place, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absolute(placePath(lang, place.id)),
        name: place[lang].name,
      })),
    },
    breadcrumbSchema(trail),
  ]
  const body = (
    <>
      <Breadcrumbs lang={lang} trail={trail} />
      <div className="lp-intro">
        <h1>{copy.placesHeading}</h1>
        <p className="body-copy">{copy.placesIntro}</p>
      </div>
      {group(copy.featuredPlaces, PLACES.filter((p) => p.featured), true)}
      {group(copy.morePlaces, PLACES.filter((p) => !p.featured))}
      <Cta lang={lang} title={copy.ctaTitle(lang === 'en' ? 'Lukang' : '鹿港')} />
    </>
  )
  return {
    title: copy.placesTitle,
    description: copy.placesDescription,
    image: '/hero-main.jpg',
    preload: { photo: PLACES.find((p) => p.featured)?.photo, sizes: CARD_SIZES },
    alternates: { zh: placesPath('zh'), en: placesPath('en') },
    schema,
    body,
  }
}

export function renderLanding(page, { css, year }) {
  const { lang } = page
  const view =
    page.type === 'place'
      ? placeView(lang, page.id)
      : page.type === 'tour'
        ? tourView(lang, page.minutes)
        : placesView(lang)
  const copy = PAGE_COPY[lang]
  const url = absolute(page.path)
  const image = absolute(view.image || '/hero-main.jpg')
  const ld = { '@context': 'https://schema.org', '@graph': view.schema }
  const html = (
    <html lang={lang === 'en' ? 'en' : 'zh-Hant-TW'}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{view.title}</title>
        <meta name="description" content={view.description} />
        <link rel="icon" type="image/png" href="/media/favicon.png" />
        <link rel="apple-touch-icon" href="/media/apple-touch-icon.png" />
        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="zh-Hant" href={absolute(view.alternates.zh)} />
        <link rel="alternate" hrefLang="en" href={absolute(view.alternates.en)} />
        <link rel="alternate" hrefLang="x-default" href={absolute(view.alternates.zh)} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={view.title} />
        <meta property="og:description" content={view.description} />
        <meta property="og:image" content={image} />
        {view.imageAlt && <meta property="og:image:alt" content={view.imageAlt} />}
        <meta property="og:locale" content={lang === 'en' ? 'en_US' : 'zh_TW'} />
        <meta property="og:site_name" content={lang === 'en' ? 'GtourLK' : '導鹿 GtourLK'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={view.title} />
        <meta name="twitter:description" content={view.description} />
        <meta name="twitter:image" content={image} />
        <PreloadPhoto preload={view.preload} />
        <style dangerouslySetInnerHTML={{ __html: css.replaceAll('</style', '<\\/style') }} />
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: SPECULATION_RULES }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(ld) }} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">{copy.skip}</a>
        <Header lang={lang} alternate={view.alternates[other(lang)]} />
        <main id="main-content" className="page-width lp-main">
          {view.body}
        </main>
        <Footer lang={lang} year={year} />
        <script dangerouslySetInnerHTML={{ __html: landingAnalytics(lang) }} />
      </body>
    </html>
  )
  return `<!doctype html>${renderToStaticMarkup(html)}`
}
