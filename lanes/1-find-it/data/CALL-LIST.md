# Call list: top sites per law per city

**Prototype only. Not legal or financial advice.** These are leads to research, not approved sites. Owner and willingness to sell are unknown for every site.

**How sites are ranked (ASSUMPTION: the team's judgment):** only parcels the screen marked "Possible" (SB 1123: vacant single-family lots; SB 4: church or college land use). Flood-zone parcels and SCAG "parent" outlines (drawn around other parcels) are left out. AB 2011 and SB 684 rank vacant land and parking first, then retail and office, then other non-housing uses, then existing housing (tenants may live there); bigger lots first within each group. SB 9, SB 1123 and SB 4 rank by lot size. Full top 20 in `call-list.csv`; rules in `scripts/rank_sites.py`.

**Open the map link first.** About 4 in 10 sites have no county site address. Large lots with no address can be common areas, slopes or utility land rather than buildable lots.

## AB 2011

Check before calling: Commercial corridor frontage; industrial neighbors; affordability and prevailing-wage terms; city "exempt and replace" list; tenants on site.

**Santa Ana**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 40006108 | 6.147 | P | Urban Vacant | [map](https://www.google.com/maps?q=33.749232,-117.841937) |
| 2 | unknown | 39616109 | 3.294 | C4 | Public Parking Facilities | [map](https://www.google.com/maps?q=33.760835,-117.852757) |
| 3 | 445 W CIVIC CENTER | 00518143 | 3.248 | P | Public Parking Facilities | [map](https://www.google.com/maps?q=33.752558,-117.871575) |
| 4 | unknown | 40221109 | 1.373 | C1 | Urban Vacant | [map](https://www.google.com/maps?q=33.745103,-117.841108) |
| 5 | unknown | 40006105 | 1.316 | P | Urban Vacant | [map](https://www.google.com/maps?q=33.748605,-117.841086) |
| 6 | unknown | 39631213 | 1.198 | C1 | Urban Vacant | [map](https://www.google.com/maps?q=33.760596,-117.833942) |
| 7 | unknown | 00316247 | 1.122 | C5 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.76041,-117.860827) |
| 8 | unknown | 39631214 | 1.081 | C1 | Urban Vacant | [map](https://www.google.com/maps?q=33.761272,-117.834068) |
| 9 | unknown | 40701436 | 0.936 | C1 | Urban Vacant | [map](https://www.google.com/maps?q=33.727784,-117.903749) |
| 10 | unknown | 40006107 | 0.893 | P | Urban Vacant | [map](https://www.google.com/maps?q=33.74861,-117.842483) |

**Anaheim**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 08329095 | 2.796 | O-L | Vacant | [map](https://www.google.com/maps?q=33.79729,-117.894681) |
| 2 | unknown | 07309045 | 1.581 | C-G | Vacant | [map](https://www.google.com/maps?q=33.856638,-117.919234) |
| 3 | unknown | 03407083 | 1.189 | C-G | Vacant | [map](https://www.google.com/maps?q=33.833089,-117.936261) |
| 4 | unknown | 07309039 | 1.132 | C-G | Vacant | [map](https://www.google.com/maps?q=33.854944,-117.918685) |
| 5 | unknown | 03407077 | 0.838 | C-G | Vacant | [map](https://www.google.com/maps?q=33.833051,-117.935405) |
| 6 | unknown | 25363128 | 0.835 | C-G | Vacant | [map](https://www.google.com/maps?q=33.812745,-117.874576) |
| 7 | unknown | 35408116 | 0.602 | C-G | Vacant | [map](https://www.google.com/maps?q=33.869154,-117.748248) |
| 8 | unknown | 07309035 | 0.584 | C-G | Vacant | [map](https://www.google.com/maps?q=33.854777,-117.918945) |
| 9 | 1881 W BALL RD | 12829136 | 0.429 | C-G | Vacant | [map](https://www.google.com/maps?q=33.818198,-117.949829) |
| 10 | 944 S NUTWOOD ST | 12829138 | 0.351 | C-G | Vacant | [map](https://www.google.com/maps?q=33.818482,-117.949752) |

**Garden Grove**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 08970101 | 1.646 | PUD(M) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.774784,-117.95594) |
| 2 | unknown | 08970118 | 1.109 | PUD(M) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.775027,-117.956976) |
| 3 | 12252 HARBOR BLVD | 23152102 | 0.921 | PUD(C) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.785061,-117.914113) |
| 4 | 12202 HARBOR BLVD | 23149121 | 0.804 | PUD(C) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.785804,-117.914287) |
| 5 | 12222 HARBOR BLVD | 23149120 | 0.8 | PUD(C) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.785433,-117.914231) |
| 6 | 12292 HARBOR BLVD | 23152105 | 0.631 | PUD(C) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.784477,-117.91414) |
| 7 | 12272 HARBOR BLVD | 23152104 | 0.554 | PUD(C) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.784679,-117.914116) |
| 8 | unknown | 09913434 | 0.532 | PUD(R-1) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.769917,-117.939141) |
| 9 | 7051 GARDEN GROVE BLVD | 21501701 | 0.516 | C-2 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.774036,-118.009986) |
| 10 | 5262 LAMPSON AVE | 21729301 | 0.483 | C-1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.780858,-118.041043) |

**Stanton**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 10632 BEACH BLVD | 12643415 | 0.157 | CN | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.808092,-117.992793) |
| 2 | 12131 BEACH BLVD | 13140113 | 6.237 | CG | Retail Stores and Commercial Services | [map](https://www.google.com/maps?q=33.786866,-117.99405) |
| 3 | 12540 BEACH BLVD | 13149108 | 5.822 | CG | Retail Stores and Commercial Services | [map](https://www.google.com/maps?q=33.779863,-117.99074) |
| 4 | 11091 BEACH BLVD | 13109167 | 5.731 | CG | Retail Stores and Commercial Services | [map](https://www.google.com/maps?q=33.801863,-117.994791) |
| 5 | 12820 BEACH BLVD | 13156223 | 5.407 | CG | Retail Stores and Commercial Services | [map](https://www.google.com/maps?q=33.774725,-117.991275) |
| 6 | unknown | 13170112 | 3.946 | CG | Retail Stores and Commercial Services | [map](https://www.google.com/maps?q=33.775344,-117.994121) |
| 7 | 12736 BEACH BLVD | 13150104 | 3.767 | CG | Retail Stores and Commercial Services | [map](https://www.google.com/maps?q=33.778423,-117.992208) |
| 8 | 7450 KATELLA AVE | 13164113 | 3.49 | CN | Hotels and Motels | [map](https://www.google.com/maps?q=33.802153,-118.002885) |
| 9 | 10500 S MAGNOLIA AVE | 12746102 | 3.16 | CG | Retail Centers (Non-Strip With Contiguous Interconnected Off-Street Parking) | [map](https://www.google.com/maps?q=33.809817,-117.974651) |
| 10 | 8210 KATELLA AVE | 13110120 | 3.023 | BP | General Office Use | [map](https://www.google.com/maps?q=33.802315,-117.989159) |

## SB 684

Check before calling: Ten or fewer homes and lots; no tenant or rent-controlled housing removed; utilities; urban lot.

**Santa Ana**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 40017269 | 2.502 | R4 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.755404,-117.840309) |
| 2 | unknown | 40015367 | 2.498 | R4 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.755395,-117.837748) |
| 3 | unknown | 40017155 | 2.023 | R4 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.75363,-117.840014) |
| 4 | 11901 NEWPORT AVE |  | 1.174 | R2 | Urban Vacant | [map](https://www.google.com/maps?q=33.727918,-117.910784) |
| 5 | unknown | 40011105 | 0.874 | R4 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.75443,-117.84227) |
| 6 | unknown | 40011112 | 0.791 | R4 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.756769,-117.842442) |
| 7 | unknown | 40017154 | 0.582 | R4 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.75353,-117.839571) |
| 8 | unknown | 40015366 | 0.561 | R4 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.755385,-117.837758) |
| 9 | unknown | 40017268 | 0.555 | R4 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.755381,-117.840291) |
| 10 | 1113 N BEWLEY ST | 19810220 | 0.464 | R2 | Urban Vacant | [map](https://www.google.com/maps?q=33.754806,-117.917422) |

**Anaheim**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 13446137 | 0.682 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.823561,-118.013467) |
| 2 | 3175 W BALL RD | 07988234 | 0.364 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.817685,-118.00177) |
| 3 | 314 E JULIANNE ST | 26716314 | 0.186 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.848431,-117.91491) |
| 4 | 1130 W DIAMOND ST | 25503201 | 0.154 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.833317,-117.92887) |
| 5 | unknown | 03712429 | 0.148 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.830695,-117.905155) |
| 6 | 326 S KROEGER ST | 03711413 | 0.143 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.833787,-117.906611) |
| 7 | 322 S KROEGER ST | 03711414 | 0.143 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.833945,-117.90674) |
| 8 | 316 S KROEGER ST | 03711415 | 0.143 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.834032,-117.906625) |
| 9 | 312 S KROEGER ST | 03711416 | 0.143 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.834185,-117.90674) |
| 10 | unknown | 03712425 | 0.142 | RM-4 | Vacant | [map](https://www.google.com/maps?q=33.832074,-117.905707) |

**Garden Grove**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 14212 BROOKHURST ST | 09917310 | 0.925 | R-3 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.75619,-117.954309) |
| 2 | unknown | 09702314 | 0.206 | R-3 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.771242,-117.98632) |
| 3 | unknown | 21513245 | 0.138 | R-3 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.779181,-117.978908) |
| 4 | unknown | 09904302 | 0.135 | R-2 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.768489,-117.951628) |
| 5 | unknown | 08969109 | 0.08 | PUD(R-3) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.774223,-117.953355) |
| 6 | unknown | 09969167 | 0.04 | PUD(R-3) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.773524,-117.952331) |
| 7 | unknown | 08968177 | 0.027 | PUD(R-3) | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.774264,-117.952327) |
| 8 | unknown | 21513249 | 0.026 | R-3 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.777787,-117.979908) |
| 9 | unknown | 09821106 | 0.024 | R-2 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.768968,-117.958711) |
| 10 | unknown | 09720221 | 0.023 | R-3 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.771183,-117.984955) |

