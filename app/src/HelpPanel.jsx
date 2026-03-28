// ─── HelpPanel.jsx ────────────────────────────────────────────────────────────
// Panneau d'aide contextuel — slide-in depuis la droite.
// Le contenu s'adapte automatiquement à la page active.

import { useEffect } from "react";
import { Icon } from "./Layout.jsx";

const tk = {
  background:"#060e20",
  surface:"#0c1934",
  surfaceHigh:"#101e3e",
  surfaceHighest:"#142449",
  primary:"#5bb1ff",
  secondary:"#c5c0ff",
  tertiary:"#f0cf59",
  onSurface:"#dee5ff",
  onVariant:"#9baad6",
  glass:"rgba(12,25,52,0.97)",
  border:"rgba(255,255,255,0.08)",
};

// ─── Contenu par page ─────────────────────────────────────────────────────────
const HELP_CONTENT = {
  dashboard: {
    title: "Tableau de bord",
    icon:  "dashboard",
    intro: "Vue principale de Meteor — toutes les données météo de votre ville en un coup d'œil.",
    sections: [
      {
        icon: "image",
        title: "Image de la ville",
        body: "Le bandeau du haut affiche automatiquement une photo de la ville depuis Wikimedia Commons. Si aucune image n'est trouvée dans les 5 secondes, le drapeau du pays est affiché à la place. Un badge indique la source.",
      },
      {
        icon: "search",
        title: "Barre de recherche",
        body: "Tapez le nom d'une ville dans la barre en haut pour changer de lieu. La recherche utilise Nominatim (OpenStreetMap). La ville est mémorisée entre les sessions.",
      },
      {
        icon: "notifications_active",
        title: "Alertes météo",
        body: "Des bandeaux colorés apparaissent automatiquement en cas de vent fort (≥ 30 km/h), UV élevés (≥ 6), précipitations en cours, gel ou cumul journalier important. Chaque alerte peut être fermée individuellement.",
      },
      {
        icon: "schedule",
        title: "Prévisions horaires",
        body: "Carousel des 24 prochaines heures. Cliquez sur une carte pour la sélectionner. La probabilité de précipitation est affichée en violet quand elle dépasse 20%.",
      },
      {
        icon: "humidity_mid",
        title: "Cartes de métriques",
        body: "Quatre indicateurs clés : Humidité (avec point de rosée), Indice UV (avec barre colorée), Vent (vitesse + direction), Pression atmosphérique (avec tendance Élevée / Stable / Basse).",
      },
      {
        icon: "show_chart",
        title: "Courbe de température",
        body: "Graphique Chart.js des températures sur 24h. L'amplitude de l'axe Y est ajustée automatiquement (±3° autour du min/max réel). Survolez pour voir les valeurs exactes.",
      },
      {
        icon: "calendar_month",
        title: "Prévisions 7 jours",
        body: "Cliquez sur n'importe quelle carte journalière pour ouvrir une fenêtre de détail : températures max/min, précipitations, probabilité de pluie, vent max, lever et coucher du soleil, indice UV. Fermez avec la touche Échap ou en cliquant en dehors.",
      },
    ],
  },

  cartes: {
    title: "Cartes",
    icon:  "map",
    intro: "Carte interactive Leaflet centrée sur votre ville avec données météo en overlay.",
    sections: [
      {
        icon: "layers",
        title: "Fonds de carte",
        body: "Cliquez sur le bouton calques (icône 🗂) en haut à droite pour choisir parmi 4 fonds : Standard (OpenStreetMap), Topographie (OpenTopoMap), Sombre (CARTO), Satellite (Esri). Le changement est instantané.",
      },
      {
        icon: "rainy",
        title: "Données météo",
        body: "Choisissez un overlay météo dans le panneau calques : Précipitations (cercles bleus proportionnels), Température (couleur froide→chaude), Vent (vert→rouge selon l'intensité), Nuages (opacité proportionnelle à la couverture).",
      },
      {
        icon: "scatter_plot",
        title: "Grille de points",
        body: "Les données météo sont affichées sur une grille 5×5 de 25 points espacés de ~50 km autour de votre ville. Chaque point est interrogé en temps réel via Open-Meteo. Cliquez sur un cercle pour voir le détail.",
      },
      {
        icon: "add_circle",
        title: "Contrôles de zoom",
        body: "Utilisez les boutons + et − en haut à droite pour zoomer/dézoomer. Le bouton de localisation (🎯) centre la carte sur votre position GPS (demande la permission du navigateur). La molette de la souris fonctionne aussi.",
      },
      {
        icon: "legend_toggle",
        title: "Légende",
        body: "La légende en bas à gauche s'adapte automatiquement au calque sélectionné : dégradé de couleurs pour la température et les nuages, paliers discrets pour les précipitations et le vent.",
      },
    ],
  },

  air: {
    title: "Qualité de l'air",
    icon:  "air",
    intro: "Surveillance de l'indice de qualité de l'air (IQA) en temps réel et sur 24h.",
    sections: [
      {
        icon: "sensors",
        title: "Vue En Direct",
        body: "Affiche la jauge IQA circulaire (0–150+), les 6 polluants principaux (PM2.5, PM10, NO₂, O₃, CO, SO₂) avec leur valeur et une barre de niveau, et les recommandations santé adaptées à l'indice actuel.",
      },
      {
        icon: "history",
        title: "Historique 24h",
        body: "Bascule vers un graphique en barres colorées par niveau de qualité (vert→rouge). Un tableau heure par heure est affiché en dessous avec l'IQA et la qualité correspondante. Les résumés (actuel, max, min) sont affichés en haut.",
      },
      {
        icon: "info",
        title: "Échelle IQA",
        body: "0–25 : Bon (🟢) · 26–50 : Assez bon (🟡) · 51–75 : Modéré (🟠) · 76–100 : Médiocre (🔴) · 100+ : Mauvais (🟣). Les couleurs de l'interface s'adaptent automatiquement au niveau.",
      },
      {
        icon: "cloud_download",
        title: "Source des données",
        body: "Open-Meteo Air Quality — gratuit, sans clé API, conforme RGPD. Les données sont issues de modèles météorologiques européens (CAMS). Mise à jour toutes les heures.",
      },
    ],
  },

  historique: {
    title: "Historique",
    icon:  "history",
    intro: "Données météo passées sur 24h (temps réel) ou sur 7, 30 et 90 jours (archives).",
    sections: [
      {
        icon: "schedule",
        title: "Mode 24h",
        body: "Utilise les données horaires déjà chargées dans l'application (pas d'appel API supplémentaire). Affiche un graphique de température et un graphique de probabilité de pluie heure par heure, plus un tableau détaillé.",
      },
      {
        icon: "calendar_month",
        title: "Mode 7 / 30 / 90 jours",
        body: "Charge les données historiques depuis l'archive Open-Meteo. Deux graphiques : températures max/min (courbes) et précipitations (barres). Les 30 premiers jours sont listés dans le tableau. Le reste est disponible via export CSV.",
      },
      {
        icon: "download",
        title: "Export CSV",
        body: "Le bouton 'Exporter CSV' génère un fichier avec les colonnes : Date, Max (°C ou °F), Min, Précipitations (mm), Vent max (km/h). Le fichier est nommé automatiquement avec la ville et la période.",
      },
      {
        icon: "bar_chart",
        title: "Graphiques",
        body: "Les graphiques Chart.js sont interactifs : survolez pour voir les valeurs exactes. La courbe de température min est en pointillés pour la distinguer de la max. Les barres de précipitations passent en violet au-dessus de 10mm.",
      },
    ],
  },

  parametres: {
    title: "Paramètres",
    icon:  "settings",
    intro: "Configuration de l'affichage et informations sur l'application.",
    sections: [
      {
        icon: "thermostat",
        title: "Unités de température",
        body: "Bascule entre Celsius (°C) et Fahrenheit (°F). Le changement s'applique instantanément sur tous les écrans : tableau de bord, historique, cartes, fenêtres de détail.",
      },
      {
        icon: "language",
        title: "Langue",
        body: "L'interface est actuellement disponible en Français, English et Deutsch. La sélection est sauvegardée dans le navigateur (localStorage).",
      },
      {
        icon: "notifications_active",
        title: "Notifications",
        body: "Activez ou désactivez les alertes météo graves, les résumés quotidiens et les alertes qualité de l'air. Note : les notifications navigateur nécessitent une permission système.",
      },
      {
        icon: "open_source",
        title: "Open Source",
        body: "Meteor est un projet open source sous licence MIT. Toutes les données proviennent de sources gratuites et sans clé API : Open-Meteo (météo + qualité de l'air + archives), Nominatim/OSM (géocodage), Wikimedia Commons (images de villes), flagcdn.com (drapeaux).",
      },
    ],
  },
};

