// Shared page-speed helpers for the prerendered pages.
// (Comments stay in English: the font-coverage test scans all source text.)
import { GA_MEASUREMENT_ID, isValidMeasurementId } from './analytics.js'

// Chrome and Edge fetch the next page while the visitor hovers or presses a
// link, so sight and route pages open almost instantly. Other browsers ignore it.
export const SPECULATION_RULES = JSON.stringify({
  prerender: [
    {
      where: {
        and: [
          { href_matches: ['/places/*', '/tours/*', '/en/places/*', '/en/tours/*'] },
          { not: { selector_matches: '[target=_blank], [rel~=nofollow]' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
  prefetch: [
    { where: { href_matches: ['/', '/en/'] }, eagerness: 'moderate' },
  ],
})

// Static sight and route pages have no app bundle, so this tiny script
// (written to dist/landing-ga.js at build time, never inline, so the Content
// Security Policy needs no 'unsafe-inline') loads GA after the page has loaded
// and records LINE and phone taps with the same event names as the home page
// (see src/analytics.js).
export const LANDING_GA_PATH = '/landing-ga.js'
export function landingAnalytics(id = GA_MEASUREMENT_ID) {
  if (!isValidMeasurementId(id)) return ''
  return `(function(){
var w=window,d=document;w.dataLayer=w.dataLayer||[];
var lang=(d.documentElement.lang||'').indexOf('en')===0?'en':'zh';
function gtag(){w.dataLayer.push(arguments)}w.gtag=w.gtag||gtag;
gtag('js',new Date());gtag('config',${JSON.stringify(id)},{site_language:lang});
function where(el){var t=el.closest('[data-analytics-location]');if(t)return t.dataset.analyticsLocation;var a=el.closest('section[id],header,footer,nav');return a?(a.id||a.tagName.toLowerCase()):'other'}
d.addEventListener('click',function(e){var l=e.target.closest&&e.target.closest('a[href]');if(!l)return;var h=l.getAttribute('href');
if(/^https?:\\/\\/(?:[\\w-]+\\.)*line\\.me\\//i.test(h)){var m=/line\\.me\\/.*?(@[\\w.-]+)/i.exec(decodeURIComponent(h));
w.gtag('event','line_click',{link_location:where(l),line_account:m?m[1].toLowerCase():'unknown',with_summary:l.dataset.analyticsSummary==='true',link_url:h.split('?')[0]})}
else if(h.indexOf('tel:')===0)w.gtag('event','phone_click',{link_location:where(l),phone_number:h.slice(4)})},true);
function load(){var s=d.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(${JSON.stringify(id)});d.head.appendChild(s)}
function later(){(w.requestIdleCallback||function(f){setTimeout(f,1)})(load,{timeout:3000})}
if(d.readyState==='complete')later();else w.addEventListener('load',later,{once:true});
})();`
}
