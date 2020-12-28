//    _____    _           _                        ____                   __                   
//   |  ___|__(_) ___ _ __| |_ __ _  __ _ ___      |  _ \ _ __ _   _  ___ / _|_   _ _ __   __ _ 
//   | |_ / _ \ |/ _ \ '__| __/ _` |/ _` / __|_____| |_) | '__| | | |/ _ \ |_| | | | '_ \ / _` |
//   |  _|  __/ |  __/ |  | || (_| | (_| \__ \_____|  __/| |  | |_| |  __/  _| |_| | | | | (_| |
//   |_|  \___|_|\___|_|   \__\__,_|\__, |___/     |_|   |_|   \__,_|\___|_|  \__,_|_| |_|\__, |
//                                  |___/                                                 |___/ 
// 
//  Das Skript prüft ein Moment-Datum bundesweit oder für ein Bundesland auf Feiertag.
//  (Die Daten basieren auf https://de.wikipedia.org/wiki/Gesetzliche_Feiertage_in_Deutschland)
// 
//  Die möglichen Rückgabewert sind 
//      false           => wenn kein Feiertag vorliegt
//      Feiertags-Name  => wenn ein Feiertag vorliegt
//
//  Aufrufsbeispiele
//  me.start()                              => fragt das heutige Datum nach einem bundesweiten Feiertag ab
//  me.start(moment('2020-12-25'))          => fragt den 25.12.2020 nach einem bundesweiten Fertag ab
//  me.start(undefined, 'HH')               => fragt das heutige Datum für das Bundesland Hamburg nach einem Feiertag ab
//  me.start(moment('2020-05-01', 'SN'))    => fragt den 01.05.2020 für das BUndesland Sachsen nach einem Feiertag ab
// 
//  Verwendungsbeispiel in externen Skripten:
//      const feiertag = require('/home/nodejs/feiertag/app')
//      if (feiertag.start(undefined, 'HH')) {
//          console.log('Ausführung wegen Feiertag ausgesetzt')
//          return
//      }
// 

'use strict'
const moment = require('moment')
const me = module.exports = {}

let feiertage = [
//  [Tag, Monat, 'Feiertag', 'Bundesländer (BUND = bundesweit)'] 
//  wenn Tag = 0 handelt es sich um einen, vom Osterdatum abhängigen, beweglichen Feiertag. Der Abstand der Tage vom Ostersonntag ist dann im Wert vom Monat hinterlegt.
    [1, 1, 'Neujahr', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [6, 1, 'Heilige Drei Könige', 'BW,BY,ST'],
    [8, 3, 'Frauentag', 'BE'],
    [0, -2, 'Karfreitag', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [0, 0, 'Ostersonntag', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [0, 1, 'Ostermontag', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [1, 5, 'Erster Mai', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [0, 39, 'Christi Himmelfahrt', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [0, 49, 'Pfingstsonntag', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [0, 50, 'Pfingstmontag', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [0, 60, 'Frohnleichnam', 'BW,BY,HE,NW,RP,SL,SN*,TH*'],
    [8, 8, 'Augsburger Hohes Friedensfest', 'BY*'],
    [15, 8, 'Mariä Himmelfahrt', 'BY*,SL'],
    [20, 9, 'Weltkindertag', 'TH'],
    [3, 10, 'Tag der Deutschen Einheit', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [31, 10, 'Reformationstag', 'BB,HB,HH,MV,NI,SN,ST,SH,TH'],
    [1, 11, 'Allerheiligen', 'BW,BY,NW,RP,SL'],
    [23, 11, 'Buß- und Bettag', 'SN'],
    [24, 12, 'Heiligabend*', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [25, 12, '1. Weichnachtstag', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [26, 12, '2. Weichnachtstag', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH'],
    [31, 12, 'Silvester*', 'BUND,BW,BY,BE,BB,HB,HH,HE,MV,NI,NW,RP,SL,SN,ST,SH,TH']
]

me.start = function (datum = moment(), bundesland = 'BUND') {
    for (let i = 0; i < feiertage.length; i++) {
        if (feiertage[i][3].includes(bundesland)) { // ist der Feiertag für das angegebene Bundesland relevant?
            if (feiertage[i][0] != 0 && feiertage[i][2] != 'Buß- und Bettag') { // feste Feiertage
                if (datum.isSame(moment([datum.year(), feiertage[i][1] - 1, feiertage[i][0]]))) return feiertage[i][2]
            } else if (feiertage[i][0] == 0) { // bewegliche Feiertage (abhängig vom Osterdatum) 
                if (datum.isSame(Osterdatum(datum.year()).add(feiertage[i][1], "day"))) return feiertage[i][2]
            } else if (feiertage[i][2] == 'Buß- und Bettag') { // bewegliche Feiertage (unabhängig vom Osterdatum)
                for (let j = 22; j >= 16; j--) {
                    if (moment([datum.year(), feiertage[i][1] - 1, j]).day() == 3 && datum.isSame(moment([datum.year(), feiertage[i][1] - 1, j]))) return feiertage[i][2]
                }
            }
        }
    }
    return false
}

// Spencers Osterformel dient zur Berechnung des Ostersonntags (Monat = n, Tag = p+1)
let Osterdatum = function (Jahr) {
    let a = Jahr % 19
    let b = Math.trunc(Jahr / 100)
    let c = Jahr % 100
    let d = Math.trunc(b / 4)
    let e = b % 4
    let f = Math.trunc((b + 8) / 25)
    let g = Math.trunc((b - f + 1) / 3)
    let h = (19 * a + b - d - g + 15) % 30
    let i = Math.trunc(c / 4)
    let k = c % 4
    let l = (32 + 2 * e + 2 * i - h - k) % 7
    let m = Math.trunc((a + 11 * h + 22 * l) / 451)
    let n = Math.trunc((h + l - 7 * m + 114) / 31)
    let p = (h + l - 7 * m + 114) % 31
    return moment([Jahr, n - 1, p + 1])
};