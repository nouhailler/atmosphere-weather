import { useState, useEffect, useRef } from "react";

// ─── Design tokens extraits du design system Stitch ───────────────────────────
const tokens = {
  background:          "#060e20",
  surface:             "#060e20",
  surfaceContainer:    "#0c1934",
  surfaceContainerHigh:"#101e3e",
  surfaceContainerHighest: "#142449",
  surfaceBright:       "#172b54",
  surfaceVariant:      "#142449",
  primary:             "#5bb1ff",
  primaryContainer:    "#44a3f5",
  primaryFixedDim:     "#71b8ff",
  primaryDim:          "#44a3f5",
  secondary:           "#c5c0ff",
  secondaryDim:        "#6d60e9",
  tertiary:            "#ffedb7",
  tertiaryDim:         "#f0cf59",
  tertiaryContainer:   "#ffde65",
  onBackground:        "#dee5ff",
  onSurface:           "#dee5ff",
  onSurfaceVariant:    "#9baad6",
  onPrimary:           "#002e4f",
  onPrimaryContainer:  "#00223c",
  outline:             "#65759e",
  error:               "#ff716c",
  glass:               "rgba(20,36,73,0.45)",
};

const currentWeather = {
  city: "Genève", country: "Suisse",
  temp: 19, feelsLike: 21, high: 24, low: 13,
  condition: "Partiellement Nuageux",
  icon: "partly_cloudy_day",
  humidity: 58, uvIndex: 3, uvLabel: "Modéré",
  windSpeed: 14, windDir: "Nord-Est",
  pressure: 1018, pressureLabel: "En hausse",
  dewPoint: 10,
  updatedAt: "15:42",
};

const hourlyForecast = [
  { time: "Now",   icon: "partly_cloudy_day", temp: 19 },
  { time: "16:00", icon: "wb_sunny",          temp: 20 },
  { time: "17:00", icon: "wb_sunny",          temp: 22 },
  { time: "18:00", icon: "partly_cloudy_day", temp: 23 },
  { time: "19:00", icon: "cloud",             temp: 21 },
  { time: "20:00", icon: "cloud",             temp: 19 },
  { time: "21:00", icon: "nights_stay",       temp: 17 },
  { time: "22:00", icon: "nights_stay",       temp: 16 },
  { time: "23:00", icon: "nights_stay",       temp: 15 },
];

const weeklyForecast = [
  { day: "Lun", icon: "wb_sunny",          high: 24, low: 13 },
  { day: "Mar", icon: "partly_cloudy_day", high: 21, low: 11 },
  { day: "Mer", icon: "rainy",             high: 16, low: 9  },
  { day: "Jeu", icon: "rainy",             high: 14, low: 8  },
  { day: "Ven", icon: "cloud",             high: 18, low: 10 },
  { day: "Sam", icon: "wb_sunny",          high: 22, low: 12 },
  { day: "Dim", icon: "wb_sunny",          high: 25, low: 14 },
];

const navItems = [
  { icon: "dashboard", label: "Tableau de bord", active: true  },
  { icon: "map",       label: "Cartes",           active: false },
  { icon: "air",       label: "Qualité de l'air", active: false },
  { icon: "history",   label: "Historique",       active: false },
  { icon: "settings",  label: "Paramètres",       active: false },
];

