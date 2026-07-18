export const CLIENTS = [
  {
    id: 'mr',
    initials: 'MR',
    name: 'Mrs. Rodriguez',
    age: 78,
    address: '4210 S Ashland Ave',
    status: 'visit',
    detail: 'No AC · lives alone · reported thirsty',
    inZone: true,
    tags: ['No air conditioning', 'Lives alone', 'Hypertension', 'Type 2 diabetes', 'Speaks Spanish'],
    symptoms: [
      { q: 'Feeling thirsty?', a: 'Yes', bad: true },
      { q: 'Dizzy or lightheaded?', a: 'No', bad: false },
      { q: 'Home cooling down?', a: 'No', bad: true },
      { q: 'Drinking water today?', a: 'Yes', bad: false },
    ],
    history: [
      { when: '11:15 AM today', what: 'Self-report · 2 flags' },
      { when: 'June heat event', what: 'Visited · safe' },
    ],
  },
  { id: 'dw', initials: 'DW', name: 'Dorothy W.', age: 84, address: '5017 S Damen Ave', status: 'visit', detail: 'In zone · cardiac condition', inZone: true, tags: ['Cardiac condition', 'Lives with spouse'], symptoms: [], history: [] },
  { id: 'jk', initials: 'JK', name: 'James K.', age: 71, address: '4633 S Wood St', status: 'noreply', detail: 'In zone · 2 texts unanswered', inZone: true, tags: ['Mobility limited'], symptoms: [], history: [] },
  { id: 'hp', initials: 'HP', name: 'Harold P.', age: 69, address: '4390 S Honore St', status: 'noreply', detail: 'In zone · 1 text unanswered', inZone: true, tags: ['COPD'], symptoms: [], history: [] },
  { id: 'at', initials: 'AT', name: 'Alice T.', age: 75, address: '5122 S Paulina St', status: 'safe', detail: 'Safe · 11:42 AM', inZone: false, tags: ['Lives alone'], symptoms: [], history: [] },
  { id: 'gb', initials: 'GB', name: 'Gloria B.', age: 80, address: '4820 S Hermitage Ave', status: 'safe', detail: 'Safe · daughter confirmed', inZone: false, tags: [], symptoms: [], history: [] },
]

export const RESOURCES = {
  cooling: [
    { icon: '❄', name: 'King Community Center', detail: '0.4 mi · open until 9 PM · wheelchair access', chip: 'Open' },
    { icon: '❄', name: 'Sherman Park Library', detail: '0.9 mi · open until 8 PM', chip: 'Open' },
  ],
  supplies: [
    { icon: '⛲', name: 'Hydration station — Davis Square', detail: '0.6 mi · free bottled water', chip: 'Open' },
    { icon: '✚', name: 'Walgreens — electrolytes, fans', detail: '0.7 mi · open 24h', chip: '24h' },
  ],
}

export const REPORTS = [
  { icon: '🌡', title: 'No power, no AC — 4300 block S Marshfield', detail: '2 residents reporting · 24 min ago · verified by ComEd outage map' },
  { icon: '🚧', title: 'Buckled pavement — W 43rd St', detail: 'Feeds rerouting · 1 hr ago · 5 confirmations' },
  { icon: '⛲', title: 'Hydrant open, kids cooling off — Davis Sq', detail: 'Informational · 2 hr ago' },
]

export const FALLBACK_ALERT = {
  event: 'Extreme heat advisory',
  headline: 'Heat index up to 108°F through Friday 8 PM. Cook County, including Back of the Yards, New City, and Englewood service zones.',
  declared: 'Today, 11:02 AM',
  ends: 'Fri, 8:00 PM',
  live: false,
}
