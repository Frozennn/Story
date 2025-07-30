# 🔖 Travian Farm Bookmarklet - Super Jednostavno!

**Nema instalacija, nema npm, nema Node.js - samo kopiraj i koristi!** 🚀

## 🎯 Šta je ovo?

**Bookmarklet** je obična stranica u bookmarks-ima koja pokreće JavaScript kod na trenutnoj stranici. Kad klikneš bookmark - automatski šalje sve farm liste!

## ⚡ Kako da koristiš (3 koraka)

### **Korak 1: Kopiraj kod**

Otvori fajl `travian-farm-bookmarklet.js` i **kopiraj ceo kod** (sve od `javascript:(function(){` do kraja).

### **Korak 2: Napravi bookmark**

1. **Desni klik** na bookmark bar u browseru
2. Klikni **"Add page"** ili **"Add bookmark"**
3. **Name:** `🚜 Travian Farm Bot`
4. **URL:** Nalepi kopirani kod
5. Klikni **Save**

### **Korak 3: Koristi!**

1. **Uloguj se** na Travian
2. **Klikni** na bookmark `🚜 Travian Farm Bot`
3. **Čekaj** da se farm liste pošalju
4. **Gotovo!** 🎉

## 📱 Detaljno uputstvo sa slikama

### **Chrome/Edge:**
```
1. Ctrl+Shift+B (prikaži bookmark bar)
2. Desni klik na bookmark bar
3. "Add page..." 
4. Name: 🚜 Travian Farm Bot
5. URL: [nalepi kod]
6. Save
```

### **Firefox:**
```
1. Ctrl+Shift+B (prikaži bookmark bar) 
2. Desni klik na bookmark bar
3. "New Bookmark..."
4. Name: 🚜 Travian Farm Bot  
5. Location: [nalepi kod]
6. Save
```

### **Safari:**
```
1. View → Show Bookmarks Bar
2. Desni klik na bookmark bar
3. "Add Bookmark..."
4. Name: 🚜 Travian Farm Bot
5. Address: [nalepi kod] 
6. Add
```

## 🎮 Kako radi u praksi

### **1. Uloguj se na Travian**
```
- Idi na svoj Travian server
- Uloguj se normalno
- Idi u bilo koje selo
```

### **2. Klikni bookmark**
```
- Klikni na "🚜 Travian Farm Bot" bookmark
- Pojavljuje se mali prozor sa logom u gornjem desnom uglu
```

### **3. Prati progress**
```
🎯 Starting Travian Farm Automation...
🎯 Navigating to Rally Point...
🎯 Navigating to Farm List...
🎯 Looking for Send All Farm Lists button...
✅ Found "Send all" button, clicking...
✅ All farm lists sent successfully!
```

### **4. Zatvorit log**
```
- Klikni "✖ Close" da zatvoriš log
- Ili ostavi otvoren za sledeći put
```

## 🔧 Šta radi automatski

### **Inteligentna navigacija:**
- ✅ Automatski ide do Rally Point
- ✅ Automatski ide do Farm List
- ✅ Radi sa različitim verzijama Travian-a

### **Pametno slanje:**
- ✅ Prvo traži "Send all farm lists" dugme
- ✅ Ako nema, šalje individualne farm liste
- ✅ Proverava da li su dugmad enabled
- ✅ Simulira human-like klikkove

### **Sigurnosne provere:**
- ✅ Proverava da li si ulogovan
- ✅ Čeka da se stranice učitaju
- ✅ Prikazuje greške ako nešto ne radi

## 🛡️ Anti-ban funkcije

### **Human-like ponašanje:**
- Random pauze između akcija (2-5 sekundi)
- Simulira hover pre klika
- Random offset pri klikanju
- Prirodni mouse eventi

### **Sigurne provere:**
- Ne radi ako nisi ulogovan
- Proverava da li postoje farm liste
- Graceful error handling

## 🐛 Troubleshooting

### **Problem: "You must be logged in to Travian first!"**
```
Rešenje:
- Uloguj se na Travian pre pokretanja bookmarklet-a
- Refresh stranicu i pokušaj ponovo
```

### **Problem: "No farm list buttons found!"**
```
Rešenje:
- Proveri da li imaš farm liste kreiranje
- Možda trebaš Gold Account za "Send all" funkciju
- Pokušaj da ideš ručno do Rally Point → Farm List
```

### **Problem: Bookmark se ne pojavljuje**
```
Rešenje:
- Proveri da li je bookmark bar prikazan (Ctrl+Shift+B)
- Pokušaj da napraviš bookmark ponovo
- Proveri da li si kopirao ceo kod
```

### **Problem: Ništa se ne dešava kad kliknem**
```
Rešenje:
- Otvori Developer Tools (F12)
- Idi na Console tab
- Klikni bookmark ponovo
- Vidi da li ima grešaka u console-u
```

## 💡 Pro saveti

### **1. Testiranje:**
```
- Prvi put pokreni kad si tu da gledaš
- Proveri da li sve radi kako treba
- Tek onda koristi redovno
```

### **2. Bezbednost:**
```
- Ne koristi previše često (max 2-3 puta dnevno)
- Menjaj vremena kad pokrećeš
- Pravi pauze između korišćenja
```

### **3. Optimizacija:**
```
- Ako imaš više sela, pokreni u svakom
- Kombinuj sa ručnim igranjem
- Ne oslanjaj se 100% na bot
```

### **4. Backup:**
```
- Eksportuj bookmarks redovno
- Čuvaj kopiju koda
- Napravi backup na više browsera
```

## 🔄 Kako da updatuješ

Kad izađe nova verzija:
1. Kopiraj novi kod
2. Desni klik na postojeći bookmark
3. "Edit" ili "Properties"
4. Zameni URL sa novim kodom
5. Save

## 📊 Prednosti vs Node.js verzija

### **Bookmarklet prednosti:**
- ✅ **Nema instalacija** - kopiraj i koristi
- ✅ **Radi svugde** - Chrome, Firefox, Safari, Edge
- ✅ **Brz setup** - 2 minuta i gotovo
- ✅ **Lako updateovanje** - samo zameniti kod
- ✅ **Nema dependencies** - ne treba npm, Node.js

### **Node.js verzija prednosti:**
- ✅ **Automatski loop** - radi sam bez tebe
- ✅ **Više konfiguracija** - detaljnije postavke
- ✅ **Bolji logging** - fajlovi, detaljniji logovi
- ✅ **Multi-village rotation** - automatski menja sela

## ⚠️ Važne napomene

- **Koristi na vlastitu odgovornost**
- **Bot usage može biti protiv ToS**
- **Testuj prvo u debug modu**
- **Ne ostavljaj da radi 24/7**
- **Pravi redovne pauze**

---

## 🎉 Gotovo!

**Sada imaš najlakši Travian farm bot na svetu!** 

Samo klikni bookmark kad želiš da pošalješ farm liste - nema komplikacija! 🚜✨

**Pitanja? Problemi? Javi se!** 💬