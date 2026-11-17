# DjurHittaren – projektregler för Claude

Svensk, mobilanpassad webbapp som hjälper borttappade husdjur att återförenas med sina ägare.
Fullständig kravlista och beslut finns i Claude-projektet "Pet Finder APP" (dokumentet "krav-och-beslut"). Vid motsägelse gäller det dokumentet.

## Om användaren
- Dominika är nybörjare på kod och databaser. Förklara varje tekniskt steg enkelt, steg för steg, på svenska.
- Be aldrig användaren klistra in lösenord eller hemliga nycklar (t.ex. Supabase service_role) i chatten. Hemligheter hör aldrig hemma i frontend-kod.

## Grundregler
- Kontrollera först om det redan finns kod, databas, auth och design och återanvänd den. Skapa inte ett parallellt system.
- Mobil först. All text på svenska och engelska, språkval i inställningar.
- Inga betalda tjänster eller nya integrationer utan godkännande.
- Verifiera med riktiga databasposter. Inga fabricerade sökresultat eller lokalt simulerade meddelanden.

## Integritet och säkerhet (får aldrig brytas)
- Ingen personinformation offentligt: aldrig namn, e-post, telefon, adress eller chipnummer. Användare syns bara med genererat användarnamn (t.ex. Luna1234), skapat på servern.
- Behörighet kontrolleras i databasen (RLS och säkra funktioner som get_lost_pets()/search_lost_pets()), inte bara i gränssnittet.
- Endast ägaren ändrar sitt djurs status och svarar på förfrågningar. Endast samtalets två parter läser/skriver meddelanden. Härled alltid ägare och avsändare på servern.
- Bilder i privat bucket "pet-photos", offentlig åtkomst bara för aktuellt borttappade djur. Max 5 MB, validera filtyp.
- Platser lagras som text (adress/område → ort → land), aldrig påhittade kilometeravstånd. GPS-koordinater sparas aldrig, bara används för platsuppslag och landskontroll. Adressen i en efterlysning är offentlig (varning visas i formuläret).

## Beslut
- Starta från noll (ingen känd befintlig kod).
- Djur: minst 2 foton, 3 rekommenderas.
- Återfunnet: anmälan arkiveras, försvinner från publik sökning och vektormängd, historik finns kvar för ägaren.
- Fyndets datum sätts automatiskt till inskickningstillfället.
- Blockering är fullständig och valideras i databasen.
- Konto: pausa (döljs, kan återaktiveras) eller radera (all användarens historik tas bort; motparten ser "Raderad användare").
- Platsuppslag: gratis OpenStreetMap. Nominatim för omvänd uppslagning (karta/GPS), Photon (photon.komoot.io) för adressförslag medan man skriver (godkänt av användaren), Leaflet + OpenStreetMap-kartor för kartan. Sveriges 290 kommuner som fast lista ännu ej byggd.
- Land: hemland (SE/ES) väljs vid registrering och kan ändras i profilen. Visat land (som i Marketplace) kan bytas fritt i listan/träffar. Man kan anmäla borttappat i vilket land som helst, men varje anmälan kräver påslagna platstjänster och att enhetens land = platsens land (kontrolleras i databasen, men landskoderna kommer från klienten). Platstjänster är aldrig alltid påslagna (integritet/GDPR).
- E-post: databasleverantörens standardutskick tills vidare.
- AI-bildmatchning ingår men ligger bakom en flagga. Aktiveras först när kraven är uppfyllda och användaren godkänt leverantör och kostnad: EXIF/GPS borttagna på servern, zero-data-retention, ingen träning, bilder sparas inte, kvotgräns (t.ex. 5 sökningar/timme), GDPR verifierat. Sökbilder får skickas till servern. Bildsökning kräver inte inloggning.
- Pipeline: SQL-förfilter (borttappad, samma djurslag) → vektorsökning (pgvector) → vision-verifiering av topp 3–5 → rangordnat resultat med konkret motivering.
- Appen ska kunna paketeras för App Store och Google Play (PWA/Capacitor).

## Byggordning
1. Konton, användarnamn, djurregistrering, offentlig sökning, sv/en.
2. Kontaktförfrågan, privat chatt, notiser, blockering, upphittat-flöde med textmatchning.
3. AI-bildmatchning.
Testmiljö: separat Supabase dev-projekt (djurhittaren-dev), se Status nedan. Testa med tre separata konton enligt testkraven i projektet.

## Status (uppdaterad 2026-11-17)
Klart:
- Mapp och denna CLAUDE.md skapade. Kravdokumentet "krav-och-beslut" ligger i Claude-projektet.
- Supabase Free-projekt `djurhittaren-dev` skapat i molnet av användaren (beslut: molnet, inte lokalt/Docker). URL och publishable-nyckel ligger i `.env` (ignoreras av git, `.env.example` är mallen). Den hemliga nyckeln (secret/service_role) har aldrig delats och ska aldrig delas.
- Designskiss klar som Design-artefakt "DjurHittaren – designskiss": https://claude.ai/artifact/BSTn48mD1zTWsKTTQH97re (borttappade djur, djurprofil, kontakta ägaren, hittat djur, träffar, färgtavla).