const s = {
  app: { display:"flex", minHeight:"100vh", backgroundColor:tokens.background, color:tokens.onBackground, fontFamily:"'Inter','Manrope',sans-serif", position:"relative", overflow:"hidden" },
  bgGlow: { position:"fixed", top:"-30%", left:"15%", width:"60vw", height:"60vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(91,177,255,0.06) 0%,transparent 70%)", pointerEvents:"none", zIndex:0 },
  sidebar: { position:"fixed", left:0, top:0, height:"100%", width:256, display:"flex", flexDirection:"column", padding:16, backgroundColor:"rgba(6,14,32,0.75)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderRight:"1px solid rgba(255,255,255,0.08)", zIndex:50 },
  sidebarLogo: { marginBottom:40, paddingLeft:16 },
  logoTitle: { fontSize:22, fontWeight:900, color:tokens.primary, letterSpacing:"-0.05em", fontFamily:"'Manrope',sans-serif", margin:0, lineHeight:1 },
  logoSub: { fontSize:11, color:tokens.onSurfaceVariant, letterSpacing:"0.02em", margin:"4px 0 0" },
  nav: { flex:1, display:"flex", flexDirection:"column", gap:6 },
  navItemActive: { display:"flex", alignItems:"center", gap:12, padding:"12px 16px", backgroundColor:"rgba(91,177,255,0.15)", color:tokens.primaryFixedDim, borderRadius:12, border:"1px solid rgba(91,177,255,0.2)", fontSize:14, fontWeight:600, fontFamily:"'Manrope',sans-serif", letterSpacing:"-0.01em", cursor:"pointer", transition:"all 0.2s", textDecoration:"none" },
  navItem: { display:"flex", alignItems:"center", gap:12, padding:"12px 16px", color:tokens.onSurfaceVariant, borderRadius:12, fontSize:14, fontFamily:"'Manrope',sans-serif", letterSpacing:"-0.01em", cursor:"pointer", transition:"all 0.2s", textDecoration:"none" },
  proBanner: { marginTop:"auto", padding:16, background:tokens.glass, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:16, border:"1px solid rgba(255,255,255,0.05)", textAlign:"center" },
  proText: { fontSize:12, color:tokens.onSurfaceVariant, marginBottom:10 },
  proBtn: { width:"100%", padding:"8px 0", backgroundColor:tokens.primaryContainer, color:tokens.onPrimaryContainer, borderRadius:12, fontSize:13, fontWeight:700, fontFamily:"'Manrope',sans-serif", border:"none", cursor:"pointer" },
  main: { paddingLeft:256, minHeight:"100vh", width:"100%", position:"relative", zIndex:1 },
  header: { position:"sticky", top:0, zIndex:40, height:80, backgroundColor:"rgba(6,14,32,0.5)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0 32px", borderBottom:"1px solid rgba(255,255,255,0.04)" },
  searchWrap: { position:"relative", width:380 },
  searchIcon: { position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", color:tokens.onSurfaceVariant, fontSize:20, pointerEvents:"none" },
  searchInput: { width:"100%", backgroundColor:tokens.surfaceContainerHighest, border:"none", borderRadius:9999, padding:"10px 16px 10px 48px", fontSize:14, color:tokens.onSurface, outline:"none", boxSizing:"border-box", fontFamily:"'Inter',sans-serif" },
  headerActions: { display:"flex", alignItems:"center", gap:24 },
  iconBtn: { background:"none", border:"none", color:tokens.onSurfaceVariant, cursor:"pointer", padding:4, borderRadius:8, transition:"color 0.2s", display:"flex" },
  avatar: { width:40, height:40, borderRadius:"50%", backgroundColor:tokens.surfaceContainerHigh, border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", color:tokens.primary, fontSize:14, fontWeight:700, fontFamily:"'Manrope',sans-serif" },
  content: { padding:32, maxWidth:1280, margin:"0 auto", display:"flex", flexDirection:"column", gap:32 },
  hero: { position:"relative", height:400, borderRadius:40, overflow:"hidden", background:"linear-gradient(135deg,#0d2647 0%,#0a1e3d 40%,#061225 100%)" },
  heroDecor: { position:"absolute", inset:0, background:"radial-gradient(ellipse at 70% 20%,rgba(91,177,255,0.15) 0%,transparent 60%),radial-gradient(ellipse at 20% 80%,rgba(197,192,255,0.08) 0%,transparent 50%)" },
  heroCloud: { position:"absolute", top:32, right:48, lineHeight:1, userSelect:"none" },
  heroContent: { position:"absolute", bottom:48, left:48, right:48, display:"flex", justifyContent:"space-between", alignItems:"flex-end" },
  heroLeft: { display:"flex", flexDirection:"column", gap:8 },
  heroBadge: { display:"flex", alignItems:"center", gap:10, color:tokens.primary },
  heroCity: { fontSize:22, fontWeight:400, color:tokens.onSurface, margin:0, fontFamily:"'Inter',sans-serif" },
  heroTemp: { fontSize:100, fontWeight:900, fontFamily:"'Manrope',sans-serif", letterSpacing:"-0.05em", color:"#ffffff", lineHeight:1, display:"flex", alignItems:"baseline", gap:4 },
  heroUnit: { fontSize:40, fontWeight:300, color:tokens.onSurfaceVariant, fontFamily:"'Manrope',sans-serif" },
  heroCard: { background:tokens.glass, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", padding:24, borderRadius:24, border:"1px solid rgba(255,255,255,0.1)", minWidth:240, textAlign:"right" },
  heroCondition: { fontSize:24, fontWeight:700, fontFamily:"'Manrope',sans-serif", color:tokens.onSurface, marginBottom:6 },
  heroHiLo: { display:"flex", justifyContent:"flex-end", gap:16, color:tokens.onSurfaceVariant, fontSize:14, fontWeight:500 },
  heroFeelsRow: { marginTop:16, paddingTop:16, borderTop:"1px solid rgba(255,255,255,0.1)", display:"flex", justifyContent:"space-between", alignItems:"center" },
  sectionHeader: { display:"flex", justifyContent:"space-between", alignItems:"center", paddingLeft:4, paddingRight:4, marginBottom:16 },
  sectionTitle: { fontSize:20, fontWeight:700, fontFamily:"'Manrope',sans-serif", color:tokens.onSurface, margin:0 },
  seeAllBtn: { background:"none", border:"none", color:tokens.primary, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:4, fontFamily:"'Inter',sans-serif" },
  carousel: { display:"flex", gap:12, overflowX:"auto", paddingBottom:16, scrollbarWidth:"thin", scrollbarColor:"#38476d transparent" },
  hourlyCardActive: { flexShrink:0, width:112, padding:16, background:tokens.glass, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:16, border:"1px solid rgba(91,177,255,0.3)", boxShadow:"0 0 0 1px rgba(91,177,255,0.15)", display:"flex", flexDirection:"column", alignItems:"center", gap:12 },
  hourlyCard: { flexShrink:0, width:112, padding:16, backgroundColor:tokens.surfaceContainer, borderRadius:16, display:"flex", flexDirection:"column", alignItems:"center", gap:12, cursor:"pointer", transition:"background-color 0.2s" },
  hourlyTimeActive: { fontSize:11, fontWeight:700, color:tokens.primary, textTransform:"uppercase", letterSpacing:"0.05em" },
  hourlyTime: { fontSize:11, fontWeight:500, color:tokens.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.05em" },
  hourlyTemp: { fontSize:20, fontWeight:700, fontFamily:"'Manrope',sans-serif", color:tokens.onSurface },
  bottomGrid: { display:"grid", gridTemplateColumns:"repeat(12,1fr)", gap:24 },
  metricsGrid: { gridColumn:"span 4", display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 },
  metricCard: { gridColumn:"span 1", padding:24, background:tokens.glass, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:24, border:"1px solid rgba(255,255,255,0.05)", display:"flex", flexDirection:"column", justifyContent:"space-between", aspectRatio:"1/1" },
  metricLabel: { fontSize:13, fontWeight:500, color:tokens.onSurfaceVariant, marginBottom:4, marginTop:6 },
  metricValue: { fontSize:28, fontWeight:700, fontFamily:"'Manrope',sans-serif", color:tokens.onSurface },
  metricSub: { fontSize:12, color:tokens.onSurfaceVariant, marginTop:4 },
  uvBar: { width:"100%", height:4, backgroundColor:tokens.surfaceContainerHighest, borderRadius:9999, overflow:"hidden", marginTop:6 },
  uvFill: { height:"100%", background:"linear-gradient(to right,#4ade80,#fde65e,#ef4444)", borderRadius:9999 },
  radarCard: { gridColumn:"span 8", position:"relative", borderRadius:24, overflow:"hidden", border:"1px solid rgba(255,255,255,0.05)", background:"linear-gradient(135deg,#0a1e3d 0%,#081229 100%)", minHeight:360 },
  radarBg: { position:"absolute", inset:0, background:"radial-gradient(ellipse at 60% 40%,rgba(29,158,117,0.12) 0%,transparent 60%),radial-gradient(ellipse at 30% 70%,rgba(56,130,244,0.1) 0%,transparent 50%)" },
  radarGrid: { position:"absolute", inset:0, backgroundImage:"radial-gradient(circle,rgba(91,177,255,0.08) 1px,transparent 1px)", backgroundSize:"32px 32px" },
  radarOverlay: { position:"absolute", inset:0, background:"linear-gradient(to right,rgba(6,14,32,0.5) 0%,transparent 50%)" },
  radarContent: { position:"absolute", inset:0, padding:24, display:"flex", flexDirection:"column", justifyContent:"space-between" },
  liveBadge: { display:"inline-flex", alignItems:"center", gap:8, backgroundColor:"rgba(6,14,32,0.8)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", padding:"6px 14px", borderRadius:9999, border:"1px solid rgba(255,255,255,0.1)", alignSelf:"flex-start", marginBottom:8 },
  liveDot: { width:8, height:8, borderRadius:"50%", backgroundColor:"#ef4444", boxShadow:"0 0 6px #ef4444", animation:"pulse 1.5s ease-in-out infinite" },
  liveTxt: { fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em" },
  radarTitle: { fontSize:24, fontWeight:700, fontFamily:"'Manrope',sans-serif", color:"#fff" },
  radarBottom: { display:"flex", alignItems:"center", gap:12 },
  radarPlayBtn: { background:tokens.glass, backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", padding:12, borderRadius:16, border:"1px solid rgba(255,255,255,0.2)", color:tokens.onSurface, cursor:"pointer", display:"flex", fontSize:20 },
  radarLegend: { background:tokens.glass, backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", padding:"10px 18px", borderRadius:16, border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", gap:12 },
  legendBar: { width:80, height:8, background:"linear-gradient(to right,#bfdbfe,#3b82f6,#1e1b4b)", borderRadius:9999 },
  weeklySection: { gridColumn:"span 12" },
  weeklyGrid: { display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:12 },
  weeklyCard: { padding:20, background:tokens.glass, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderRadius:20, border:"1px solid rgba(255,255,255,0.05)", display:"flex", flexDirection:"column", alignItems:"center", gap:10, cursor:"pointer", transition:"border-color 0.2s" },
  weeklyDay: { fontSize:13, fontWeight:600, color:tokens.onSurfaceVariant, fontFamily:"'Manrope',sans-serif" },
  weeklyHigh: { fontSize:20, fontWeight:700, fontFamily:"'Manrope',sans-serif", color:tokens.onSurface },
  weeklyLow: { fontSize:13, color:tokens.onSurfaceVariant },
  footer: { gridColumn:"span 12", display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:24, paddingBottom:16, borderTop:"1px solid rgba(255,255,255,0.05)" },
  footerLinks: { display:"flex", gap:24 },
  footerLink: { fontSize:12, color:tokens.onSurfaceVariant, textDecoration:"none", cursor:"pointer" },
};

function Icon({ name, size=24, style={}, filled=false }) {
  return (
    <span className="material-symbols-outlined" style={{ fontSize:size, fontVariationSettings:`'FILL' ${filled?1:0},'wght' 400,'GRAD' 0,'opsz' ${size}`, lineHeight:1, userSelect:"none", ...style }}>
      {name}
    </span>
  );
}

function RadarRings() {
  const rings = [
    { cx:"58%", cy:"45%", r:30,  color:"rgba(29,158,117,0.3)"   },
    { cx:"58%", cy:"45%", r:55,  color:"rgba(56,130,244,0.2)"   },
    { cx:"58%", cy:"45%", r:80,  color:"rgba(91,177,255,0.12)"  },
    { cx:"58%", cy:"45%", r:110, color:"rgba(197,192,255,0.07)" },
    { cx:"38%", cy:"65%", r:22,  color:"rgba(29,158,117,0.25)"  },
    { cx:"38%", cy:"65%", r:44,  color:"rgba(56,130,244,0.15)"  },
  ];
  return (
    <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none" }}>
      {rings.map((r,i) => (
        <circle key={i} cx={r.cx} cy={r.cy} r={r.r} fill={r.color} strokeWidth="0.5" />
      ))}
    </svg>
  );
}

export default function WeatherDashboard() {
  const [activeHour, setActiveHour] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    const styleId = "weather-keyframes";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .wmc:hover { border-color:rgba(91,177,255,0.2)!important }
        .whc:hover  { background-color:#101e3e!important }
        .wwc:hover  { border-color:rgba(91,177,255,0.25)!important }
        .wni:hover  { color:#dee5ff!important;background-color:rgba(255,255,255,0.04)!important }
        .wce        { animation:fadeInUp 0.5s ease forwards }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const uvPercent = (currentWeather.uvIndex / 11) * 100;

  return (
    <div style={s.app}>
      <div style={s.bgGlow} />

      {/* Sidebar */}
      <aside style={s.sidebar}>
        <div style={s.sidebarLogo}>
          <h1 style={s.logoTitle}>Atmosphere</h1>
          <p style={s.logoSub}>Local Weather</p>
        </div>
        <nav style={s.nav}>
          {navItems.map((item,i) => (
            <a key={i} href="#" onClick={e=>e.preventDefault()}
               className={item.active?"":"wni"}
               style={item.active ? s.navItemActive : s.navItem}>
              <Icon name={item.icon} size={22} filled={item.active} style={{color:item.active?tokens.primary:"inherit"}}/>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div style={s.proBanner}>
          <p style={s.proText}>Obtenez une précision avancée</p>
          <button style={s.proBtn}>Passer à la version Pro</button>
        </div>
      </aside>

      {/* Main */}
      <main style={s.main}>
        <header style={s.header}>
          <div style={s.searchWrap}>
            <Icon name="search" size={20} style={s.searchIcon}/>
            <input style={s.searchInput} type="text"
              placeholder="Rechercher une ville ou un code postal..."
              value={searchVal} onChange={e=>setSearchVal(e.target.value)}/>
          </div>
          <div style={s.headerActions}>
            <button style={s.iconBtn}><Icon name="notifications" size={22}/></button>
            <button style={s.iconBtn}><Icon name="location_on" size={22}/></button>
            <div style={s.avatar}>PF</div>
          </div>
        </header>

        <div style={s.content} className="wce">

          {/* Hero */}
          <section style={s.hero}>
            <div style={s.heroDecor}/>
            <div style={s.heroCloud}>
              <Icon name="partly_cloudy_day" size={160} filled style={{color:"rgba(91,177,255,0.12)"}}/>
            </div>
            <div style={s.heroContent}>
              <div style={s.heroLeft}>
                <div style={s.heroBadge}>
                  <Icon name="partly_cloudy_day" size={36} filled style={{color:tokens.primary}}/>
                  <span style={{fontSize:15,fontWeight:600,letterSpacing:"0.08em",textTransform:"uppercase",fontFamily:"'Manrope',sans-serif"}}>Météo Actuelle</span>
                </div>
                <p style={s.heroCity}>{currentWeather.city}, {currentWeather.country}</p>
                <div style={s.heroTemp}>{currentWeather.temp}°<span style={s.heroUnit}>C</span></div>
              </div>
              <div style={s.heroCard}>
                <div style={s.heroCondition}>{currentWeather.condition}</div>
                <div style={s.heroHiLo}>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><Icon name="arrow_upward" size={14} style={{color:tokens.primary}}/>H: {currentWeather.high}°</span>
                  <span style={{display:"flex",alignItems:"center",gap:4}}><Icon name="arrow_downward" size={14} style={{color:tokens.secondary}}/>B: {currentWeather.low}°</span>
                </div>
                <div style={s.heroFeelsRow}>
                  <span style={{fontSize:11,textTransform:"uppercase",letterSpacing:"0.12em",color:tokens.onSurfaceVariant}}>Ressenti</span>
                  <span style={{fontSize:18,fontWeight:700,fontFamily:"'Manrope',sans-serif"}}>{currentWeather.feelsLike}°</span>
                </div>
              </div>
            </div>
          </section>

          {/* Hourly */}
          <section>
            <div style={s.sectionHeader}>
              <h3 style={s.sectionTitle}>Prévisions Horaires</h3>
              <button style={s.seeAllBtn}>Prochaines 24h <Icon name="chevron_right" size={16}/></button>
            </div>
            <div style={s.carousel}>
              {hourlyForecast.map((h,i) => (
                <div key={i} className={i!==activeHour?"whc":""} style={i===activeHour?s.hourlyCardActive:s.hourlyCard} onClick={()=>setActiveHour(i)}>
                  <span style={i===activeHour?s.hourlyTimeActive:s.hourlyTime}>{h.time}</span>
                  <Icon name={h.icon} size={28} filled={i===activeHour} style={{color:i===activeHour?tokens.primary:tokens.onSurfaceVariant}}/>
                  <span style={s.hourlyTemp}>{h.temp}°</span>
                </div>
              ))}
            </div>
          </section>

          {/* Metrics + Radar + Weekly + Footer */}
          <div style={s.bottomGrid}>
            <div style={s.metricsGrid}>
              {[
                { icon:"humidity_mid", color:tokens.primary,    label:"Humidité",  value:`${currentWeather.humidity}%`,    sub:`Rosée à ${currentWeather.dewPoint}° en ce moment.` },
                { icon:"sunny",        color:tokens.tertiary,   label:"Indice UV", value:currentWeather.uvIndex, sub:currentWeather.uvLabel, uv:true },
                { icon:"air",          color:tokens.secondaryDim,label:"Vent",     value:currentWeather.windSpeed, unit:"km/h", dir:currentWeather.windDir },
                { icon:"compress",     color:tokens.error,      label:"Pression",  value:currentWeather.pressure, unit:"hPa", sub:currentWeather.pressureLabel },
              ].map((m,i) => (
                <div key={i} className="wmc" style={s.metricCard}>
                  <div>
                    <Icon name={m.icon} size={22} style={{color:m.color}}/>
                    <div style={s.metricLabel}>{m.label}</div>
                  </div>
                  <div>
                    <div style={{...s.metricValue,display:"flex",alignItems:"baseline",gap:4}}>
                      {m.value}
                      {m.unit && <span style={{fontSize:16,fontWeight:400,color:tokens.onSurfaceVariant}}>{m.unit}</span>}
                    </div>
                    {m.uv && <div style={{fontSize:13,fontWeight:600,color:tokens.tertiaryDim,marginBottom:4}}>{m.sub}</div>}
                    {m.uv && <div style={s.uvBar}><div style={{...s.uvFill,width:`${uvPercent}%`}}/></div>}
                    {m.dir && <div style={{display:"flex",alignItems:"center",gap:6,marginTop:4}}><Icon name="navigation" size={14} style={{color:tokens.onSurfaceVariant,transform:"rotate(45deg)"}}/><span style={{fontSize:12,color:tokens.onSurfaceVariant}}>{m.dir}</span></div>}
                    {m.sub && !m.uv && !m.dir && <div style={s.metricSub}>{m.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div style={s.radarCard}>
              <div style={s.radarBg}/><div style={s.radarGrid}/><RadarRings/><div style={s.radarOverlay}/>
              <div style={s.radarContent}>
                <div>
                  <div style={s.liveBadge}><span style={s.liveDot}/><span style={s.liveTxt}>Radar en direct</span></div>
                  <h4 style={s.radarTitle}>Précipitations</h4>
                </div>
                <div style={s.radarBottom}>
                  <button style={s.radarPlayBtn}><Icon name="play_arrow" size={22}/></button>
                  <div style={s.radarLegend}>
                    <div>
                      <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"0.08em",color:tokens.onSurfaceVariant,fontWeight:700,marginBottom:4}}>Précipitations</div>
                      <div style={s.legendBar}/>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:2}}>
                      <span style={{fontSize:11,color:tokens.onSurfaceVariant}}>Légères</span>
                      <span style={{fontSize:11,fontWeight:700}}>Fortes</span>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:8,marginLeft:"auto"}}>
                    {["add","remove","layers"].map((ic,i) => (
                      <button key={i} style={{...s.radarPlayBtn,marginTop:i===2?8:0,padding:10}}><Icon name={ic} size={18}/></button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={s.weeklySection}>
              <div style={{...s.sectionHeader,marginBottom:16}}><h3 style={s.sectionTitle}>Prévisions 7 Jours</h3></div>
              <div style={s.weeklyGrid}>
                {weeklyForecast.map((d,i) => (
                  <div key={i} className="wwc" style={s.weeklyCard}>
                    <div style={s.weeklyDay}>{d.day}</div>
                    <Icon name={d.icon} size={28} filled style={{color:i===0?tokens.primary:tokens.onSurfaceVariant}}/>
                    <div style={s.weeklyHigh}>{d.high}°</div>
                    <div style={s.weeklyLow}>{d.low}°</div>
                  </div>
                ))}
              </div>
            </div>

            <footer style={s.footer}>
              <p style={{fontSize:12,color:tokens.onSurfaceVariant,margin:0}}>Mis à jour à {currentWeather.updatedAt} • Atmosphere Demo</p>
              <div style={s.footerLinks}>
                <a href="#" style={s.footerLink}>Politique de confidentialité</a>
                <a href="#" style={s.footerLink}>Conditions d'utilisation</a>
              </div>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
}
