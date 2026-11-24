# Roberto installeren

Doe stap 1 t/m 4 het makkelijkst op een computer. Daarna alles op de telefoon. Totaal ongeveer 15 minuten.

## 1. De app op GitHub Pages zetten
1. Ga naar github.com, log in en kies **New repository**.
2. Naam: `roberto`, zichtbaarheid **Public**. Maak de repo aan.
3. Kies **Add file → Upload files** en sleep de *inhoud* van de map `roberto` erin (index.html, app.js, logic.js, styles.css, sw.js, manifest.webmanifest, de map icons, enzovoort). Klik **Commit changes**.
4. Ga naar **Settings → Pages**, kies bij *Source* **Deploy from a branch**, branch **main**, map **/ (root)**, en klik **Save**.
5. Na een minuut staat de app op `https://JOUWNAAM.github.io/roberto/`.

De app zelf bevat geen gegevens. De kelder staat apart in een privé-repo.

## 2. De privé-kelder aanmaken
1. Maak nog een repository: `roberto-kelder`, zichtbaarheid **Private**.
2. Upload `README.md` en de map `scripts` uit de map `roberto-kelder`.
3. Het workflowbestand maak je met de hand aan, omdat mappen met een punt (`.github`) vaak niet meegaan bij uploaden:
   **Add file → Create new file**, naam `.github/workflows/meldingen.yml`, plak de inhoud van dat bestand en klik **Commit**.

## 3. Een sleutel (token) voor de app maken
1. Ga naar **github.com/settings/personal-access-tokens/new** (Fine-grained token).
2. Naam: `Roberto`. Kies bij *Expiration* de langste termijn (of *No expiration*).
3. *Repository access*: **Only select repositories** → `roberto-kelder`.
4. *Permissions → Repository permissions → Contents*: **Read and write**.
5. Klik **Generate token** en kopieer het (begint met `github_pat_`). Je ziet het maar één keer.

## 4. Installeren op je Android-telefoon
1. Open `https://JOUWNAAM.github.io/roberto/` in **Chrome**.
2. Menu ⋮ → **App installeren** (of *Toevoegen aan startscherm*). Roberto staat nu met logo tussen je apps.
3. Open Roberto en kies **Rob**.
4. Tandwieltje → *Samen delen via GitHub*: vul je GitHub-gebruikersnaam, `roberto-kelder` en het token in → **Koppelen & synchroniseren**. Het bolletje bij het sync-icoon wordt groen.

## 5. Meldingen instellen (eenmalig)
1. In Roberto: tandwieltje → *Meldingen* → **Sleutels aanmaken**.
2. Ga in GitHub naar `roberto-kelder` → **Settings → Secrets and variables → Actions → New repository secret** en maak er twee:
   - `VAPID_PUBLIC_KEY` met de publieke sleutel
   - `VAPID_PRIVATE_KEY` met de geheime sleutel
3. Terug in Roberto: **Meldingen aanzetten op deze telefoon** en toestaan. Je krijgt direct een bevestiging.
4. Testen: in GitHub `roberto-kelder` → **Actions** → *Roberto maandmelding* → **Run workflow**. Binnen een minuut krijg je een melding.

Daarna gaat het vanzelf: op de 1e van elke maand rond 9:00 krijg je een melding met de flessen die op hun best zijn, de laatste kansen en wat over de top is.

## 6. Marion toevoegen
1. Op jouw telefoon: tandwieltje → **Koppeling delen met Marion** en stuur de link via WhatsApp. Die link bevat het token, dus stuur hem alleen naar haar.
2. Marion opent de link in Chrome, installeert de app (⋮ → App installeren) en kiest **Marion**.
3. Marion zet bij Instellingen ook **Meldingen aan**.

Jullie zien nu dezelfde kelder. Wijzigingen worden binnen een paar seconden gesynchroniseerd, en ook als je de app opent.

## Goed om te weten
- **Vivino / Untappd:** per fles staat een knop die de wijn (Vivino) of het bier (Untappd) opzoekt. Plak de deellink uit de Vivino-app in het veld *Link*, dan opent de knop meteen de juiste pagina. De score typ je zelf over; Vivino heeft geen koppeling waarmee dat automatisch kan.
- **Drinkvenster:** Roberto schat dat op basis van druif, streek, jaargang, prijs en bierstijl. Wil je het anders? Kies bij *Bewerken* → **Zelf een ander drinkvenster kiezen**.
- **Back-up:** de kelder staat met volledige geschiedenis in GitHub. Daarnaast kun je in Instellingen een JSON-export maken.
- **Naam aanpassen:** de naam staat in `manifest.webmanifest`, `index.html` en `icons/wordmark.svg`.
