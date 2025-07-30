# 🚜 Travian Legends Farm Automation

Automatska skripta za slanje farm listi u igri Travian Legends (T4.6+) sa naprednim anti-ban mehanizmima i human-like ponašanjem.

## ⚠️ VAŽNO UPOZORENJE

**KORISTITE NA VLASTITU ODGOVORNOST!** Ova skripta je napravljena za edukacijske svrhe. Autor nije odgovoran za eventualnu suspenziju ili ban naloga. Uvek pročitajte Terms of Service vaše Travian igre pre korišćenja.

## 🎯 Funkcionalnosti

- ✅ **Automatski login** sa konfiguracionim fajlom
- ✅ **Navigacija do Rally Point → Farm List**
- ✅ **Automatsko slanje svih farm listi** ("Send all farm lists" dugme)
- ✅ **Randomizovane pauze** između slanja (4-6 minuta, konfigurisano)
- ✅ **Human-like ponašanje**:
  - Pokretanje miša i hover efekti
  - Skrolovanje stranice
  - Randomizovani delay pre svakog klika
  - Prirodno kucanje teksta
- ✅ **Anti-ban zaštita**:
  - Stealth Puppeteer plugin
  - CAPTCHA detekcija
  - Popup detekcija
  - Retry mehanizam
- ✅ **Podrška za više sela** sa rotacijom
- ✅ **Detaljno logovanje** u fajlove i konzolu
- ✅ **Graceful shutdown** (Ctrl+C)

## 📋 Preduslovi

- **Node.js** 16+ (preporučeno 18+)
- **npm** ili **yarn**
- **Chrome/Chromium** browser (automatski se instalira sa Puppeteer)

## 🛠️ Instalacija

1. **Kloniraj ili preuzmi projekat:**
   ```bash
   git clone <repository_url>
   cd travian-farm-automation
   ```

2. **Instaliraj dependencies:**
   ```bash
   npm install
   ```

3. **Konfiguriši account podatke:**
   
   **Opcija A: Koristi config.json (preporučeno)**
   ```bash
   # Edituj config.json fajl
   nano config.json
   ```
   
   Promeni sledeće vrednosti:
   ```json
   {
     "travian": {
       "server": "https://ts1.travian.com",
       "username": "tvoj_username",
       "password": "tvoja_password"
     }
   }
   ```

   **Opcija B: Koristi environment variables**
   ```bash
   # Kopiraj .env.example
   cp .env.example .env
   
   # Edituj .env fajl
   nano .env
   ```

## ⚙️ Konfiguracija

### Osnovne postavke (`config.json`)

```json
{
  "travian": {
    "server": "https://ts1.travian.com",
    "username": "YOUR_USERNAME",
    "password": "YOUR_PASSWORD",
    "villages": [
      {
        "name": "Main Village",
        "coordinates": "0|0",
        "enabled": true
      }
    ]
  },
  "automation": {
    "sendInterval": {
      "min": 240000,  // 4 minuta
      "max": 360000   // 6 minuta
    },
    "delays": {
      "betweenActions": {
        "min": 3000,  // 3 sekunde
        "max": 7000   // 7 sekundi
      }
    }
  },
  "browser": {
    "headless": false,  // true za background rad
    "devtools": false   // true za debug
  }
}
```

### Environment Variables

```bash
TRAVIAN_USERNAME=tvoj_username
TRAVIAN_PASSWORD=tvoja_password
TRAVIAN_SERVER=https://ts1.travian.com
HEADLESS_MODE=false
```

## 🚀 Pokretanje

### Osnovni start:
```bash
npm start
```

### Debug mod (sa browser dev tools):
```bash
npm run dev
```

### Headless mod (background):
```bash
HEADLESS_MODE=true npm start
```

## 📊 Logovanje

Skripta kreira detaljne logove u `logs/` direktorijumu:

- `logs/app.log` - Svi logovi
- `logs/error.log` - Samo greške

