# IT Solutions Leitner – Website

Mehrseitige Unternehmenswebsite für IT Solutions Leitner aus Krieglach. Das Projekt ist bewusst ohne Framework und ohne Build-Tool mit reinem HTML, CSS und JavaScript umgesetzt.

## Projektstruktur

```text
neu-komplett/
├── index.html
├── ueber-uns.html
├── leistungen.html
├── webdesign.html
├── wartung-betreuung.html
├── domain-hosting.html
├── referenzen.html
├── referenz-hairdesign-leitner.html
├── referenz-neuburger-metall.html
├── faq.html
├── kontakt.html
├── impressum.html
├── datenschutz.html
├── 404.html
├── css/style.css
├── js/script.js
├── fonts/
├── images/
├── robots.txt
└── sitemap.xml
```

## Lokal ansehen

Den Projektordner in VS Code öffnen und `index.html` mit der Extension **Live Server** starten. Alle Pfade sind relativ und funktionieren dadurch auch nach dem Deployment.

## Veröffentlichung über Git und Vercel

1. Änderungen lokal mit Git versionieren.
2. In das GitHub-Repository auf den Branch `main` pushen.
3. Das mit GitHub verbundene Vercel-Projekt veröffentlicht die statischen Dateien automatisch.
4. Die Domain `itsolutions-leitner.at` wird im Vercel-Projekt hinterlegt und beim Domainanbieter auf Vercel ausgerichtet.

## Vor dem endgültigen Onlinegang prüfen

- Firmenstatus, UID- und Firmenbuchangaben im Impressum ergänzen, sobald vorhanden.
- Auftragsverarbeitungsvereinbarungen und Datenschutzhinweise für Vercel und Formspree prüfen.
- Kontaktformular mit einer realen Testanfrage kontrollieren.
- Finale Referenzbilder und ein Foto von Christoph Leitner einsetzen.
- Noch nicht vorhandene Social-Media-Links erst veröffentlichen, wenn die Profile eingerichtet sind.
- Preise, Telefonnummer, E-Mail-Adressen und Öffnungszeiten abschließend bestätigen.

## Pflege

Die Website verwendet genau eine zentrale CSS-Datei und eine zentrale JavaScript-Datei. Allgemeine Designänderungen gehören in `css/style.css`, Interaktionen in `js/script.js`. Inhalte der einzelnen Seiten werden direkt in den jeweiligen HTML-Dateien gepflegt.
