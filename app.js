(function () {
  'use strict';
  const DAYS = ['2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20'];
  const CATS = { sight: '🏛️ Sight', food: '🍽️ Food', tour: '🚌 Tour', transit: '🚕 Transit', hotel: '🏨 Hotel', other: '📌 Other' };
  const COLORS = ['#c8102e', '#1d4ed8', '#047857', '#b45309', '#7c3aed', '#be185d', '#0e7490', '#4d7c0f', '#6b21a8', '#c8102e'];
  const NAMES = ['Vrad', 'Krysia', 'Walter', 'Dorota', 'Tara', 'Urszula', 'Ania', 'Marian', 'Danuta', 'Ala'];
  const HOTEL = { name: 'Hotel Saint Laurent', note: 'Drop off bags on arrival if rooms are not ready.' };

  let uid = 0;
  const id = () => 'i' + Date.now().toString(36) + (uid++);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function defaults() {
    const travelers = NAMES.map((n, i) => ({ id: n.toLowerCase(), name: n, color: COLORS[i] }));
    const flights = [];
    const AC = ['vrad', 'krysia', 'walter'];
    const group1 = ['ala', 'marian', 'danuta', 'dorota'];
    const group2 = ['ania', 'urszula'];
    travelers.forEach(t => {
      const vrad = t.id === 'vrad', krysia = t.id === 'krysia', ania = t.id === 'ania', urszula = t.id === 'urszula', tara = t.id === 'tara';
      const walter = t.id === 'walter', grp = group1.includes(t.id), ac = AC.includes(t.id);
      const arr = walter ? '11:56' : grp ? '14:35' : vrad || krysia ? '11:02' : ania || urszula ? '17:07' : '';
      const dep = walter ? '19:15' : grp ? '19:00' : vrad || krysia ? '09:35' : ania || urszula ? '19:20' : '';
      const air = ac || walter ? 'Air Canada' : '';
      flights.push({
        id: id(), traveler: t.id, type: 'arrival', date: DAYS[0],
        time: arr, airline: air, flightNo: '',
        from: vrad || krysia ? 'Orlando (MCO) 8:00am' : grp || ania || urszula || walter ? 'Winnipeg (YWG)' : tara ? 'Vancouver' : '', to: 'Montreal (YUL)'
      });
      flights.push({
        id: id(), traveler: t.id, type: 'departure', date: DAYS[5],
        time: dep, airline: air, flightNo: '',
        from: 'Montreal (YUL)', to: vrad || krysia ? 'Orlando (MCO) – arrives 12:47pm' : grp || walter ? 'Winnipeg (YWG)' : group2.includes(t.id) ? 'Winnipeg (YWG) - arrives 12:55 am' : tara ? 'Vancouver' : ''
      });
    });
    const A = (day, start, end, title, location, category, notes, who, suggestion) =>
      ({ id: id(), day, start, end, title, location, category, notes, travelers: who || [], suggestion: !!suggestion });
    const activities = [
      A(DAYS[0], '12:45', '', 'Drop off bags at Hotel Saint Laurent', '355 Rue Sainte-Catherine O, Montréal', 'hotel', 'Early arrivals can leave luggage with the front desk.', ['vrad', 'krysia']),
      A(DAYS[0], '12:45', '', 'Drop off bags at Hotel Saint Laurent', '355 Rue Sainte-Catherine O, Montréal', 'hotel', 'Early arrivals can leave luggage with the front desk.', ['walter']),
      A(DAYS[0], '13:00', '14:00', 'Lunch', 'TBD', 'food', 'TBD', ['vrad', 'krysia', 'walter']),
      A(DAYS[0], '14:00', '16:00', 'Stroll Old Montréal & Notre-Dame Basilica', 'Old Montréal', 'sight', 'Suggestion – cobblestone streets and Place Jacques-Cartier.', ['vrad', 'krysia','walter']),
      A(DAYS[0], '15:00', '', 'Drop off bags at Hotel Saint Laurent', '355 Rue Sainte-Catherine O, Montréal', 'hotel', 'Just in time to check in', ['dorota', 'danuta', 'marian', 'ala']),
      A(DAYS[0], '17:00', '', 'Drop off bags at Hotel Saint Laurent', '355 Rue Sainte-Catherine O, Montréal', 'hotel', 'Just in time to check in', ['tara']),
      A(DAYS[0], '18:00', '', 'Drop off bags at Hotel Saint Laurent', '355 Rue Sainte-Catherine O, Montréal', 'hotel', 'Early arrivals can leave luggage with the front desk.', ['ania', 'urszula']),
      A(DAYS[0], '18:30', '', 'Welcome dinner', 'Old Montréal', 'food', 'Suggestion – try a poutine or bistro near the hotel.', [], true),
      A(DAYS[1], '09:30', '12:00', 'Mount Royal hike & lookout', 'Parc du Mont-Royal', 'sight', 'Suggestion – panoramic city views and fall colours.', [], true),
      A(DAYS[1], '12:30', '14:00', 'Smoked meat lunch at Schwartz\'s', 'Boulevard Saint-Laurent', 'food', 'Suggestion – expect a line.', [], true),
      A(DAYS[1], '15:00', '17:00', 'Montréal Museum of Fine Arts', 'Rue Sherbrooke O', 'sight', 'Suggestion.', [], true),
      A(DAYS[2], '06:00', '23:59', 'Dorota\'s Birthday', 'Celebrate 40th BDay', 'celebrate', 'Need to find some cake', [], true),
      A(DAYS[2], '9:00', '12:00', 'Mont Royale', 'Celebrate 150th', 'sight', 'Dorota suggested', [], true),
      A(DAYS[2], '13:30', '16:00', 'Plateau-Mont-Royal & Mile End walk', 'Plateau', 'sight', 'Suggestion – murals and boutiques.', ['vrad', 'krysia', 'walter','dorota', 'ania', 'urszula', 'danuta', 'marian', 'ala']),
      A(DAYS[3], '07:00', '20:00', 'Montréal to Québec City bus tour', 'Departure point TBD', 'tour', 'Full-day tour, back around 8:00pm.', [], true),
      A(DAYS[4], '08:00', '', 'Tara Leaving for airport', 'Hotel Saint Laurent → YUL', 'transit', 'Nobody knows when the flight departs, not even the airline.', ['tara']),
      A(DAYS[4], '09:00', '12:00', 'Jean-Talon Market & Little Italy', 'Jean-Talon Market', 'food', 'Suggestion – fall produce and bakeries.', ['vrad', 'krysia', 'walter', 'dorota', 'ania', 'urszula', 'danuta', 'marian', 'ala']),
      A(DAYS[4], '14:00', '17:00', 'Underground City & shopping', 'Downtown', 'sight', 'Suggestion – good if the weather is cold.', ['vrad', 'krysia', 'walter', 'dorota', 'ania', 'urszula', 'danuta', 'marian', 'ala']),
      A(DAYS[4], '20:30', '', 'Farewell dinner', 'TBD', 'food', 'Suggestion – pick a favourite.', ['vrad', 'krysia', 'walter', 'dorota', 'ania', 'urszula', 'danuta', 'marian', 'ala']),
      A(DAYS[5], '06:45', '', 'Leave for the airport', 'Hotel Saint Laurent → YUL', 'transit', 'Vrad and Krysia\'s flight departs 9:35am. Adjust for other travelers.', ['vrad', 'krysia']),
      A(DAYS[5], '16:00', '', 'Winnipeg group leaves for the airport', 'Hotel Saint Laurent → YUL', 'transit', 'Winnipeg flight departs 9:35am. Adjust for other travelers.', ['dorota', 'ania', 'urszula', 'danuta', 'marian', 'ala']),
      A(DAYS[5], '16:00', '', 'Walter leaves for the airport', 'Hotel Saint Laurent → YUL', 'transit', 'Winnipeg flight departs 9:14pm. Adjust for other travelers.', ['walter']),
    ];
    return { travelers, flights, activities, hotel: HOTEL };
  }

  const state = defaults();
  let day = 0, overview = true, filter = null;
  const T = tid => state.travelers.find(t => t.id === tid) || { name: '?', color: '#888' };
  const $ = s => document.querySelector(s);

  const fmtDay = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtTime = t => { if (!t || t === 'TBD') return 'TBD'; const [h, m] = t.split(':').map(Number); return ((h + 11) % 12 + 1) + ':' + String(m).padStart(2, '0') + (h < 12 ? 'am' : 'pm'); };
  const visible = ids => !filter || !ids.length || ids.includes(filter);
  const tagsFor = ids => (ids.length ? ids : state.travelers.map(t => t.id)).filter(i => !filter || i === filter).map(i => `<span class="tag" style="--c:${T(i).color}">${esc(T(i).name)}</span>`).join('');

  function renderTabs() {
    $('#tabs').innerHTML = `<button class="tab" role="tab" aria-selected="${overview}" data-tab="o">Overview<small>Flights &amp; hotel</small></button>` +
      DAYS.map((d, i) => `<button class="tab" role="tab" aria-selected="${!overview && day === i}" data-tab="${i}">${fmtDay(d).split(',')[0]}<small>${fmtDay(d).split(', ')[1]}</small></button>`).join('');
    $('#filter').innerHTML = `<button class="chip ${filter ? '' : 'on'}" data-f="">Everyone</button>` +
      state.travelers.map(t => `<button class="chip ${filter === t.id ? 'on' : ''}" style="--c:${t.color}" data-f="${t.id}">${esc(t.name)}</button>`).join('');
  }

  function flightCard(f) {
    const t = T(f.traveler);
    return `<div class="card" style="--c:${t.color}"><div class="row"><div><h3>${f.type === 'arrival' ? '🛬 Arrives' : '🛫 Departs'} · ${esc(t.name)}</h3>
      <div class="meta">${fmtDay(f.date)} · ${f.type === 'arrival' ? 'lands' : 'departs'} ${fmtTime(f.time)}</div>
      <div class="meta">${esc(f.from) || 'From TBD'} → ${esc(f.to) || 'To TBD'}</div>
      <div class="meta">${esc([f.airline, f.flightNo].filter(Boolean).join(' '))}</div>
      ${f.note ? `<div class="meta"><em>${esc(f.note)}</em></div>` : ''}</div>
      </div></div>`;
  }

  function sortedFlights(d) {
    return state.flights.filter(f => (d == null || f.date === d) && visible([f.traveler]))
      .sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  }

  function renderOverview() {
    return `<h2>Lodging</h2><div class="card"><div class="row"><div><h3>🏨 ${esc(state.hotel.name)}</h3><div class="meta">${esc(state.hotel.note)}</div>
      <div class="meta">${fmtDay(DAYS[0])} – ${fmtDay(DAYS[5])}</div></div></div></div>
      <h2>Arrivals · ${fmtDay(DAYS[0])}</h2><div class="flights">${sortedFlights(DAYS[0]).filter(f => f.type === 'arrival').map(flightCard).join('') || '<p class="empty">None</p>'}</div>
      <h2>Departures · ${fmtDay(DAYS[5])}</h2><div class="flights">${sortedFlights(DAYS[5]).filter(f => f.type === 'departure').map(flightCard).join('') || '<p class="empty">None</p>'}</div>
      `;
  }

  function renderDay() {
    const d = DAYS[day];
    const acts = state.activities.filter(a => a.day === d && visible(a.travelers)).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
    const fl = sortedFlights(d);
    return `<h2>${new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
      ${fl.length ? `<h3>Flights</h3><div class="flights">${fl.map(flightCard).join('')}</div>` : ''}
      <div class="row"><h3>Activities</h3></div>
      ${acts.map(a => `<div class="card ${a.suggestion ? 'sug' : ''}"><div class="row"><div class="time">${fmtTime(a.start)}${a.end ? ' – ' + fmtTime(a.end) : ''}</div>
        <div style="flex:1;min-width:200px"><h3>${esc(a.title)}</h3>
        <div class="meta">${a.location ? '📍 <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a.location + ' Montreal') + '">' + esc(a.location) + '</a>' : ''}</div>
        ${a.notes ? `<div class="meta">${esc(a.notes)}</div>` : ''}
        <span class="tag plain">${CATS[a.category] || CATS.other}</span>${a.suggestion ? '<span class="tag plain">Suggestion</span>' : ''}${tagsFor(a.travelers)}</div>
        </div></div>`).join('') || '<p class="empty">Nothing planned.</p>'}`;
  }

  function render() { renderTabs(); $('#view').innerHTML = overview ? renderOverview() : renderDay(); }

  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    const d = t.dataset;
    if ('tab' in d) { overview = d.tab === 'o'; if (!overview) day = +d.tab; render(); }
    else if ('f' in d) { filter = d.f || null; render(); }
  });

  $('#printBtn').onclick = () => window.print();

  render();
})();
