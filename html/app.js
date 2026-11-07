// Ten Sites to Call: ranks affordable-housing site leads for one Orange County city.
// All data comes live from public map services, plus a cached copy of the HCD surplus-land CSV.

const CHECKED = '2026-11-07';

const SRC = {
  he: {
    name: 'SCAG Housing Element Sites',
    url: 'https://maps.scag.ca.gov/scaggis/rest/services/LDX/HousingElementSite_poly_scag/MapServer/0',
  },
  zoning: {
    name: 'SCAG Zoning_poly_OR',
    url: 'https://maps.scag.ca.gov/scaggis/rest/services/LDX/Zoning_poly_OR/MapServer/0',
  },
  surplus: {
    name: 'HCD Surplus Land Act Notices of Availability (cached copy)',
    url: 'https://data.ca.gov/dataset/surplus-land-act-notices-of-availability-received',
  },
  flood: {
    name: 'OC Floodplains (FEMA flood zones, county copy)',
    url: 'https://www.ocgis.com/arcpub/rest/services/Map_Layers/Floodplains/MapServer/0',
  },
  fire: {
    name: 'OC Fire Hazard Severity Zones, LRA',
    url: 'https://www.ocgis.com/arcpub/rest/services/Map_Layers/Fire_Hazard_Severity_Zones_LRA/MapServer/0',
  },
  landslide: {
    name: 'CGS Landslide Zones',
    url: 'https://services2.arcgis.com/zr3KAIbsRSUyARHG/arcgis/rest/services/CGS_Landslide_Zones/FeatureServer/0',
  },
  parcels: {
    name: 'OC Parcels (county)',
    url: 'https://www.ocgis.com/arcpub/rest/services/Map_Layers/Parcels/FeatureServer/0',
  },
  transit: {
    name: 'Caltrans High Quality Transit Areas',
    url: 'https://caltrans-gis.dot.ca.gov/arcgis/rest/services/CHrailroad/CA_HQ_Transit_Areas/FeatureServer/0',
  },
};

// ASSUMPTION: ranking weights are the team's judgment, not from a law or program.
const WEIGHTS = {
  lowIncomeUnitsMax: 40, // up to 40 points, scaled by lower-income units planned (capped at 50 units)
  lowIncomeUnitsCap: 50,
  surplusNotice: 25,     // a public owner already filed a surplus notice
  transit: 15,           // inside a High Quality Transit Area
  floodPenalty: -20,     // FEMA zone starting with A or V (Special Flood Hazard Area)
  firePenalty: -20,      // in a mapped LRA fire hazard severity zone
  landslidePenalty: -20, // in a CGS landslide zone
};
const HAZARD_CHECK_COUNT = 25;
const SHOW_COUNT = 10;

let surplusData = null;
let map, markerLayer;

// ---------- helpers ----------

const $ = (id) => document.getElementById(id);
const digits = (s) => (s || '').replace(/\D/g, '');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const titleCase = (s) => s.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

async function arcgis(url, params) {
  const q = new URLSearchParams({ f: 'json', ...params });
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(`${url}/query?${q}`);
      const j = await r.json();
      if (j.error) throw new Error(j.error.message);
      return j;
    } catch (e) {
      if (attempt === 1) throw e;
    }
  }
}

// Does a point fall inside any feature of this layer? Returns the first feature's attributes,
// null if none, or 'error' if the service did not answer.
async function pointHit(layer, lat, lon, outFields) {
  try {
    const j = await arcgis(SRC[layer].url, {
      geometry: `${lon},${lat}`, geometryType: 'esriGeometryPoint', inSR: 4326,
      spatialRel: 'esriSpatialRelIntersects', outFields, returnGeometry: false, resultRecordCount: 1,
    });
    return j.features.length ? j.features[0].attributes : null;
  } catch (e) {
    return 'error';
  }
}

function ringCenter(geom) {
  const ring = geom?.rings?.[0];
  if (!ring) return null;
  let x = 0, y = 0;
  ring.forEach(([lx, ly]) => { x += lx; y += ly; });
  return { lon: x / ring.length, lat: y / ring.length };
}

