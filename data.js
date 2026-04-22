

const countyData = [
  // California
  { fips:"06085", name:"Santa Clara County, CA",    income:145023, bachelors:57.2, tech_share:28.4, broadband:89.1, unemployment:3.1 },
  { fips:"06075", name:"San Francisco County, CA",  income:136692, bachelors:59.1, tech_share:22.7, broadband:87.4, unemployment:3.6 },
  { fips:"06081", name:"San Mateo County, CA",      income:138411, bachelors:55.4, tech_share:24.1, broadband:88.2, unemployment:3.0 },
  { fips:"06001", name:"Alameda County, CA",        income:107184, bachelors:49.8, tech_share:17.3, broadband:83.6, unemployment:4.2 },
  { fips:"06073", name:"San Diego County, CA",      income: 87209, bachelors:39.1, tech_share:11.4, broadband:81.0, unemployment:4.5 },
  { fips:"06037", name:"Los Angeles County, CA",    income: 74246, bachelors:33.2, tech_share: 9.8, broadband:79.2, unemployment:5.6 },
  // Washington
  { fips:"53033", name:"King County, WA",           income:112437, bachelors:55.3, tech_share:23.5, broadband:88.0, unemployment:3.3 },
  { fips:"53061", name:"Snohomish County, WA",      income: 89341, bachelors:37.4, tech_share:10.2, broadband:83.2, unemployment:4.1 },
  { fips:"53053", name:"Pierce County, WA",         income: 74018, bachelors:27.8, tech_share: 7.1, broadband:77.5, unemployment:5.2 },
  // New York
  { fips:"36061", name:"New York County, NY",       income: 93112, bachelors:62.1, tech_share:14.8, broadband:84.5, unemployment:5.1 },
  { fips:"36047", name:"Kings County, NY",          income: 60473, bachelors:34.2, tech_share: 7.6, broadband:74.8, unemployment:6.3 },
  { fips:"36059", name:"Nassau County, NY",         income:108294, bachelors:42.8, tech_share: 9.4, broadband:85.7, unemployment:3.9 },
  { fips:"36119", name:"Westchester County, NY",    income:104871, bachelors:50.2, tech_share:10.1, broadband:86.0, unemployment:4.0 },
  // Texas
  { fips:"48453", name:"Travis County, TX",         income: 86047, bachelors:48.2, tech_share:16.7, broadband:82.3, unemployment:3.5 },
  { fips:"48113", name:"Dallas County, TX",         income: 64302, bachelors:33.1, tech_share:11.2, broadband:76.4, unemployment:4.8 },
  { fips:"48201", name:"Harris County, TX",         income: 62118, bachelors:32.4, tech_share: 8.7, broadband:74.1, unemployment:5.4 },
  { fips:"48491", name:"Williamson County, TX",     income: 95284, bachelors:42.6, tech_share:14.3, broadband:84.1, unemployment:3.2 },
  { fips:"48029", name:"Bexar County, TX",          income: 60491, bachelors:28.9, tech_share: 7.8, broadband:73.2, unemployment:4.9 },
  // Colorado
  { fips:"08031", name:"Denver County, CO",         income: 72384, bachelors:49.3, tech_share:13.8, broadband:82.7, unemployment:4.1 },
  { fips:"08059", name:"Jefferson County, CO",      income: 86219, bachelors:46.5, tech_share:12.4, broadband:84.3, unemployment:3.6 },
  { fips:"08013", name:"Boulder County, CO",        income: 89471, bachelors:65.2, tech_share:18.2, broadband:86.1, unemployment:2.9 },
  // Massachusetts
  { fips:"25017", name:"Middlesex County, MA",      income:105342, bachelors:57.8, tech_share:19.4, broadband:87.3, unemployment:3.2 },
  { fips:"25025", name:"Suffolk County, MA",        income: 80129, bachelors:52.4, tech_share:14.7, broadband:83.1, unemployment:4.3 },
  { fips:"25009", name:"Essex County, MA",          income: 85047, bachelors:40.1, tech_share: 9.8, broadband:81.2, unemployment:3.9 },
  // Virginia
  { fips:"51059", name:"Fairfax County, VA",        income:128374, bachelors:60.4, tech_share:22.1, broadband:89.5, unemployment:2.8 },
  { fips:"51013", name:"Arlington County, VA",      income:122841, bachelors:73.1, tech_share:24.6, broadband:91.2, unemployment:2.5 },
  { fips:"51510", name:"Alexandria city, VA",       income:104293, bachelors:65.3, tech_share:18.9, broadband:88.7, unemployment:2.9 },
  // Illinois
  { fips:"17031", name:"Cook County, IL",           income: 68047, bachelors:38.2, tech_share: 9.7, broadband:80.1, unemployment:5.8 },
  { fips:"17043", name:"DuPage County, IL",         income: 94182, bachelors:49.7, tech_share:12.3, broadband:87.4, unemployment:3.4 },
  // North Carolina
  { fips:"37183", name:"Wake County, NC",           income: 83291, bachelors:49.2, tech_share:14.1, broadband:83.8, unemployment:3.5 },
  { fips:"37119", name:"Mecklenburg County, NC",    income: 74384, bachelors:44.6, tech_share:12.4, broadband:81.5, unemployment:4.1 },
  { fips:"37063", name:"Durham County, NC",         income: 68192, bachelors:49.8, tech_share:13.2, broadband:79.8, unemployment:4.4 },
  // Georgia
  { fips:"13121", name:"Fulton County, GA",         income: 78304, bachelors:49.2, tech_share:12.8, broadband:81.2, unemployment:4.6 },
  { fips:"13067", name:"Cobb County, GA",           income: 82471, bachelors:43.7, tech_share:11.4, broadband:83.1, unemployment:3.9 },
  // Florida
  { fips:"12086", name:"Miami-Dade County, FL",     income: 56284, bachelors:30.4, tech_share: 6.8, broadband:73.5, unemployment:5.1 },
  { fips:"12095", name:"Orange County, FL",         income: 60173, bachelors:31.2, tech_share: 7.4, broadband:74.3, unemployment:4.9 },
  { fips:"12057", name:"Hillsborough County, FL",   income: 62047, bachelors:34.1, tech_share: 8.1, broadband:75.8, unemployment:4.7 },
  // Ohio
  { fips:"39049", name:"Franklin County, OH",       income: 63182, bachelors:38.4, tech_share: 9.2, broadband:78.4, unemployment:4.3 },
  { fips:"39035", name:"Cuyahoga County, OH",       income: 54293, bachelors:35.7, tech_share: 7.1, broadband:74.1, unemployment:6.1 },
  // Michigan
  { fips:"26163", name:"Wayne County, MI",          income: 49047, bachelors:25.1, tech_share: 5.8, broadband:70.3, unemployment:7.2 },
  { fips:"26125", name:"Oakland County, MI",        income: 79284, bachelors:46.3, tech_share:11.2, broadband:84.6, unemployment:4.0 },
  { fips:"26065", name:"Ingham County, MI",         income: 56173, bachelors:42.1, tech_share: 9.1, broadband:76.8, unemployment:4.9 },
  // Pennsylvania
  { fips:"42101", name:"Philadelphia County, PA",   income: 52047, bachelors:30.1, tech_share: 7.4, broadband:71.2, unemployment:6.8 },
  { fips:"42003", name:"Allegheny County, PA",      income: 65284, bachelors:42.3, tech_share:10.8, broadband:79.7, unemployment:4.5 },
  // Oregon
  { fips:"41051", name:"Multnomah County, OR",      income: 72193, bachelors:48.3, tech_share:13.4, broadband:83.2, unemployment:4.4 },
  { fips:"41005", name:"Clackamas County, OR",      income: 82047, bachelors:38.2, tech_share: 9.7, broadband:81.4, unemployment:4.1 },
  // Minnesota
  { fips:"27053", name:"Hennepin County, MN",       income: 80293, bachelors:50.4, tech_share:13.6, broadband:84.9, unemployment:3.7 },
  { fips:"27123", name:"Ramsey County, MN",         income: 63047, bachelors:40.8, tech_share: 9.4, broadband:79.3, unemployment:4.8 },
  // Wisconsin
  { fips:"55025", name:"Dane County, WI",           income: 76384, bachelors:54.1, tech_share:12.8, broadband:84.1, unemployment:2.8 },
  { fips:"55079", name:"Milwaukee County, WI",      income: 51047, bachelors:28.4, tech_share: 5.9, broadband:70.1, unemployment:6.9 },
  // Indiana
  { fips:"18097", name:"Marion County, IN",         income: 56293, bachelors:34.2, tech_share: 8.4, broadband:75.4, unemployment:5.3 },
  // Arizona
  { fips:"04013", name:"Maricopa County, AZ",       income: 72047, bachelors:36.4, tech_share:10.7, broadband:79.2, unemployment:4.3 },
  { fips:"04019", name:"Pima County, AZ",           income: 57184, bachelors:34.8, tech_share: 7.8, broadband:73.8, unemployment:5.1 },
  // Nevada
  { fips:"32003", name:"Clark County, NV",          income: 62047, bachelors:25.4, tech_share: 5.4, broadband:74.2, unemployment:5.8 },
  // Tennessee
  { fips:"47037", name:"Davidson County, TN",       income: 66293, bachelors:42.8, tech_share:10.2, broadband:79.8, unemployment:3.8 },
  // Missouri
  { fips:"29189", name:"St. Louis County, MO",      income: 72184, bachelors:44.1, tech_share:10.9, broadband:81.3, unemployment:4.0 },
  // Maryland
  { fips:"24031", name:"Montgomery County, MD",     income:113284, bachelors:60.2, tech_share:18.4, broadband:88.1, unemployment:3.1 },
  { fips:"24033", name:"Prince George's County, MD",income: 80047, bachelors:33.4, tech_share: 8.2, broadband:79.6, unemployment:4.6 },
  // Rural low-income anchors (outliers for contrast)
  { fips:"13307", name:"Webster County, GA",        income: 28173, bachelors:12.1, tech_share: 1.2, broadband:48.3, unemployment:9.1 },
  { fips:"48301", name:"Loving County, TX",         income: 31047, bachelors:11.8, tech_share: 0.8, broadband:42.1, unemployment:7.4 }
];