**Stanton**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 07977136 | 1.24 | RH | Public Parking Facilities | [map](https://www.google.com/maps?q=33.807356,-118.007994) |
| 2 | unknown | 13149243 | 1.131 | RH | Vacant | [map](https://www.google.com/maps?q=33.780076,-117.989084) |
| 3 | unknown | 12648129 | 0.254 | RH | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.8079,-117.979152) |
| 4 | unknown | 12648215 | 0.213 | RH | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.807514,-117.976224) |
| 5 | unknown | 12648115 | 0.208 | RH | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.808235,-117.976021) |
| 6 | unknown | 13149237 | 0.207 | RH | Vacant | [map](https://www.google.com/maps?q=33.780639,-117.989197) |
| 7 | unknown | 12648205 | 0.182 | RH | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.807397,-117.97826) |
| 8 | unknown | 12648111 | 0.175 | RH | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.80828,-117.977139) |
| 9 | unknown | 12648112 | 0.175 | RH | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.808171,-117.976512) |
| 10 | unknown | 12648113 | 0.175 | RH | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.808246,-117.976531) |

## SB 1123

Check before calling: Confirm the lot is vacant; SB 1123 lot-size limit (read the statute); ten or fewer homes.

**Santa Ana**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 39904166 | 2.796 | R1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.760986,-117.901563) |
| 2 | unknown | 39904169 | 1.639 | R1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.76096,-117.901417) |
| 3 | unknown | 00312225 | 0.645 | R1 | Urban Vacant | [map](https://www.google.com/maps?q=33.764032,-117.864574) |
| 4 | unknown | 39904167 | 0.523 | R1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.760876,-117.900985) |
| 5 | unknown | 01115410 | 0.494 | R1 | Urban Vacant | [map](https://www.google.com/maps?q=33.744294,-117.84603) |
| 6 | unknown | 40018116 | 0.479 | R1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.752333,-117.844478) |
| 7 | 1517 N FREEMAN ST | 40532114 | 0.415 | R1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.758441,-117.878513) |
| 8 | 4440 W MC FADDEN AVE | 18808243 | 0.412 | R1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.737798,-117.928302) |
| 9 | unknown | 40532113 | 0.408 | R1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.758462,-117.878116) |
| 10 | unknown | 40532108 | 0.375 | R1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.758554,-117.877413) |

