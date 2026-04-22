
// ── APPLICATION STATE ────────────────────────────────────────
let currentAttr = "income";   // active attribute key (matches attrs{})
let sortDesc    = true;        // bar chart sort direction
let pinnedFips  = null;        // clicked/locked county FIPS string
let hoveredFips = null;        // currently hovered county FIPS string

// ── D3 SELECTIONS ────────────────────────────────────────────
const mapSvg = d3.select("#map-svg");
let mapGroup, countyPaths, pathFn, zoomBehavior;
let barGroups, barX, barY;
const BAR_N = 20;   // number of counties shown in bar chart

// ── TOOLTIP ──────────────────────────────────────────────────
const tooltip = d3.select("#tooltip");
const ttInner  = tooltip.select(".tt-inner");

/* ================================================================
   BOOT — load TopoJSON then draw everything
================================================================ */
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json")
  .then(us => {
    document.getElementById("map-loading").style.display = "none";

    // Fade hint after 5 s
    setTimeout(() => {
      const h = document.getElementById("zoom-hint");
      if (h) h.style.opacity = "0";
    }, 5000);

    setupMap(us);
    updateStats();
    drawBarChart();
  })
  .catch(err => {
    document.getElementById("map-loading").textContent =
      "⚠ Map failed to load. Open via Live Server — not file://.";
    console.error(err);
  });

/* ================================================================
   MAP  —  AlbersUSA choropleth with zoom + pan
================================================================ */
function setupMap(us) {
  const panel = document.getElementById("map-panel");
  const W = panel.clientWidth;
  const H = panel.clientHeight;

  // AlbersUSA: the standard projection for 50-state U.S. choropleths
  const projection = d3.geoAlbersUsa()
    .fitSize([W * 0.96, H * 0.96],
             topojson.feature(us, us.objects.counties));

  pathFn = d3.geoPath().projection(projection);
  mapSvg.attr("viewBox", `0 0 ${W} ${H}`);

  // All geographic elements live inside mapGroup so zoom moves them together
  mapGroup = mapSvg.append("g");

  // ── COUNTY PATHS ──────────────────────────────────────────
  countyPaths = mapGroup.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
      // Counties with data get the "county" class; others get "no-data"
      .attr("class", d => dataByFips[d.id] ? "county" : "county no-data")
      .attr("d", pathFn)

      // RETRIEVE: hover → tooltip + info box + highlight matching bar
      .on("mousemove", function(event, d) {
        if (!dataByFips[d.id]) return;
        hoveredFips = d.id;
        showTooltip(event, d.id);
        if (!pinnedFips) updateInfoBox(d.id);
        highlightBar(d.id);
      })
      .on("mouseleave", function() {
        hoveredFips = null;
        hideTooltip();
        if (!pinnedFips) updateInfoBox(null);
        highlightBar(null);
      })

      // RETRIEVE: click → pin/unpin county
      .on("click", function(event, d) {
        if (!dataByFips[d.id]) return;
        pinnedFips = (pinnedFips === d.id) ? null : d.id;
        updateInfoBox(pinnedFips || hoveredFips);
        highlightBar(pinnedFips);
        countyPaths.classed("highlighted", dd => dd.id === pinnedFips);
      });

  // ── STATE BORDERS ─────────────────────────────────────────
  // mesh with (a !== b) draws only shared edges once — avoids duplicates
  mapGroup.append("path")
    .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
    .attr("class", "state-borders")
    .attr("d", pathFn);

  // ── ZOOM + PAN ────────────────────────────────────────────
  zoomBehavior = d3.zoom()
    .scaleExtent([1, 10])                        // 1× to 10× zoom
    .translateExtent([[0, 0], [W, H]])           // can't pan off-screen
    .on("zoom", event => mapGroup.attr("transform", event.transform));

  mapSvg.call(zoomBehavior);

  // Reset zoom button — smooth transition back to identity transform
  document.getElementById("zoom-reset").addEventListener("click", () => {
    mapSvg.transition().duration(500)
      .call(zoomBehavior.transform, d3.zoomIdentity);
  });

  colorMap(); // Apply initial choropleth colors
}

/* ── COLOR SCALE ─────────────────────────────────────────────
   Sequential scale: dark (#1c2030) → attribute accent color.
   Unemployment is inverted because lower values are better.
──────────────────────────────────────────────────────────── */
function getColorScale() {
  const a    = attrs[currentAttr];
  const vals = countyData.map(d => d[currentAttr]);
  const [lo, hi] = d3.extent(vals);
  const interp = d3.interpolate("#1c2030", a.color);
  return a.invert
    ? d3.scaleSequential().domain([hi, lo]).interpolator(interp)
    : d3.scaleSequential().domain([lo, hi]).interpolator(interp);
}

