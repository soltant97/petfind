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
- Platser lagras som text (adress/område → ort → land), aldrig påhittade kilometeravstånd. GPS-koordinater sparas aldrig, bara används för platsuppslag och landskontroll. Adressen i en efterlysning och i en upphittad-anmälan är offentlig (användaren har godkänt att gatuadress visas; varning visas i formuläret).

## Beslut
- Gäster (ej inloggade) ser bara startsidan Borttappade djur med de första 6 djuren (skrivskyddat). Att öppna ett djur, byta flik/djurslag/land, använda filter eller bottenmenyn (utom Borttappade) ger en inloggningsruta ("Logga in för att fortsätta": Logga in / Skapa konto / Inte nu). Detta ersätter tidigare regel om att gäster kan söka och göra upphittat-flödet utan konto (beslut 2026-11-18; även AI-bildsökning kräver därmed inloggning tills annat sägs). Gatterat i docs/app.js (showGate, GSEL); språkväxlaren är öppen.
- Starta från noll (ingen känd befintlig kod).
- Djur: minst 2 foton, 3 rekommenderas. Ras måste väljas ur listan för alla djurslag med raslista (hund, katt, fåglar, kaniner, gnagare, reptiler); egen text går bara för "Annat" (v=74; Pomeranian, tax m.fl. tillagda i hundlistan). Ålder anges som födelsedatum med tre listor (år, månad, dag – ingen fri text; framtida datum nekas, pets.birth_date); åldern i hela år räknas ut automatiskt och visas offentligt, aldrig själva datumet (get_lost_pets räknar ut åldern från birth_date; gamla age_years används om datum saknas) (v=75). Djurets namn får alltid stor första bokstav (capFirst i docs/app.js: medan man skriver och vid sparning; v=73).
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

## Upphittade djur (nytt, publikt)
- Under Borttappade djur finns två flikar: "Efterlysta djur" (ägaren söker) och "Upphittade djur" (någon har hittat ett djur, ägaren okänd).
- Upphittare publicerar från träfflistan ("Publicera som upphittat djur"). Krav: inloggad, minst 1 foto, plats vald via platssymbol/adresslista, platstjänster på och enhetens land = platsens land.
- Offentligt visas den plats upphittaren valt (gatuadress, område, ort; godkänt av användaren), upphittarens genererade användarnamn + avatar och foton – aldrig namn eller kontaktuppgifter.
- Kontakt via samma tvåvägsgodkännande: den som känner igen djuret skriver introduktion, upphittaren godkänner, sedan privat chatt. Upphittaren kan stänga ("Ägaren är hittad") eller radera; stängd anmälan försvinner från sökning men samtal finns kvar.
- DB: found_reports (is_public, closed_at, city, country_code, color), contact_requests.found_id, RPC publish_found/close_found/get_found_pets/search_found_pets/get_found_pet/create_found_contact_request. schema.sql MÅSTE köras om i Supabase.
- Tidigare gällde att fyndrapporter alltid var privata; privata sparade fynd (saveFind) finns kvar, publika är ett separat val.

