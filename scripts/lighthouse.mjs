// Optional QA tooling: install Lighthouse in .tooling/qa, never in the product.
import fs from 'node:fs/promises'
import path from 'node:path'
import lighthouse from '../.tooling/qa/node_modules/lighthouse/core/index.js'
import { launch } from '../.tooling/qa/node_modules/chrome-launcher/dist/index.js'

const url = process.argv[2] || 'http://127.0.0.1:4173/'
const name = process.argv[3] || 'zh'
const userDataDir = path.resolve(`.tooling/lighthouse-${name}`)
await fs.mkdir(userDataDir, { recursive: true })
await fs.mkdir('artifacts', { recursive: true })
const chrome = await launch({
  chromePath: process.env.CHROME_PATH,
  chromeFlags: ['--headless', '--disable-gpu'],
  userDataDir,
})
try {
  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  })
  await fs.writeFile(`artifacts/lighthouse-${name}.json`, result.report)
  if (result.lhr.runtimeError) {
    throw new Error(
      `Lighthouse did not audit the page: ${result.lhr.runtimeError.message}`,
    )
  }
  console.log(
    JSON.stringify(
      {
        url,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [
            key,
            value.score * 100,
          ]),
        ),
        metrics: Object.fromEntries(
          [
            'first-contentful-paint',
            'largest-contentful-paint',
            'total-blocking-time',
            'cumulative-layout-shift',
          ].map((key) => [key, result.lhr.audits[key].displayValue]),
        ),
      },
      null,
      2,
    ),
  )
} finally {
  await chrome.kill()
}