/* ── ATTRIBUTE CONFIG ──────────────────────────────────────────
   Each key maps to a field in every countyData record above.
   These match the column headers in county_tech_vitality_data.csv.
─────────────────────────────────────────────────────────────── */
const attrs = {
  income: {
    label:  "Median Household Income",
    csvCol: "median_household_income",
    fmt:    d => "$" + d3.format(",")(Math.round(d)),
    color:  "#00e5ff",   // cyan
    invert: false
  },
  bachelors: {
    label:  "Bachelor's Degree %",
    csvCol: "bachelors_pct",
    fmt:    d => d.toFixed(1) + "%",
    color:  "#a78bfa",   // violet
    invert: false
  },
  tech_share: {
    label:  "Tech Employment %",
    csvCol: "tech_employment_pct",
    fmt:    d => d.toFixed(1) + "%",
    color:  "#34d399",   // emerald
    invert: false
  },
  broadband: {
    label:  "Broadband Access %",
    csvCol: "broadband_access_pct",
    fmt:    d => d.toFixed(1) + "%",
    color:  "#fbbf24",   // amber
    invert: false
  },
  unemployment: {
    label:  "Unemployment Rate %",
    csvCol: "unemployment_rate",
    fmt:    d => d.toFixed(1) + "%",
    color:  "#f87171",   // red (inverted — lower is better)
    invert: true
  }
};

/* Build the FIPS → record lookup once at parse time */
const dataByFips = {};
countyData.forEach(d => { dataByFips[d.fips] = d; });
