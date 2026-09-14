import { getTourPlans } from './tours.js'

/** @typedef {60 | 90 | 150} Duration */
/** @typedef {{ tier: Duration, weight: number, kind: 'sight' | 'area' }} PreferenceMeta */
const plans = getTourPlans('zh')
export const MAX_PRIORITIES = 2
/** Editorial advisory policy, NOT stop capacity, travel minutes or an operator promise.
 * First appearance in the existing plans supplies the tier. The broad-area choice
 * weighs two because it is not one stop. Budgets reuse existing reference-list sizes.
 * These conservative prompts need guide review; nothing blocks an inquiry.
 * @type {Record<string, PreferenceMeta>}
 */
export const PREFERENCE_META = Object.fromEntries(
  [...new Set(plans.flatMap((plan) => plan.stops))].map((id) => [
    id,
    {
      tier: /** @type {Duration} */ (
        plans.find((plan) => plan.stops.includes(id)).minutes
      ),
      weight: id === '南北鹿港經典古蹟' ? 2 : 1,
      kind: id === '南北鹿港經典古蹟' ? 'area' : 'sight',
    },
  ]),
)
/** @type {Record<Duration, number>} Soft editorial load, not a stop-count limit. */
export const PREFERENCE_BUDGET = Object.fromEntries(
  plans.map((plan) => [plan.minutes, plan.stops.length]),
)
export function cleanPriorities(stops, priorities = []) {
  return [...new Set(Array.isArray(priorities) ? priorities : [])]
    .filter((id) => stops.includes(id) && PREFERENCE_META[id])
    .slice(0, MAX_PRIORITIES)
}
export function togglePriority(stops, priorities, id) {
  const current = cleanPriorities(stops, priorities)
  return current.includes(id)
    ? current.filter((item) => item !== id)
    : cleanPriorities(stops, [...current, id])
}
/**
 * @param {Duration} minutes
 * @param {string[]} stops
 * @param {boolean} guideChoice
 * @returns {{ advisory: boolean, next: Duration | null, load: number, tier: number }}
 */
export function recommendDuration(minutes, stops, guideChoice = false) {
  const entries = guideChoice
    ? []
    : [...new Set(stops)].map((id) => PREFERENCE_META[id]).filter(Boolean)
  const load = entries.reduce((sum, item) => sum + item.weight, 0)
  const tier = Math.max(60, ...entries.map((item) => item.tier))
  const advisory = load > PREFERENCE_BUDGET[minutes] || tier > minutes
  // Suggest the first larger tier that fits this heuristic. If none fits, the
  // largest duration is still an option, but its advisory remains visible.
  const next =
    advisory && minutes < 150
      ? /** @type {Duration} */ (
          plans.find(
            (plan) =>
              plan.minutes > minutes &&
              plan.minutes >= tier &&
              PREFERENCE_BUDGET[plan.minutes] >= load,
          )?.minutes || 150
        )
      : null
  return { advisory, next, load, tier }
}
export const PREFERENCE_COPY = {
  zh: {
    guidance: {
      60: '先留幾個最想看的地方，把時間留給故事。',
      90: '多一些巷弄與寺廟，也留一點停下來的時間。',
      150: '南北鹿港慢慢串連，停留的節奏一起討論。',
    },
    title: '把想看的地方，留一點彈性。',
    advisory: (minutes) =>
      `${minutes} 分鐘可能無法涵蓋全部偏好。可多留時間，或請導覽員協助取捨。`,
    upgrade: (minutes) => `改選 ${minutes} 分鐘`,
    keep: '已保留時長與偏好',
    priorities: '最想去',
    priorityHelp: '最多選 2 個，讓導覽員知道你的優先順序；不是保證停靠。',
    empty: '選好景點後，可標記最多 2 個「最想去」。',
    limit: '已標記 2 個；如要更換，先取消其中一個。',
    none: '尚未指定',
    sights: '景點偏好',
    notes: '其他需求',
  },
  en: {
    guidance: {
      60: 'Choose a few favourites and leave time for their stories.',
      90: 'More lanes and temple stories, with time to pause.',
      150: 'Connect north and south; agree the pace with your guide.',
    },
    title: 'Leave some room in your plans.',
    advisory: (minutes) =>
      `${minutes} minutes may not cover every preference. Allow more time, or ask your guide to prioritise.`,
    upgrade: (minutes) => `Change to ${minutes} minutes`,
    keep: 'Duration and preferences saved',
    priorities: 'Must-see',
    priorityHelp:
      'Choose up to 2 priorities for your guide, not guaranteed stops.',
    empty: 'Choose some sights, then mark up to 2 as Must-see.',
    limit: '2 marked. Unmark one before choosing another.',
    none: 'Not specified',
    sights: 'Preferred sights',
    notes: 'Other requests',
  },
}
