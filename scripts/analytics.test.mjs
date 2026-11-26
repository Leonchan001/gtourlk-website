import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import {
  GA_MEASUREMENT_ID,
  GA_PLACEHOLDER_ID,
  isValidMeasurementId,
  lineAccount,
  initAnalytics,
} from '../src/analytics.js'

test('GA uses a real measurement ID, never the placeholder', () => {
  assert.equal(isValidMeasurementId(GA_MEASUREMENT_ID), true)
  assert.equal(isValidMeasurementId(GA_PLACEHOLDER_ID), false)
  assert.equal(isValidMeasurementId(''), false)
  assert.equal(isValidMeasurementId('UA-12345-1'), false)
  assert.equal(isValidMeasurementId('G-AB12CD34EF'), true)
  // No window in Node / prerender: must be a safe no-op.
  assert.equal(initAnalytics('zh', 'G-AB12CD34EF'), false)
})

test('LINE links report which official account was opened', () => {
  assert.equal(lineAccount('https://line.me/R/ti/p/@lk167'), '@lk167')
  assert.equal(lineAccount('https://line.me/R/ti/p/%40lukang2012'), '@lukang2012')
  assert.equal(
    lineAccount('https://line.me/R/oaMessage/@lk167/?%E6%82%A8%E5%A5%BD'),
    '@lk167',
  )
})

test('booking funnel buttons carry analytics hooks', () => {
  const contact = fs.readFileSync('src/components/Contact.jsx', 'utf8')
  for (const hook of [
    "track('copy_summary'",
    "track('view_booking_form')",
    'trackBookingStep(step)',
    'data-analytics-summary="true"',
    'data-analytics-location="booking_direct_chat"',
  ])
    assert.ok(contact.includes(hook), hook)
  assert.match(fs.readFileSync('src/main.jsx', 'utf8'), /initAnalytics\(/)
})

test('prefilled LINE link is tracked without sending trip details to GA', () => {
  const contact = fs.readFileSync('src/components/Contact.jsx', 'utf8')
  const link = contact.slice(contact.indexOf('href={lineMessageUrl(summary)}'))
  assert.match(link.slice(0, 200), /data-analytics-summary="true"/)
  const analytics = fs.readFileSync('src/analytics.js', 'utf8')
  assert.ok(analytics.includes("link_url: href.split('?')[0]"))
})
