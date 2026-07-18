import { useEffect, useState } from 'react'
import { CLIENTS, RESOURCES, REPORTS } from '../data.js'
import { LiveMap, LiveRoute } from '../LiveMap.jsx'

const WMO = {
  0: ['☀️', 'Clear'], 1: ['🌤', 'Mostly clear'], 2: ['⛅', 'Partly cloudy'], 3: ['☁️', 'Overcast'],
  45: ['🌫', 'Fog'], 48: ['🌫', 'Freezing fog'],
  51: ['🌦', 'Light drizzle'], 53: ['🌦', 'Drizzle'], 55: ['🌧', 'Heavy drizzle'],
  61: ['🌧', 'Light rain'], 63: ['🌧', 'Rain'], 65: ['🌧', 'Heavy rain'],
  66: ['🧊', 'Freezing rain'], 67: ['🧊', 'Freezing rain'],
  71: ['🌨', 'Light snow'], 73: ['🌨', 'Snow'], 75: ['❄️', 'Heavy snow'], 77: ['🌨', 'Snow grains'],
  80: ['🌦', 'Rain showers'], 81: ['🌧', 'Rain showers'], 82: ['⛈', 'Violent showers'],
  85: ['🌨', 'Snow showers'], 86: ['❄️', 'Snow showers'],
  95: ['⛈', 'Thunderstorm'], 96: ['⛈', 'Storm + hail'], 99: ['⛈', 'Storm + hail'],
}

function drivingNote(code, tempF, windMph) {
  if ([95, 96, 99].includes(code)) return ['red', 'Thunderstorm — delay travel if possible']
  if ([66, 67].includes(code)) return ['red', 'Freezing rain — icy roads likely']
  if ([65, 82].includes(code)) return ['red', 'Heavy rain — flooded viaducts possible']
  if ([71, 73, 75, 85, 86].includes(code)) return ['amber', 'Snow — allow extra travel time']
  if ([45, 48].includes(code)) return ['amber', 'Low visibility — fog on route']
  if (windMph >= 30) return ['amber', 'High winds — caution on overpasses']
  if (tempF >= 95) return ['amber', 'Extreme heat — keep water in vehicle']
  if ([61, 63, 80, 81, 51, 53, 55].includes(code)) return ['amber', 'Wet roads — slick pavement']
  return ['green', 'Roads clear — normal driving conditions']
}

export function useWeather() {
  const [wx, setWx] = useState(null)
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=41.8096&longitude=-87.6645&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph')
      .then((r) => r.json())
      .then((j) => { if (j?.current) setWx(j.current) })
      .catch(() => {})
  }, [])
  return wx
}

