// Google Analytics 4 for the booking funnel.
//
// Replace G-XXXXXXXXXX below with the GA4 web stream Measurement ID
// (starts with "G-"), or set VITE_GA_MEASUREMENT_ID at build time.
// While the placeholder is in place, GA is never loaded and nothing is sent.
// (Comments stay in English: the font-coverage test scans all source text.)
export const GA_PLACEHOLDER_ID = 'G-XXXXXXXXXX'
const GA_SITE_ID = 'G-KXNZE09GMR'
export const GA_MEASUREMENT_ID =
  (typeof import.meta !== 'undefined' &&
    import.meta.env?.VITE_GA_MEASUREMENT_ID) ||
  GA_SITE_ID

export function isValidMeasurementId(id) {
  return /^G-[A-Z0-9]{4,}$/.test(id || '') && id !== GA_PLACEHOLDER_ID
}

let enabled = false

function gtag() {
  // gtag.js expects the real `arguments` object, not an array.
  window.dataLayer.push(arguments)
}

// Funnel events. Mark `line_click` (and optionally `copy_summary`) as key
// events in GA4 to count bookings started from the site.
export function track(name, params = {}) {
  if (!enabled || typeof window === 'undefined') return
  window.gtag('event', name, params)
}

const sentSteps = new Set()
// One `booking_step` per form field per page load, so the funnel shows how
// far visitors get without flooding GA with every keystroke.
export function trackBookingStep(step, params = {}) {
  if (sentSteps.has(step)) return
  sentSteps.add(step)
  track('booking_step', { step, ...params })
}

// Where on the page a link sits, e.g. "contact", "faq", "footer".
export function linkLocation(element) {
  const tagged = element.closest('[data-analytics-location]')
  if (tagged) return tagged.dataset.analyticsLocation
  const area = element.closest('section[id], header, footer, nav')
  if (!area) return 'other'
  return area.id || area.tagName.toLowerCase()
}

export function lineAccount(href) {
  const match = /line\.me\/.*?(@[\w.-]+)/i.exec(decodeURIComponent(href))
  return match ? match[1].toLowerCase() : 'unknown'
}

function onDocumentClick(event) {
  const link = event.target.closest?.('a[href]')
  if (!link) return
  const href = link.getAttribute('href')
  if (/^https?:\/\/(?:[\w-]+\.)*line\.me\//i.test(href)) {
    track('line_click', {
      link_location: linkLocation(link),
      line_account: lineAccount(href),
      with_summary: link.dataset.analyticsSummary === 'true',
      // Drop the query: oaMessage links carry the guest's trip details.
      link_url: href.split('?')[0],
    })
  } else if (href.startsWith('tel:')) {
    track('phone_click', {
      link_location: linkLocation(link),
      phone_number: href.slice(4),
    })
  }
}

export function initAnalytics(lang, id = GA_MEASUREMENT_ID) {
  if (enabled || typeof window === 'undefined' || !isValidMeasurementId(id))
    return false
  enabled = true
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || gtag
  window.gtag('js', new Date())
  window.gtag('config', id, { site_language: lang })
  document.addEventListener('click', onDocumentClick, true)
  // Events queue in dataLayer right away; gtag.js itself waits until the page
  // has loaded and the main thread is idle, so it never delays first paint.
  afterLoadIdle(() => {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    document.head.appendChild(script)
    reportWebVitals()
  })
  return true
}

function afterLoadIdle(callback) {
  const idle = () =>
    (window.requestIdleCallback || ((fn) => setTimeout(fn, 1)))(callback, {
      timeout: 3000,
    })
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
}

// Real-visitor Core Web Vitals (LCP, INP, CLS) as GA4 events, so the site is
// judged on what guests actually experience, not only on lab tests.
export function sendWebVital({ name, value, rating, id, navigationType }) {
  track('web_vitals', {
    metric_name: name,
    metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
    metric_rating: rating,
    metric_id: id,
    navigation_type: navigationType,
    non_interaction: true,
  })
}

function reportWebVitals() {
  import('web-vitals')
    .then(({ onLCP, onINP, onCLS }) => {
      onLCP(sendWebVital)
      onINP(sendWebVital)
      onCLS(sendWebVital)
    })
    .catch(() => {
      /* Metrics are optional; the site works without them. */
    })
}
