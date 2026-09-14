import { ATLAS_STOPS } from '../data/atlas'
import { TOWN_ROADS } from '../data/townAtlasRoads'
import {
  TOWN_VIEW,
  TOWN_LABELS,
  TOWN_ROAD_LABELS,
  roadTier,
  townProject,
} from '../data/townAtlas'

// Architectural details are simplified from actual facades, not generic pins.
function Drawing({ kind }) {
  if (kind === 'tianhou')
    return (
      <g>
        <path d="M-48,-18 Q-30,-14 -19,-25 H19 Q30,-14 48,-18 L43,-12 H-43 Z M-33,-31 Q-26,-30 -21,-40 Q0,-33 21,-40 Q26,-30 33,-31 L29,-25 H-29 Z M-35,-10 V10 M35,-10 V10 M-21,-10 V10 M21,-10 V10 M-8,-10 V10 M8,-10 V10 M-38,10 H38 M-41,14 H41 M-13,-9 H13 V-2 H-13 Z M-19,-30 V-25 M19,-30 V-25" />
        <path d="M-25,-40 l-5,-5 M25,-40 l5,-5 M-42,-18 l-6,-5 M42,-18 l6,-5 M-26,-22 H26 M-31,-8 V6 M31,-8 V6" />
      </g>
    )
  if (kind === 'longshan')
    return (
      <g>
        <path d="M-48,-23 Q-43,-20 -37,-28 Q0,-19 37,-28 Q43,-20 48,-23 L43,-14 H-43 Z M-60,-16 Q-51,-10 -43,-14 M43,-14 Q51,-10 60,-16 M-57,-10 H-43 M43,-10 H57 M-42,-12 V13 M42,-12 V13 M-24,-12 V13 M24,-12 V13 M-9,-12 V13 M9,-12 V13 M-57,-10 V13 H57 V-10 M-54,13 V-1 Q-48,-10 -44,-1 V13 M44,13 V-1 Q48,-10 54,-1 V13 M-29,-29 l-5,-7 M29,-29 l5,-7 M-60,17 H60" />
        <path d="M-36,-8 H-29 V5 H-36 Z M29,-8 H36 V5 H29 Z M-19,-7 H-14 V5 H-19 Z M14,-7 H19 V5 H14 Z" />
      </g>
    )
  if (kind === 'house')
    return (
      <g>
        <path d="M-43,0 V-36 H-28 V0 M28,0 V-36 H43 V0 M-46,-36 Q-36,-56 -25,-36 M25,-36 Q36,-56 46,-36 M-28,-27 H-13 V-39 Q0,-54 13,-39 V-27 H28 M-28,0 H28 M-13,0 V-18 Q0,-30 13,-18 V0 M-39,-27 H-32 V-15 H-39 Z M32,-27 H39 V-15 H32 Z M-7,-34 H7 V-26 H-7 Z M-23,-19 H-17 V-8 H-23 Z M17,-19 H23 V-8 H17 Z" />
      </g>
    )
  if (kind === 'arts')
    return (
      <g>
        <path d="M-40,-26 L-45,-32 H39 L45,-26 Z M-36,-25 V0 H36 V-25 M-24,0 V-21 H-10 V0 M0,-21 H12 V-6 H0 Z M19,-21 H31 V-6 H19 Z M6,-21 V-6 M25,-21 V-6 M-40,4 H40" />
      </g>
    )
  return null
}