// Run async jobs a few at a time, to be kind to public servers.
async function pool(items, size, fn) {
  const out = [];
  let i = 0;
  async function worker() { while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); } }
  await Promise.all(Array.from({ length: size }, worker));
  return out;
}

// ---------- city list ----------

async function loadCities() {
  surplusData = await (await fetch('data/surplus-oc.json')).json();
  const stats = await arcgis(SRC.he.url, {
    where: "COUNTY='Orange'", groupByFieldsForStatistics: 'Jurisdiction',
    outStatistics: JSON.stringify([{ statisticType: 'count', onStatisticField: 'OBJECTID', outStatisticFieldName: 'n' }]),
  });
  const counts = {};
  stats.features.forEach((f) => { counts[f.attributes.Jurisdiction] = { he: f.attributes.n, surplus: 0 }; });
  surplusData.rows.forEach((r) => { (counts[r.city] ||= { he: 0, surplus: 0 }).surplus++; });
  delete counts['ORANGE COUNTY']; // unincorporated county land, not a city

  const sel = $('city');
  sel.innerHTML = Object.keys(counts).sort().map((c) =>
    `<option value="${esc(c)}">${esc(titleCase(c))} (${counts[c].he} plan sites, ${counts[c].surplus} surplus notices)</option>`).join('');
  sel.value = 'ANAHEIM';
  $('go').disabled = false;
}

// ---------- candidates ----------

async function loadCandidates(city) {
  const he = await arcgis(SRC.he.url, {
    where: `Jurisdiction='${city.replace(/'/g, "''")}'`,
    outFields: 'APN24,Assessor_Parcel_Number,Low_Income_HE_Capacity,Moderate_Income_HE_Capacity,Above_Moderate_Income_HE_Capacity,Total_HE_Capacity,YEAR',
    outSR: 4326, returnGeometry: true,
  });

  const sites = new Map();
  he.features.forEach((f) => {
    const a = f.attributes;
    const c = ringCenter(f.geometry);
    if (!c) return;
    const key = digits(a.APN24 || a.Assessor_Parcel_Number);
    const prev = sites.get(key);
    if (prev) { prev.he.low += a.Low_Income_HE_Capacity || 0; prev.he.total += a.Total_HE_Capacity || 0; return; }
    sites.set(key, {
      apn: a.Assessor_Parcel_Number || a.APN24, apn24: digits(a.APN24), ...c,
      he: { low: a.Low_Income_HE_Capacity || 0, moderate: a.Moderate_Income_HE_Capacity || 0,
            above: a.Above_Moderate_Income_HE_Capacity || 0, total: a.Total_HE_Capacity || 0, year: a.YEAR },
      surplus: null,
    });
  });

  surplusData.rows.filter((r) => r.city === city && r.lat && r.lon).forEach((r) => {
    const key = digits(r.apn);
    const s = sites.get(key);
    if (s) { s.surplus = r; return; }
    sites.set(key || `surplus-${sites.size}`, { apn: r.apn, apn24: key, lat: r.lat, lon: r.lon, he: null, surplus: r });
  });
  return [...sites.values()];
}

function baseScore(s) {
  let pts = 0;
  const why = [];
  if (s.he?.low) {
    const p = Math.round(WEIGHTS.lowIncomeUnitsMax * Math.min(s.he.low, WEIGHTS.lowIncomeUnitsCap) / WEIGHTS.lowIncomeUnitsCap);
    pts += p; why.push(`+${p} city plan counts ${s.he.low} lower-income homes here`);
  }
  if (s.surplus) { pts += WEIGHTS.surplusNotice; why.push(`+${WEIGHTS.surplusNotice} public owner filed a surplus-land notice`); }
  return { pts, why };
}