export function WeatherStrip() {
  const wx = useWeather()
  const code = wx?.weather_code ?? 0
  const temp = wx ? Math.round(wx.temperature_2m) : 98
  const feels = wx ? Math.round(wx.apparent_temperature) : 106
  const wind = wx ? Math.round(wx.wind_speed_10m) : 12
  const [emoji, label] = WMO[code] || ['🌡', 'Current conditions']
  const [tone, note] = drivingNote(code, feels, wind)
  return (
    <div className="card" style={{ marginTop: 8, marginBottom: 4, padding: '10px 14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 26 }}>{emoji}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {temp}°F · {label}
            {wx && <span className="live-tag">LIVE</span>}
          </div>
          <div style={{ fontSize: 11.5, color: 'var(--muted)' }}>Feels like {feels}° · wind {wind} mph</div>
        </div>
        <span className={`chip ${tone}`}>{tone === 'green' ? 'Clear' : tone === 'amber' ? 'Caution' : 'Hazard'}</span>
      </div>
      <div style={{ fontSize: 12, marginTop: 6, color: tone === 'green' ? 'var(--safe)' : tone === 'amber' ? 'var(--warn)' : 'var(--alert)', fontWeight: 600 }}>
        🚗 {note}
      </div>
    </div>
  )
}

const statusChip = { visit: ['red', 'Visit'], noreply: ['amber', 'No reply'], safe: ['green', 'Safe'] }
const avClass = { visit: 'risk', noreply: 'wait', safe: 'ok' }

function Tabbar({ go, cur }) {
  const tabs = [
    ['dash', '⌂', 'Home'],
    ['map', '◎', 'Map'],
    ['resources', '✚', 'Resources'],
    ['reports', '◱', 'Reports'],
  ]
  return (
    <div className="tabbar">
      {tabs.map(([id, ic, label]) => (
        <button key={id} className={cur === id ? 'cur' : ''} onClick={() => go(id)}>
          <span className="ic">{ic}</span>
          {label}
        </button>
      ))}
    </div>
  )
}

function ClientRow({ c, go, showAge }) {
  const [chip, chipLabel] = statusChip[c.status]
  return (
    <div className="row" onClick={() => go('client')}>
      <div className={`av ${avClass[c.status]}`}>{c.initials}</div>
      <div className="info">
        <div className="nm">{showAge ? `${c.name}, ${c.age}` : c.name}</div>
        <div className="dt">{c.detail}</div>
      </div>
      <span className={`chip ${chip}`}>{chipLabel}</span>
    </div>
  )
}

export function Login({ go }) {
  return (
    <div className="screen">
      <div className="bigq" style={{ paddingTop: 70 }}>
        <div style={{ width: 64, height: 64, borderRadius: 18, background: 'var(--alert)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 30, margin: '0 auto' }}>B</div>
        <h2 style={{ marginTop: 18 }}>Beacon</h2>
        <p>Wellbeing checks when the weather turns.<br />Who's signing in?</p>
      </div>
      <button className="hugebtn ink" onClick={() => go('dash')}>I'm a caregiver</button>
      <button className="hugebtn yes" onClick={() => go('senior')}>I'm checking in on myself</button>
      <button className="btn ghost" onClick={() => go('family')}>I'm a family member</button>
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--muted)', padding: '14px 30px', lineHeight: 1.6 }}>
        Caregivers sign in with their agency account. Seniors and family don't need an account — they get a secure link by text.
      </p>
    </div>
  )
}

export function FamilyView({ go, showToast }) {
  return (
    <div className="screen">
      <div className="appbar">
        <button className="back" onClick={() => go('login')}>‹ Sign out</button>
        <div>
          <div className="t" style={{ marginLeft: 6 }}>Your mom, Maria</div>
          <div className="sub" style={{ marginLeft: 6 }}>Viewing as Denise · daughter</div>
        </div>
      </div>
      <div className="banner">
        <div className="bt"><span className="pulse"></span> Heat advisory in her area</div>
        <div className="bs">Her care team is actively checking on her today</div>
      </div>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="av wait" style={{ width: 46, height: 46, fontSize: 15 }}>MR</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Responded at 11:15 AM</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Reported feeling thirsty · home not cooling</div>
        </div>
        <span className="chip amber">Watched</span>
      </div>
      <div className="sec">Today's timeline</div>
      <div className="list">
        <div className="report-item"><div className="rt">🕐 11:02 AM — Heat advisory declared</div><div className="rd">Maria's address is inside the affected area</div></div>
        <div className="report-item"><div className="rt">💬 11:05 AM — Check-in text sent</div><div className="rd">Automatic wellbeing check from her care team</div></div>
        <div className="report-item"><div className="rt">⚠️ 11:15 AM — Maria answered</div><div className="rd">Thirsty: yes · Dizzy: no · Home cooling: no</div></div>
        <div className="report-item"><div className="rt">🚗 11:20 AM — Visit scheduled</div><div className="rd">Caregiver Amara arriving ~12:30 PM with water</div></div>
      </div>
      <div className="sec">You can help</div>
      <button className="btn safe" onClick={() => showToast("Marked: you'll check on Maria — care team notified")}>I'll check on her myself</button>
      <button className="btn ghost" onClick={() => go('chat')}>View message thread</button>
      <button className="btn ghost" onClick={() => showToast('Calling Amara…')}>Call her caregiver</button>
    </div>
  )
}

export function Dashboard({ go, alert }) {
  const priority = CLIENTS.slice(0, 3)
  return (
    <div className="screen">
      <div className="appbar">
        <div className="logo">B</div>
        <div>
          <div className="t">Good morning, Amara</div>
          <div className="sub">South Side team · 14 clients</div>
        </div>
      </div>
      <div className="banner" onClick={() => go('alert')}>
        <div className="bt">
          <span className="pulse"></span> {alert.event} — active
          {alert.live && <span className="live-tag">LIVE NWS</span>}
        </div>
        <div className="bs">Declared {alert.declared} · tap for details</div>
      </div>
      <div className="stats">
        <div className="stat"><div className="n">14</div><div className="l">Assigned clients</div></div>
        <div className="stat"><div className="n green">9</div><div className="l">Checked in safe</div></div>
        <div className="stat"><div className="n red">5</div><div className="l">Need a visit</div></div>
      </div>
      <div className="sec">Priority — in affected area</div>
      <div className="list">
        {priority.map((c) => <ClientRow key={c.id} c={c} go={go} />)}
      </div>
      <button className="btn ghost" onClick={() => go('list')}>View all 14 clients →</button>
      <div className="spacer" />
      <Tabbar go={go} cur="dash" />
    </div>
  )
}

export function AlertDetail({ go, alert }) {
  return (
    <div className="screen">
      <div className="appbar"><button className="back" onClick={() => go('dash')}>‹ Back</button></div>
      <div className="pad">
        <span className="chip red">Severe · NWS alert{alert.live ? ' · live feed' : ''}</span>
        <h2 style={{ fontSize: 21, fontWeight: 700, marginTop: 10, letterSpacing: '-0.02em' }}>{alert.event}</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, lineHeight: 1.6 }}>{alert.headline}</p>
      </div>
      <div className="card">
        <div className="kv"><span className="k">Declared</span><span className="v">{alert.declared}</span></div>
        <div className="kv"><span className="k">Expected end</span><span className="v">{alert.ends}</span></div>
        <div className="kv"><span className="k">Your clients in zone</span><span className="v red">8 of 14</span></div>
        <div className="kv"><span className="k">Auto check-ins sent</span><span className="v">8 · 11:05 AM</span></div>
      </div>
      <div className="sec">Playbook for this hazard</div>
      <div className="card" style={{ marginTop: 0 }}>
        <div className="kv"><span className="k">Priority 1</span><span className="v">No AC + lives alone (3)</span></div>
        <div className="kv"><span className="k">Priority 2</span><span className="v">Cardiac / diabetic (4)</span></div>
        <div className="kv"><span className="k">Priority 3</span><span className="v">All others in zone (1)</span></div>
      </div>
      <button className="btn primary" onClick={() => go('list')}>See affected clients</button>
    </div>
  )
}

export function ClientList({ go }) {
  const [filter, setFilter] = useState('all')
  const shown = CLIENTS.filter((c) => {
    if (filter === 'zone') return c.inZone
    if (filter === 'noreply') return c.status === 'noreply'
    if (filter === 'safe') return c.status === 'safe'
    return true
  })
  return (
    <div className="screen">
      <div className="appbar">
        <button className="back" onClick={() => go('dash')}>‹ Home</button>
        <div className="t" style={{ marginLeft: 6 }}>All clients</div>
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '6px 18px 2px', flexWrap: 'wrap' }}>
        <span className="chip red click" onClick={() => setFilter('zone')}>In zone · 8</span>
        <span className="chip amber click" onClick={() => setFilter('noreply')}>No reply · 3</span>
        <span className="chip green click" onClick={() => setFilter('safe')}>Safe · 9</span>
        <span className="chip blue click" onClick={() => setFilter('all')}>All · 14</span>
      </div>
      <div className="sec">Sorted by risk</div>
      <div className="list">
        {shown.map((c) => <ClientRow key={c.id} c={c} go={go} showAge />)}
      </div>
    </div>
  )
}

