"""The cities the call list covers: the same 30 as the main page's city dropdown (html/app.js).

That dropdown lists every OC city with SCAG housing-element sites or an HCD surplus-land notice,
minus unincorporated county land (checked 2026-11-07). Laguna Woods is not in it.
Names are spelled as in SCAG's CITY field.
"""
CITIES = [
    'Aliso Viejo', 'Anaheim', 'Brea', 'Buena Park', 'Cypress', 'Dana Point', 'Fountain Valley',
    'Fullerton', 'Garden Grove', 'Irvine', 'La Habra', 'La Palma', 'Laguna Beach', 'Laguna Hills',
    'Laguna Niguel', 'Lake Forest', 'Los Alamitos', 'Mission Viejo', 'Newport Beach', 'Orange',
    'Placentia', 'San Clemente', 'San Juan Capistrano', 'Santa Ana', 'Seal Beach', 'Stanton',
    'Tustin', 'Villa Park', 'Westminster', 'Yorba Linda',
]