async function addChecks(s) {
  const [flood, fire, slide, transit] = await Promise.all([
    pointHit('flood', s.lat, s.lon, 'FLD_ZONE,ZONE_SUBTY'),
    pointHit('fire', s.lat, s.lon, 'HAZ_CLASS'),
    pointHit('landslide', s.lat, s.lon, 'QUAD_NAME'),
    pointHit('transit', s.lat, s.lon, 'hqta_type,agency_primary'),
  ]);
  s.checks = { flood, fire, slide, transit };
  const { pts, why } = baseScore(s);
  let score = pts;
  if (transit && transit !== 'error') { score += WEIGHTS.transit; why.push(`+${WEIGHTS.transit} in a High Quality Transit Area`); }
  if (flood && flood !== 'error' && /^[AV]/.test(flood.FLD_ZONE || '')) { score += WEIGHTS.floodPenalty; why.push(`${WEIGHTS.floodPenalty} FEMA flood zone ${flood.FLD_ZONE}`); }
  if (fire && fire !== 'error') { score += WEIGHTS.firePenalty; why.push(`${WEIGHTS.firePenalty} ${fire.HAZ_CLASS} fire hazard zone`); }
  if (slide && slide !== 'error') { score += WEIGHTS.landslidePenalty; why.push(`${WEIGHTS.landslidePenalty} CGS landslide zone`); }
  s.score = score; s.why = why;
}

async function addZoning(sites) {
  const apns = sites.map((s) => s.apn24).filter((a) => a && a.length === 8);
  if (!apns.length) return;
  try {
    const j = await arcgis(SRC.zoning.url, {
      where: `APN24 IN (${apns.map((a) => `'${a}'`).join(',')})`,
      outFields: 'APN24,ZN24_CITY,ZN24_SCAG,ACRES,SLOPE', returnGeometry: false,
    });
    const z = {};
    j.features.forEach((f) => { z[f.attributes.APN24] = f.attributes; });
    sites.forEach((s) => { s.zoning = z[s.apn24] || null; });
  } catch (e) {
    sites.forEach((s) => { s.zoning = 'error'; });
  }
}

// Address and year built from the county parcel layer (APN format 034-460-33).
async function addParcelInfo(sites) {
  const dashed = (d) => `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6, 8)}`;
  const apns = sites.map((s) => digits(s.apn)).filter((d) => d.length === 8);
  if (!apns.length) return;
  try {
    const j = await arcgis(SRC.parcels.url, {
      where: `ASSESSMENT_NO IN (${apns.map((d) => `'${dashed(d)}'`).join(',')})`,
      outFields: 'ASSESSMENT_NO,SITE_ADDRESS,YEAR_BUILT', returnGeometry: false,
    });
    const p = {};
    j.features.forEach((f) => { p[digits(f.attributes.ASSESSMENT_NO)] = f.attributes; });
    sites.forEach((s) => {
      s.parcel = p[digits(s.apn)] || null;
      if (/NOT AVAILABLE/i.test(s.parcel?.SITE_ADDRESS || '')) s.parcel.SITE_ADDRESS = '';
      if (s.parcel && /^0*$/.test(s.parcel.YEAR_BUILT || '')) s.parcel.YEAR_BUILT = ''; // "0" means blank
    });
  } catch (e) {
    sites.forEach((s) => { s.parcel = null; });
  }
}

// ---------- render ----------

function flag(label, hit, okText, hitText, src) {
  let cls = 'bg-success-subtle text-success-emphasis', text = okText;
  if (hit === 'error') { cls = 'bg-secondary-subtle text-secondary-emphasis'; text = 'unknown (service did not answer)'; }
  else if (hit) { cls = 'bg-danger-subtle text-danger-emphasis'; text = hitText(hit); }
  return `<span class="badge flag ${cls} me-1 mb-1" title="${esc(SRC[src].name)}">${label}: ${esc(text)}</span>`;
}

