// Call List by Law: shows the ranked leads built by lanes/1-find-it/scripts/rank_sites.py.
// Reads data/call-list.json only; nothing is sent anywhere.

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let DATA, map, layer;
const markers = {};

function render() {
  const city = $('cl-city').value, law = $('cl-law').value;
  const rows = DATA.rows.filter((r) => r.city === city && r.law === law);
  $('cl-check').innerHTML = `<strong>Check before calling (${esc(law)}):</strong> ${esc(DATA.laws[law])}.`;
  $('cl-count').textContent = `${rows.length} sites · data built ${DATA.generated}`;

  $('cl-tbody').innerHTML = rows.length ? rows.map((r) => `
    <tr id="cl-row-${r.rank}" data-rank="${r.rank}" style="cursor:pointer">
      <td>${r.rank}</td>
      <td>${esc(r.address)}${r.public_owner_notice === 'yes' ? ' <span class="badge text-bg-warning">surplus notice</span>' : ''}</td>
      <td>${esc(r.apn)}</td>
      <td>${esc(r.acres)}</td>
      <td>${esc(r.zone_city)}</td>
      <td>${esc(r.existing_use)}<span class="d-block text-muted">${esc(r.use_group)}</span></td>
      <td>${esc(r.flags) || '<span class="text-muted">none</span>'}</td>
      <td><a href="${esc(r.map)}" target="_blank" rel="noopener">map</a></td>
    </tr>`).join('') : '<tr><td colspan="8" class="text-muted">No sites for this city and law.</td></tr>';

  layer.clearLayers();
  for (const k in markers) delete markers[k];
  rows.forEach((r) => {
    const icon = L.divIcon({
      className: '',
      html: `<div id="cl-marker-${r.rank}" style="background:#0d6efd;color:#fff;border-radius:50%;width:24px;height:24px;line-height:24px;text-align:center;font-size:12px;font-weight:600;border:2px solid #fff;box-shadow:0 0 3px #0006">${r.rank}</div>`,
      iconSize: [24, 24], iconAnchor: [12, 12],
    });
    markers[r.rank] = L.marker([r.lat, r.lon], { icon })
      .bindPopup(`<strong>#${r.rank}</strong> ${esc(r.address)}<br>${esc(r.acres)} acres · ${esc(r.existing_use)}`)
      .on('click', () => highlight(r.rank, false))
      .addTo(layer);
  });
  if (rows.length) map.fitBounds(L.latLngBounds(rows.map((r) => [r.lat, r.lon])).pad(0.15));

  document.querySelectorAll('#cl-tbody tr[data-rank]').forEach((tr) =>
    tr.addEventListener('click', () => highlight(Number(tr.dataset.rank), true)));
}

function highlight(rank, fromRow) {
  document.querySelectorAll('#cl-tbody tr').forEach((tr) => tr.classList.toggle('active-row', Number(tr.dataset.rank) === rank));
  const m = markers[rank];
  if (m && fromRow) { map.panTo(m.getLatLng()); m.openPopup(); }
  if (!fromRow) $(`cl-row-${rank}`)?.scrollIntoView({ block: 'nearest' });
}

async function init() {
  map = L.map('cl-map').setView([33.78, -117.9], 12);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);
  layer = L.layerGroup().addTo(map);

  try {
    DATA = await (await fetch('data/call-list.json')).json();
  } catch (e) {
    $('cl-count').textContent = 'Could not load data/call-list.json.';
    return;
  }
  $('cl-city').innerHTML = DATA.cities.map((c) => `<option>${esc(c)}</option>`).join('');
  $('cl-law').innerHTML = Object.keys(DATA.laws).map((l) => `<option>${esc(l)}</option>`).join('');
  $('cl-city').addEventListener('change', render);
  $('cl-law').addEventListener('change', render);
  render();
}

init();
