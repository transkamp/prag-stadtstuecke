/* Impressum und Datenschutzerklärung – jeweils { de, en }. Rechtlich maßgeblich ist die deutsche Fassung. */

const OPERATOR = {
  name: 'Markus Kamp',
  street: 'c/o WeWork, Pilgrimstr. 6',
  city: '50674 Köln',
  email: 'objektiv-geckos.2p@icloud.com',
};

const mail = `<a href="mailto:${OPERATOR.email}">${OPERATOR.email}</a>`;
const address = `${OPERATOR.name}<br>${OPERATOR.street}<br>${OPERATOR.city}`;

const LEGAL = {
  impressum: {
    title: { de: 'Impressum', en: 'Legal notice' },
    kicker: { de: 'Rechtliches', en: 'Legal' },
    html: {
      de: `
        <h2>Angaben gemäß § 5 DDG</h2>
        <p>${OPERATOR.name}<br>c/o WeWork<br>Pilgrimstr. 6<br>${OPERATOR.city}</p>
        <h2>Kontakt</h2>
        <p>E-Mail: ${mail}</p>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>${OPERATOR.name}, Pilgrimstr. 6, ${OPERATOR.city}</p>
        <h2>Kartendaten</h2>
        <p>Kartendaten © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap-Mitwirkende</a>, verfügbar unter der Open Database License (ODbL). Kartenkacheln: <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a>.</p>`,
      en: `
        <p class="legal__hint">This legal notice is required under German law. The German version is legally binding.</p>
        <h2>Information pursuant to § 5 DDG</h2>
        <p>${OPERATOR.name}<br>c/o WeWork<br>Pilgrimstr. 6<br>${OPERATOR.city}<br>Germany</p>
        <h2>Contact</h2>
        <p>Email: ${mail}</p>
        <h2>Responsible for content pursuant to § 18 (2) MStV</h2>
        <p>${OPERATOR.name}, Pilgrimstr. 6, ${OPERATOR.city}, Germany</p>
        <h2>Map data</h2>
        <p>Map data © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>, available under the Open Database License (ODbL). Map tiles: <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a>.</p>`,
    },
  },

  datenschutz: {
    title: { de: 'Datenschutzerklärung', en: 'Privacy policy' },
    kicker: { de: 'Rechtliches', en: 'Legal' },
    html: {
      de: `
        <h2>1. Verantwortlicher</h2>
        <p>${address}<br>E-Mail: ${mail}</p>

        <h2>2. Das Wichtigste in Kürze</h2>
        <p>Diese Website setzt keine Cookies, verwendet keine Analyse- oder Tracking-Werkzeuge und hat kein Kontaktformular. Schriftarten und Programmbibliotheken liegen auf demselben Server wie die Website. Daten an Dritte fließen nur dort, wo es für die Darstellung der Karte oder die von dir angeforderte Fußroute technisch nötig ist. Dein Standort wird nur verwendet, wenn du ihn ausdrücklich freigibst.</p>

        <h2>3. Hosting über GitHub Pages</h2>
        <p>Die Website wird bei GitHub Pages gehostet, einem Dienst der GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf der Seiten verarbeitet GitHub technisch notwendige Zugriffsdaten (sogenannte Server-Logfiles), insbesondere deine IP-Adresse, Datum und Uhrzeit des Abrufs, die aufgerufene Datei, die übertragene Datenmenge sowie Browser- und Betriebssysteminformationen. Das dient der Auslieferung und der Sicherheit der Website.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in einer zuverlässigen und sicheren Bereitstellung der Website. Eine Übermittlung in die USA ist möglich. GitHub ist nach dem EU-U.S. Data Privacy Framework zertifiziert (Angemessenheitsbeschluss der EU-Kommission, Art. 45 DSGVO). Weitere Informationen: <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">Datenschutzerklärung von GitHub</a>.</p>

        <h2>4. Kartendarstellung (OpenFreeMap / OpenStreetMap)</h2>
        <p>Für die interaktiven Karten lädt dein Browser Kartenkacheln und Kartenschriften vom Dienst OpenFreeMap (tiles.openfreemap.org) der Hyperknot Software Kft., Ungarn. Dabei werden deine IP-Adresse, Browserinformationen und der angezeigte Kartenausschnitt an den Betreiber übermittelt. Laut eigener Angabe speichert OpenFreeMap IP-Adressen nicht in seinen Zugriffsprotokollen. Ohne diese Übertragung kann die Karte nicht angezeigt werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse ist eine ansprechende und funktionsfähige Kartendarstellung ohne kommerzielle Tracking-Dienste. Weitere Informationen: <a href="https://openfreemap.org/privacy" target="_blank" rel="noopener">openfreemap.org/privacy</a>.</p>
        <p>Die Kartendaten stammen von OpenStreetMap. Die Haltestellen sind als Datei auf dieser Website hinterlegt, beim Anzeigen werden dafür keine Daten an Dritte übertragen.</p>

        <h2>5. Standort und Fußroute</h2>
        <p>Wenn du auf „Meinen Standort verwenden“ klickst, fragt dein Browser um Erlaubnis. Erst wenn du zustimmst, ermittelt er deinen Standort. Die Entfernungen zu den Orten berechnet die Website direkt in deinem Browser. Ich speichere deinen Standort nicht, und er wird nicht an mich übermittelt.</p>
        <p>Auf den Detailseiten wird für die Fußroute dein Standort (Start) zusammen mit dem Ziel an den Routing-Dienst der FOSSGIS e.V. (routing.openstreetmap.de) übermittelt. Dabei wird auch deine IP-Adresse übertragen. Der Dienst berechnet daraus den Weg und die Gehzeit. Rechtsgrundlage ist deine Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO, die du mit der Standortfreigabe erteilst. Du kannst sie jederzeit in den Einstellungen deines Browsers widerrufen. Hinweise des Betreibers: <a href="https://www.fossgis.de/datenschutzerkl%C3%A4rung/" target="_blank" rel="noopener">Datenschutzerklärung der FOSSGIS e.V.</a>.</p>

        <h2>6. Links zu Google Maps und OpenStreetMap</h2>
        <p>Die Schaltflächen „ÖPNV-Verbindung planen“ und „Route in OpenStreetMap“ öffnen externe Websites (Google Maps der Google Ireland Limited bzw. openstreetmap.org der OpenStreetMap Foundation). Daten werden erst übertragen, wenn du einen dieser Links anklickst. Hast du deinen Standort freigegeben, ist er als Startpunkt im Link enthalten und wird so an den jeweiligen Anbieter übermittelt. Für die Verarbeitung dort ist der jeweilige Anbieter verantwortlich: <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener">Datenschutzerklärung von Google</a>, <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener">Datenschutzerklärung der OSM Foundation</a>.</p>

        <h2>7. Speicherung im Browser</h2>
        <p>Wählst du eine Sprache (DE/EN), wird deine Wahl im lokalen Speicher deines Browsers (localStorage) abgelegt, damit die Seite beim nächsten Besuch in derselben Sprache erscheint. Diese Information verlässt dein Gerät nicht. Die Speicherung ist für den von dir gewünschten Dienst unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst sie jederzeit über die Browsereinstellungen löschen.</p>

        <h2>8. Deine Rechte</h2>
        <p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18), Datenübertragbarkeit (Art. 20) sowie Widerspruch gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (Art. 21). Eine erteilte Einwilligung kannst du jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3). Wende dich dafür an die oben genannte E-Mail-Adresse.</p>
        <p>Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestr. 2–4, 40213 Düsseldorf, <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener">www.ldi.nrw.de</a>.</p>

        <p class="legal__date">Stand: Oktober 2026</p>`,
      en: `
        <p class="legal__hint">This is a translation for your convenience. The German version is legally binding.</p>
        <h2>1. Controller</h2>
        <p>${address}<br>Germany<br>Email: ${mail}</p>

        <h2>2. In brief</h2>
        <p>This website does not set cookies, uses no analytics or tracking tools and has no contact form. Fonts and code libraries are hosted on the same server as the website. Data only goes to third parties where it is technically necessary to display the map or to calculate a walking route you have asked for. Your location is only used if you explicitly share it.</p>

        <h2>3. Hosting on GitHub Pages</h2>
        <p>This website is hosted on GitHub Pages, a service of GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. When you visit the pages, GitHub processes technically necessary access data (server log files), in particular your IP address, date and time of access, the requested file, the amount of data transferred, and browser and operating system information. This serves to deliver and secure the website.</p>
        <p>The legal basis is Art. 6 (1) (f) GDPR; my legitimate interest is the reliable and secure provision of the website. Data may be transferred to the USA. GitHub is certified under the EU-U.S. Data Privacy Framework (EU Commission adequacy decision, Art. 45 GDPR). More information: <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub Privacy Statement</a>.</p>

        <h2>4. Maps (OpenFreeMap / OpenStreetMap)</h2>
        <p>To show the interactive maps, your browser loads map tiles and map fonts from OpenFreeMap (tiles.openfreemap.org), operated by Hyperknot Software Kft., Hungary. This sends your IP address, browser information and the visible map area to the operator, which states that it does not store IP addresses in its access logs. The map cannot be displayed without this transfer. The legal basis is Art. 6 (1) (f) GDPR; my legitimate interest is an attractive, working map without commercial tracking services. More information: <a href="https://openfreemap.org/privacy" target="_blank" rel="noopener">openfreemap.org/privacy</a>.</p>
        <p>Map data comes from OpenStreetMap. Transit stops are stored as a file on this website, so no data is sent to third parties to display them.</p>

        <h2>5. Location and walking route</h2>
        <p>When you click “Use my location”, your browser asks for permission and only determines your location if you agree. Distances to places are calculated directly in your browser. I do not store your location, and it is not sent to me.</p>
        <p>To calculate a walking route on the detail pages, your location (start) and the destination are sent to the routing service of FOSSGIS e.V. (routing.openstreetmap.de), together with your IP address, which returns the route and walking time. The legal basis is your consent under Art. 6 (1) (a) GDPR, given by sharing your location. You can withdraw it at any time in your browser settings. Operator information: <a href="https://www.fossgis.de/datenschutzerkl%C3%A4rung/" target="_blank" rel="noopener">FOSSGIS e.V. privacy policy</a>.</p>

        <h2>6. Links to Google Maps and OpenStreetMap</h2>
        <p>The buttons “Plan a public transport trip” and “Route in OpenStreetMap” open external websites (Google Maps by Google Ireland Limited, or openstreetmap.org by the OpenStreetMap Foundation). Data is only transferred when you click one of these links. If you have shared your location, it is included in the link as the starting point and is thus passed on to that provider, who is responsible for any further processing: <a href="https://policies.google.com/privacy?hl=en" target="_blank" rel="noopener">Google Privacy Policy</a>, <a href="https://osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener">OSM Foundation Privacy Policy</a>.</p>

        <h2>7. Storage in your browser</h2>
        <p>When you choose a language (DE/EN), your choice is saved in your browser’s local storage so the page appears in the same language next time. This information never leaves your device. Storing it is strictly necessary for the service you requested (§ 25 (2) no. 2 TDDDG). You can delete it at any time in your browser settings.</p>

        <h2>8. Your rights</h2>
        <p>You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18), data portability (Art. 20) and to object to processing based on Art. 6 (1) (f) GDPR (Art. 21). You can withdraw consent at any time with effect for the future (Art. 7 (3)). To do so, contact the email address above.</p>
        <p>You also have the right to lodge a complaint with a data protection supervisory authority, for example the Data Protection and Freedom of Information Commissioner of North Rhine-Westphalia, Kavalleriestr. 2–4, 40213 Düsseldorf, Germany, <a href="https://www.ldi.nrw.de" target="_blank" rel="noopener">www.ldi.nrw.de</a>.</p>

        <p class="legal__date">Last updated: October 2026</p>`,
    },
  },
};