// "Which law" row: one badge per law, plus a list of the tests behind it.
function lawRow(s, id, z, acres) {
  const hit = (h) => (h === 'error' ? null : !!h);
  const flood = s.checks.flood;
  const result = checkLaws({
    zoneCode: z?.ZN24_SCAG,
    acres: acres != null ? Number(acres) : null,
    fire: hit(s.checks.fire),
    sfha: flood === 'error' ? null : !!(flood && /^[AV]/.test(flood.FLD_ZONE || '')),
    publicOwner: !!s.surplus,
  });
  s.lawResult = result; // kept for the CSV export
  const color = { Possible: 'text-bg-success', 'Not likely': 'text-bg-secondary', Unknown: 'text-bg-warning' };
  const mark = { pass: '✓', fail: '✗', unknown: '?', 'not checked': '–' };
  const badges = result.laws.map((l) =>
    `<span class="badge ${color[l.v]} me-1 mb-1" title="${esc(l.cite)}">${esc(l.law)}: ${esc(l.v)}</span>`).join('');
  const details = result.laws.map((l, i) => `
    <div id="${id}-law${i + 1}" class="mt-1">
      <strong>${esc(l.law)}</strong> (${esc(l.cite)}): ${esc(l.v)}.
      <a href="${esc(l.src)}" target="_blank" rel="noopener">HCD fact sheet, Apr 2026</a>
      <ul class="mb-1 ps-3">${l.tests.map((t) => `<li>${mark[t.r]} ${esc(t.t)}${t.r === 'not checked' ? ' <span class="text-muted">(not checked)</span>' : ''}</li>`).join('')}</ul>
    </div>`).join('');
  return `
      <div id="${id}-laws" class="small mt-2">
        <strong>Which law might apply:</strong><br>${badges}
        <details id="${id}-law-details"><summary>Show tests</summary>${details}
          <div id="${id}-law-note" class="text-muted">First screen only, from HCD fact sheets. Zone type is SCAG's regional category; the city's own zoning code decides, and the two can differ (for example, Laguna Beach "R3" is SCAG single-family 1111). ✓ passed, ✗ failed, ? unknown, – not checked. Not a legal determination: confirm with the city and a land-use attorney.</div>
        </details>
      </div>`;
}

