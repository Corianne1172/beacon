import { useEffect, useState, useCallback } from 'react'
import { FALLBACK_ALERT } from './data.js'
import {
  Login, FamilyView, Dashboard, AlertDetail, ClientList, ClientDetail,
  Chat, Dispatch, MapScreen, RouteScreen, Sos, Resources, Reports,
  SeniorCheckin, SeniorSymptoms,
} from './screens/index.jsx'

const SCREENS = [
  ['login', '0 Login'],
  ['family', '0b Family view'],
  ['dash', '1 Dashboard'],
  ['alert', '2 Alert'],
  ['list', '3 Clients'],
  ['client', '4 Client detail'],
  ['chat', '5 Messages'],
  ['dispatch', '6 Dispatch'],
  ['map', '7 Map'],
  ['route', '8 Reroute'],
  ['sos', '9 SOS timer'],
  ['resources', '10 Resources'],
  ['reports', '11 Reports'],
  ['senior', '12 Senior check-in'],
  ['symptoms', '13 Symptoms'],
]

export default function App() {
  const [screen, setScreen] = useState('login')
  const [toast, setToast] = useState(null)
  const [alert, setAlert] = useState(FALLBACK_ALERT)

  const go = useCallback((s) => setScreen(s), [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    window.clearTimeout(showToast._h)
    showToast._h = window.setTimeout(() => setToast(null), 2200)
  }, [])

  useEffect(() => {
    fetch('https://api.weather.gov/alerts/active?area=IL')
      .then((r) => r.json())
      .then((json) => {
        const feats = json?.features || []
        const relevant = feats.find((f) =>
          /heat|air quality|flood|storm|tornado|winter|cold|wind/i.test(f.properties?.event || ''),
        ) || feats[0]
        if (relevant) {
          const p = relevant.properties
          setAlert({
            event: p.event,
            headline: p.headline || p.description?.slice(0, 180) || '',
            declared: p.effective ? new Date(p.effective).toLocaleString() : '—',
            ends: p.ends ? new Date(p.ends).toLocaleString() : '—',
            live: true,
          })
        }
      })
      .catch(() => {})
  }, [])

  const props = { go, showToast, alert }

  return (
    <>
      <div className="proto-header">
        <h1>
          Beacon <span>●</span>
        </h1>
        <p>
          Climate wellbeing checks for home-care agencies. Use the pills to jump
          between screens, or click through the app itself.
          {alert.live && ' Alert banner is showing a LIVE National Weather Service alert for Illinois.'}
        </p>
      </div>

      <div className="screen-nav">
        {SCREENS.map(([id, label]) => (
          <button
            key={id}
            className={screen === id ? 'active' : ''}
            onClick={() => go(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="phone">
        <div className="statusbar">
          <span>9:41</span>
          <span className="mono" style={{ fontSize: 11 }}>BEACON</span>
          <span>◧ ⌁ ▮</span>
        </div>

        {screen === 'login' && <Login {...props} />}
        {screen === 'family' && <FamilyView {...props} />}
        {screen === 'dash' && <Dashboard {...props} />}
        {screen === 'alert' && <AlertDetail {...props} />}
        {screen === 'list' && <ClientList {...props} />}
        {screen === 'client' && <ClientDetail {...props} />}
        {screen === 'chat' && <Chat {...props} />}
        {screen === 'dispatch' && <Dispatch {...props} />}
        {screen === 'map' && <MapScreen {...props} />}
        {screen === 'route' && <RouteScreen {...props} />}
        {screen === 'sos' && <Sos {...props} />}
        {screen === 'resources' && <Resources {...props} />}
        {screen === 'reports' && <Reports {...props} />}
        {screen === 'senior' && <SeniorCheckin {...props} />}
        {screen === 'symptoms' && <SeniorSymptoms {...props} />}

        {toast && (
          <div className="toast">✓ <span>{toast}</span></div>
        )}
      </div>
    </>
  )
}