/* Recolor all county paths + rebuild legend. Smooth 400 ms transition. */
function colorMap() {
  const scale = getColorScale();
  countyPaths
    .transition().duration(400)
    .attr("fill", d => {
      const cd = dataByFips[d.id];
      return cd ? scale(cd[currentAttr]) : null; // null → CSS .no-data fill
    });
  buildLegend(scale);
}

/* ── LEGEND ──────────────────────────────────────────────────
   Five color swatches from high to low with formatted labels.
──────────────────────────────────────────────────────────── */
function buildLegend(scale) {
  const a = attrs[currentAttr];
  document.getElementById("legend-title").textContent = a.label;
  const wrap = document.getElementById("legend-scale");
  wrap.innerHTML = "";
  const [lo, hi] = scale.domain();
  for (let i = 4; i >= 0; i--) {
    const val = lo + (i / 4) * (hi - lo);
    const row = document.createElement("div");
    row.className = "legend-row";
    row.innerHTML = `
      <div class="legend-swatch" style="background:${scale(val)}"></div>
      <span>${a.fmt(val)}</span>`;
    wrap.appendChild(row);
  }
}

/* ── STATS CARDS ─────────────────────────────────────────────
   Four summary metrics recomputed whenever the attribute changes.
──────────────────────────────────────────────────────────── */
function updateStats() {
  const a    = attrs[currentAttr];
  const vals = countyData.map(d => d[currentAttr]);
  document.getElementById("s-count").textContent = countyData.length;
  document.getElementById("s-avg").textContent   = a.fmt(d3.mean(vals));
  document.getElementById("s-max").textContent   = a.fmt(d3.max(vals));
  document.getElementById("s-min").textContent   = a.fmt(d3.min(vals));
}

/* ================================================================
   TOOLTIP  (Retrieve — floating label near cursor)
================================================================ */
function showTooltip(event, fips) {
  const cd = dataByFips[fips];
  if (!cd) return;
  const a = attrs[currentAttr];
  ttInner.html(`
    <strong>${cd.name}</strong>
    <div class="tt-row"><span>${a.label}:</span>
      <span class="tt-val">${a.fmt(cd[currentAttr])}</span></div>
    <div class="tt-row"><span>Income:</span>
      <span>${attrs.income.fmt(cd.income)}</span></div>
    <div class="tt-row"><span>Tech %:</span>
      <span>${attrs.tech_share.fmt(cd.tech_share)}</span></div>
    <div class="tt-row"><span>Broadband:</span>
      <span>${attrs.broadband.fmt(cd.broadband)}</span></div>
  `);
  tooltip.style("opacity", 1)
    .style("left", (event.clientX + 14) + "px")
    .style("top",  (event.clientY - 10) + "px");
}
function hideTooltip() { tooltip.style("opacity", 0); }

/* ================================================================
   INFO BOX  (Retrieve — side-panel county profile)
================================================================ */
function updateInfoBox(fips) {
  const box = document.getElementById("info-box");
  if (!fips || !dataByFips[fips]) {
    box.innerHTML = `<span class="placeholder-text">Hover or click a county to retrieve details.</span>`;
    return;
  }
  const cd = dataByFips[fips];
  box.innerHTML = `
    <strong>${cd.name}</strong>
    <div class="ib-row">
      <span class="ib-key">Median Income</span>
      <span class="ib-hi">${attrs.income.fmt(cd.income)}</span>
    </div>
    <div class="ib-row">
      <span class="ib-key">Bachelor's %</span>
      <span class="ib-val">${attrs.bachelors.fmt(cd.bachelors)}</span>
    </div>
    <div class="ib-row">
      <span class="ib-key">Tech Employment %</span>
      <span class="ib-val">${attrs.tech_share.fmt(cd.tech_share)}</span>
    </div>
    <div class="ib-row">
      <span class="ib-key">Broadband Access</span>
      <span class="ib-val">${attrs.broadband.fmt(cd.broadband)}</span>
    </div>
    <div class="ib-row">
      <span class="ib-key">Unemployment</span>
      <span class="ib-val">${attrs.unemployment.fmt(cd.unemployment)}</span>
    </div>`;
}

