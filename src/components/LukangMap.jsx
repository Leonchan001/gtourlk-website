import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ATLAS_STOPS } from '../data/atlas'
import { MORE_PLACES } from '../data/morePlaces'
import { TOWN_ROADS } from '../data/townAtlasRoads'
import { TOWN_VIEW, TOWN_LABELS, TOWN_ROAD_LABELS, roadTier, townProject } from '../data/townAtlas'
import './LukangMap.css'

const useMapLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

// Four individually drawn facades. These are illustrations, not footprints.
function Drawing({ kind }) {
  if (kind === 'tianhou') return <g>
    <path className="atlas-building-wash" d="M-52,-24 Q-36,-19 -22,-32 H22 Q36,-19 52,-24 L46,-15 H-46 Z M-37,-43 Q-23,-40 -18,-53 Q0,-47 18,-53 Q23,-40 37,-43 L32,-35 H-32 Z M-43,-13 H43 V17 H-43 Z" />
    <path d="M-52,-24 Q-36,-19 -22,-32 H22 Q36,-19 52,-24 L46,-15 H-46 Z M-37,-43 Q-23,-40 -18,-53 Q0,-47 18,-53 Q23,-40 37,-43 L32,-35 H-32 Z M-31,-35 V-30 M31,-35 V-30 M-46,-15 V17 M46,-15 V17 M-29,-14 V17 M29,-14 V17 M-13,-14 V17 M13,-14 V17 M-49,17 H49 M-53,21 H53 M-57,25 H57" />
    <path className="atlas-building-detail" d="M-47,-20 H47 M-31,-39 H31 M-21,-50 V-44 M-10,-48 V-42 M0,-47 V-41 M10,-48 V-42 M21,-50 V-44 M-42,-24 V-20 M-30,-27 V-20 M-17,-28 V-20 M-5,-28 V-20 M7,-28 V-20 M19,-28 V-20 M31,-26 V-20 M43,-24 V-20 M-24,-34 H24 M-23,-30 H23 M-39,-9 H-35 V11 H-39 Z M35,-9 H39 V11 H35 Z M-23,-9 H-19 V11 H-23 Z M19,-9 H23 V11 H19 Z M-9,-8 H9 V-2 H-9 Z M-8,2 V14 M0,2 V14 M8,2 V14 M-44,13 H-31 M31,13 H44" />
    <path d="M-37,-43 l-5,-6 6,2 M37,-43 l5,-6 -6,2 M-52,-24 l-5,-7 7,3 M52,-24 l5,-7 -7,3 M-18,-53 l-5,-7 M18,-53 l5,-7 M-3,-49 V-55 H3 V-49" />
  </g>
  if (kind === 'longshan') return <g>
    <path className="atlas-building-wash" d="M-51,-29 Q-42,-24 -34,-36 Q0,-28 34,-36 Q42,-24 51,-29 L46,-18 H-46 Z M-68,-16 Q-57,-10 -46,-18 V20 H46 V-18 Q57,-10 68,-16 L63,-9 V20 H-63 V-9 Z" />
    <path d="M-51,-29 Q-42,-24 -34,-36 Q0,-28 34,-36 Q42,-24 51,-29 L46,-18 H-46 Z M-68,-16 Q-57,-10 -46,-18 M46,-18 Q57,-10 68,-16 M-65,-10 H-47 M47,-10 H65 M-46,-17 V20 M46,-17 V20 M-27,-17 V20 M27,-17 V20 M-9,-17 V20 M9,-17 V20 M-63,-9 V20 H63 V-9 M-68,24 H68 M-71,28 H71" />
    <path className="atlas-building-detail" d="M-46,-24 H46 M-30,-32 V-25 M-18,-30 V-25 M-6,-29 V-25 M6,-29 V-25 M18,-30 V-25 M30,-32 V-25 M-42,-12 H-32 V14 H-42 Z M32,-12 H42 V14 H32 Z M-23,-12 H-13 V14 H-23 Z M13,-12 H23 V14 H13 Z M-5,-10 H5 V17 H-5 Z M-59,18 V0 Q-55,-9 -50,0 V18 M50,18 V0 Q55,-9 59,0 V18 M-37,-9 V10 M37,-9 V10 M-18,-9 V10 M18,-9 V10 M-7,-15 H7" />
    <path d="M-34,-36 l-5,-8 6,3 M34,-36 l5,-8 -6,3 M-51,-29 l-5,-6 M51,-29 l5,-6 M-68,-16 l-4,-5 M68,-16 l4,-5 M-4,-30 V-36 H4 V-30" />
  </g>
  if (kind === 'house') return <g>
    <path className="atlas-building-wash" d="M-57,19 V-28 H-35 V-14 H-20 V-36 Q0,-56 20,-36 V-14 H35 V-28 H57 V19 Z" />
    <path d="M-61,22 H61 M-65,26 H65 M-57,19 V-28 H-35 V19 M35,19 V-28 H57 V19 M-61,-28 Q-48,-53 -31,-28 M31,-28 Q48,-53 61,-28 M-59,-24 H-33 M33,-24 H59 M-35,-14 H-20 V-36 Q0,-56 20,-36 V-14 H35 M-23,-14 H23 M-20,-36 H20 M-23,-10 H23 M-18,19 V0 Q0,-20 18,0 V19 M-11,19 V1 Q0,-10 11,1 V19 M-33,19 H33" />
    <path className="atlas-building-detail" d="M-52,-16 H-41 V-2 H-52 Z M41,-16 H52 V-2 H41 Z M-52,5 H-41 V15 H-52 Z M41,5 H52 V15 H41 Z M-29,-6 H-24 V10 H-29 Z M24,-6 H29 V10 H24 Z M-10,-28 H10 V-18 H-10 Z M0,-28 V-18 M-47,-16 V-2 M47,-16 V-2 M-56,-31 H-37 M37,-31 H56 M-9,-40 Q0,-47 9,-40 M-57,-1 H-35 M35,-1 H57 M-5,0 V17 M5,0 V17" />
  </g>
  if (kind === 'arts') return <g>
    <path className="atlas-building-wash" d="M-63,-24 L-44,-43 H43 L64,-24 Z M-54,-20 H54 V23 H-54 Z" />
    <path d="M-63,-24 L-44,-43 H43 L64,-24 Z M-58,-20 H58 M-54,-20 V23 H54 V-20 M-60,27 H60 M-63,31 H63 M-37,23 V-13 H-13 V23 M-33,-9 H-17 V23 M-3,-13 H18 V8 H-3 Z M27,-13 H47 V8 H27 Z M-3,13 H18 M27,13 H47" />
    <path className="atlas-building-detail" d="M-46,-37 H46 M-53,-31 H53 M-40,-42 l-14,17 M-27,-42 l-9,17 M-14,-42 l-4,17 M0,-42 V-25 M14,-42 l4,17 M27,-42 l9,17 M40,-42 l14,17 M-25,-9 V22 M-33,1 H-17 M-33,12 H-17 M7,-13 V8 M-3,-2 H18 M37,-13 V8 M27,-2 H47 M-52,-10 H-41 M-52,-1 H-41 M-52,8 H-41 M-52,17 H-41 M-9,-18 V23 M23,-18 V23 M52,-18 V23" />
  </g>
  return <g>
    <path className="atlas-building-wash" d="M-62,24 V-28 L-28,-43 V8 L-6,25 Z M62,24 V-28 L28,-43 V8 L6,25 Z" />
    <path d="M-62,24 V-28 L-28,-43 V8 L-6,25 M62,24 V-28 L28,-43 V8 L6,25 M-66,27 H66 M-65,-29 L-27,-47 M65,-29 L27,-47 M-28,8 L-6,-1 L8,8 L28,1" />
    <path className="atlas-building-detail" d="M-57,-18 L-35,-28 V-6 L-57,3 Z M57,-18 L35,-28 V-6 L57,3 Z M-47,-22 V-1 M47,-22 V-1 M-57,-7 L-35,-17 M57,-7 L35,-17 M-62,11 L-28,-4 M62,11 L28,-4 M-7,25 L-15,18 L-3,11 L-4,5 M8,25 L0,18 L12,11" />
  </g>
}