export function ClientDetail({ go }) {
  const c = CLIENTS[0]
  return (
    <div className="screen">
      <div className="appbar"><button className="back" onClick={() => go('list')}>‹ Clients</button></div>
      <div className="pad" style={{ display: 'flex', gap: 12, alignItems: 'center', paddingBottom: 4 }}>
        <div className="av risk" style={{ width: 50, height: 50, fontSize: 16 }}>{c.initials}</div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{c.name}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{c.age} · {c.address}</div>
        </div>
        <span className="chip red" style={{ marginLeft: 'auto' }}>In affected area</span>
      </div>
      <div className="sec">Health & risk profile</div>
      <div className="card" style={{ marginTop: 0 }}>
        <div className="tags">{c.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      </div>
      <div className="sec">Self-reported check · 11:15 AM</div>
      <div className="card" style={{ marginTop: 0 }}>
        {c.symptoms.map((s) => (
          <div key={s.q} className="kv">
            <span className="k">{s.q}</span>
            <span className={`v ${s.bad ? 'red' : 'green'}`}>{s.a}</span>
          </div>
        ))}
      </div>
      <div className="sec">Check-in history</div>
      <div className="card" style={{ marginTop: 0 }}>
        {c.history.map((h) => (
          <div key={h.when} className="kv"><span className="k">{h.when}</span><span className="v">{h.what}</span></div>
        ))}
      </div>
      <button className="btn ghost" onClick={() => go('chat')}>💬 Message Mrs. Rodriguez</button>
      <button className="btn danger" onClick={() => go('dispatch')}>Dispatch in-person visit</button>
    </div>
  )
}

export function Chat({ go, showToast }) {
  return (
    <div className="screen">
      <div className="appbar">
        <button className="back" onClick={() => go('client')}>‹ Profile</button>
        <div>
          <div className="t" style={{ marginLeft: 6 }}>Mrs. Rodriguez</div>
          <div className="sub" style={{ marginLeft: 6 }}>Delivered by SMS · auto-translated to Spanish</div>
        </div>
      </div>
      <div className="chat-scroll">
        <div className="chat-pill">Heat advisory declared · 11:02 AM</div>
        <div className="msg them">Buenos días Maria ☀️ It's going to be very hot today. Are you doing okay? Tap the link to answer 3 quick questions.</div>
        <div className="msg-meta left">Beacon auto check-in · 11:05 AM</div>
        <div className="msg me" style={{ background: 'var(--warn-bg)', border: '1px solid #ecd9a8' }}>✓ Answered: thirsty — yes · dizzy — no · home cooling — no</div>
        <div className="msg-meta right">Maria's reply · 11:15 AM</div>
        <div className="msg them" style={{ background: 'var(--accent-bg)', border: '1px solid #c4d6e8' }}>Hi Maria, it's Amara. I saw your answers — I'm coming by around 12:30 with cold water. Is that alright?</div>
        <div className="msg-meta left">Amara (you) · 11:20 AM</div>
        <div className="msg me" style={{ background: 'var(--safe-bg)', border: '1px solid #bcdccf' }}>Si, gracias Amara ❤️</div>
        <div className="msg-meta right">11:24 AM · daughter Denise can see this thread</div>
      </div>
      <div className="chat-input">
        <input type="text" placeholder="Message Maria…" />
        <button className="btn primary" onClick={() => showToast('Sent by SMS ✓')}>Send</button>
      </div>
    </div>
  )
}

export function Dispatch({ go, showToast }) {
  return (
    <div className="screen">
      <div className="appbar">
        <button className="back" onClick={() => go('client')}>‹ Profile</button>
        <div className="t" style={{ marginLeft: 6 }}>Dispatch visit</div>
      </div>
      <div className="card">
        <div className="kv"><span className="k">Client</span><span className="v">Mrs. Rodriguez</span></div>
        <div className="kv"><span className="k">Assigned to</span><span className="v">You (Amara)</span></div>
        <div className="kv"><span className="k">Reason</span><span className="v red">Heat · 2 symptom flags</span></div>
        <div className="kv"><span className="k">ETA with reroute</span><span className="v">18 min</span></div>
      </div>
      <div className="sec">On arrival, log outcome</div>
      <button className="btn safe" onClick={() => { showToast('Logged: confirmed safe ✓'); setTimeout(() => go('dash'), 1200) }}>✓ Confirmed safe</button>
      <button className="btn ghost" onClick={() => showToast('Logged: needs assistance — supervisor notified')}>Needs assistance</button>
      <button className="btn ghost" onClick={() => showToast('Escalated: no answer — emergency contact called')}>No answer — escalate</button>
      <button className="btn primary" onClick={() => go('route')}>View route →</button>
    </div>
  )
}

export function MapScreen({ go }) {
  return (
    <div className="screen">
      <div className="appbar">
        <div className="t">Team map</div>
        <span className="chip red" style={{ marginLeft: 'auto' }}>Heat zone active</span>
      </div>
      <WeatherStrip />
      <div className="legend">
        <span><span className="dot" style={{ background: 'var(--safe)' }}></span>Safe</span>
        <span><span className="dot" style={{ background: 'var(--warn)' }}></span>No reply</span>
        <span><span className="dot" style={{ background: 'var(--alert)' }}></span>Needs visit</span>
      </div>
      <div className="mapbox">
        <LiveMap go={go} height={280} />
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', padding: '6px 20px', lineHeight: 1.5 }}>
        Live OpenStreetMap. Tap a red or amber pin to open that client. Blue pin = nearest cooling center. Shaded circle = highest heat index zone.
      </p>
      <button className="btn primary" onClick={() => go('route')}>Route to Mrs. Rodriguez</button>
      <div className="spacer" />
      <Tabbar go={go} cur="map" />
    </div>
  )
}

export function RouteScreen({ go }) {
  return (
    <div className="screen">
      <div className="appbar">
        <button className="back" onClick={() => go('map')}>‹ Map</button>
        <div className="t" style={{ marginLeft: 6 }}>Route</div>
        <span className="chip blue" style={{ marginLeft: 'auto' }}>Rerouted</span>
      </div>
      <WeatherStrip />
      <div className="mapbox">
        <LiveRoute height={250} />
      </div>
      <div className="card">
        <div className="kv"><span className="k">Route engine</span><span className="v">OSRM · live driving route</span></div>
        <div className="kv"><span className="k">Original route</span><span className="v strike">12 min</span></div>
        <div className="kv"><span className="k">Rerouted via S Racine</span><span className="v">18 min</span></div>
        <div className="kv"><span className="k">Avoiding</span><span className="v red">Buckled road, W 43rd St</span></div>
      </div>
      <button className="btn primary" onClick={() => go('sos')}>Start visit · begin safety timer</button>
    </div>
  )
}

const SOS_TOTAL = 900

export function Sos({ go, showToast }) {
  const [secs, setSecs] = useState(SOS_TOTAL)

  useEffect(() => {
    const id = setInterval(() => {
      setSecs((s) => {
        if (s <= 1) {
          clearInterval(id)
          showToast('No check-in — location broadcast to dispatcher')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [showToast])

  const m = String(Math.floor(secs / 60)).padStart(2, '0')
  const s = String(secs % 60).padStart(2, '0')
  const dashOffset = 515 * (1 - secs / SOS_TOTAL)

  return (
    <div className="screen">
      <div className="appbar">
        <button className="back" onClick={() => go('route')}>‹ Route</button>
        <div className="t" style={{ marginLeft: 6 }}>Visit in progress</div>
      </div>
      <div className="timer">
        <svg viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="82" fill="none" stroke="#e3dfd5" strokeWidth="8" />
          <circle cx="90" cy="90" r="82" fill="none" stroke="#c94f2e" strokeWidth="8" strokeLinecap="round" strokeDasharray="515" strokeDashoffset={dashOffset} />
        </svg>
        <div className="tm">{m}:{s}</div>
        <div className="tl">until auto-broadcast</div>
      </div>
      <p className="sos-note">
        You're visiting <b>Mrs. Rodriguez</b> during an active heat advisory. If you
        don't check in before the timer ends, your last location is sent to your
        dispatcher and emergency contact.
      </p>
      <button className="btn safe" onClick={() => { setSecs(SOS_TOTAL); showToast('Checked in — timer reset ✓') }}>I'm safe — reset timer</button>
      <button className="btn danger" onClick={() => showToast('SOS sent — dispatcher has your live location')}>Send SOS now</button>
      <div className="card">
        <div className="kv"><span className="k">Dispatcher</span><span className="v">South Side desk · on duty</span></div>
        <div className="kv"><span className="k">Your location shared</span><span className="v green">Live · GPS</span></div>
        <div className="kv"><span className="k">Emergency contact</span><span className="v">Denise (sister)</span></div>
      </div>
    </div>
  )
}

export function Resources({ go }) {
  return (
    <div className="screen">
      <div className="appbar">
        <div className="t">Resources near you</div>
        <span className="chip red" style={{ marginLeft: 'auto' }}>Heat</span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--muted)', padding: '2px 18px' }}>
        Filtered for the active hazard. Changes automatically per event type.
      </p>
      <div className="sec">Cooling centers</div>
      <div className="list">
        {RESOURCES.cooling.map((r) => (
          <div className="row" key={r.name}>
            <div className="av ok" style={{ borderRadius: 10 }}>{r.icon}</div>
            <div className="info"><div className="nm">{r.name}</div><div className="dt">{r.detail}</div></div>
            <span className="chip blue">{r.chip}</span>
          </div>
        ))}
      </div>
      <div className="sec">Water & supplies</div>
      <div className="list">
        {RESOURCES.supplies.map((r) => (
          <div className="row" key={r.name}>
            <div className="av wait" style={{ borderRadius: 10 }}>{r.icon}</div>
            <div className="info"><div className="nm">{r.name}</div><div className="dt">{r.detail}</div></div>
            <span className="chip blue">{r.chip}</span>
          </div>
        ))}
      </div>
      <div className="spacer" />
      <Tabbar go={go} cur="resources" />
    </div>
  )
}

export function Reports({ go, showToast }) {
  return (
    <div className="screen">
      <div className="appbar">
        <div className="t">Community reports</div>
        <span className="chip amber" style={{ marginLeft: 'auto' }}>3 nearby</span>
      </div>
      <div className="list" style={{ marginTop: 8 }}>
        {REPORTS.map((r) => (
          <div className="report-item" key={r.title}>
            <div className="rt">{r.icon} {r.title}</div>
            <div className="rd">{r.detail}</div>
          </div>
        ))}
      </div>
      <div className="sec">Submit a report</div>
      <div className="card" style={{ marginTop: 0 }}>
        <label className="field-l">What are you seeing?</label>
        <select>
          <option>Power outage</option>
          <option>Flooded street</option>
          <option>Road closed / damaged</option>
          <option>Person in distress</option>
          <option>Other</option>
        </select>
        <label className="field-l">Location</label>
        <input type="text" placeholder="Use my location" defaultValue="4210 S Ashland Ave" />
      </div>
      <button className="btn primary" onClick={() => showToast('Report submitted — visible to your team')}>Submit report</button>
      <div className="spacer" />
      <Tabbar go={go} cur="reports" />
    </div>
  )
}

export function SeniorCheckin({ go, showToast }) {
  return (
    <div className="screen">
      <div className="bigq">
        <div className="emoji">☀️</div>
        <h2>It's very hot today, Maria</h2>
        <p>Your care team is checking on you.<br />Are you doing okay?</p>
      </div>
      <button className="hugebtn yes" onClick={() => go('symptoms')}>I'm okay 👍</button>
      <button className="hugebtn help" onClick={() => showToast('Help is on the way — Amara has been notified')}>I need help</button>
      <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--muted)', padding: '8px 30px' }}>
        Or call your caregiver Amara: <b>(312) 555-0182</b>
      </p>
    </div>
  )
}

const QUESTIONS = ['Are you feeling thirsty?', 'Do you feel dizzy?', 'Is your home cooling down?']

export function SeniorSymptoms({ go, showToast }) {
  const [answers, setAnswers] = useState({})
  return (
    <div className="screen">
      <div className="bigq" style={{ paddingBottom: 8 }}>
        <h2>Three quick questions</h2>
        <p>Tap yes or no for each one.</p>
      </div>
      {QUESTIONS.map((q) => (
        <div className="qrow" key={q}>
          <span className="q">{q}</span>
          <span className="yn">
            <button className={answers[q] === 'Y' ? 'selY' : ''} onClick={() => setAnswers((a) => ({ ...a, [q]: 'Y' }))}>Yes</button>
            <button className={answers[q] === 'N' ? 'selN' : ''} onClick={() => setAnswers((a) => ({ ...a, [q]: 'N' }))}>No</button>
          </span>
        </div>
      ))}
      <button
        className="hugebtn yes"
        style={{ fontSize: 17, padding: 18 }}
        onClick={() => { showToast('Thank you Maria — your answers were sent to Amara'); setTimeout(() => go('senior'), 1500) }}
      >
        Done ✓
      </button>
    </div>
  )
}