export default function LukangMap({ lang, included, selectedId, onSelect }) {
  const stops = ATLAS_STOPS.filter((s) => s.coordinates)
  const layer = (mobile) => {
    const view = mobile ? 'mobile' : 'desktop'
    return (
      <svg
        className={'atlas-geometry atlas-geometry-' + view}
        viewBox={'0 0 ' + TOWN_VIEW[view].join(' ')}
        aria-hidden="true"
        focusable="false"
      >
        <g className="atlas-streets">
          {['context', 'main', 'lane'].map((tier) => (
            <g key={tier} data-road-tier={tier}>
              {TOWN_ROADS.filter((r) => roadTier(r.name) === tier).map((r) => (
                <polyline
                  key={r.id}
                  data-way-id={r.id}
                  data-road-name={r.name}
                  className={'atlas-road-' + tier}
                  points={r.points
                    .map((p) => townProject(p, mobile).join(','))
                    .join(' ')}
                />
              ))}
            </g>
          ))}
        </g>
        <g className="atlas-road-names">
          {TOWN_ROAD_LABELS.map((r) => {
            const [x, y] = townProject(r.coordinates, mobile)
            return (
              <text
                key={r.zh}
                x={x}
                y={y}
                transform={'rotate(' + r.angle + ' ' + x + ' ' + y + ')'}
              >
                {r[lang]}
              </text>
            )
          })}
        </g>
        {stops.map((stop) => {
          const [x, y] = townProject(stop.coordinates, mobile),
            label = TOWN_LABELS[stop.id],
            [lx, ly] = label[view]
          // Leaders end outside the label's text baseline, using the same rule.
          const endY = ly
          const endX = lx + (x < lx ? -1 : 1) * (mobile ? 85 : 50)
          return (
            <g
              key={stop.id}
              data-sight-id={stop.id}
              className={
                'atlas-anchor ' +
                (included.includes(stop.id) ? 'is-included' : '') +
                (selectedId === stop.id ? ' is-selected' : '')
              }
            >
              <path
                className="atlas-leader"
                d={'M' + x + ',' + y + ' L' + endX + ',' + endY}
              />
              <circle
                className="atlas-location"
                data-lon={stop.coordinates[0]}
                data-lat={stop.coordinates[1]}
                cx={x}
                cy={y}
                r={selectedId === stop.id ? 4.5 : 3}
              />
              {selectedId === stop.id && (
                <circle className="atlas-location-ring" cx={x} cy={y} r="10" />
              )}
              {label.drawing && (
                <g
                  className="atlas-building"
                  data-landmark={label.drawing}
                  transform={
                    'translate(' + lx + ',' + (ly - 32) + ') scale(.85)'
                  }
                >
                  <Drawing kind={label.drawing} />
                </g>
              )}
            </g>
          )
        })}
      </svg>
    )
  }
  return (
    <div
      className="atlas-canvas"
      role="group"
      aria-label={
        lang === 'zh'
          ? '鹿港散策圖：點選地名閱讀介紹'
          : 'Lukang town atlas: choose a place to read its story'
      }
    >
      {layer(false)}
      {layer(true)}
      <div className="atlas-north" aria-hidden="true">
        <span>↑ N</span>
        <strong>{lang === 'zh' ? '北鹿港' : 'NORTH'}</strong>
        <small>LUKANG / 鹿港</small>
      </div>
      <span className="atlas-south" aria-hidden="true">
        {lang === 'zh' ? '南鹿港' : 'SOUTH'} ↓
      </span>
      {stops.map((stop) => {
        const { desktop: d, mobile: m } = TOWN_LABELS[stop.id]
        return (
          <button
            key={stop.id}
            type="button"
            className={
              'atlas-map-stop ' +
              (included.includes(stop.id) ? 'is-included' : '')
            }
            style={{
              '--label-x': (d[0] / TOWN_VIEW.desktop[0]) * 100 + '%',
              '--label-y': (d[1] / TOWN_VIEW.desktop[1]) * 100 + '%',
              '--mobile-label-x': (m[0] / TOWN_VIEW.mobile[0]) * 100 + '%',
              '--mobile-label-y': (m[1] / TOWN_VIEW.mobile[1]) * 100 + '%',
            }}
            aria-label={stop[lang].name}
            aria-pressed={selectedId === stop.id}
            aria-controls="atlas-stop-detail"
            onClick={() => onSelect(stop.id)}
          >
            <span>{stop[lang].short}</span>
          </button>
        )
      })}
    </div>
  )
}
