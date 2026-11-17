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
- Platser lagras som text (område → ort/kommun → hela Sverige), aldrig påhittade kilometeravstånd. GPS-koordinater sparas inte.

## Beslut
- Starta från noll (ingen känd befintlig kod).
- Djur: minst 2 foton, 3 rekommenderas.
- Återfunnet: anmälan arkiveras, försvinner från publik sökning och vektormängd, historik finns kvar för ägaren.
- Fyndets datum sätts automatiskt till inskickningstillfället.
- Blockering är fullständig och valideras i databasen.
- Konto: pausa (döljs, kan återaktiveras) eller radera (all användarens historik tas bort; motparten ser "Raderad användare").
- Platsuppslag: gratis OpenStreetMap/Nominatim, bara vid knapptryck. Sveriges 290 kommuner som fast lista.
- E-post: databasleverantörens standardutskick tills vidare.
- AI-bildmatchning ingår men ligger bakom en flagga. Aktiveras först när kraven är uppfyllda och användaren godkänt leverantör och kostnad: EXIF/GPS borttagna på servern, zero-data-retention, ingen träning, bilder sparas inte, kvotgräns (t.ex. 5 sökningar/timme), GDPR verifierat. Sökbilder får skickas till servern. Bildsökning kräver inte inloggning.
- Pipeline: SQL-förfilter (borttappad, samma djurslag) → vektorsökning (pgvector) → vision-verifiering av topp 3–5 → rangordnat resultat med konkret motivering.
- Appen ska kunna paketeras för App Store och Google Play (PWA/Capacitor).

## Byggordning
1. Konton, användarnamn, djurregistrering, offentlig sökning, sv/en.
2. Kontaktförfrågan, privat chatt, notiser, blockering, upphittat-flöde med textmatchning.
3. AI-bildmatchning.
Testmiljö: separat Supabase dev-projekt (djurhittaren-dev), se Status nedan. Testa med tre separata konton enligt testkraven i projektet.

## Status (uppdaterad 2026-11-12)
Klart:
- Mapp och denna CLAUDE.md skapade. Kravdokumentet "krav-och-beslut" ligger i Claude-projektet.
- Supabase Free-projekt `djurhittaren-dev` skapat i molnet av användaren (beslut: molnet, inte lokalt/Docker). URL och publishable-nyckel ligger i `.env` (ignoreras av git, `.env.example` är mallen). Den hemliga nyckeln (secret/service_role) har aldrig delats och ska aldrig delas.
- Designskiss klar som Design-artefakt "DjurHittaren – designskiss": https://claude.ai/artifact/BSTn48mD1zTWsKTTQH97re (borttappade djur, djurprofil, kontakta ägaren, hittat djur, träffar, färgtavla).

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
1. Skriva databasfilen (SQL): tabeller för profiler/användarnamn, djur, djurfoton, fyndrapporter, kontaktförfrågningar, samtal, meddelanden, notiser, blockeringar; RLS på allt; säkra funktioner get_lost_pets() och search_lost_pets(); privat bucket pet-photos; pgvector förberett för AI. Användaren klistrar in den i Supabase SQL Editor (guida steg för steg).
2. Stänga av e-postbekräftelse i dev-projektet (Supabases inbyggda mejl tillåter få utskick per timme). Slå på igen före lansering.
3. Välja ramverk och bygga appen enligt designskissen, fas 1 först (se Byggordning).
4. Sätta upp GitHub-repo, keep-alive och backup.
5. Testa med tre konton enligt testkraven. AI-matchning byggs bakom flagga och aktiveras först efter godkännande av leverantör och kostnad.