// ─── Composant section d'aide ─────────────────────────────────────────────────
function HelpSection({ icon, title, body }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
        <div style={{ width:30, height:30, borderRadius:8, backgroundColor:`${tk.primary}18`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span className="material-symbols-outlined" style={{ fontSize:16, color:tk.primary }}>{icon}</span>
        </div>
        <span style={{ fontSize:13, fontWeight:700, color:tk.onSurface, fontFamily:"'Manrope',sans-serif" }}>{title}</span>
      </div>
      <p style={{ fontSize:13, color:tk.onVariant, lineHeight:1.65, margin:0, paddingLeft:40 }}>{body}</p>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────
export default function HelpPanel({ page, onClose }) {
  const content = HELP_CONTENT[page] ?? HELP_CONTENT.dashboard;

  // Fermer avec Échap
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Overlay semi-transparent */}
      <div onClick={onClose} style={{ position:"fixed", inset:0, zIndex:900, backgroundColor:"rgba(0,0,0,0.35)", backdropFilter:"blur(2px)" }}/>

      {/* Panneau latéral droit */}
      <div style={{
        position:"fixed", top:0, right:0, bottom:0, zIndex:901,
        width:420, maxWidth:"90vw",
        backgroundColor:tk.glass,
        borderLeft:`1px solid ${tk.border}`,
        backdropFilter:"blur(24px)",
        WebkitBackdropFilter:"blur(24px)",
        display:"flex", flexDirection:"column",
        animation:"slideInRight 0.25s ease",
        overflowY:"auto",
      }}>

        {/* ── En-tête ── */}
        <div style={{ padding:"24px 28px 20px", borderBottom:`1px solid ${tk.border}`, flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:12, backgroundColor:`${tk.primary}20`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span className="material-symbols-outlined" style={{ fontSize:22, color:tk.primary, fontVariationSettings:"'FILL' 1" }}>{content.icon}</span>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:tk.onVariant, marginBottom:3 }}>Documentation</div>
                <h2 style={{ fontSize:18, fontWeight:900, fontFamily:"'Manrope',sans-serif", color:"#fff", margin:0 }}>{content.title}</h2>
              </div>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${tk.border}`, borderRadius:10, cursor:"pointer", color:tk.onVariant, display:"flex", padding:8, flexShrink:0 }}>
              <span className="material-symbols-outlined" style={{ fontSize:18 }}>close</span>
            </button>
          </div>

          {/* Intro */}
          <p style={{ fontSize:13, color:tk.onVariant, lineHeight:1.6, margin:"16px 0 0", paddingLeft:52 }}>
            {content.intro}
          </p>
        </div>

        {/* ── Navigation entre pages ── */}
        <div style={{ padding:"12px 28px", borderBottom:`1px solid ${tk.border}`, display:"flex", gap:6, flexWrap:"wrap", flexShrink:0 }}>
          {Object.entries(HELP_CONTENT).map(([id, c]) => (
            <div key={id} style={{
              display:"flex", alignItems:"center", gap:5,
              padding:"4px 10px", borderRadius:9999, fontSize:11, fontWeight:600,
              backgroundColor: id === page ? `${tk.primary}20` : "transparent",
              color:            id === page ? tk.primary : tk.onVariant,
              border:           id === page ? `1px solid ${tk.primary}44` : "1px solid transparent",
              cursor: "default",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize:12 }}>{c.icon}</span>
              {c.title}
            </div>
          ))}
        </div>

        {/* ── Contenu ── */}
        <div style={{ padding:"24px 28px", flex:1 }}>
          {content.sections.map((sec, i) => (
            <HelpSection key={i} icon={sec.icon} title={sec.title} body={sec.body}/>
          ))}

          {/* Sources globales */}
          <div style={{ marginTop:28, paddingTop:20, borderTop:`1px solid ${tk.border}` }}>
            <p style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:tk.onVariant, marginBottom:12 }}>Sources de données</p>
            {[
              { name:"Open-Meteo",      url:"https://open-meteo.com",               desc:"Météo · Qualité de l'air · Archives" },
              { name:"Nominatim / OSM", url:"https://nominatim.openstreetmap.org",  desc:"Géocodage · Cartes" },
              { name:"Wikimedia",       url:"https://commons.wikimedia.org",         desc:"Images de villes" },
              { name:"flagcdn.com",     url:"https://flagcdn.com",                  desc:"Drapeaux" },
            ].map((s,i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", borderRadius:10, textDecoration:"none", color:tk.onSurface, marginBottom:4, backgroundColor:"rgba(255,255,255,0.03)" }}>
                <div>
                  <span style={{ fontSize:12, fontWeight:600 }}>{s.name}</span>
                  <span style={{ fontSize:11, color:tk.onVariant, marginLeft:8 }}>{s.desc}</span>
                </div>
                <span className="material-symbols-outlined" style={{ fontSize:14, color:tk.onVariant }}>open_in_new</span>
              </a>
            ))}
          </div>

          {/* Version */}
          <p style={{ fontSize:11, color:tk.onVariant, textAlign:"center", marginTop:24 }}>
            Meteor v1.1.0 · Licence MIT · Open Source
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}