export function LandmarkDrawing({ kind = 'lane', className = '', ...props }) {
  return <svg className={'atlas-landmark-drawing ' + className} viewBox="-80 -75 160 115" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}><Drawing kind={kind} /></svg>
}

function LaneMark() {
  return <svg viewBox="0 0 18 20" aria-hidden="true" focusable="false"><path d="M2,18 V4 L7,2 V16 M16,18 V4 L11,2 V16 M7,16 L10,12 L8,9 M1,18 H17" /></svg>
}

const realStops = ATLAS_STOPS.filter(stop => stop.coordinates)

// Connect to the actual rendered text chip, so a translated label never has a
// leader through its letters. The measured geometry is presentation-only.
function leaderEnd(x, y, box) {
  const cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2
  const dx = x - cx, dy = y - cy
  const ratio = Math.max(Math.abs(dx) / ((box.right - box.left) / 2), Math.abs(dy) / ((box.bottom - box.top) / 2))
  return ratio <= 1 ? null : [cx + dx / ratio, cy + dy / ratio]
}

export default function LukangMap({ lang, included, selectedId, onSelect }) {
  const canvas = useRef(null)
  const labels = useRef({})
  const [labelBoxes, setLabelBoxes] = useState({})
  const [extraLabelWidth, setExtraLabelWidth] = useState(180)
  const extra = MORE_PLACES.find(stop => stop.id === selectedId)
  const extraLayout = view => {
    if (!extra) return null
    // Wenwu's true point is near the lower-right corner. Keep its name inside
    // the same map and away from Longshan's caption. The central-west callout
    // space serves the closely grouped extension sights without hiding a name.
    if (extra.id === '文武廟') return view === 'mobile' ? [190, 574] : [170, 611]
    if (extra.id === '新祖宮') return view === 'mobile' ? [153, 211] : [97, 195]
    return view === 'mobile' ? [185, 382] : [125, 412]
  }

  useMapLayoutEffect(() => {
    const measure = () => {
      const rect = canvas.current?.getBoundingClientRect()
      if (!rect?.width || !rect.height) return
      const view = window.matchMedia('(min-width: 1024px)').matches ? 'desktop' : 'mobile'
      const [w, h] = TOWN_VIEW[view]
      if (extra && labels.current[extra.id]) {
        // Clamp the whole rendered caption, including its padding, instead of
        // assuming Chinese and English labels occupy the same SVG width.
        const width = labels.current[extra.id].parentElement.getBoundingClientRect().width
        setExtraLabelWidth(width)
      }
      const boxes = {}
      Object.entries(labels.current).forEach(([id, node]) => {
        if (!node) return
        const box = node.getBoundingClientRect()
        boxes[id] = { left: (box.left - rect.left) / rect.width * w - 4, right: (box.right - rect.left) / rect.width * w + 4, top: (box.top - rect.top) / rect.height * h - 3, bottom: (box.bottom - rect.top) / rect.height * h + 3 }
      })
      setLabelBoxes({ [view]: boxes })
    }
    measure()
    let mounted = true
    const breakpoint = window.matchMedia('(min-width: 1024px)')
    const observer = new ResizeObserver(measure)
    if (canvas.current) observer.observe(canvas.current)
    breakpoint.addEventListener('change', measure)
    document.fonts?.ready.then(() => { if (mounted) measure() })
    return () => { mounted = false; observer.disconnect(); breakpoint.removeEventListener('change', measure) }
  }, [lang, selectedId, extraLabelWidth])

  function leader(id, x, y, lx, ly, view) {
    const box = labelBoxes[view]?.[id] || { left: lx - 48, right: lx + 48, top: ly - 13, bottom: ly + 13 }
    const end = leaderEnd(x, y, box)
    return end ? <path className="atlas-leader" d={`M${x},${y} L${end[0]},${end[1]}`} /> : null
  }

  function layer(mobile) {
    const view = mobile ? 'mobile' : 'desktop'
    return <svg className={'atlas-geometry atlas-geometry-' + view} viewBox={'0 0 ' + TOWN_VIEW[view].join(' ')} aria-hidden="true" focusable="false">
      <g className="atlas-streets">
        {['context', 'main', 'lane'].map(tier => <g key={tier} data-road-tier={tier}>
          {TOWN_ROADS.filter(road => roadTier(road.name) === tier).map(road => <polyline key={road.id} data-way-id={road.id} data-road-name={road.name} className={'atlas-road-' + tier} points={road.points.map(point => townProject(point, mobile).join(',')).join(' ')} />)}
        </g>)}
      </g>
      <g className="atlas-road-names">{TOWN_ROAD_LABELS.map(road => {
        const [x, y] = townProject(road.coordinates, mobile)
        return <text key={road.zh} x={x} y={y} transform={`rotate(${road.angle} ${x} ${y})`}>{road[lang]}</text>
      })}</g>
      {realStops.map(stop => {
        const [x, y] = townProject(stop.coordinates, mobile)
        const label = TOWN_LABELS[stop.id], [lx, ly] = label[view]
        const building = label[view + 'Building'] || [lx, ly - (mobile ? 66 : 48)]
        return <g key={stop.id} data-sight-id={stop.id} onClick={() => onSelect(stop.id)} className={'atlas-anchor' + (included.includes(stop.id) ? ' is-included' : '') + (selectedId === stop.id ? ' is-selected' : '')}>
          {leader(stop.id, x, y, lx, ly, view)}
          <circle className="atlas-hit-area" cx={x} cy={y} r={mobile ? 42 : 24} />
          <circle className="atlas-location" data-lon={stop.coordinates[0]} data-lat={stop.coordinates[1]} cx={x} cy={y} r="4" />
          {selectedId === stop.id && <circle className="atlas-location-ring" cx={x} cy={y} r="12" />}
          {label.drawing && <g className="atlas-building" data-landmark={label.drawing} transform={`translate(${building[0]},${building[1]}) scale(${mobile ? 1.08 : .83})`}>
            <rect className="atlas-hit-area" x="-72" y="-63" width="144" height="94" />
            <Drawing kind={label.drawing} />
          </g>}
        </g>
      })}
      {extra && (() => {
        const [x, y] = townProject(extra.coordinates, mobile), [lx, ly] = extraLayout(view)
        return <g className="atlas-extra-selected" data-extra-place={extra.id}>
          {leader(extra.id, x, y, lx, ly, view)}
          <circle className="atlas-location-ring" cx={x} cy={y} r="13" />
          <circle className="atlas-location" data-lon={extra.coordinates[0]} data-lat={extra.coordinates[1]} cx={x} cy={y} r="4.5" />
        </g>
      })()}
    </svg>
  }

  const labelStyle = (d, m) => ({ '--label-x': d[0] / TOWN_VIEW.desktop[0] * 100 + '%', '--label-y': d[1] / TOWN_VIEW.desktop[1] * 100 + '%', '--mobile-label-x': m[0] / TOWN_VIEW.mobile[0] * 100 + '%', '--mobile-label-y': m[1] / TOWN_VIEW.mobile[1] * 100 + '%' })
  return <div ref={canvas} className="atlas-canvas" role="group" aria-label={lang === 'zh' ? '鹿港散策圖：點選地名閱讀介紹' : 'Lukang town atlas: choose a place to read its story'}>
    {layer(false)}{layer(true)}
    <div className="atlas-north" aria-hidden="true"><span className="atlas-compass">N<i /></span><strong>{lang === 'zh' ? '北鹿港' : 'NORTH'}</strong><small>LUKANG</small></div>
    <span className="atlas-south" aria-hidden="true">{lang === 'zh' ? '南鹿港' : 'SOUTH LUKANG'} <span>↓</span></span>
    {realStops.map(stop => {
      const label = TOWN_LABELS[stop.id]
      return <button key={stop.id} type="button" className={'atlas-map-stop' + (included.includes(stop.id) ? ' is-included' : '')} style={labelStyle(label.desktop, label.mobile)} aria-label={stop[lang].name} aria-pressed={selectedId === stop.id} aria-controls="atlas-stop-detail" onClick={() => onSelect(stop.id)}>
        <span ref={node => { labels.current[stop.id] = node }} className="atlas-label-chip">{!label.drawing && <LaneMark />}<span>{stop[lang].short}</span></span>
      </button>
    })}
    {extra && <span className="atlas-map-extra-label" style={{ ...labelStyle(extraLayout('desktop'), extraLayout('mobile')), '--extra-label-half-width': extraLabelWidth / 2 + 'px' }}><span ref={node => { labels.current[extra.id] = node }} className="atlas-label-chip">{extra[lang].short}</span></span>}
  </div>
}