Primer log output:
```
2024-01-15 14:30:25 info: 🚀 Initializing Travian Bot...
2024-01-15 14:30:30 info: 🔐 Successfully logged in as player123 on https://ts1.travian.com
2024-01-15 14:30:35 info: 🎯 Navigating to Rally Point...
2024-01-15 14:30:40 info: 🎯 Navigating to Farm List...
2024-01-15 14:30:45 info: 🚜 Farm lists sent from Main Village (all lists)
2024-01-15 14:30:50 info: ⏰ Waiting 5 minutes until next cycle...
```

## 🛡️ Anti-Ban Funkcionalnosti

### Human-like ponašanje:
- **Random mouse movements** - Pomera miš po stranici
- **Scrolling simulation** - Skroluje gore-dole
- **Hover effects** - Hover pre klika na elemente
- **Typing delays** - Prirodno kucanje sa pauzama
- **Random click offsets** - Klika sa malim offsetom od centra

### Detekcija i zaštita:
- **CAPTCHA detection** - Automatski pauzira kad detektuje CAPTCHA
- **Popup detection** - Detektuje neočekivane popup-e
- **Retry mechanism** - Pokušava ponovo u slučaju greške
- **Stealth mode** - Koristi stealth plugin za Puppeteer

### Sigurnosne postavke:
```json
{
  "safety": {
    "maxRetries": 3,
    "pauseOnCaptcha": true,
    "pauseOnError": true,
    "emergencyStop": true
  }
}
```

## 🏘️ Podrška za više sela

Dodaj sela u `config.json`:

```json
{
  "travian": {
    "villages": [
      {
        "name": "Main Village",
        "coordinates": "0|0",
        "enabled": true
      },
      {
        "name": "Second Village",
        "coordinates": "10|15",
        "enabled": true
      },
      {
        "name": "Third Village",
        "coordinates": "-5|8",
        "enabled": false
      }
    ]
  }
}
```

Skripta će rotirati između omogućenih sela.

## 🐛 Troubleshooting

### Česti problemi:

1. **"Login failed"**
   - Proveri username/password
   - Proveri server URL
   - Možda je potreban CAPTCHA

2. **"Could not find Send all farm lists button"**
   - Možda nemaš Gold Account
   - Možda nemaš farm liste
   - Možda se selektori razlikuju na tvom serveru

3. **"Browser failed to launch"**
   - Instaliraj Chrome/Chromium
   - Pokreni sa `--no-sandbox` flag

4. **CAPTCHA se stalno pojavljuje**
   - Smanji frekvenciju slanja
   - Povećaj randomizaciju
   - Koristi headless=false da vidiš šta se dešava

### Debug mod:

```bash
# Pokreni sa debug info
DEBUG=true npm start

# Pokreni sa browser dev tools
npm run dev
```

## 📝 Napomene

### Kompatibilnost:
- ✅ Travian Legends T4.6+
- ✅ Gold Account (potreban za "Send all farm lists")
- ✅ Linux, Windows, macOS

### Performance:
- RAM usage: ~200-300MB
- CPU usage: Nizak (osim tokom navigacije)
- Network: Minimalan (kao normalan browser)

### Bezbednost:
- Nikad ne čuva lozinke u plain text (osim config fajla)
- Koristi HTTPS konekcije
- Nema spoljne API pozive

## 🤝 Doprinos

Pull requests su dobrodošli! Za veće izmene, molimo da prvo otvorite issue.

## 📄 Licenca

MIT License - videti [LICENSE](LICENSE) fajl.

## ⚠️ Disclaimer

Ova skripta je napravljena za edukacijske svrhe. Korišćenje botova može biti protiv Terms of Service igre Travian. Koristite na vlastitu odgovornost. Autor nije odgovoran za bilo kakve posledice korišćenja ove skripte, uključujući ali ne ograničavajući se na suspenziju ili ban naloga.

---

**Srećno farmovanje! 🚜✨**