Byggt och uppladdat (GitHub Pages: https://soltant97.github.io/petfind/, repo soltant97/petfind, publikt; kod i `docs/`, databas i `supabase/schema.sql`):
- Webbapp kopplad till Supabase (docs/app.js, db.js, config.js med publishable-nyckel): registrering/inloggning/återställ lösenord, djurregistrering med ≥2 foton (bilder skalas ned till 1024 px), borttappat/återfunnet, offentlig sökning, upphittat-flöde med textmatchning, kontaktförfrågan, godkänn/avböj/återkalla, privat chatt med realtid, notiser (oläst-siffra), blockering, byte av användarnamn, pausa/radera konto, sv/en.
- Databasen (schema.sql) är körd i djurhittaren-dev av användaren och går att köra om. Nya landsregler (hemland, p_country-filter, report_lost med p_country + p_device_country, set_home_country) ligger i schema.sql och MÅSTE köras om av användaren i SQL Editor innan landsfunktionen fungerar (väntar på användarens "klart").
- Efter användarens testning: bildbläddring med pilar/svepning (inga vinkeltexter), platssymbol (ikon) i stället för knapp, fältet "Sågs senast" med adressförslag (Photon) och karta med flyttbar markör som visar exakt adress (gata + nummer, område, ort), rasväljare (katt-/hundlistor, Huskatt, Okänd, Blandras med flera raser), land (se Beslut).
- Cache-busting med ?v=N på skript/stil i docs/index.html (höj N vid varje ändring; senast v=11).
- Testat i sandlådan bara mot en låtsas-Supabase (Playwright) och en lokal Postgres; riktiga Supabase, riktiga kartor och riktiga adresstjänster kunde inte nås därifrån och är inte live-testade.

Designval:
- Färger: solgul #FFD770, ljusgul #FFF3C9, korall #F4806B, ljuskorall #FFE3DC, beige #F6EDE0, mörkbeige #E9DCC8, vit #FFFCF5, text #3A2A1E, dämpad text #7A6552, korallfärgad text på ljuskorall #A8402D. Inget grönt (användarens önskemål).
- Typsnitt: Nunito. Mobil först, bottennavigering: Borttappade, Mina djur, Hittat djur (stor gul knapp i mitten), Meddelanden, Profil.
- Knappar och etiketter har mörk text (vit text på gult/korall blir för svagt).

Beslut om drift (Supabase Free):
- Gratisplanen räcker för test och tidig lansering: ca 500 MB databas, 1 GB filer, 5 GB utgående trafik/månad, 2 aktiva projekt. Pausas efter en vecka utan aktivitet och har inga backuper.
- Plan: gratis schemalagd "keep-alive" och egen automatisk databaskopia (t.ex. via GitHub Actions). Skala ner foton i appen innan uppladdning, visa små förhandsbilder i listor. Uppgradera till Pro (25 USD/mån) först när användarna växer.
- Kod ska ligga i ett privat GitHub-repo (gratis).
- Webbplatsen driftsätts på gratis värdtjänst, vald senare.

## Nästa steg
1. Användaren kör om hela `supabase/schema.sql` i Supabase SQL Editor (nya landsregler) och svarar "klart". Sätt Authentication → URL Configuration → Site URL = https://soltant97.github.io/petfind/ (+ redirect-URL) för lösenordsåterställning.
2. Testa live med tre konton enligt testkraven (ägare, upphittare, tredje användare; avslag, blockering, återfunnet) samt gästsökning, karta, adressförslag, rasväljare, land (Sverige/Spanien, fel land blockeras). Rätta fel användaren rapporterar.
3. Sveriges 290 kommuner som fast lista (om det fortfarande behövs), fler länder vid behov (ändra check-listor i schema.sql och COUNTRIES i app.js).
4. Integritetspolicy + samtycke vid registrering, utdrag av egna uppgifter, databehandlaravtal (Supabase), lista leverantörer (Supabase, GitHub Pages, OpenStreetMap, Photon). Låt jurist/dataskyddsexpert granska före lansering. Överväg val "visa bara område offentligt" för adresser.
5. GitHub Actions: keep-alive och automatisk databaskopia. Överväg privat repo (kräver betald Pages) före lansering; slå på e-postbekräftelse + egen SMTP före lansering.
6. AI-bildmatchning bakom flagga: aktiveras först efter användarens godkännande av leverantör och kostnad och när kraven i Beslut är uppfyllda (serverfunktion krävs, EXIF/GPS tvättas på servern, 1024 px).
7. Paketering för App Store/Google Play (PWA/Capacitor).
