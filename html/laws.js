// Which state law might open this site? A first screen only, from the site tests HCD's fact
// sheets state (April 2026 versions, read 2026-11-07). Anything we cannot check is listed as
// "not checked". This is not a legal determination.

const LAW_SOURCES = {
  facts: 'https://www.hcd.ca.gov/sites/default/files/docs/planning-and-community/housing-law-fact-sheets.pdf',
  sb9: 'https://www.hcd.ca.gov/sites/default/files/docs/planning-and-community/lot-splits-and-duplexes-sb-9.pdf',
  scagCodes: 'https://maps.scag.ca.gov/scaggis/rest/services/LDX/Zoning_poly_OR/MapServer/0',
};

// SCAG ZN24_SCAG zoning code -> zone type, from the code legend in the SCAG layer description.
function zoneType(code) {
  const c = String(code || '');
  if (!c || c === '9999') return { type: 'unknown', label: 'zoning code unknown' };
  if (c === '7777') return { type: 'specific', label: 'specific plan (rules are in the plan)' };
  if (c.startsWith('111')) return { type: 'sf', label: 'single-family residential' };
  if (c.startsWith('112')) return { type: 'mf', label: 'multifamily residential' };
  if (c.startsWith('16')) return { type: 'mixed', label: 'mixed residential and commercial' };
  if (/^12[0-3]/.test(c) || c === '1500') return { type: 'commercial', label: 'office, retail or commercial' };
  return { type: 'other', label: `other (SCAG code ${c})` };
}

const PASS = 'pass', FAIL = 'fail', NC = 'not checked';

function verdict(tests, ifAllPass = 'Possible') {
  if (tests.some((t) => t.r === FAIL)) return 'Not likely';
  if (tests.some((t) => t.r === 'unknown')) return 'Unknown';
  return ifAllPass;
}

// site: { zoneCode, acres, fire: true|false|null, sfha: true|false|null, publicOwner: bool }
// fire/sfha: null means the hazard service did not answer.
function checkLaws(site) {
  const z = zoneType(site.zoneCode);
  const zoneUnknown = z.type === 'unknown' || z.type === 'specific';
  const zoneTest = (ok, what) => ({
    t: `${what} (this site: ${z.label})`,
    r: zoneUnknown ? 'unknown' : ok ? PASS : FAIL,
  });
  const hazard = (hit, what) => ({ t: what, r: hit === null ? 'unknown' : hit ? FAIL : PASS });
  const out = [];

  // SB 9: HCD SB 9 fact sheet, Gov Code 65852.21, 66411.7
  {
    const tests = [
      zoneTest(z.type === 'sf', 'Lot is in a single-family residential zone'),
      { t: 'In an urbanized area', r: NC },
      { t: 'Not a historic district or listed historic resource', r: NC },
      { t: 'No tenant in the last 3 years, no rent control or affordability covenant, no Ellis Act withdrawal in 15 years', r: NC },
      { t: 'Not on listed sensitive lands (Gov Code 65913.4(a)(6)(B)-(K))', r: NC },
    ];
    out.push({ law: 'SB 9', cite: 'Gov Code §§ 65852.21, 66411.7', src: LAW_SOURCES.sb9, v: verdict(tests), tests });
  }

  // SB 684 / SB 1123 (Starter Home Revitalization Act): HCD fact sheet, Gov Code 65852.28, 66499.41
  {
    const a = site.acres;
    let size;
    if (a == null) size = { t: 'Lot is under 5 acres (size unknown)', r: 'unknown' };
    else if (Math.abs(a - 5) < 0.005) size = { t: `Lot is 5.00 acres: HCD's sheet says both "under five acres" and "5 acres or less". Sources differ`, r: 'unknown' };
    else size = { t: `Lot is under 5 acres (this site: ${a.toFixed(2)} acres)`, r: a < 5 ? PASS : FAIL };

    const tests = [];
    if (z.type === 'sf') {
      // SB 1123 extends the process to single-family zones; HCD titles it "Vacant Single-Family Lots".
      tests.push({ t: 'SB 1123: single-family zone (this site: single-family residential)', r: PASS });
      tests.push({ t: 'SB 1123: lot is vacant (not confirmed by free data)', r: 'unknown' });
      tests.push({ t: 'SB 1123 lot-size limit: not stated in the HCD fact sheet', r: 'unknown' });
    } else if (z.type === 'mixed') {
      tests.push({ t: 'Zone allows multifamily (mixed-use zones can qualify, per HCD letter to Hayward, Jan 2025): check the city zone', r: 'unknown' });
      tests.push(size);
    } else {
      tests.push(zoneTest(z.type === 'mf', 'Lot is zoned for multifamily residential'));
      tests.push(size);
    }
    tests.push(hazard(site.fire, 'Not in a fire hazard zone (HCD lists fire hazard zones as ineligible; LRA layer only)'));
    tests.push({ t: 'Ten or fewer units and lots', r: NC });
    tests.push({ t: 'In an incorporated city or large urban county; urban lot', r: NC });
    tests.push({ t: 'No displacement of rent-controlled or tenant-occupied housing; not farmland or wetlands', r: NC });
    out.push({ law: 'SB 684/1123', cite: 'Gov Code §§ 65852.28, 66499.41', src: LAW_SOURCES.facts, v: verdict(tests), tests });
  }

  // AB 2011: HCD fact sheet, Gov Code 65912.100-65912.140
  {
    const tests = [
      zoneTest(z.type === 'commercial' || z.type === 'mixed', 'Zone allows commercial uses (office, retail or parking)'),
      { t: 'Environmental criteria, replacement housing, vacant-site limits, density', r: NC },
      { t: 'Not exempted by the city under "exempt and replace"', r: NC },
      { t: 'Affordability pathway (100% lower income, or mixed-income) and prevailing-wage terms', r: NC },
    ];
    out.push({ law: 'AB 2011', cite: 'Gov Code §§ 65912.100–65912.140', src: LAW_SOURCES.facts, v: verdict(tests), tests });
  }

  // SB 4: HCD fact sheet, Gov Code 65913.16. Allowed in all zones; ownership is the key test.
  {
    const tests = [
      site.publicOwner
        ? { t: 'Owned by a religious institution or independent college as of Jan 1, 2024 (a public agency filed a surplus notice for this site)', r: FAIL }
        : { t: 'Owned by a religious institution or independent college as of Jan 1, 2024 (owner not in free data)', r: 'unknown' },
      hazard(site.fire, 'Not in a very high fire hazard severity zone (LRA layer)'),
      hazard(site.sfha, 'Not in a FEMA special flood hazard area (A or V zone)'),
      { t: 'In an urbanized area or urban cluster; 75% of perimeter adjoins urban uses', r: NC },
      { t: 'Not near listed industrial uses or a refinery; no earthquake fault zone, wetlands, farmland, hazardous waste', r: NC },
    ];
    out.push({ law: 'SB 4', cite: 'Gov Code § 65913.16', src: LAW_SOURCES.facts, v: verdict(tests), tests });
  }

  return { zone: z, laws: out };
}
