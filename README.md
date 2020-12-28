# Feiertags-Pruefung

Das Skript prüft ein Moment-Datum bundesweit oder für ein Bundesland auf Feiertag.
(Die Daten basieren auf https://de.wikipedia.org/wiki/Gesetzliche_Feiertage_in_Deutschland)
 
Die möglichen Rückgabewert sind 
    false           => wenn kein Feiertag vorliegt
    Feiertags-Name  => wenn ein Feiertag vorliegt

Aufrufsbeispiele
  me.start()                              => fragt das heutige Datum nach einem bundesweiten Feiertag ab
  me.start(moment('2020-12-25'))          => fragt den 25.12.2020 nach einem bundesweiten Fertag ab
  me.start(undefined, 'HH')               => fragt das heutige Datum für das Bundesland Hamburg nach einem Feiertag ab
  me.start(moment('2020-05-01', 'SN'))    => fragt den 01.05.2020 für das BUndesland Sachsen nach einem Feiertag ab
 
Verwendungsbeispiel in externen Skripten:
```javascript
const feiertag = require('/home/nodejs/feiertag/app')
  if (feiertag.start(undefined, 'HH')) {
  console.log('Ausführung wegen Feiertag ausgesetzt')
  return
  }
```