function card(s, rank) {
  const id = `site-${rank}`;
  const z = s.zoning && s.zoning !== 'error' ? s.zoning : null;
  const acres = z?.ACRES ?? s.surplus?.acres;
  const floodHit = s.checks.flood && s.checks.flood !== 'error' && !/^[AV]/.test(s.checks.flood.FLD_ZONE || '') ? null : s.checks.flood;
  const who = s.surplus
    ? `Notice issued by <strong>${esc(s.surplus.agency)}</strong> on ${esc(s.surplus.date_issued)}. Contact that agency's real-estate or surplus-property office.`
    : `The <strong>City of ${esc(titleCase($('city').value))}</strong> planning or housing division (this parcel is in its housing-element site list).`;

  return `
  <div id="${id}" class="card site-card mb-2">
    <div id="${id}-body" class="card-body p-3">
      <div id="${id}-head" class="d-flex justify-content-between align-items-start">
        <div id="${id}-title">
          <div id="${id}-line1" class="fw-semibold">${rank}. ${esc(s.surplus?.address || (s.parcel?.SITE_ADDRESS ? titleCase(s.parcel.SITE_ADDRESS) : 'Address unknown'))} </div>
          <div id="${id}-line2" class="small text-muted">APN ${esc(s.apn || 'unknown')}</div>
        </div>
        <span class="badge text-bg-primary score-badge" title="ASSUMPTION: team-chosen points">${s.score}</span>
      </div>

      <div id="${id}-facts" class="small mt-2">
        ${s.he ? `<div id="${id}-line3">Housing element (data year ${esc(s.he.year)}): ${s.he.low} lower, ${s.he.moderate} moderate, ${s.he.above} above-moderate homes planned. <span class="text-muted">[${esc(SRC.he.name)}]</span></div>` : ''}
        ${s.surplus ? `<div id="${id}-line4">Surplus notice: ${esc(s.surplus.existing_use || 'use not given')}; ${esc(s.surplus.zoning || 'zoning not given')}. Status <strong>${esc(s.surplus.status)}</strong> in the HCD file (meaning not confirmed: ask the agency if the land is still available). <span class="text-muted">[HCD, downloaded ${esc(surplusData.downloaded)}]</span></div>` : ''}
        <div id="${id}-line5">Zoning: ${z ? `${esc(z.ZN24_CITY)} (SCAG category ${esc(z.ZN24_SCAG || '?')}: ${esc(zoneType(z.ZN24_SCAG).label)})` : 'unknown'}; size: ${acres != null ? Number(acres).toFixed(2) + ' acres' : 'unknown'}. <span class="text-muted">[${z ? esc(SRC.zoning.name) : s.surplus?.acres != null ? 'HCD notice' : 'no source'}]</span></div>
        ${s.parcel?.SITE_ADDRESS && !s.parcel.SITE_ADDRESS.toUpperCase().includes($('city').value)
          ? `<div id="${id}-mismatch" class="text-warning-emphasis"><strong>Sources disagree:</strong> SCAG lists this site under ${esc(titleCase($('city').value))}, but the county address is "${esc(titleCase(s.parcel.SITE_ADDRESS))}". Check which city has jurisdiction.</div>` : ''}
        <div id="${id}-line6">Year built on county record: ${s.parcel ? esc(s.parcel.YEAR_BUILT || 'blank (may be vacant, or not recorded)') : 'unknown'}. <span class="text-muted">[${esc(SRC.parcels.name)}]</span></div>
      </div>

      <div id="${id}-flags" class="mt-2">
        ${flag('Flood', floodHit, 'not in A/V zone', (h) => `zone ${h.FLD_ZONE}`, 'flood')}
        ${flag('Fire', s.checks.fire, 'not in LRA zone', (h) => h.HAZ_CLASS, 'fire')}
        ${flag('Landslide', s.checks.slide, 'not in zone', () => 'in CGS zone', 'landslide')}
        ${s.checks.transit && s.checks.transit !== 'error'
          ? `<span class="badge flag bg-info-subtle text-info-emphasis me-1 mb-1" title="${esc(SRC.transit.name)}">Transit: ${esc(s.checks.transit.hqta_type)}</span>`
          : flag('Transit', s.checks.transit === 'error' ? 'error' : null, 'not in HQTA', () => '', 'transit').replace('bg-success-subtle text-success-emphasis', 'bg-light text-muted')}
      </div>

      ${lawRow(s, id, z, acres)}

      <div id="${id}-why" class="small mt-2"><strong>Why it ranks here:</strong> ${s.why.map(esc).join('; ') || 'no points'}</div>
      <div id="${id}-unknown" class="small mt-1 text-danger-emphasis"><strong>Unknown:</strong> owner and willingness to sell; whether it has sold or been built since listing; water, sewer, contamination; local objective standards.</div>
      <div id="${id}-call" class="small mt-1"><strong>Who to call:</strong> ${who}</div>
    </div>
  </div>`;
}

function renderMap(top) {
  markerLayer.clearLayers();
  top.forEach((s, i) => {
    const color = s.surplus ? '#fd7e14' : '#0d6efd';
    L.marker([s.lat, s.lon], {
      icon: L.divIcon({
        className: '',
        html: `<div id="marker-${i + 1}" style="background:${color};color:#fff;border-radius:50%;width:26px;height:26px;line-height:26px;text-align:center;font-weight:600;border:2px solid #fff;box-shadow:0 0 3px #0006">${i + 1}</div>`,
        iconSize: [26, 26],
      }),
    }).bindTooltip(`${i + 1}. APN ${s.apn}`).on('click', () => $(`site-${i + 1}`).scrollIntoView({ behavior: 'smooth' }))
      .addTo(markerLayer);
  });
  map.invalidateSize();
  if (top.length) map.fitBounds(L.latLngBounds(top.map((s) => [s.lat, s.lon])).pad(0.2));
}

