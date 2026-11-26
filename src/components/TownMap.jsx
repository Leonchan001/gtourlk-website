import { ATLAS_STOPS } from '../data/atlas'
import { BASEMAP_SIZE, MOBILE_VIEWBOX, METRES_PER_UNIT, MAP_POINTS, basemapSrc, projectToMap } from '../data/townBasemap'

// Where each name sits relative to its marker, chosen so labels clear the
// route and each other at both the desktop and the cropped phone view.
const LABEL_SIDE = {
  鹿港天后宮: 'left', 鹿港老街: 'right', 桂花巷藝術村: 'left', 辜家大宅: 'right',
  九曲巷: 'right', 摸乳巷: 'left', 鹿港龍山寺: 'right',
}
export const MAP_PLACES = ATLAS_STOPS.filter(place => place.coordinates)
export const mapPoint = place => projectToMap(MAP_POINTS[place.id] || place.coordinates)

function Layer({ view, lang, itinerary, selectedId, onSelect }) {
  const mobile = view === 'mobile'
  const [width, height] = BASEMAP_SIZE
  const viewBox = mobile ? MOBILE_VIEWBOX : [0, 0, width, height]
  const text = mobile ? 19 : 15
  const order = itinerary.order
  const metres200 = 200 / METRES_PER_UNIT
  return (
    <svg className={`town-map-layer is-${view}`} viewBox={viewBox.join(' ')} aria-hidden="true" focusable="false">
      <image href={basemapSrc(lang)} width={width} height={height} />
      <g className="town-map-route">
        {itinerary.legs.map(leg => <polyline key={leg.from + leg.to} points={leg.points.map(p => projectToMap(p).join(',')).join(' ')} />)}
      </g>
      {MAP_PLACES.map(place => {
        const [x, y] = mapPoint(place)
        const index = order.indexOf(place.id)
        const side = LABEL_SIDE[place.id] === 'left' ? -1 : 1
        const r = mobile ? 14 : 11.5
        const selected = selectedId === place.id
        return (
          <g key={place.id} className={`town-map-place ${index >= 0 ? 'is-stop' : 'is-other'}${selected ? ' is-selected' : ''}`} onClick={() => onSelect(place.id)}>
            <circle className="town-map-hit" cx={x} cy={y} r={r + 10} />
            {index >= 0 ? <>
              <circle className="town-map-marker" cx={x} cy={y} r={r} />
              <text className="town-map-number" x={x} y={y} dy=".36em" fontSize={r * 1.25}>{index + 1}</text>
            </> : <circle className="town-map-dot" cx={x} cy={y} r={mobile ? 6.5 : 5.5} />}
            <text className="town-map-name" x={x + side * (r + 5)} y={y} dy=".36em" textAnchor={side < 0 ? 'end' : 'start'} fontSize={index >= 0 ? text : text * 0.82}>{place[lang].short}</text>
          </g>
        )
      })}
      {!mobile && <>
        <g className="town-map-north" transform={`translate(${width - 34},40)`}><path d="M0,-18 L7,8 L0,3 L-7,8Z" /><text y="26" textAnchor="middle">N</text></g>
        <g className="town-map-scale" transform={`translate(24,${height - 26})`}><path d={`M0,0 V6 H${metres200} V0`} /><text x="0" y="-6">0</text><text x={metres200} y="-6" textAnchor="middle">200 m</text></g>
      </>}
    </svg>
  )
}

export default function TownMap(props) {
  const { lang } = props
  return (
    <div className="town-map" id="atlas-town-map" role="img" aria-label={lang === 'zh' ? '鹿港老街區步行路線地圖，依 OpenStreetMap 街道繪製' : 'Walking route map of old Lukang, drawn from OpenStreetMap streets'}>
      <Layer view="desktop" {...props} />
      <Layer view="mobile" {...props} />
      <a className="town-map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
    </div>
  )
}
