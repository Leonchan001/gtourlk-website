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

test('GA stays off until a real measurement ID is set', () => {
  assert.equal(GA_MEASUREMENT_ID, GA_PLACEHOLDER_ID)
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
