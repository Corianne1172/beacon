import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { CLIENTS, CAREGIVER_POS, COOLING_CENTER, HEAT_ZONE } from './data.js'

const STATUS_COLOR = { visit: '#c94f2e', noreply: '#b07c10', safe: '#1d7a5f' }

export function LiveMap({ go, height = 300 }) {
  const ref = useRef(null)

  useEffect(() => {
    const map = L.map(ref.current, { zoomControl: false, attributionControl: true })
      .setView([HEAT_ZONE.lat, HEAT_ZONE.lng], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    L.circle([HEAT_ZONE.lat, HEAT_ZONE.lng], {
      radius: HEAT_ZONE.radius,
      color: '#c94f2e',
      weight: 1,
      fillColor: '#c94f2e',
      fillOpacity: 0.12,
    }).addTo(map).bindTooltip('Highest heat index', { permanent: false })

    CLIENTS.forEach((c) => {
      const m = L.circleMarker([c.lat, c.lng], {
        radius: 9,
        color: '#ffffff',
        weight: 2.5,
        fillColor: STATUS_COLOR[c.status],
        fillOpacity: 1,
      }).addTo(map)
      m.bindTooltip(`${c.name} — ${c.detail}`)
      if (c.status !== 'safe' && go) m.on('click', () => go('client'))
    })

    L.circleMarker([COOLING_CENTER.lat, COOLING_CENTER.lng], {
      radius: 8,
      color: '#ffffff',
      weight: 2.5,
      fillColor: '#2b5d8f',
      fillOpacity: 1,
    }).addTo(map).bindTooltip(`❄ ${COOLING_CENTER.name} (cooling center)`)

    return () => map.remove()
  }, [go])

  return <div ref={ref} style={{ height, width: '100%' }} />
}

export function LiveRoute({ height = 260 }) {
  const ref = useRef(null)

  useEffect(() => {
    const from = CAREGIVER_POS
    const to = CLIENTS[0]

    const map = L.map(ref.current, { zoomControl: false })
      .setView([(from.lat + to.lat) / 2, (from.lng + to.lng) / 2], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(map)

    L.circle([41.8125, -87.6635], {
      radius: 220,
      color: '#c94f2e',
      weight: 1,
      fillColor: '#c94f2e',
      fillOpacity: 0.18,
    }).addTo(map).bindTooltip('Road closed — buckled pavement')

    L.circleMarker([from.lat, from.lng], { radius: 8, color: '#fff', weight: 2.5, fillColor: '#2b5d8f', fillOpacity: 1 })
      .addTo(map).bindTooltip('You')
    L.circleMarker([to.lat, to.lng], { radius: 8, color: '#fff', weight: 2.5, fillColor: '#c94f2e', fillOpacity: 1 })
      .addTo(map).bindTooltip('Mrs. Rodriguez')

    const fallback = () => {
      L.polyline([[from.lat, from.lng], [to.lat, to.lng]], {
        color: '#2b5d8f', weight: 4, dashArray: '2 10',
      }).addTo(map)
    }

    fetch(`https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`)
      .then((r) => r.json())
      .then((j) => {
        const coords = j?.routes?.[0]?.geometry?.coordinates
        if (!coords) return fallback()
        const latlngs = coords.map(([lng, lat]) => [lat, lng])
        const line = L.polyline(latlngs, { color: '#2b5d8f', weight: 5, opacity: 0.9 }).addTo(map)
        map.fitBounds(line.getBounds(), { padding: [24, 24] })
      })
      .catch(fallback)

    return () => map.remove()
  }, [])

  return <div ref={ref} style={{ height, width: '100%' }} />
}
