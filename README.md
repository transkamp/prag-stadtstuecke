# Stadtstücke. Prag

Stadtführer für Prag nach dem Figma-Entwurf „klara-projekt-prag“. Die Seite funktioniert auf Desktop und Mobil und ist zweisprachig (DE/EN).

## Starten

Die Seite ist statisch und braucht keinen Build-Schritt. Wegen der Standortabfrage muss sie über `http://localhost` oder `https` laufen. Ein direkt per Doppelklick geöffnetes `file://` reicht nicht.

```sh
cd site
python -m http.server 8765
# dann http://localhost:8765 öffnen
```

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | Rahmen: Navigation, Drawer (mobil), Footer |
| `css/styles.css` | Design-Tokens aus Figma, Layouts, Breakpoints, Motion |
| `js/data.js` | Orte und Gerichte, alle Texte als `{ de, en }`, Koordinaten aus OSM |
| `js/stops.js` | ÖPNV-Haltestellen (Tram, Metro, Bus, Standseilbahn) als OSM-Export (Stand 16.10.2026) |
| `js/legal.js` | Impressum und Datenschutzerklärung (DE/EN) |
| `js/i18n.js` | UI-Texte und Sprachwahl (merkt sich die Wahl, `?lang=en` geht auch) |
| `js/map-style.js` | Eigener MapLibre-Stil in den Figma-Farben |
| `js/geo.js` | Standort, Entfernung, Fußweg, Haltestellen |
| `js/app.js` | Hash-Router (`#/`, `#/ort/<id>`, `#/gericht/<id>`, `#/k/<kapitel>`), Ansichten, Karten |

## Externe Dienste

- **Lokal gehostet:** Schriften (Lora, Inter) in `fonts/`, MapLibre GL JS 4.7.1 in `vendor/`. Es gibt keine Verbindung zu Google Fonts oder einem CDN.
- **Karte:** [MapLibre GL JS](https://maplibre.org) mit Vektorkacheln von [OpenFreeMap](https://openfreemap.org). Die Daten stammen aus © OpenStreetMap-Mitwirkende. Ein API-Key ist nicht nötig.
- **Fußweg:** FOSSGIS-OSRM (`routing.openstreetmap.de`, Profil „foot“). Ist der Dienst nicht erreichbar, schätzt die Seite den Weg aus Luftlinie × 1,3.
- **ÖPNV:** Die nächsten Haltestellen kommen aus `js/stops.js`, ohne Abfrage bei Dritten. Für die Verbindungssuche verlinkt die Seite auf Google Maps (`travelmode=transit`).

## Motion

Die Animationen folgen den Regeln aus [emilkowalski/skills](https://github.com/emilkowalski/skills):

- starke Ease-out-Kurve `cubic-bezier(0.23, 1, 0.32, 1)`
- UI-Dauern unter 300 ms
- Hover-Effekte nur bei `(hover: hover) and (pointer: fine)`
- `scale(0.97)` beim Drücken von Buttons
- `prefers-reduced-motion` blendet nur noch über die Deckkraft ein

Die Fußroute „zeichnet“ sich einmal vom Standort zum Ziel.
