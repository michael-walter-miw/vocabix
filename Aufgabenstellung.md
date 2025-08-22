# Aufgabenstellung Angular

## Einführung

In unserem aktuellen Software-Projekt verwenden wir **Angular mit TypeScript**. Gerne würden wir dir eine kleine Aufgabe geben, um einen ersten Eindruck von deiner Herangehensweise und deinem Code-Style zu bekommen.

Vorzugsweise löst du die Aufgabe mit Angular. Welche der beiden Aufgaben du lösen möchtest, ist dir überlassen. Falls du noch nie mit Angular gearbeitet hast, empfehlen wir dir einen Blick auf die [Angular Dokumentation](https://angular.io/docs/ts/latest/guide/learning-angular.html) zu werfen. Die Seite eignet sich gut als Einstieg.

Der geschätzte Zeitaufwand für die Aufgabe beträgt je nach Vorkenntnissen zwischen **4 und 12 Stunden**.

Bei der Implementierung solltest du folgende Punkte berücksichtigen:

- Objekt-orientierter TypeScript- oder JavaScript-Code
- Logische und sinnvolle Benutzeroberfläche
- Stelle uns deine Webapplikation auf **GitHub mit einer Readme-Datei** zur Verfügung

---

## Aufgabe: Wortschatz-Trainer

Erstelle eine Wortschatz-Trainer Applikation mit folgenden Funktionalitäten, die in **3 Tabs** angeordnet sind:

### 1. Erfassen

- Wortpaare alphabetisch sortiert auflisten
- Wortpaare **hinzufügen / bearbeiten / löschen**
- Button: **Beispieldaten einfüllen**
- Button: **Alles zurücksetzen**
- **Bonus:**
  - Liste der Wortpaare kann für beide Sprachen sortiert werden
  - Wortliste wird im **LocalStorage** persistiert

### 2. Trainieren

- Es wird zufällig eine der beiden Sprachen abgefragt
- Wörter werden zufällig ausgewählt
- Nach falscher Antwort wird das korrekte Wort angezeigt
- **Bonus:**
  - Falsch beantwortete Wörter werden häufiger wieder abgefragt

### 3. Prüfung

- Während der Prüfung sind die Tabs **Erfassen** und **Trainieren** gesperrt
- Es wird zufällig eine der beiden Sprachen abgefragt
- Alle Wörter werden in zufälliger Reihenfolge abgefragt
- Nach der Prüfung werden **Resultat und Statistik** angezeigt
- **Bonus:**
  - Trefferquote und Wortanzahl definierbar
  - Prüfungsdauer kann limitiert werden

---

## Aufgabe: Pomodoro-App

Erstelle eine Pomodoro-Applikation mit folgenden Funktionalitäten, ebenfalls in **3 Tabs**:

### 1. Einstellungen

- Dauer der Aufgaben/Pausen definieren
- Änderungen nur **vor dem Start** möglich

### 2. Wecker

- Aufgaben **hinzufügen**, bearbeiten oder löschen (sofern nicht aktiv)
- Aufgaben als **erledigt markieren**
- Wecker **starten und stoppen**
- Button: **Beispieldaten einfüllen**
- Button: **Alles zurücksetzen**
- Überfällige Wecker markieren und **Meldung im Browserfenster** anzeigen
- **Bonus:**
  - Desktop-Notifications bei minimiertem Fenster
  - Wartende Aufgaben verschieben (z. B. mit Up/Down-Buttons oder Drag and Drop)
  - Einstellungen/Wecker im **LocalStorage** speichern

### 3. Log

- Alle Ereignisse loggen und hier anzeigen

---

## Nützliche Links

- [Angular Startseite](https://angular.io)
- [Angular API Referenz](https://angular.io/docs/ts/latest/api)
- [Angular Lernpfad (Einstieg)](https://angular.io/docs/ts/latest/guide/learning-angular.html)
- [Warum TypeScript? – Basarat Guide](https://basarat.gitbooks.io/typescript/docs/why-typescript.html)