## Avatar (profilbild)
- Varje användare får en djuravatar som slumpas på servern vid registrering (profiles.avatar, format 'djur:bakgrund:accessoar[:färg]', t.ex. fox:3:1 eller panda:2:5:13). 20 djur (katt, hund, kanin, räv, björn, panda, mus, fågel, hamster, marsvin, papegoja, kyckling, ekorre, zebra, häst, lejon, apa, gris, ko, tiger), 8 bakgrundsindex (7 erbjuds; index 6 "mörk rosa" borttagen ur valet, index 2 korall gjord ljusare #F7967F), 9 accessoarer 0–8 (ingen, rosett, glasögon, halsduk, solglasögon, krona, partyhatt, hörlurar, blomma), fjärde delen i koden = pose 0–6 (0 glad, 1 blinkar, 2 tunga ute med knipna ögon, 3 kärlek, 4 fryser med is, 5 gråter, 6 sömnig; större tal tolkas som 0). Djurfärg kan inte väljas längre (beslut 2026-11-18): varje djur har sin vanligaste färg (FUR i avatar.js) – inget val, allt mindre komplicerat. Alla djur har ögon med vit sklera, pupill och ljusreflex (eyePose() i avatar.js); poserna ändrar ögon, lutning (TILT) och extra detaljer (poseExtra/poseFace: stjärna, rodnad, hjärtan, tunga, istappar, tårar, Zz) (v=72). Valideras med regex i databasen (check + set_avatar) och i docs/avatar.js.
- Redigera avatar (#/avatar): "Välj ditt avatardjur"-rad öppnar popup med alla djur → Spara stänger popupen; därunder Bakgrund (färgrutor), Pose (7 miniatyrer med namn), Accessoarer (valknappar med bild på accessoaren, inte namn), Spara avatar / Slumpa. Tvåfärgade djur (panda, zebra, ko, tiger) får andra färgen automatiskt i samma nyans men tydligt mörkare/ljusare (contrast() i avatar.js); andra delar (öron, man, nos) härleds ur djurfärgen. Flöde dit: Profil → Kontouppgifter (#/editprofile) → tryck på avataren → "Redigera avatar". Ritas som SVG i docs/avatar.js.
- Visas som rund bild bredvid användarnamnet för alla (djurprofiler, upphittade djur, meddelanden, chatt). Avatarer är offentliga och innehåller ingen personinformation. schema.sql MÅSTE köras om.

## Attribut och filter (v=77)
- Djur (Mina djur) och Hittat djur har svarsalternativ (inga fria texter): Ögonfärg (pets/found_reports.eye_color), Storlek (size), Halsband (collar), Kön; Hittat djur har dessutom Färg och Ras via samma väljare som djurformuläret. Hittat djur har enda fria fältet "Övrig beskrivning" (valfritt). Svenska värden lagras och översätts i appen (ATTR i app.js); check-regler i schema.sql. match_lost_pets/publish_found tar nya parametrar; träffmotiveringen visar matchande attribut. schema.sql MÅSTE köras om.
- Filter på Borttappade/Upphittade djur är ett popup-fönster (filterPopup, v=78) (knappen lika hög som Plats-rutan; Kön har Alla/Hona/Hane/Okänt) med utfällbara sektioner Djurslag (Alla + alla djurslag) och Färg (färgknappar) samt Ras, Kön, Försvann/Hittades; bara Plats ligger utanför filtret, på sidan. Popupen: "Tillämpa" stänger och behåller valen, × / bakgrund avbryter och återställer, "Rensa filter" nollställer.

## Profilmeny
- Profilsidan visar bara avatar + användarnamn och två listor. En lista: Kontouppgifter, Sparat, Användarvillkor, Kontakt och säkerhet, Betygsätt appen, Logga ut, Inställningar. Inställningar är en kategori som öppnar egen sida (#/settings) med underkategorier: Notiser, Blockerade användare, Region, Integritet, Inaktivera eller radera konto, Version (underkategoriernas tillbakapil går till Inställningar). Sparat (#/saved) = bokmärkta inlägg (borttappade eller upphittade djur) med spara-ikon uppe till höger i djurets bild (inte på egna inlägg); tabell saved_posts + save_post/unsave_post, max 200; inlägg som stängts/tagits bort städas bort. Kategorier (varje öppnar en egen sida): Kontouppgifter (avatar via tryck → Redigera avatar, användarnamn, e-post och lösenord – alla redigerbara; e-postbyte kräver bekräftelselänk), Notiser (på/av-knappar i iPhone-stil per notistyp: Meddelanden = chattmeddelanden + chattförfrågningar; Svar = godkänd/avböjd; Djur och träffar = möjlig träff (nytt upphittat djur av samma djurslag i samma land som ditt borttappade) + anmälan stängd; sparas i profiles.notif_off via set_notif_pref och avstängda typer skapas aldrig (trigger); därunder notislistan + markera alla lästa; push/e-post finns inte än), Blockerade användare (avblockera via unblock_user), Region (hemland + språk), Integritet, Användarvillkor, Kontakt och säkerhet, Betygsätt appen, Logga ut, Inaktivera eller radera konto, Version.
- Texterna för Integritet och Användarvillkor är preliminära sammanfattningar och MÅSTE granskas av jurist före lansering. Kontaktväg till support och betygsättning (App Store/Google Play) finns inte än – sidorna säger det ärligt.

## Meddelanden och bilder i förfrågan
- Meddelanden-sidan (som Instagram): sökruta "Sök" högst upp (filtrerar egna samtal på användarnamn, djurnamn och text i meddelanden – delord, stor/liten bokstav och accenter spelar ingen roll; träffande meddelande visas som förhandsvisning), flikarna "Meddelanden" (öppna chattar: avatar, namn, senaste meddelande, tid, oläst-prick) och "Förfrågningar" (med antal väntande mottagna). Notis om ny förfrågan länkar till #/messages/reqs.
- Kontaktförfrågan (både "Kontakta ägaren" och "Kontakta upphittaren") kan ha 1–5 bifogade bilder (ta foto eller välj). Bilderna laddas upp i den privata bucketen under <användar-id>/contact/, kopplas via attach_request_photos (bara egen väntande förfrågan, validerad sökväg) och kan läsas bara av förfrågans två parter (storage-policy + request_photo_visible). Visas under förfrågan och överst i chatten.

## Chatt och användarsida (v=45)
- Chatten visar bara motpartens användarnamn (ingen rubrik "Privat chatt"), färgad bakgrund bakom bubblorna, avatar bredvid varje bubbla, tid + bockar under egna bubblor (✓ skickat, ✓✓ läst via messages.read_at). Ingen blockeringsknapp under chatten.
- Chatten täcker hela skärmen (bottenmenyn dolt via body.inchat), skrivrutan längst ned. Namnrutan överst är ett färgat kort med pil; Meddelanden-listan har färgade kort per person (5 färger efter namn).
- Tryck på namnrutan → egen sida #/chatinfo/<id> (inte popup): Profil (→ #/user/<namn>), Sök (sök i chatten), Stäng av/Slå på notiser (chat_mutes + set_chat_muted; trigger hoppar över 'message'-notiser för tystade chattar), Alternativ → egen sida #/chatopts/<id> med Blockera, Anmäl.
- Användarsida #/user/<namn> (get_user_card): avatar + namn + tre punkter → Blockera/Avblockera (block_user_by_id), Anmäl (report_user → tabellen user_reports, orsaker spam/scam/harassment/inappropriate/other, max 10/dag; ingen admin-vy än), Om det här kontot (medlemsdatum, hemland, antal aktiva efterlysningar/upphittade), Skicka meddelande (bara om godkänd chatt finns). Visar också användarens djur (djurslag + namn, get_user_pets; aldrig chipnummer). Alla användarnamn i appen länkar dit. schema.sql MÅSTE köras om.

## Status (uppdaterad 2026-11-18)
Klart:
- Mapp och denna CLAUDE.md skapade. Kravdokumentet "krav-och-beslut" ligger i Claude-projektet.
- Supabase Free-projekt `djurhittaren-dev` skapat i molnet av användaren (beslut: molnet, inte lokalt/Docker). URL och publishable-nyckel ligger i `.env` (ignoreras av git, `.env.example` är mallen). Den hemliga nyckeln (secret/service_role) har aldrig delats och ska aldrig delas.
- Designskiss klar som Design-artefakt "DjurHittaren – designskiss": https://claude.ai/artifact/BSTn48mD1zTWsKTTQH97re (borttappade djur, djurprofil, kontakta ägaren, hittat djur, träffar, färgtavla).

Byggt och uppladdat (GitHub Pages: https://soltant97.github.io/petfind/, repo soltant97/petfind, publikt; kod i `docs/`, databas i `supabase/schema.sql`):
- Webbapp kopplad till Supabase (docs/app.js, db.js, config.js med publishable-nyckel): registrering/inloggning/återställ lösenord, djurregistrering med ≥2 foton (bilder skalas ned till 1024 px), borttappat/återfunnet, offentlig sökning, upphittat-flöde med textmatchning, kontaktförfrågan, godkänn/avböj/återkalla, privat chatt med realtid, notiser (oläst-siffra), blockering, byte av användarnamn, pausa/radera konto, sv/en.
- Databasen (schema.sql) är körd i djurhittaren-dev av användaren och går att köra om. Nya landsregler (hemland, p_country-filter, report_lost med p_country + p_device_country, set_home_country) ligger i schema.sql och MÅSTE köras om av användaren i SQL Editor innan landsfunktionen fungerar (väntar på användarens "klart").
- Efter användarens testning: bildbläddring med pilar/svepning (inga vinkeltexter), platssymbol (ikon) i stället för knapp, fältet "Sågs senast" med adressförslag (Photon) och karta med flyttbar markör som visar exakt adress (gata + nummer, område, ort), rasväljare (katt-/hundlistor, Huskatt, Okänd, Blandras med flera raser), land (se Beslut).
- Cache-busting med ?v=N på skript/stil i docs/index.html (höj N vid varje ändring; senast v=66).
- Sidan Borttappade djur: djurslagsknappar (Alla, Katt, Hund, Fåglar, Kaniner, Gnagare, Reptiler, Annat) utan rubriken "Art"; knappen "Filter" fäller ut Ras, Färg, Kön, Försvann (7/30/90 dagar) och Plats (valfria). Kön och Försvann filtreras i appen (inte i databasen). Visat land = hemland från profilen från början, kan bytas överst.
- Nya djurslag i app och schema.sql: bird, rabbit, rodent, reptile (plus cat, dog, other). Raslistor för varje; fri text tillåten bara för Annat. schema.sql ändrar check-reglerna på pets och found_reports, så den MÅSTE köras om innan nya djurslag går att spara (felmeddelande dbSpecies visas annars).
- Tomt-läge: kort med korall tass, "Inga borttappade djur just nu" / "Skönt – alla verkar vara hemma." (annan text när filter är aktiva). Undertext på listan: "Hjälp oss hitta hem igen. Håll utkik i ditt område."
- Ikoner: logga/favicon/Mina djur = klassisk fylld tass roterad 28 grader (alternativ 1), mörkbrun på gul ruta. Favicon finns som SVG, PNG (32/48/192) och ICO med ?v=2 (Safari stöder inte SVG; cachas hårt). Platsknapp och kartmarkör = mörkbrun kartnål med gul tass (alternativ 5).
- Testat i sandlådan bara mot en låtsas-Supabase (Playwright) och en lokal Postgres; riktiga Supabase, riktiga kartor och riktiga adresstjänster kunde inte nås därifrån och är inte live-testade.

Designval:
- Färger: solgul #FFD770, ljusgul #FFF3C9, korall #F4806B, ljuskorall #FFE3DC, beige #F6EDE0, mörkbeige #E9DCC8, vit #FFFCF5, text #3A2A1E, dämpad text #7A6552, korallfärgad text på ljuskorall #A8402D. Inget grönt (användarens önskemål).
- Typsnitt: Nunito. Mobil först, bottennavigering: Borttappade, Mina djur, Hittat djur (stor gul knapp i mitten, kan bli korall om användaren väljer det), Meddelanden, Profil.
- Knappar och etiketter har mörk text (vit text på gult/korall blir för svagt).

Beslut om drift (Supabase Free):
- Gratisplanen räcker för test och tidig lansering: ca 500 MB databas, 1 GB filer, 5 GB utgående trafik/månad, 2 aktiva projekt. Pausas efter en vecka utan aktivitet och har inga backuper.
- Plan: gratis schemalagd "keep-alive" och egen automatisk databaskopia (t.ex. via GitHub Actions). Skala ner foton i appen innan uppladdning, visa små förhandsbilder i listor. Uppgradera till Pro (25 USD/mån) först när användarna växer.
- Kod ska ligga i ett privat GitHub-repo (gratis).
- Webbplatsen driftsätts på gratis värdtjänst, vald senare.

- Sparad designskiss (inte införd): `design/skiss-ljus-korall.html`, ljus korall (#FFC4B8, ytor #FFEDE8) i stället för gult, bakgrunden oförändrad. Användaren funderar; byt inte färger i appen utan besked. Även skissad (ej sparad, ej införd): bruna ikoner/detaljer i ljus korall (#F68E7C, inaktiva menyikoner #FFC4B8), text oförändrat mörkbrun; frågan om även text ska ändras är obesvarad.

## Nästa steg
1. Användaren kör om hela `supabase/schema.sql` i Supabase SQL Editor (landsregler + nya djurslag + sökfilter) och svarar "klart". Sätt Authentication → URL Configuration → Site URL = https://soltant97.github.io/petfind/ (+ redirect-URL) för lösenordsåterställning.
2. Testa live med tre konton enligt testkraven (ägare, upphittare, tredje användare; avslag, blockering, återfunnet) samt gästsökning, karta, adressförslag, rasväljare per djurslag, filterpanelen, tomt-läge, kartmarkör, land (Sverige/Spanien, fel land blockeras). Rätta fel användaren rapporterar.
3. Sveriges 290 kommuner som fast lista (om det fortfarande behövs), fler länder vid behov (ändra check-listor i schema.sql och COUNTRIES i app.js).
4. Integritetspolicy + samtycke vid registrering, utdrag av egna uppgifter, databehandlaravtal (Supabase), lista leverantörer (Supabase, GitHub Pages, OpenStreetMap, Photon). Låt jurist/dataskyddsexpert granska före lansering. Överväg val "visa bara område offentligt" för adresser.
5. GitHub Actions: keep-alive och automatisk databaskopia. Överväg privat repo (kräver betald Pages) före lansering; slå på e-postbekräftelse + egen SMTP före lansering.
6. AI-bildmatchning bakom flagga: aktiveras först efter användarens godkännande av leverantör och kostnad och när kraven i Beslut är uppfyllda (serverfunktion krävs, EXIF/GPS tvättas på servern, 1024 px).
7. Paketering för App Store/Google Play (PWA/Capacitor).

## Färger (v=80)
- Färglistan (COLORS i app.js) har ingen "Svartvit": svart och vit väljs som två färger (flerval, högst 4). Färgknapparna har en färgprick (COLSW); mönster (tigrerad, brindle, sköldpadd, trefärgad, fläckig, merle) har mönsterprick. Texten ovanför knapparna förklarar att man kan välja flera. Gamla poster med "Svartvit" visas fortfarande.

## Djursidan och listor (v=86)
- Djurprofilen har egna sektioner: Djur (var "Art"), Kön, Ålder; sedan Färg, Ras, Ögonfärg/Storlek/Halsband, Senast sedd, Sedd datum, Kännetecken, Beskrivning (= efterlysningens omständigheter). Ägare visas som en rad: avatar + användarnamn (ingen förklaringstext). "Kontakta ägaren/upphittaren" har meddelande-ikon.
- Ålder visas från födelsedatum: under 12 månader i månader (avrundat upp när mer än 15 dagar av månaden gått, <1 månad = "Mindre än 1 månad"), annars hela år. get_lost_pets/search_lost_pets/get_lost_pet returnerar age_months (schema.sql MÅSTE köras om). Djurnamn visas alltid med stor första bokstav (capFirst).
- Listkort visar bara ort, inte färg; sparaknappen ligger nere till höger på kortet (v=88). Ort (last_city), hela adressen först på djursidan (v=87). Kommun lagras inte separat.
- Sparaknapp (bokmärke) finns även på korten i listor (inloggad, ej egna inlägg); tmp.sv håller sparade nycklar.