async function run() {
  const city = $('city').value;
  $('go').disabled = true;
  $('csv').classList.add('d-none');
  $('list').innerHTML = '';
  $('summary').textContent = '';
  try {
    $('status').textContent = 'Loading candidate sites…';
    const all = await loadCandidates(city);
    if (!all.length) {
      $('list').innerHTML = `<div id="no-data" class="alert alert-secondary">No housing-element sites or surplus notices found for ${esc(titleCase(city))} in these sources. That means <strong>unknown</strong>, not "no sites".</div>`;
      markerLayer.clearLayers();
      return;
    }
    all.forEach((s) => { s.base = baseScore(s).pts; });
    const shortlist = all.sort((a, b) => b.base - a.base).slice(0, HAZARD_CHECK_COUNT);

    let done = 0;
    await pool(shortlist, 4, async (s) => {
      await addChecks(s);
      $('status').textContent = `Checking hazards… ${++done}/${shortlist.length}`;
    });
    const top = shortlist.sort((a, b) => b.score - a.score).slice(0, SHOW_COUNT);
    $('status').textContent = 'Looking up zoning…';
    await Promise.all([addZoning(top), addParcelInfo(top)]);

    $('summary').textContent = `${all.length} candidate sites in ${titleCase(city)}; top ${HAZARD_CHECK_COUNT} checked for hazards; showing the best ${top.length}.`;
    $('list').innerHTML = top.map((s, i) => card(s, i + 1)).join('');
    renderMap(top);
    lastResult = { city, top, checked: new Date() };
    $('csv').classList.remove('d-none');
    $('status').textContent = `Done. Data checked live ${new Date().toLocaleString()}.`;
  } catch (e) {
    $('status').textContent = '';
    $('list').innerHTML = `<div id="error" class="alert alert-danger">A public data service did not answer (${esc(e.message)}). Try again in a minute.</div>`;
  } finally {
    $('go').disabled = false;
  }
}

// ---------- CSV export (built in the browser; nothing is sent anywhere) ----------

let lastResult = null;