**Anaheim**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 35627104 | 4.167 | RH-2 | Vacant | [map](https://www.google.com/maps?q=33.853144,-117.772018) |
| 2 | 391 PERALTA HILLS DR | 36124109 | 3.071 | RH-1 | Vacant | [map](https://www.google.com/maps?q=33.844372,-117.822601) |
| 3 | unknown | 36166115 | 1.996 | RH-3 | Vacant | [map](https://www.google.com/maps?q=33.838707,-117.80776) |
| 4 | 200 S ORANGE ACRES DR | 36119105 | 1.091 | RH-1 | Vacant | [map](https://www.google.com/maps?q=33.843184,-117.812851) |
| 5 | unknown | 36123157 | 1.062 | RH-1 | Vacant | [map](https://www.google.com/maps?q=33.844168,-117.815489) |
| 6 | 4910 E SANTA ANA CANYON RD | 36122207 | 1.017 | RH-1 | Vacant | [map](https://www.google.com/maps?q=33.849735,-117.810531) |
| 7 | 527 PERALTA HILLS DR | 36124225 | 1.011 | RH-1 | Vacant | [map](https://www.google.com/maps?q=33.842037,-117.817685) |
| 8 | unknown | 36123104 | 1.008 | RH-1 | Vacant | [map](https://www.google.com/maps?q=33.844672,-117.816968) |
| 9 | unknown | 36123155 | 1.008 | RH-1 | Vacant | [map](https://www.google.com/maps?q=33.845034,-117.815127) |
| 10 | unknown | 36123154 | 1.002 | RH-1 | Vacant | [map](https://www.google.com/maps?q=33.844932,-117.815542) |

**Garden Grove**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 09702401 | 0.448 | R-1 | Vacant | [map](https://www.google.com/maps?q=33.770411,-117.989582) |
| 2 | unknown | 09702402 | 0.274 | R-1 | Vacant | [map](https://www.google.com/maps?q=33.770421,-117.989064) |
| 3 | unknown | 09702403 | 0.263 | R-1 | Vacant | [map](https://www.google.com/maps?q=33.770399,-117.988601) |
| 4 | unknown | 09702404 | 0.256 | R-1 | Vacant | [map](https://www.google.com/maps?q=33.770414,-117.988261) |
| 5 | unknown | 09702405 | 0.239 | R-1 | Vacant | [map](https://www.google.com/maps?q=33.770385,-117.987775) |
| 6 | unknown | 09702406 | 0.235 | R-1 | Vacant | [map](https://www.google.com/maps?q=33.770432,-117.987553) |
| 7 | unknown | 09702407 | 0.222 | R-1 | Vacant | [map](https://www.google.com/maps?q=33.770389,-117.987015) |
| 8 | unknown | 09702408 | 0.212 | R-1 | Vacant | [map](https://www.google.com/maps?q=33.770437,-117.986797) |
| 9 | unknown | 23147119 | 0.208 | R-1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.785114,-117.916046) |
| 10 | 12791 LEROY ST | 13342155 | 0.202 | R-1 | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.776705,-117.972294) |

**Stanton**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 10732 ROSE AVE | 07932010 | 1.753 | RM | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.806909,-117.995825) |
| 2 | unknown | 13123119 | 0.993 | RE | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.7916,-117.98878) |
| 3 | unknown | 07935208 | 0.158 | RL | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.805182,-117.996307) |
| 4 | unknown | 13155321 | 0.124 | RL | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.777154,-117.989969) |
| 5 | 7875 GRAND AVE | 07934109 | 0.101 | RL | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.805805,-117.994875) |
| 6 | unknown | 07936301 | 0.086 | RL | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.80558,-117.999129) |
| 7 | unknown | 07936316 | 0.072 | RL | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.805663,-117.998815) |
| 8 | unknown | 12635141 | 0.065 | RL | Vacant Undifferentiated | [map](https://www.google.com/maps?q=33.813957,-117.97997) |

## SB 4

Check before calling: Owner is the religious institution or an independent (private nonprofit) college as of Jan 1, 2024; public colleges do not qualify (check the Assessor); perimeter mostly urban; industrial neighbors.

**Santa Ana**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 2914 W EDINGER AVE | 40803105 | 22.003 | O | Colleges and Universities | [map](https://www.google.com/maps?q=33.72597,-117.908533) |
| 2 | 3800 S FAIRVIEW ST | 41427102 | 9.994 | M1 | Religious Facilities | [map](https://www.google.com/maps?q=33.696899,-117.908997) |
| 3 | 1010 N TUSTIN AVE B,E | 40016410 | 8.555 | SD95 | Religious Facilities | [map](https://www.google.com/maps?q=33.753746,-117.835391) |
| 4 | 2130 N GRAND AVE | 39619144 | 6.204 | R1 | Religious Facilities | [map](https://www.google.com/maps?q=33.765127,-117.852672) |
| 5 | 3401 S GREENVILLE ST | 41254102 | 4.997 | SD51 | Religious Facilities | [map](https://www.google.com/maps?q=33.701662,-117.903214) |
| 6 | 288 S HARBOR BLVD | 18804106 | 4.545 | SP2 | Religious Facilities | [map](https://www.google.com/maps?q=33.742902,-117.921258) |
| 7 | 1025 W MEMORY LN | 00228116 | 3.769 | R1 | Religious Facilities | [map](https://www.google.com/maps?q=33.773894,-117.879765) |
| 8 | 2525 N GRAND AVE | 39636105 | 3.751 | C5 | Religious Facilities | [map](https://www.google.com/maps?q=33.770908,-117.851558) |
| 9 | 651 SUNFLOWER AVE | 41011102 | 3.587 | SD94 | Religious Facilities | [map](https://www.google.com/maps?q=33.694679,-117.875692) |
| 10 | 2500 N BRISTOL ST | 00130315 | 2.838 | R1 | Religious Facilities | [map](https://www.google.com/maps?q=33.770536,-117.885391) |

**Anaheim**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 1111 N BROOKHURST ST | 07106099 | 10.247 | C-G | Religious Facilities | [map](https://www.google.com/maps?q=33.84809,-117.961063) |
| 2 | 3330 E MIRALOMA AVE | 34508123 | 9.134 | SP 2015-1 | Religious Facilities | [map](https://www.google.com/maps?q=33.85884,-117.851904) |
| 3 | 222 N EAST ST | 03535038 | 8.565 | T | Religious Facilities | [map](https://www.google.com/maps?q=33.840246,-117.901399) |
| 4 | 2463 W LA PALMA AVE | 07154101 | 7.486 | I | Religious Facilities | [map](https://www.google.com/maps?q=33.849657,-117.971074) |
| 5 | 5800 E SANTA ANA CANYON RD | 36302201 | 6.024 | T | Religious Facilities | [map](https://www.google.com/maps?q=33.851192,-117.784402) |
| 6 | 1770 W CERRITOS AVE | 12851102 | 5.001 | T | Religious Facilities | [map](https://www.google.com/maps?q=33.809623,-117.945236) |
| 7 | 315 S KNOTT | 13408246 | 4.962 | T | Religious Facilities | [map](https://www.google.com/maps?q=33.827574,-118.011818) |
| 8 | 1900 CRESCENT AVE | 07207135 | 4.705 | I | Religious Facilities | [map](https://www.google.com/maps?q=33.839027,-117.951224) |
| 9 | 270 E PALAIS RD | 08248208 | 4.69 | I | Religious Facilities | [map](https://www.google.com/maps?q=33.813122,-117.903347) |
| 10 | 405 N DALE ST | 07056242 | 4.463 | RS-2 | Religious Facilities | [map](https://www.google.com/maps?q=33.836619,-117.985413) |

**Garden Grove**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 10212 STANFORD AVE | 08966224 | 4.836 | R-3 | Religious Facilities | [map](https://www.google.com/maps?q=33.776752,-117.954647) |
| 2 | 11832 EUCLID ST | 09064102 | 4.617 | R-1 | Religious Facilities | [map](https://www.google.com/maps?q=33.790946,-117.940073) |
| 3 | 12901 EUCLID ST | 09016337 | 3.947 | CC_3 | Colleges and Universities | [map](https://www.google.com/maps?q=33.775549,-117.93917) |
| 4 | 8421 ORANGEWOOD AVE | 13116105 | 3.886 | R-1 | Religious Facilities | [map](https://www.google.com/maps?q=33.796218,-117.985516) |
| 5 | 5802 SANTA CATALINA AVE | 22421201 | 3.024 | R-1 | Religious Facilities | [map](https://www.google.com/maps?q=33.791139,-118.031907) |
| 6 | 12301 MAGNOLIA ST | 13320145 | 2.996 | R-1 | Religious Facilities | [map](https://www.google.com/maps?q=33.783465,-117.976225) |
| 7 | 12160 VALLEY VIEW ST | 22425108 | 2.989 | C-2 | Religious Facilities | [map](https://www.google.com/maps?q=33.786122,-118.027631) |
| 8 | 11082 STANFORD | 09014144 | 2.982 | CC_OS | Religious Facilities | [map](https://www.google.com/maps?q=33.777327,-117.939254) |
| 9 | 13261 DUNKLEE AVE | 23112103 | 2.82 | R-1 | Religious Facilities | [map](https://www.google.com/maps?q=33.777699,-117.901181) |
| 10 | 12722 9TH ST | 09031239 | 2.672 | R-1 | Religious Facilities | [map](https://www.google.com/maps?q=33.778361,-117.931595) |

**Stanton**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 7272 CERRITOS AVE | 07954143 | 1.274 | RM | Religious Facilities | [map](https://www.google.com/maps?q=33.809561,-118.005379) |
| 2 | unknown | 07954103 | 0.449 | RM | Religious Facilities | [map](https://www.google.com/maps?q=33.80955,-118.005799) |
| 3 | 10591 FLOWER AVE | 07933407 | 0.293 | RM | Religious Facilities | [map](https://www.google.com/maps?q=33.808742,-117.994721) |
| 4 | 10901 BEACH BLVD | 07934215 | 0.226 | CN | Religious Facilities | [map](https://www.google.com/maps?q=33.804058,-117.993732) |
| 5 | 10891 BEACH BLVD | 07934204 | 0.076 | CN | Religious Facilities | [map](https://www.google.com/maps?q=33.804162,-117.993582) |
| 6 | unknown | 07954156 | 0.046 | RM | Religious Facilities | [map](https://www.google.com/maps?q=33.809459,-118.006541) |
| 7 | unknown | 07954157 | 0.016 | RM | Religious Facilities | [map](https://www.google.com/maps?q=33.808921,-118.005047) |

## SB 9

Check before calling: Tenants in last 3 years; rent control or covenant; owner-occupancy affidavit (waived for nonprofits and land trusts); historic status; 40% split rule.

**Santa Ana**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | unknown | 41222001 | 8.922 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.697411,-117.894879) |
| 2 | unknown | 41222007 | 6.585 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.699035,-117.894842) |
| 3 | 615 W SANTA CLARA AVE | 00207128 | 1.637 | R1 | High Density Single Family Residential (9 or more DUs/ac) | [map](https://www.google.com/maps?q=33.767409,-117.874298) |
| 4 | 803 S SULLIVAN ST | 40706249 | 1.453 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.737174,-117.901948) |
| 5 | 1221 N MAR LES DR | 19815101 | 0.994 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.756043,-117.905501) |
| 6 | 2032 CIVIC CENTER DRIVE W | 00731104 | 0.892 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.750856,-117.897871) |
| 7 | unknown | 19834265 | 0.829 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.748009,-117.910736) |
| 8 | 2122 N FLOWER ST | 00120108 | 0.792 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.764954,-117.876652) |
| 9 | 2046 N FLOWER ST | 00120110 | 0.764 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.764235,-117.876703) |
| 10 | 2620 N SANTIAGO AVE | 00303218 | 0.729 | R1 | Single Family Residential | [map](https://www.google.com/maps?q=33.772315,-117.86093) |

**Anaheim**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 561 S PERALTA HILLS DR | 36117107 | 5.136 | RH-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.840899,-117.816558) |
| 2 | 860 S PERALTA HILLS DR | 36121168 | 4.476 | RH-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.848499,-117.809852) |
| 3 | 6255 E FOXGLEN DR | 35641104 | 4.135 | RH-2 | Single Family Residential | [map](https://www.google.com/maps?q=33.850339,-117.772765) |
| 4 | 601 S PERALTA HILLS DR | 36117122 | 3.522 | RH-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.841831,-117.815302) |
| 5 | 301 S PERALTA HILLS DR | 36125205 | 2.782 | RH-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.841781,-117.822504) |
| 6 | 6263 E TRAIL DR | 35627113 | 2.242 | RH-2 | Single Family Residential | [map](https://www.google.com/maps?q=33.851921,-117.77137) |
| 7 | 112 S MONTGOMERY WAY | 36122140 | 2.231 | RH-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.848848,-117.813282) |
| 8 | 745 S PERALTA HILLS DR | 36120111 | 2.186 | RH-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.843757,-117.810566) |
| 9 | 571 S PERALTA HILLS DR | 36123201 | 2.16 | RH-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.84374,-117.816843) |
| 10 | 175 S HEATH TER | 35627102 | 2.148 | RH-2 | Single Family Residential | [map](https://www.google.com/maps?q=33.852907,-117.770519) |

**Garden Grove**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 9282 ROYAL PALM BLVD | 13232104 | 1.522 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.794292,-117.971289) |
| 2 | unknown | 09918461 | 1.49 | PUD(R-1) | Single Family Residential | [map](https://www.google.com/maps?q=33.752739,-117.939845) |
| 3 | 9392 TOWN/COUNTRY DR | 13233140 | 1.393 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.793408,-117.969033) |
| 4 | unknown |  | 1.285 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.789416,-117.979656) |
| 5 | 9722 STANFORD AVE | 13339145 | 1.219 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.777175,-117.963162) |
| 6 | 11252 CHAPMAN AVE | 09027411 | 1.108 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.788221,-117.936593) |
| 7 | 9631 STANFORD AVE | 13333128 | 1.097 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.778191,-117.964869) |
| 8 | 12661 GILBERT ST | 13331144 | 1.076 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.778908,-117.967784) |
| 9 | 5856 BELGRAVE AVE | 22424313 | 0.93 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.785166,-118.031908) |
| 10 | 11862 LAMPSON AVE | 09059424 | 0.909 | R-1 | Single Family Residential | [map](https://www.google.com/maps?q=33.781204,-117.925514) |

**Stanton**

| # | Address | APN | Acres | Zone | Existing use | Map |
|---|---|---|---|---|---|---|
| 1 | 11662 COURT LN | 13122105 | 1.32 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.793404,-117.990446) |
| 2 | 8181 LA MONTE RD | 13122107 | 1.256 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.793393,-117.989332) |
| 3 | 11601 COURT LN | 13121116 | 1.252 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.794069,-117.991256) |
| 4 | 11631 COURT LN | 13122102 | 1.249 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.793625,-117.991287) |
| 5 | 10681 SHERRILL ST | 12648226 | 1.127 | RL | Single Family Residential | [map](https://www.google.com/maps?q=33.807452,-117.979617) |
| 6 | 8131 BEVER PL | 13123122 | 1.027 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.791565,-117.990469) |
| 7 | 8191 BEVER PL | 13123118 | 1.001 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.79158,-117.989149) |
| 8 | 8281 HYNES RD | 13121111 | 0.896 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.794996,-117.988946) |
| 9 | 8092 HYNES RD | 13121117 | 0.796 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.794518,-117.991045) |
| 10 | unknown | 13121122 | 0.758 | RE | Single Family Residential | [map](https://www.google.com/maps?q=33.79408,-117.99041) |