/* ================================================================
   BAR CHART  (Coordinated view — horizontal bars, top/bottom N)
   Fixed margins ensure bars AND labels are fully visible.
================================================================ */
function drawBarChart() {
  const a = attrs[currentAttr];

  // Update chart panel heading
  document.getElementById("chart-title").textContent =
    `${sortDesc ? "Top" : "Bottom"} ${BAR_N} Counties — ${a.label}`;

  const el = document.getElementById("bar-chart");
  const W  = el.clientWidth  || 320;
  const H  = el.clientHeight || 360;

  // Left margin = room for county name labels
  // Right margin = room for value labels at bar end
  const margin = { top: 6, right: 72, bottom: 6, left: 120 };
  const iw = W - margin.left - margin.right;
  const ih = H - margin.top  - margin.bottom;

  // Remove previous SVG
  d3.select("#bar-chart svg").remove();

  const svg = d3.select("#bar-chart").append("svg")
    .attr("width", W).attr("height", H);

  const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Sort: unemployment uses ascending (lower = better shown first when sortDesc)
  const sorted = [...countyData]
    .sort((a, b) => sortDesc
      ? b[currentAttr] - a[currentAttr]
      : a[currentAttr] - b[currentAttr])
    .slice(0, BAR_N);

  // ── SCALES ─────────────────────────────────────────────────
  // Y: one band per county, ordered by rank
  barY = d3.scaleBand()
    .domain(sorted.map(d => d.fips))
    .range([0, ih])
    .padding(0.22);

  // X: linear, 0 → max value with 5% headroom for value labels
  barX = d3.scaleLinear()
    .domain([0, d3.max(sorted, d => d[currentAttr]) * 1.05])
    .range([0, iw]);

  // ── BAR GROUPS ─────────────────────────────────────────────
  barGroups = g.selectAll(".bar-g")
    .data(sorted, d => d.fips)
    .join("g")
      .attr("class", "bar-g")
      .attr("transform", d => `translate(0, ${barY(d.fips)})`);

  // Bar rectangles
  barGroups.append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width",  d => barX(d[currentAttr]))
    .attr("height", barY.bandwidth())
    .attr("fill",   a.color)
    .attr("rx", 2)
    // RETRIEVE: hover on bar → highlight county on map
    .on("mousemove", function(event, d) {
      hoveredFips = d.fips;
      countyPaths.filter(dd => dd.id === d.fips)
        .raise()
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.8);
      if (!pinnedFips) updateInfoBox(d.fips);
      // Build a synthetic event-like object for the tooltip
      showTooltip(event, d.fips);
    })
    .on("mouseleave", function(event, d) {
      hoveredFips = null;
      hideTooltip();
      if (!pinnedFips) updateInfoBox(null);
      // Restore county stroke to default
      countyPaths.filter(dd => dd.id === d.fips)
        .attr("stroke", "rgba(255,255,255,0.06)")
        .attr("stroke-width", 0.3);
    })
    .on("click", function(event, d) {
      pinnedFips = (pinnedFips === d.fips) ? null : d.fips;
      updateInfoBox(pinnedFips);
      highlightBar(pinnedFips);
      countyPaths.classed("highlighted", dd => dd.id === pinnedFips);
    });

  // County name labels — anchored to the LEFT of the bar (inside left margin)
  barGroups.append("text")
    .attr("class", "bar-name")
    .attr("x", -6)                         // 6px left of bar start
    .attr("y", barY.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")            // right-align into left margin
    .text(d => {
      // Strip "County", "city", ", XX" state suffix — keep it short
      let n = d.name
        .replace(/\s*County\s*/gi, "")
        .replace(/\s*city\s*/gi, "")
        .replace(/,.*$/, "")
        .trim();
      return n.length > 15 ? n.slice(0, 14) + "…" : n;
    });

  // Value labels — anchored to the RIGHT of the bar end
  barGroups.append("text")
    .attr("class", "bar-value")
    .attr("x", d => barX(d[currentAttr]) + 5)
    .attr("y", barY.bandwidth() / 2)
    .attr("dy", "0.35em")
    .attr("fill", a.color)
    .text(d => a.fmt(d[currentAttr]));

  // Restore pin highlight if one is already active
  if (pinnedFips) highlightBar(pinnedFips);
}

/* Dim non-highlighted bars (coordinated highlight across views) */
function highlightBar(fips) {
  if (!barGroups) return;
  barGroups.select("rect")
    .attr("opacity", d => (!fips || d.fips === fips) ? 1 : 0.28)
    .classed("pinned", d => d.fips === fips);
  barGroups.select(".bar-name")
    .classed("active", d => d.fips === fips);
}

/* ================================================================
   REEXPRESS  —  attribute buttons + sort toggle
================================================================ */
document.querySelectorAll(".attr-btn[data-attr]").forEach(btn => {
  btn.addEventListener("click", function() {
    document.querySelectorAll(".attr-btn[data-attr]")
      .forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    currentAttr = this.dataset.attr;
    colorMap();       // recolor choropleth
    updateStats();    // update summary cards
    drawBarChart();   // redraw bar chart
  });
});

document.getElementById("sort-btn").addEventListener("click", function() {
  sortDesc = !sortDesc;
  this.textContent = sortDesc ? "↓ Highest First" : "↑ Lowest First";
  drawBarChart();
});