function downloadCsv() {
  if (!lastResult) return;
  const { city, top, checked } = lastResult;
  const U = 'unknown';
  const val = (v) => (v === null || v === undefined || v === '' ? U : v);
  const cell = (v) => { const t = String(v); return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
  const hazard = (h, hitText) => (h === 'error' ? U : h ? hitText(h) : 'no');
  const law = (s, name) => s.lawResult?.laws.find((l) => l.law === name)?.v ?? U;

  const header = [
    'rank', 'score (ASSUMPTION)', 'address', 'apn', 'city', 'source type',
    'lower-income units planned', 'moderate units planned', 'above-moderate units planned', 'housing element data year',
    'surplus notice agency', 'surplus notice date', 'surplus notice status',
    'city zoning', 'SCAG zoning category', 'acres', 'year built (county record)',
    'flood (FEMA A/V zone)', 'fire (LRA zone)', 'landslide (CGS zone)', 'transit (HQTA)',
    'SB 9', 'SB 684/1123', 'AB 2011', 'SB 4',
    'why it ranks here', 'who to call', 'sources disagree on city', 'lat', 'lon',
  ];
  const rows = top.map((s, i) => {
    const z = s.zoning && s.zoning !== 'error' ? s.zoning : null;
    const acres = z?.ACRES ?? s.surplus?.acres;
    const addr = s.surplus?.address || (s.parcel?.SITE_ADDRESS ? titleCase(s.parcel.SITE_ADDRESS) : '');
    const flood = s.checks.flood;
    const sfha = flood === 'error' ? 'error' : flood && /^[AV]/.test(flood.FLD_ZONE || '') ? flood : null;
    const mismatch = s.parcel?.SITE_ADDRESS ? (s.parcel.SITE_ADDRESS.toUpperCase().includes(city) ? 'no' : `yes: county address is ${titleCase(s.parcel.SITE_ADDRESS)}`) : U;
    return [
      i + 1, s.score, val(addr), val(s.apn), titleCase(city),
      s.he && s.surplus ? 'housing element + surplus notice' : s.he ? 'housing element' : 'surplus notice',
      s.he ? s.he.low : 'n/a', s.he ? s.he.moderate : 'n/a', s.he ? s.he.above : 'n/a', s.he ? val(s.he.year) : 'n/a',
      s.surplus ? val(s.surplus.agency) : 'n/a', s.surplus ? val(s.surplus.date_issued) : 'n/a', s.surplus ? val(s.surplus.status) : 'n/a',
      val(z?.ZN24_CITY), z ? `${val(z.ZN24_SCAG)} ${zoneType(z.ZN24_SCAG).label}` : U,
      acres != null ? Number(acres).toFixed(2) : U, s.parcel ? val(s.parcel.YEAR_BUILT) : U,
      hazard(sfha, (h) => `yes: zone ${h.FLD_ZONE}`), hazard(s.checks.fire, (h) => `yes: ${h.HAZ_CLASS}`),
      hazard(s.checks.slide, () => 'yes'), hazard(s.checks.transit, (h) => `yes: ${h.hqta_type}`),
      law(s, 'SB 9'), law(s, 'SB 684/1123'), law(s, 'AB 2011'), law(s, 'SB 4'),
      s.why.join('; ') || 'no points',
      s.surplus ? `${s.surplus.agency} (agency that issued the surplus notice)` : `City of ${titleCase(city)} planning or housing division`,
      mismatch, s.lat.toFixed(6), s.lon.toFixed(6),
    ];
  });

  const notes = [
    ['Ten Sites to Call: prototype from the Claude Impact Lab. Not legal, financial or lending advice. Every site is a lead to check, not a confirmed opportunity.'],
    [`City: ${titleCase(city)}. Data checked live ${checked.toISOString()}. Surplus notices from a copy downloaded ${surplusData.downloaded}.`],
    ['Scores are ASSUMPTION (team-chosen points). Law columns are a first screen from HCD fact sheets (April 2026), not a legal determination. "unknown" means the source does not say.'],
    [`Sources: ${Object.values(SRC).map((s) => `${s.name} ${s.url}`).join(' | ')} | ${LAW_SOURCES.facts} | ${LAW_SOURCES.sb9}`],
    [],
  ];
  const csv = [...notes, header, ...rows].map((r) => r.map(cell).join(',')).join('\r\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ten-sites-${city.toLowerCase().replace(/\s+/g, '-')}-${checked.toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function renderMethod() {
  $('method-list').innerHTML = [
    `Up to +${WEIGHTS.lowIncomeUnitsMax} for lower-income homes the city's housing element plans on the site (full points at ${WEIGHTS.lowIncomeUnitsCap}+ units)`,
    `+${WEIGHTS.surplusNotice} if a public agency filed a surplus-land notice`,
    `+${WEIGHTS.transit} if inside a Caltrans High Quality Transit Area`,
    `${WEIGHTS.floodPenalty} if in a FEMA flood zone starting with A or V (Special Flood Hazard Area)`,
    `${WEIGHTS.firePenalty} if in a mapped local fire hazard severity zone (LRA layer only; state-responsibility areas not checked)`,
    `${WEIGHTS.landslidePenalty} if in a CGS landslide zone`,
  ].map((t) => `<li>${esc(t)}</li>`).join('');
  $('laws-list').innerHTML = [
    'SB 9: single-family zone (SCAG codes 111x).',
    'SB 684: multifamily zone (112x; mixed-use 16x counts only if the zone allows multifamily), lot under 5 acres, not in a fire hazard zone. SB 1123: single-family zone and a vacant lot; its size limit is not in the HCD fact sheet, so it stays unknown.',
    'AB 2011: zone allows office, retail or parking (SCAG 1200–1233, 1500, 16x).',
    'SB 4: allowed in any zone, but the owner must be a religious institution or independent college; free data does not show the owner. Very high fire zones and FEMA A/V flood zones rule it out; so does a public owner (surplus notice).',
    'Specific-plan (7777) or blank zoning: unknown. Read the specific plan.',
    'Zone types come from SCAG\'s ZN24_SCAG code legend (in the layer description). Ranking does not use these results.',
  ].map((t) => `<li>${esc(t)}</li>`).join('');
  $('sources-list').innerHTML = Object.values(SRC).map((s) =>
    `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.name)}</a></li>`).join('');
}

// ---------- start ----------

map = L.map('map').setView([33.75, -117.85], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19, attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);
markerLayer = L.layerGroup().addTo(map);

renderMethod();
$('go').addEventListener('click', run);
$('csv').addEventListener('click', downloadCsv);
loadCities().catch((e) => { $('status').textContent = `Could not load city list: ${e.message}`; });
