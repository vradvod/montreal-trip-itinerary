(function () {
  'use strict';
  const KEY = 'montreal-itinerary-v1';
  const DAYS = ['2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20'];
  const CATS = { sight: '🏛️ Sight', food: '🍽️ Food', tour: '🚌 Tour', transit: '🚕 Transit', hotel: '🏨 Hotel', other: '📌 Other' };
  const COLORS = ['#c8102e', '#1d4ed8', '#047857', '#b45309', '#7c3aed', '#be185d', '#0e7490', '#4d7c0f', '#6b21a8'];
  const NAMES = ['Vrad', 'Krysia', 'Walter', 'Dorothy', 'Tara', 'Ursula', 'Ania', 'Marian', 'Danuta'];
  const HOTEL = { name: 'Hotel Saint Laurent', note: 'Drop off bags on arrival if rooms are not ready.' };

  let uid = 0;
  const id = () => 'i' + Date.now().toString(36) + (uid++);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function defaults() {
    const travelers = NAMES.map((n, i) => ({ id: n.toLowerCase(), name: n, color: COLORS[i] }));
    const flights = [];
    travelers.forEach(t => {
      const known = t.id === 'vrad', assumed = t.id === 'krysia';
      const note = assumed ? 'Assumed same as Vrad – please confirm' : known ? '' : 'Flight details TBD';
      flights.push({
        id: id(), traveler: t.id, type: 'arrival', date: DAYS[0],
        time: known || assumed ? '11:02' : '', airline: '', flightNo: '',
        from: known || assumed ? 'Orlando (MCO) 8:00am' : '', to: 'Montreal (YUL)', note
      });
      flights.push({
        id: id(), traveler: t.id, type: 'departure', date: DAYS[5],
        time: known || assumed ? '09:35' : '', airline: '', flightNo: '',
        from: 'Montreal (YUL)', to: known || assumed ? 'Orlando (MCO) – arrives 12:47pm' : '', note
      });
    });
    const A = (day, start, end, title, location, category, notes, who, suggestion) =>
      ({ id: id(), day, start, end, title, location, category, notes, travelers: who || [], suggestion: !!suggestion });
    const activities = [
      A(DAYS[0], '12:00', '', 'Drop off bags at Hotel Saint Laurent', '355 Rue Sainte-Catherine O, Montréal', 'hotel', 'Early arrivals can leave luggage with the front desk.'),
      A(DAYS[0], '14:00', '16:00', 'Stroll Old Montréal & Notre-Dame Basilica', 'Old Montréal', 'sight', 'Suggestion – cobblestone streets and Place Jacques-Cartier.', [], true),
      A(DAYS[0], '18:30', '', 'Welcome dinner', 'Old Montréal', 'food', 'Suggestion – try a poutine or bistro near the hotel.', [], true),
      A(DAYS[1], '09:30', '12:00', 'Mount Royal hike & lookout', 'Parc du Mont-Royal', 'sight', 'Suggestion – panoramic city views and fall colours.', [], true),
      A(DAYS[1], '12:30', '14:00', 'Smoked meat lunch at Schwartz\'s', 'Boulevard Saint-Laurent', 'food', 'Suggestion – expect a line.', [], true),
      A(DAYS[1], '15:00', '17:00', 'Montréal Museum of Fine Arts', 'Rue Sherbrooke O', 'sight', 'Suggestion.', [], true),
      A(DAYS[2], '09:00', '12:00', 'Jean-Talon Market & Little Italy', 'Jean-Talon Market', 'food', 'Suggestion – fall produce and bakeries.', [], true),
      A(DAYS[2], '14:00', '17:00', 'Underground City & shopping', 'Downtown', 'sight', 'Suggestion – good if the weather is cold.', [], true),
      A(DAYS[3], '07:00', '20:00', 'Montréal to Québec City bus tour', 'Departure point TBD', 'tour', 'Full-day tour, back around 8:00pm.'),
      A(DAYS[4], '10:00', '12:00', 'Bagels at St-Viateur / Fairmount', 'Mile End', 'food', 'Suggestion.', [], true),
      A(DAYS[4], '13:30', '16:00', 'Plateau-Mont-Royal & Mile End walk', 'Plateau', 'sight', 'Suggestion – murals and boutiques.', [], true),
      A(DAYS[4], '19:00', '', 'Farewell dinner', 'TBD', 'food', 'Suggestion – pick a favourite.', [], true),
      A(DAYS[5], '06:45', '', 'Leave for the airport', 'Hotel Saint Laurent → YUL', 'transit', 'Vrad\'s flight departs 9:35am. Adjust for other travelers.', ['vrad', 'krysia'])
    ];
    return { travelers, flights, activities, hotel: HOTEL };
  }

  let state;
  try { state = JSON.parse(localStorage.getItem(KEY)); } catch (e) { state = null; }
  if (!state || !state.travelers) state = defaults();
  let day = 0, overview = true, filter = null;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } };
  const T = tid => state.travelers.find(t => t.id === tid) || { name: '?', color: '#888' };
  const $ = s => document.querySelector(s);

  const fmtDay = d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtTime = t => { if (!t) return 'TBD'; const [h, m] = t.split(':').map(Number); return ((h + 11) % 12 + 1) + ':' + String(m).padStart(2, '0') + (h < 12 ? 'am' : 'pm'); };
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
      <div><button class="btn sm" data-edit-flight="${f.id}">Edit</button></div></div></div>`;
  }

  function sortedFlights(d) {
    return state.flights.filter(f => (d == null || f.date === d) && visible([f.traveler]))
      .sort((a, b) => (a.time || '99').localeCompare(b.time || '99'));
  }

  function renderOverview() {
    return `<h2>Lodging</h2><div class="card"><div class="row"><div><h3>🏨 ${esc(state.hotel.name)}</h3><div class="meta">${esc(state.hotel.note)}</div>
      <div class="meta">${fmtDay(DAYS[0])} – ${fmtDay(DAYS[5])}</div></div><button class="btn sm" data-edit-hotel>Edit</button></div></div>
      <h2>Arrivals · ${fmtDay(DAYS[0])}</h2><div class="flights">${sortedFlights(DAYS[0]).filter(f => f.type === 'arrival').map(flightCard).join('') || '<p class="empty">None</p>'}</div>
      <h2>Departures · ${fmtDay(DAYS[5])}</h2><div class="flights">${sortedFlights(DAYS[5]).filter(f => f.type === 'departure').map(flightCard).join('') || '<p class="empty">None</p>'}</div>
      <p><button class="btn line" data-add-flight>+ Add flight</button></p>`;
  }

  function renderDay() {
    const d = DAYS[day];
    const acts = state.activities.filter(a => a.day === d && visible(a.travelers)).sort((a, b) => (a.start || '').localeCompare(b.start || ''));
    const fl = sortedFlights(d);
    return `<h2>${new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
      ${fl.length ? `<h3>Flights</h3><div class="flights">${fl.map(flightCard).join('')}</div>` : ''}
      <div class="row"><h3>Activities</h3><button class="btn" data-add-act>+ Add activity</button></div>
      ${acts.map(a => `<div class="card ${a.suggestion ? 'sug' : ''}"><div class="row"><div class="time">${fmtTime(a.start)}${a.end ? ' – ' + fmtTime(a.end) : ''}</div>
        <div style="flex:1;min-width:200px"><h3>${esc(a.title)}</h3>
        <div class="meta">${a.location ? '📍 <a target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(a.location + ' Montreal') + '">' + esc(a.location) + '</a>' : ''}</div>
        ${a.notes ? `<div class="meta">${esc(a.notes)}</div>` : ''}
        <span class="tag plain">${CATS[a.category] || CATS.other}</span>${a.suggestion ? '<span class="tag plain">Suggestion</span>' : ''}${tagsFor(a.travelers)}</div>
        <div><button class="btn sm" data-edit-act="${a.id}">Edit</button> <button class="btn sm del" data-del-act="${a.id}">Delete</button></div></div></div>`).join('') || '<p class="empty">Nothing planned. Add an activity!</p>'}`;
  }

  function render() { renderTabs(); $('#view').innerHTML = overview ? renderOverview() : renderDay(); }

  const dlg = $('#dlg'), form = $('#form');
  const field = (label, name, val, type) => `<label class="f">${label}<input name="${name}" type="${type || 'text'}" value="${esc(val)}"></label>`;
  const travelerOptions = sel => state.travelers.map(t => `<option value="${t.id}" ${t.id === sel ? 'selected' : ''}>${esc(t.name)}</option>`).join('');
  const foot = (extra) => `<div class="actions">${extra || ''}<button class="btn sm" value="cancel" formnovalidate>Cancel</button><button class="btn" value="ok">Save</button></div>`;

  function openForm(html, onSave) {
    form.innerHTML = html;
    form.onclick = null;
    form.onsubmit = e => {
      if (e.submitter && e.submitter.value === 'cancel') return;
      onSave(new FormData(form));
      save(); render();
    };
    dlg.showModal();
  }

  function editActivity(a) {
    const isNew = !a;
    a = a || { day: DAYS[day], start: '09:00', end: '', title: '', location: '', category: 'sight', notes: '', travelers: [] };
    openForm(`<h3>${isNew ? 'Add' : 'Edit'} activity</h3>
      <label class="f">Title<input name="title" required value="${esc(a.title)}"></label>
      <label class="f">Day<select name="day">${DAYS.map(d => `<option value="${d}" ${d === a.day ? 'selected' : ''}>${fmtDay(d)}</option>`).join('')}</select></label>
      <div class="two">${field('Start', 'start', a.start, 'time')}${field('End', 'end', a.end, 'time')}</div>
      ${field('Location', 'location', a.location)}
      <label class="f">Category<select name="category">${Object.entries(CATS).map(([k, v]) => `<option value="${k}" ${k === a.category ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label class="f">Notes<textarea name="notes" rows="3">${esc(a.notes)}</textarea></label>
      <div class="f">Who (none checked = everyone)</div><div class="checks">${state.travelers.map(t => `<label><input type="checkbox" name="who" value="${t.id}" ${a.travelers.includes(t.id) ? 'checked' : ''}> <span style="color:${t.color}">●</span> ${esc(t.name)}</label>`).join('')}</div>
      ${foot()}`, fd => {
      Object.assign(a, { title: fd.get('title').trim(), day: fd.get('day'), start: fd.get('start'), end: fd.get('end'), location: fd.get('location'), category: fd.get('category'), notes: fd.get('notes'), travelers: fd.getAll('who'), suggestion: false });
      if (isNew) { a.id = id(); state.activities.push(a); }
      day = DAYS.indexOf(a.day);
    });
  }

  function editFlight(f) {
    const isNew = !f;
    f = f || { traveler: state.travelers[0].id, type: 'arrival', date: DAYS[0], time: '', airline: '', flightNo: '', from: '', to: '', note: '' };
    openForm(`<h3>${isNew ? 'Add' : 'Edit'} flight</h3>
      <div class="two"><label class="f">Traveler<select name="traveler">${travelerOptions(f.traveler)}</select></label>
      <label class="f">Type<select name="type"><option value="arrival" ${f.type === 'arrival' ? 'selected' : ''}>Arrival</option><option value="departure" ${f.type === 'departure' ? 'selected' : ''}>Departure</option></select></label></div>
      <div class="two"><label class="f">Date<select name="date">${DAYS.map(d => `<option value="${d}" ${d === f.date ? 'selected' : ''}>${fmtDay(d)}</option>`).join('')}</select></label>${field('Time (landing / takeoff)', 'time', f.time, 'time')}</div>
      <div class="two">${field('Airline', 'airline', f.airline)}${field('Flight #', 'flightNo', f.flightNo)}</div>
      <div class="two">${field('From', 'from', f.from)}${field('To', 'to', f.to)}</div>
      ${field('Note', 'note', f.note)}
      ${foot(isNew ? '' : '<button class="btn sm del" value="del" formnovalidate>Delete</button>')}`, fd => {
      Object.assign(f, { traveler: fd.get('traveler'), type: fd.get('type'), date: fd.get('date'), time: fd.get('time'), airline: fd.get('airline'), flightNo: fd.get('flightNo'), from: fd.get('from'), to: fd.get('to'), note: fd.get('note') });
      if (isNew) { f.id = id(); state.flights.push(f); }
    });
    form.onclick = isNew ? null : e => {
      if (e.target.value === 'del') { e.preventDefault(); state.flights = state.flights.filter(x => x !== f); dlg.close(); save(); render(); }
    };
  }

  function editHotel() {
    openForm(`<h3>Edit lodging</h3>${field('Hotel', 'name', state.hotel.name)}${field('Notes', 'note', state.hotel.note)}${foot()}`,
      fd => { state.hotel = { name: fd.get('name'), note: fd.get('note') }; });
  }

  document.addEventListener('click', e => {
    const t = e.target.closest('button'); if (!t) return;
    const d = t.dataset;
    if ('tab' in d) { overview = d.tab === 'o'; if (!overview) day = +d.tab; render(); }
    else if ('f' in d) { filter = d.f || null; render(); }
    else if ('addAct' in d) editActivity();
    else if ('editAct' in d) editActivity(state.activities.find(a => a.id === d.editAct));
    else if ('delAct' in d) { if (confirm('Delete this activity?')) { state.activities = state.activities.filter(a => a.id !== d.delAct); save(); render(); } }
    else if ('addFlight' in d) editFlight();
    else if ('editFlight' in d) editFlight(state.flights.find(f => f.id === d.editFlight));
    else if ('editHotel' in d) editHotel();
  });

  $('#printBtn').onclick = () => window.print();
  $('#resetBtn').onclick = () => { if (confirm('Reset everything to the starter itinerary? Your edits will be lost.')) { state = defaults(); save(); render(); } };
  $('#exportBtn').onclick = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' }));
    a.download = 'montreal-itinerary.json'; a.click(); URL.revokeObjectURL(a.href);
  };
  $('#importInput').onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    file.text().then(txt => {
      const s = JSON.parse(txt);
      if (!Array.isArray(s.travelers) || !Array.isArray(s.flights) || !Array.isArray(s.activities)) throw new Error('bad');
      s.hotel = s.hotel || HOTEL; state = s; save(); render();
    }).catch(() => alert('Invalid itinerary file.'));
    e.target.value = '';
  };

  render();
})();
