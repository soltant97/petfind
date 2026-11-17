'use strict';
/* DjurHittaren – klickbar prototyp. Data sparas bara i den här webbläsaren (localStorage). */
const T={
appname:['DjurHittaren','DjurHittaren'],
lostTitle:['Borttappade djur','Lost pets'],lostSub:['Hjälp oss hitta hem igen. Du behöver inget konto för att söka.','Help them find their way home. No account needed to search.'],
searchPh:['Sök plats, ras eller färg','Search place, breed or colour'],all:['Alla','All'],cat:['Katt','Cat'],dog:['Hund','Dog'],other:['Annat','Other'],
lost:['Borttappad','Lost'],registered:['Registrerad','Registered'],foundSt:['Återfunnen','Reunited'],
noLost:['Inga borttappade djur matchar din sökning.','No lost pets match your search.'],
navLost:['Borttappade','Lost'],navMine:['Mina djur','My pets'],navFound:['Hittat djur','Found pet'],navMsg:['Meddelanden','Messages'],navProfile:['Profil','Profile'],
species:['Art','Species'],sex:['Kön','Sex'],age:['Ålder','Age'],colorBreed:['Färg och ras','Colour and breed'],marks:['Kännetecken','Markings'],
female:['Hona','Female'],male:['Hane','Male'],unknown:['Okänt','Unknown'],years:['år','yrs'],
lastSeen:['Senast sedd','Last seen'],owner:['Ägare','Owner'],ownerNote:['Ägarens namn och kontaktuppgifter visas aldrig. Ni kan chatta först när ägaren har godkänt din förfrågan.','The owner’s name and contact details are never shown. You can chat only after the owner accepts your request.'],
contactOwner:['Kontakta ägaren','Contact the owner'],manage:['Hantera mitt djur','Manage my pet'],
front:['Framifrån','Front'],left:['Vänster','Left'],right:['Höger','Right'],
contactTitle:['Kontakta ägaren','Contact the owner'],introLbl:['Berätta varför du tror att du sett eller har djuret','Tell us why you think you have seen or have the pet'],
introPh:['Var och när såg du djuret? Hur såg det ut och hur mådde det?','Where and when did you see it? What did it look like and how was it?'],
needOne:['Skriv minst ett tecken','Write at least one character'],howTitle:['Så går det till','How it works'],
how1:['Ägaren får en notis i appen med ditt meddelande.','The owner gets an in-app notification with your message.'],how2:['Först när ägaren accepterar öppnas en privat chatt.','A private chat opens only when the owner accepts.'],how3:['Ingen ser ditt namn eller dina kontaktuppgifter. Du kan återkalla förfrågan så länge den väntar.','No one sees your name or contact details. You can withdraw the request while it is pending.'],
sendReq:['Skicka förfrågan','Send request'],reqSent:['Förfrågan skickad','Request sent'],dupReq:['Du har redan en väntande förfrågan för det här djuret.','You already have a pending request for this pet.'],
blockedErr:['Du kan inte kontakta den här användaren.','You cannot contact this user.'],ownPet:['Det här är ditt eget djur.','This is your own pet.'],
foundTitle:['Jag har hittat ett djur','I have found a pet'],foundSub:['Inget konto behövs för att söka','No account needed to search'],
s1:['1. Foton','1. Photos'],s2:['2. Djurslag','2. Species'],s3:['3. Var hittade du djuret?','3. Where did you find it?'],s4:['4. Hur ser djuret ut?','4. What does it look like?'],
takePhoto:['Ta foto','Take photo'],pickPhotos:['Välj bilder','Choose photos'],removePhoto:['Ta bort bild','Remove photo'],
placePh:['Område eller ort, till exempel Södermalm','Area or town, e.g. Södermalm'],useLoc:['Använd min position','Use my location'],
locHint:['Positionen används bara för att föreslå ort och sparas inte. Tid och datum sätts till nu.','Your position is only used to suggest a place and is not saved. Time and date are set to now.'],
locDemo:['Min position','My position'],locDenied:['Kunde inte hämta positionen. Skriv platsen själv.','Could not get your position. Type the place instead.'],
descPh:['Färg, tecken, halsband, ögonfärg …','Colour, markings, collar, eye colour …'],searchOwner:['Sök efter ägaren','Search for the owner'],
needSpecies:['Välj djurslag.','Choose a species.'],needPlace:['Ange var du hittade djuret.','Enter where you found it.'],
resultsTitle:['Möjliga träffar','Possible matches'],area:['Område','Area'],city:['Ort/kommun','Town/municipality'],country:['Hela Sverige','All of Sweden'],
why:['Varför?','Why?'],sameWords:['Gemensamt i beskrivningen:','In common:'],noCommon:['Ingen gemensam beskrivning, men samma djurslag och plats.','No common description, but same species and area.'],
simHigh:['Hög likhet','High similarity'],simMid:['Viss likhet','Some similarity'],simLow:['Möjlig träff','Possible match'],viewProfile:['Visa profil','View profile'],
emptyRes:['Inga registrerade djur matchade. Utöka sökområdet, eller kontakta Polisen på 114 14 och närmaste veterinär.','No registered pets matched. Widen the search area, or contact the police on 114 14 and the nearest vet.'],
help:['Hittar du inte rätt djur? Utöka sökområdet, eller kontakta Polisen på 114 14 och närmaste veterinär.','Can’t find the right pet? Widen the search area, or contact the police on 114 14 and the nearest vet.'],
matchNote:['Matchning sker här med ordöverlappning i beskrivningen. AI-bildmatchning ingår inte i prototypen.','Matching here uses word overlap in the description. AI image matching is not part of the prototype.'],
changeSearch:['Ändra sökning','Edit search'],
mineTitle:['Mina djur','My pets'],addPet:['Lägg till djur','Add pet'],noPets:['Du har inga djur registrerade än.','You have no registered pets yet.'],
setLost:['Anmäl borttappad','Report lost'],setFound:['Markera återfunnen','Mark as reunited'],setReg:['Registrerad','Registered'],del:['Radera','Delete'],
confirmDel:['Radera djuret? Det går inte att ångra.','Delete this pet? This cannot be undone.'],
lostForm:['Anmäl borttappad','Report lost'],lastPlace:['Senaste kända plats (område)','Last known place (area)'],cityLbl:['Ort/kommun','Town/municipality'],dateLost:['Datum då djuret försvann','Date the pet went missing'],
circ:['Omständigheter','Circumstances'],saveLost:['Publicera efterlysning','Publish alert'],cancel:['Avbryt','Cancel'],
needLostFields:['Fyll i plats, datum och omständigheter. Datumet får inte ligga i framtiden.','Fill in place, date and circumstances. The date cannot be in the future.'],
nowLost:['Djuret är nu efterlyst och syns i listan.','The pet is now listed as lost.'],nowFound:['Fint! Efterlysningen är arkiverad och syns inte längre publikt.','Great! The alert is archived and no longer public.'],
demoIncoming:['Demo: skapa inkommande förfrågan','Demo: create incoming request'],
addTitle:['Lägg till djur','Add pet'],fName:['Namn','Name'],fBreed:['Ras','Breed'],fColor:['Färg','Colour'],fAge:['Ålder (år)','Age (years)'],fMarks:['Kännetecken','Markings'],fDesc:['Beskrivning','Description'],fChip:['Chip-/ID-nummer (visas aldrig offentligt)','Chip/ID number (never shown publicly)'],
photosNeed:['Foton (minst 2, helst 3: framifrån, vänster, höger)','Photos (at least 2, ideally 3: front, left, right)'],save:['Spara','Save'],
needPetFields:['Fyll i namn, djurslag och färg.','Fill in name, species and colour.'],needPhotos:['Minst 2 foton krävs.','At least 2 photos are required.'],petSaved:['Djuret är sparat.','Pet saved.'],
badFile:['Endast bilder upp till 5 MB.','Images up to 5 MB only.'],
msgTitle:['Meddelanden','Messages'],noMsgs:['Inga förfrågningar eller samtal än.','No requests or chats yet.'],
pending:['Väntande','Pending'],accepted:['Accepterad','Accepted'],declined:['Avböjd','Declined'],revoked:['Återkallad','Withdrawn'],
sent:['Skickad av dig','Sent by you'],received:['Mottagen','Received'],accept:['Acceptera','Accept'],decline:['Avböj','Decline'],revoke:['Återkalla','Withdraw'],openChat:['Öppna chatt','Open chat'],
demoAccept:['Demo: ägaren accepterar','Demo: owner accepts'],archivedPet:['Djuret är arkiverat – samtalet finns kvar','Pet archived – the chat is kept'],
chatTitle:['Privat chatt','Private chat'],msgPh:['Skriv ett meddelande','Write a message'],send:['Skicka','Send'],block:['Blockera','Block'],blockedChat:['Du har blockerat den här användaren. Inga fler meddelanden eller förfrågningar kan skickas.','You have blocked this user. No more messages or requests can be sent.'],
confirmBlock:['Blockera användaren?','Block this user?'],demoReply:['Demo: svar från motparten','Demo: reply from other party'],demoReplyTxt:['Tack för att du hör av dig!','Thanks for getting in touch!'],
profTitle:['Profil och inställningar','Profile and settings'],username:['Offentligt användarnamn','Public username'],usernameHint:['Det här är det enda andra ser. Ditt namn och din e-post visas aldrig.','This is all others see. Your name and email are never shown.'],
saveName:['Spara användarnamn','Save username'],nameTaken:['Användarnamnet är upptaget.','That username is taken.'],nameBad:['3–20 tecken: bokstäver och siffror.','3–20 characters: letters and digits.'],nameSaved:['Användarnamnet är ändrat.','Username changed.'],
language:['Språk','Language'],pause:['Pausa konto','Pause account'],resume:['Återaktivera konto','Reactivate account'],paused:['Kontot är pausat. Dina djur syns inte publikt.','Account paused. Your pets are hidden.'],
pauseDone:['Kontot är pausat.','Account paused.'],resumeDone:['Kontot är återaktiverat.','Account reactivated.'],
delAcc:['Radera konto och all historik','Delete account and all history'],confirmDelAcc:['Radera kontot och ALL din historik? Det går inte att ångra.','Delete your account and ALL history? This cannot be undone.'],accDeleted:['Kontot är raderat.','Account deleted.'],
logout:['Logga ut','Log out'],loginTitle:['Logga in eller skapa konto','Log in or create an account'],loginSub:['Du behöver ett konto för att kontakta ägare, spara fynd och registrera djur.','You need an account to contact owners, save finds and register pets.'],
email:['E-post','Email'],password:['Lösenord (minst 6 tecken)','Password (at least 6 characters)'],login:['Logga in','Log in'],register:['Skapa konto','Create account'],
loginSwitch:['Har du inget konto? Skapa konto','No account? Create one'],regSwitch:['Har du redan konto? Logga in','Already have an account? Log in'],forgot:['Glömt lösenord?','Forgot password?'],
forgotDone:['Prototyp: i riktiga appen skickas en återställningslänk till din e-post.','Prototype: the real app emails you a reset link.'],
badLogin:['Ange en giltig e-post och ett lösenord på minst 6 tecken.','Enter a valid email and a password of at least 6 characters.'],welcome:['Välkommen! Ditt användarnamn är','Welcome! Your username is'],
demoNote:['Prototyp med exempeldata. Allt du gör sparas bara i din webbläsare.','Prototype with sample data. Everything is stored only in your browser.'],
notFound:['Sidan finns inte.','Page not found.'],back:['Tillbaka','Back'],forgetTitle:['Återställ lösenord','Reset password'],
privacy:['Integritet: namn, e-post, telefon, adress och chipnummer visas aldrig offentligt.','Privacy: name, email, phone, address and chip number are never shown publicly.']
};
const SEED=[
{id:'s1',name:'Misse',species:'cat',breed:['huskatt','domestic cat'],color:['svart med vit bläs','black with white blaze'],sex:'f',age:4,marks:['vit bläs över nosen, vita framtassar, gröna ögon, litet hack i vänster öra','white blaze over the nose, white front paws, green eyes, small notch in left ear'],place:'Södermalm',city:'Stockholm',date:'2026-11-09',circ:['Smet ut genom en öppen balkongdörr.','Slipped out through an open balcony door.'],owner:'Luna1234',status:'lost',tint:'#FFF3C9'},
{id:'s2',name:'Bamse',species:'dog',breed:['golden retriever','golden retriever'],color:['gyllene','golden'],sex:'m',age:6,marks:['röd halsrem, lite grå runt nosen','red collar, a little grey around the muzzle'],place:'Hisingen',city:'Göteborg',date:'2026-11-08',circ:['Försvann under en promenad i skogen.','Went missing on a walk in the woods.'],owner:'Bamse0001',status:'lost',tint:'#FFE3DC'},
{id:'s3',name:'Nova',species:'cat',breed:['huskatt','domestic cat'],color:['grå tabby','grey tabby'],sex:'f',age:2,marks:['ränder, vit bröstfläck, gula ögon','stripes, white chest patch, yellow eyes'],place:'Limhamn',city:'Malmö',date:'2026-11-06',circ:['Kom inte hem på kvällen.','Did not come home in the evening.'],owner:'Nova7788',status:'lost',tint:'#F6EDE0'},
{id:'s4',name:'Sotis',species:'cat',breed:['huskatt','domestic cat'],color:['svart','black'],sex:'m',age:3,marks:['vit fläck på bröstet, gula ögon','white patch on chest, yellow eyes'],place:'Nacka',city:'Stockholm',date:'2026-11-07',circ:['Försvann från trädgården.','Disappeared from the garden.'],owner:'Sotis4521',status:'lost',tint:'#FFF3C9'}];
const TAKEN=['luna1234','bamse0001','nova7788','sotis4521','misse4821','kalle5522'];
const KEY='dh-proto-v1';
let S=load();
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(s&&s.pets)return s}catch(e){}return{lang:'sv',user:null,pets:[],reqs:[],blocked:[]}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast(t('badFile'))}}
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const t=k=>(T[k]?T[k][S.lang==='en'?1:0]:k);
const L=v=>(v&&typeof v==='object'&&!Array.isArray(v)?v[S.lang]:Array.isArray(v)?v[S.lang==='en'?1:0]:v);
const today=()=>new Date().toISOString().slice(0,10);
const uid=()=>'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const speciesName=s=>t(s);
const paw='<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3A2A1E" stroke-opacity=".45" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="10" r="2"/><circle cx="10" cy="5.5" r="2"/><circle cx="14" cy="5.5" r="2"/><circle cx="18" cy="10" r="2"/><path d="M12 12c-3 0-5.5 3-5.5 5.2 0 1.7 1.4 2.3 2.8 2.3 1 0 1.8-.4 2.7-.4s1.7.4 2.7.4c1.4 0 2.8-.6 2.8-2.3C17.5 15 15 12 12 12z"/></svg>';
const ic={back:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3A2A1E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
list:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A6552" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
msg:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A6552" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
user:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7A6552" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
cam:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3A2A1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>'};
let tmp={foundPhotos:[],petPhotos:[],find:null,tab:'area',q:'',sp:'all',photoIdx:0,lostFor:null,loginMode:'login',next:''};
function toast(m){const e=document.createElement('div');e.id='toast';e.setAttribute('role','status');e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),2800)}
function allLost(){const hidden=S.user&&S.user.paused;return SEED.map(p=>({...p})).concat(S.pets.filter(p=>p.status==='lost'&&!hidden))}
function findPet(id){return SEED.find(p=>p.id===id)||S.pets.find(p=>p.id===id)}
function mine(p){return S.user&&p.owner===S.user.name}
function unread(){return S.reqs.filter(r=>S.user&&(r.to===S.user.name&&r.status==='pending')).length}
function genName(){const base=['Misse','Luna','Findus','Pelle','Molly','Bella','Tott','Saga'];let n;do{n=base[Math.floor(Math.random()*base.length)]+(1000+Math.floor(Math.random()*9000))}while(TAKEN.includes(n.toLowerCase()));return n}
function topbar(title,sub,backHref){return `<div class="top">${backHref?`<a class="back" href="${backHref}" aria-label="${esc(t('back'))}">${ic.back}</a>`:`<div class="brand"><span class="logo">${paw.replace('36','22').replace('36','22').replace('.45','1')}</span>${t('appname')}</div>`}${backHref?'':langSw()}</div>${title?`<div class="pad"><h1>${esc(title)}</h1>${sub?`<p class="sub">${esc(sub)}</p>`:''}</div>`:''}`}
function langSw(){return `<div class="lang" role="group" aria-label="${esc(t('language'))}"><button data-act="lang" data-v="sv" class="${S.lang==='sv'?'on':''}">SV</button><button data-act="lang" data-v="en" class="${S.lang==='en'?'on':''}">EN</button></div>`}
function head(title,sub,back){return `<div class="top"><a class="back" href="${back}" aria-label="${esc(t('back'))}">${ic.back}</a>${langSw()}</div><div class="pad"><h1>${esc(title)}</h1>${sub?`<p class="sub">${esc(sub)}</p>`:''}</div>`}
function nav(r){const n=unread();const a=(h,k,i,on)=>`<a href="#/${h}" class="${on?'on':''}">${i}${t(k)}</a>`;
return `<nav aria-label="Navigation">${a('','navLost',ic.list,r==='')}${a('mine','navMine',paw.replace(/36/g,'24').replace('.45','1').replace('1.6','2'),r==='mine'||r==='addpet')}<a href="#/found" class="cam ${r==='found'||r==='results'?'on':''}"><span>${ic.cam}</span>${t('navFound')}</a><a href="#/messages" class="${r==='messages'||r==='chat'?'on':''}">${ic.msg}${n?`<i class="badge">${n}</i>`:''}${t('navMsg')}</a>${a('profile','navProfile',ic.user,r==='profile'||r==='login')}</nav>`}
function photoOf(p){return p.photos&&p.photos.length?`<img src="${p.photos[0]}" alt="${esc(p.name)}">`:paw}
function tagOf(p){return `<span class="tag ${p.status==='lost'?'t-lost':p.status==='found'?'t-found':'t-reg'}">${t(p.status==='found'?'foundSt':p.status==='lost'?'lost':'registered')}</span>`}
function petCard(p,extra){return `<a class="card ${extra&&extra.hl?'hl':''}" href="#/pet/${p.id}"><div class="ph" style="background:${p.tint||'#FFF3C9'}">${photoOf(p)}</div><div class="grow"><div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span class="name">${esc(p.name)}</span>${extra&&extra.tag||tagOf(p)}</div><span class="muted">${esc(speciesName(p.species))} · ${esc(L(p.color))}</span><span style="font-size:14px;font-weight:700">${esc(p.place)}, ${esc(p.city)}</span><span class="muted">${esc(fmtDate(p.date))}</span>${extra&&extra.body||''}</div></a>`}
function fmtDate(d){try{return new Date(d+'T12:00:00').toLocaleDateString(S.lang==='en'?'en-GB':'sv-SE',{day:'numeric',month:'long'})}catch(e){return d}}
/* ---------- views ---------- */
function vList(){return `${topbar(t('lostTitle'),t('lostSub'))}<div class="pad"><input type="text" id="q" value="${esc(tmp.q)}" placeholder="${esc(t('searchPh'))}" aria-label="${esc(t('searchPh'))}"><div class="row" style="margin-top:12px">${['all','cat','dog','other'].map(s=>`<button class="chip ${tmp.sp===s?'on':''}" data-act="sp" data-v="${s}">${t(s)}</button>`).join('')}</div><div id="list"></div></div><p class="demo">${t('demoNote')}</p>`}
function fillList(){const q=tmp.q.trim().toLowerCase();const items=allLost().filter(p=>(tmp.sp==='all'||p.species===tmp.sp)&&(!q||[p.place,p.city,p.name,...(p.breed||[]),...(p.color||[]),...(p.marks||[])].some(x=>String(typeof x==='object'?JSON.stringify(x):x).toLowerCase().includes(q))));
$('#list').innerHTML=items.length?items.map(p=>petCard(p)).join(''):`<div class="info">${t('noLost')}</div>`}
function vPet(id){const p=findPet(id);if(!p)return head(t('notFound'),'','#/');const ph=p.photos||[];const i=Math.min(tmp.photoIdx,Math.max(ph.length-1,0));const ang=['front','left','right'];
return `<div class="hero" style="background:${p.tint||'#FFF3C9'}"><a class="back" href="#/" aria-label="${esc(t('back'))}">${ic.back}</a>${ph.length?`<img src="${ph[i]}" alt="${esc(p.name)}">`:paw.replace(/36/g,'84')}${ph.length>1?`<div class="chips">${ph.map((_,k)=>`<button data-act="ph" data-v="${k}" class="${k===i?'on':''}">${t(ang[k]||'front')}${ang[k]?'':' '+(k+1)}</button>`).join('')}</div>`:''}</div>
<div class="pad"><div style="display:flex;justify-content:space-between;align-items:center"><h1>${esc(p.name)}</h1>${tagOf(p)}</div>
<div class="grid3" style="margin-top:14px"><div class="cell"><small>${t('species')}</small><b>${esc(speciesName(p.species))}</b></div><div class="cell"><small>${t('sex')}</small><b>${esc(p.sex==='f'?t('female'):p.sex==='m'?t('male'):t('unknown'))}</b></div><div class="cell"><small>${t('age')}</small><b>${p.age?esc(p.age)+' '+t('years'):'–'}</b></div><div class="cell" style="grid-column:span 3"><small>${t('colorBreed')}</small><b>${esc(L(p.color))}${p.breed&&L(p.breed)?' · '+esc(L(p.breed)):''}</b></div></div>
${L(p.marks)?`<div class="field"><div class="lbl" style="color:var(--m);font-size:13px">${t('marks')}</div><div style="font-weight:600;line-height:1.4">${esc(L(p.marks))}</div></div>`:''}
${p.status==='lost'?`<div class="card"><div class="grow"><b>${t('lastSeen')}: ${esc(p.place)}, ${esc(p.city)}</b><span class="muted">${esc(fmtDate(p.date))}${L(p.circ)?' · '+esc(L(p.circ)):''}</span></div></div>`:''}
<div class="info"><b>${t('owner')}: ${esc(p.owner)}.</b> ${t('ownerNote')}</div>
<div style="margin-top:16px">${mine(p)?`<a class="btn sec" href="#/mine">${t('manage')}</a>`:p.status==='lost'?`<a class="btn" href="#/contact/${p.id}">${t('contactOwner')}</a>`:''}</div></div>`}
function vContact(id){const p=findPet(id);if(!p)return head(t('notFound'),'','#/');return `${head(t('contactTitle'),'',`#/pet/${id}`)}<div class="pad"><div class="card" style="margin-top:0"><div class="ph" style="width:56px;height:56px">${photoOf(p)}</div><div class="grow"><span class="name">${esc(p.name)}</span><span class="muted">${esc(speciesName(p.species))} · ${esc(p.place)}, ${esc(p.city)}</span></div></div>
<div class="field"><label for="intro">${t('introLbl')}</label><textarea id="intro" rows="6" maxlength="2000" placeholder="${esc(t('introPh'))}"></textarea><div class="hint" style="display:flex;justify-content:space-between"><span>${t('needOne')}</span><span id="cnt">0 / 2000</span></div></div>
<div class="info"><b>${t('howTitle')}</b><br>1. ${t('how1')}<br>2. ${t('how2')}<br>3. ${t('how3')}</div>
<div style="margin-top:16px"><button class="btn" data-act="sendReq" data-v="${id}">${t('sendReq')}</button></div></div>`}
function vFound(){const ph=tmp.foundPhotos;const f=tmp.find||{species:'',place:'',desc:''};
return `${head(t('foundTitle'),t('foundSub'),'#/')}<div class="pad"><div class="lbl" style="margin-top:6px">${t('s1')}</div><div class="thumbs">
<label class="add"><input type="file" accept="image/*" capture="environment" hidden data-file="found">${ic.cam.replace(/28/g,'26')}${t('takePhoto')}</label>
${ph.map((s,i)=>`<div class="thumb"><img src="${s}" alt=""><button data-act="rmFound" data-v="${i}" aria-label="${esc(t('removePhoto'))}">×</button></div>`).join('')}
<label class="add" style="background:#fff;border:1.5px solid var(--db)"><input type="file" accept="image/*" multiple hidden data-file="found"><span style="font-size:24px">+</span>${t('pickPhotos')}</label></div>
<div class="lbl" style="margin-top:16px">${t('s2')}</div><div class="row">${['cat','dog','other'].map(s=>`<button class="chip ${f.species===s?'on':''}" data-act="fsp" data-v="${s}">${t(s)}</button>`).join('')}</div>
<div class="lbl" style="margin-top:16px">${t('s3')}</div><input type="text" id="fplace" value="${esc(f.place)}" placeholder="${esc(t('placePh'))}" aria-label="${esc(t('s3'))}"><button class="btn sec small" style="margin-top:8px;background:var(--lc)" data-act="loc">${t('useLoc')}</button><div class="hint">${t('locHint')}</div>
<div class="lbl" style="margin-top:16px"><label for="fdesc">${t('s4')}</label></div><textarea id="fdesc" rows="3" placeholder="${esc(t('descPh'))}">${esc(f.desc)}</textarea>
<div style="margin-top:16px"><button class="btn" data-act="search">${t('searchOwner')}</button></div></div>`}
function words(s){return String(s||'').toLowerCase().split(/[^a-zåäöé0-9]+/).filter(w=>w.length>2)}
function vResults(){const f=tmp.find;if(!f)return vFound();const place=f.place.trim().toLowerCase();
const inArea=p=>place&&(p.place.toLowerCase().includes(place)||place.includes(p.place.toLowerCase()));
const inCity=p=>inArea(p)||(place&&(p.city.toLowerCase().includes(place)||place.includes(p.city.toLowerCase())));
const ok={area:inArea,city:inCity,country:()=>true}[tmp.tab];
const fw=new Set(words(f.desc));
const res=allLost().filter(p=>p.species===f.species&&ok(p)&&p.date<=today()).map(p=>{const pw=new Set([...words(p.color[0]),...words(p.color[1]),...words(p.marks[0]),...words(p.marks[1]),...words(p.breed[0]),...words(p.breed[1])]);const common=[...fw].filter(w=>pw.has(w));return{p,common}}).sort((a,b)=>b.common.length-a.common.length);
return `${head(t('resultsTitle'),`${speciesName(f.species)} · ${f.place||'–'}`,'#/found')}<div class="pad"><div class="seg">${['area','city','country'].map(k=>`<button data-act="tab" data-v="${k}" class="${tmp.tab===k?'on':''}">${t(k)}</button>`).join('')}</div>
${res.length?res.map(({p,common})=>{const sim=common.length>=2?'simHigh':common.length===1?'simMid':'simLow';return petCard(p,{hl:common.length>=2,tag:`<span class="tag" style="background:${common.length>=2?'var(--y)':'var(--lc)'}">${t(sim)}</span>`,body:`<div class="info" style="margin-top:6px;padding:8px 10px"><b>${t('why')}</b> ${common.length?esc(t('sameWords'))+' '+esc(common.join(', ')):esc(t('noCommon'))}</div>`})}).join(''):`<div class="info warn">${t('emptyRes')}</div>`}
<div class="info warn">${t('help')}</div><div class="hint" style="margin-top:10px">${t('matchNote')}</div><div style="margin-top:14px"><a class="btn sec small" href="#/found">${t('changeSearch')}</a></div></div>`}
function needLogin(next){tmp.next=next;location.hash='#/login'}
function vLogin(){const reg=tmp.loginMode==='reg';return `${head(t('loginTitle'),t('loginSub'),'#/')}<div class="pad"><form data-form="login"><div class="field"><label for="em">${t('email')}</label><input type="email" id="em" autocomplete="email"></div><div class="field"><label for="pw">${t('password')}</label><input type="password" id="pw" autocomplete="${reg?'new':'current'}-password"></div><div style="margin-top:16px"><button class="btn" type="submit">${t(reg?'register':'login')}</button></div></form>
<p style="text-align:center"><button class="chip" style="border:0;background:none;text-decoration:underline" data-act="loginMode">${t(reg?'regSwitch':'loginSwitch')}</button></p><p style="text-align:center;margin-top:0"><button class="chip" style="border:0;background:none;text-decoration:underline" data-act="forgot">${t('forgot')}</button></p><div class="hint">${t('demoNote')}</div></div>`}
function vMine(){if(!S.user)return vLogin();const ps=S.pets;return `${topbar(t('mineTitle'),S.user.name)}<div class="pad">${S.user.paused?`<div class="info warn">${t('paused')}</div>`:''}<a class="btn" href="#/addpet">${t('addPet')}</a>${ps.length?'':`<div class="info">${t('noPets')}</div>`}
${ps.map(p=>`<div class="card" style="flex-direction:column"><div style="display:flex;gap:12px"><div class="ph" style="width:72px;height:72px">${photoOf(p)}</div><div class="grow"><div style="display:flex;justify-content:space-between;align-items:center"><a class="name" href="#/pet/${p.id}">${esc(p.name)}</a>${tagOf(p)}</div><span class="muted">${esc(speciesName(p.species))} · ${esc(L(p.color))}</span>${p.status==='lost'?`<span class="muted">${esc(p.place)}, ${esc(p.city)} · ${esc(fmtDate(p.date))}</span>`:''}</div></div>
<div class="row" style="margin-top:10px">${p.status!=='lost'?`<button class="chip" data-act="lostForm" data-v="${p.id}">${t('setLost')}</button>`:`<button class="chip on" data-act="setFound" data-v="${p.id}">${t('setFound')}</button>`}${p.status!=='registered'?`<button class="chip" data-act="setReg" data-v="${p.id}">${t('setReg')}</button>`:''}<button class="chip" style="color:var(--ct)" data-act="delPet" data-v="${p.id}">${t('del')}</button></div>
${p.status==='lost'?`<button class="btn sec small" style="margin-top:8px" data-act="demoIn" data-v="${p.id}">${t('demoIncoming')}</button>`:''}
${tmp.lostFor===p.id?`<div class="sep"></div><div class="lbl">${t('lostForm')}</div><div class="field" style="margin-top:0"><label for="lp">${t('lastPlace')}</label><input type="text" id="lp"></div><div class="field"><label for="lc">${t('cityLbl')}</label><input type="text" id="lc"></div><div class="field"><label for="ld">${t('dateLost')}</label><input type="date" id="ld" max="${today()}" value="${today()}"></div><div class="field"><label for="lcirc">${t('circ')}</label><textarea id="lcirc" rows="3"></textarea></div><div class="row" style="margin-top:12px"><button class="btn small" style="width:auto;padding:0 20px" data-act="saveLost" data-v="${p.id}">${t('saveLost')}</button><button class="btn sec small" style="width:auto;padding:0 20px" data-act="cancelLost">${t('cancel')}</button></div>`:''}</div>`).join('')}</div>`}
function vAdd(){if(!S.user)return vLogin();return `${head(t('addTitle'),'','#/mine')}<div class="pad"><div class="lbl" style="margin-top:6px">${t('photosNeed')}</div><div class="thumbs"><label class="add"><input type="file" accept="image/*" capture="environment" hidden data-file="pet">${ic.cam.replace(/28/g,'26')}${t('takePhoto')}</label>${tmp.petPhotos.map((s,i)=>`<div class="thumb"><img src="${s}" alt=""><button data-act="rmPet" data-v="${i}" aria-label="${esc(t('removePhoto'))}">×</button></div>`).join('')}<label class="add" style="background:#fff;border:1.5px solid var(--db)"><input type="file" accept="image/*" multiple hidden data-file="pet"><span style="font-size:24px">+</span>${t('pickPhotos')}</label></div>
<div class="field"><label for="an">${t('fName')}</label><input type="text" id="an"></div><div class="field"><label>${t('species')}</label><select id="asp"><option value="cat">${t('cat')}</option><option value="dog">${t('dog')}</option><option value="other">${t('other')}</option></select></div>
<div class="field"><label for="ab">${t('fBreed')}</label><input type="text" id="ab"></div><div class="field"><label for="ac">${t('fColor')}</label><input type="text" id="ac"></div>
<div class="field"><label for="ase">${t('sex')}</label><select id="ase"><option value="f">${t('female')}</option><option value="m">${t('male')}</option><option value="">${t('unknown')}</option></select></div>
<div class="field"><label for="aa">${t('fAge')}</label><input type="number" id="aa" min="0" max="40"></div><div class="field"><label for="am">${t('fMarks')}</label><textarea id="am" rows="2"></textarea></div><div class="field"><label for="ad">${t('fDesc')}</label><textarea id="ad" rows="3"></textarea></div><div class="field"><label for="ach">${t('fChip')}</label><input type="text" id="ach"></div>
<div style="margin-top:16px"><button class="btn" data-act="savePet">${t('save')}</button></div></div>`}
function vMsgs(){if(!S.user)return vLogin();const rs=S.reqs.filter(r=>r.from===S.user.name||r.to===S.user.name);return `${topbar(t('msgTitle'))}<div class="pad">${rs.length?'':`<div class="info">${t('noMsgs')}</div>`}${rs.slice().reverse().map(r=>{const p=findPet(r.petId)||r.petSnap;const rec=r.to===S.user.name;const other=rec?r.from:r.to;const st={pending:'pending',accepted:'accepted',declined:'declined',revoked:'revoked'}[r.status];
return `<div class="card" style="flex-direction:column"><div style="display:flex;justify-content:space-between"><span class="name">${esc(p?p.name:'')}</span><span class="tag t-found">${t(st)}</span></div><span class="muted">${t(rec?'received':'sent')} · ${esc(other)}</span><div style="font-size:15px;font-weight:600;margin-top:4px">${esc(r.text)}</div>${p&&p.status!=='lost'?`<span class="muted">${t('archivedPet')}</span>`:''}
<div class="row" style="margin-top:10px">${r.status==='pending'&&rec?`<button class="chip on" data-act="accept" data-v="${r.id}">${t('accept')}</button><button class="chip" data-act="decline" data-v="${r.id}">${t('decline')}</button>`:''}${r.status==='pending'&&!rec?`<button class="chip" data-act="revoke" data-v="${r.id}">${t('revoke')}</button><button class="chip" data-act="demoAcc" data-v="${r.id}">${t('demoAccept')}</button>`:''}${r.status==='accepted'?`<a class="chip" style="display:flex;align-items:center;font-weight:800;background:var(--y)" href="#/chat/${r.id}">${t('openChat')}</a>`:''}</div></div>`}).join('')}</div>`}
function vChat(id){if(!S.user)return vLogin();const r=S.reqs.find(x=>x.id===id);if(!r||r.status!=='accepted')return head(t('notFound'),'','#/messages');if(r.from!==S.user.name&&r.to!==S.user.name)return head(t('notFound'),'','#/messages');const other=r.from===S.user.name?r.to:r.from;const bl=S.blocked.includes(other);
return `${head(t('chatTitle'),other,'#/messages')}<div class="pad"><div class="msgs">${r.msgs.map(m=>`<div class="msg ${m.from===S.user.name?'me':'them'}">${esc(m.text)}<small>${new Date(m.ts).toLocaleString(S.lang==='en'?'en-GB':'sv-SE',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'})}</small></div>`).join('')}</div>
${bl?`<div class="info warn">${t('blockedChat')}</div>`:`<form class="sendbar" data-form="chat" data-v="${id}"><input type="text" id="cm" placeholder="${esc(t('msgPh'))}" aria-label="${esc(t('msgPh'))}" maxlength="2000"><button class="btn" type="submit">${t('send')}</button></form><div class="row" style="margin-top:12px"><button class="chip" data-act="demoReply" data-v="${id}">${t('demoReply')}</button><button class="chip" style="color:var(--ct)" data-act="block" data-v="${other}">${t('block')}</button></div>`}</div>`}
function vProfile(){if(!S.user)return vLogin();const u=S.user;return `${topbar(t('profTitle'))}<div class="pad"><div class="field" style="margin-top:0"><label for="un">${t('username')}</label><input type="text" id="un" value="${esc(u.name)}" maxlength="20"><div class="hint">${t('usernameHint')}</div></div><button class="btn small" style="margin-top:10px" data-act="saveName">${t('saveName')}</button>
<div class="sep"></div><div class="lbl">${t('language')}</div><div class="row"><button class="chip ${S.lang==='sv'?'on':''}" data-act="lang" data-v="sv">Svenska</button><button class="chip ${S.lang==='en'?'on':''}" data-act="lang" data-v="en">English</button></div>
<div class="sep"></div>${u.paused?`<div class="info warn">${t('paused')}</div>`:''}<button class="btn sec" data-act="pause">${t(u.paused?'resume':'pause')}</button><button class="btn danger" style="margin-top:10px" data-act="delAcc">${t('delAcc')}</button><button class="btn sec" style="margin-top:10px" data-act="logout">${t('logout')}</button><div class="info">${t('privacy')}</div></div>`}
/* ---------- router ---------- */
function route(){const h=location.hash.replace(/^#\/?/,'');const [r,a]=h.split('/');let html;
switch(r){case '':html=vList();break;case 'pet':html=vPet(a);break;case 'contact':html=S.user?vContact(a):(needLogin('#/contact/'+a),'');break;case 'found':html=vFound();break;case 'results':html=vResults();break;case 'login':html=vLogin();break;case 'mine':html=vMine();break;case 'addpet':html=vAdd();break;case 'messages':html=vMsgs();break;case 'chat':html=vChat(a);break;case 'profile':html=vProfile();break;default:html=head(t('notFound'),'','#/')}
if(!html)return;document.documentElement.lang=S.lang;$('#app').innerHTML=html+nav(r);if(r==='')fillList();window.scrollTo(0,0)}
function rerender(keepScroll){const y=window.scrollY;route();if(keepScroll)window.scrollTo(0,y)}
/* ---------- photos ---------- */
function shrink(file){return new Promise((ok,no)=>{if(!file.type.startsWith('image/')||file.size>5*1024*1024)return no();const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const m=480,k=Math.min(1,m/Math.max(im.width,im.height));const c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);c.getContext('2d').drawImage(im,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.7))};im.onerror=no;im.src=fr.result};fr.onerror=no;fr.readAsDataURL(file)})}
document.addEventListener('change',async e=>{const el=e.target;if(!el.dataset||!el.dataset.file)return;const list=el.dataset.file==='found'?tmp.foundPhotos:tmp.petPhotos;saveFields();for(const f of el.files){try{list.push(await shrink(f))}catch(x){toast(t('badFile'))}}rerender(true)});
function saveFields(){const v=id=>{const e=document.getElementById(id);return e?e.value:undefined};if(location.hash.startsWith('#/found')){tmp.find=tmp.find||{species:'',place:'',desc:''};if(v('fplace')!==undefined)tmp.find.place=v('fplace');if(v('fdesc')!==undefined)tmp.find.desc=v('fdesc')}}
/* ---------- actions ---------- */
const A={
lang(v){S.lang=v;save();saveFields();rerender(true)},
sp(v){tmp.sp=v;rerender(true)},
ph(v){tmp.photoIdx=+v;rerender(true)},
fsp(v){saveFields();tmp.find.species=v;rerender(true)},
rmFound(v){saveFields();tmp.foundPhotos.splice(+v,1);rerender(true)},
rmPet(v){tmp.petPhotos.splice(+v,1);rerender(true)},
loc(){saveFields();if(!navigator.geolocation){toast(t('locDenied'));return}navigator.geolocation.getCurrentPosition(()=>{tmp.find.place=tmp.find.place||t('locDemo');rerender(true);toast(t('locDemo')+' ✓')},()=>toast(t('locDenied')),{timeout:8000})},
search(){saveFields();const f=tmp.find||{};if(!f.species)return toast(t('needSpecies'));if(!f.place.trim())return toast(t('needPlace'));tmp.tab='area';location.hash='#/results'},
tab(v){tmp.tab=v;rerender(true)},
sendReq(id){const p=findPet(id);const txt=($('#intro').value||'').trim();if(!txt)return toast(t('needOne'));if(mine(p))return toast(t('ownPet'));
if(S.blocked.includes(p.owner))return toast(t('blockedErr'));if(S.reqs.some(r=>r.petId===id&&r.from===S.user.name&&r.status==='pending'))return toast(t('dupReq'));
S.reqs.push({id:uid(),petId:id,petSnap:{name:p.name,status:p.status},from:S.user.name,to:p.owner,text:txt.slice(0,2000),status:'pending',msgs:[]});save();toast(t('reqSent'));location.hash='#/messages'},
accept(id){const r=S.reqs.find(x=>x.id===id);r.status='accepted';r.msgs.push({from:r.from,text:r.text,ts:Date.now()});save();location.hash='#/chat/'+id},
decline(id){S.reqs.find(x=>x.id===id).status='declined';save();rerender(true)},
revoke(id){S.reqs.find(x=>x.id===id).status='revoked';save();rerender(true)},
demoAcc(id){const r=S.reqs.find(x=>x.id===id);r.status='accepted';r.msgs.push({from:r.from,text:r.text,ts:Date.now()});save();rerender(true)},
demoReply(id){const r=S.reqs.find(x=>x.id===id);const other=r.from===S.user.name?r.to:r.from;r.msgs.push({from:other,text:t('demoReplyTxt'),ts:Date.now()});save();rerender()},
block(name){if(!confirm(t('confirmBlock')))return;if(!S.blocked.includes(name))S.blocked.push(name);save();rerender()},
loginMode(){tmp.loginMode=tmp.loginMode==='reg'?'login':'reg';rerender()},
forgot(){toast(t('forgotDone'))},
lostForm(id){tmp.lostFor=id;rerender(true)},cancelLost(){tmp.lostFor=null;rerender(true)},
saveLost(id){const pl=$('#lp').value.trim(),ci=$('#lc').value.trim(),d=$('#ld').value,c=$('#lcirc').value.trim();if(!pl||!ci||!c||!d||d>today())return toast(t('needLostFields'));const p=S.pets.find(x=>x.id===id);Object.assign(p,{status:'lost',place:pl,city:ci,date:d,circ:c});tmp.lostFor=null;save();toast(t('nowLost'));rerender(true)},
setFound(id){const p=S.pets.find(x=>x.id===id);p.lostArchive={place:p.place,city:p.city,date:p.date,circ:p.circ};p.status='found';save();toast(t('nowFound'));rerender(true)},
setReg(id){S.pets.find(x=>x.id===id).status='registered';save();rerender(true)},
delPet(id){if(!confirm(t('confirmDel')))return;S.pets=S.pets.filter(p=>p.id!==id);save();rerender(true)},
demoIn(id){const p=S.pets.find(x=>x.id===id);const from='Kalle5522';if(S.blocked.includes(from))return toast(t('blockedErr'));S.reqs.push({id:uid(),petId:id,petSnap:{name:p.name,status:p.status},from,to:S.user.name,text:S.lang==='en'?'Hi! I think I saw your pet near the station yesterday evening.':'Hej! Jag tror att jag såg ert djur vid stationen igår kväll.',status:'pending',msgs:[]});save();toast(t('reqSent'));rerender(true)},
savePet(){const g=i=>$('#'+i).value.trim();if(!g('an')||!g('ac'))return toast(t('needPetFields'));if(tmp.petPhotos.length<2)return toast(t('needPhotos'));
S.pets.push({id:uid(),name:g('an'),species:$('#asp').value,breed:g('ab'),color:g('ac'),sex:$('#ase').value,age:g('aa'),marks:g('am'),desc:g('ad'),chip:g('ach'),photos:tmp.petPhotos.slice(),owner:S.user.name,status:'registered',place:'',city:'',date:today()});tmp.petPhotos=[];save();toast(t('petSaved'));location.hash='#/mine'},
saveName(){const n=$('#un').value.trim();if(!/^[A-Za-z0-9åäöÅÄÖ]{3,20}$/.test(n))return toast(t('nameBad'));if(n.toLowerCase()!==S.user.name.toLowerCase()&&TAKEN.includes(n.toLowerCase()))return toast(t('nameTaken'));const old=S.user.name;S.user.name=n;S.pets.forEach(p=>{if(p.owner===old)p.owner=n});S.reqs.forEach(r=>{if(r.from===old)r.from=n;if(r.to===old)r.to=n;r.msgs.forEach(m=>{if(m.from===old)m.from=n})});save();toast(t('nameSaved'));rerender(true)},
pause(){S.user.paused=!S.user.paused;save();toast(t(S.user.paused?'pauseDone':'resumeDone'));rerender(true)},
delAcc(){if(!confirm(t('confirmDelAcc')))return;const n=S.user.name;S.pets=S.pets.filter(p=>p.owner!==n);S.reqs=S.reqs.filter(r=>r.from!==n&&r.to!==n);S.user=null;S.blocked=[];save();toast(t('accDeleted'));location.hash='#/'},
logout(){S.user=null;save();location.hash='#/'}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;e.preventDefault();const f=A[b.dataset.act];if(f)f(b.dataset.v)});
document.addEventListener('input',e=>{if(e.target.id==='q'){tmp.q=e.target.value;fillList()}if(e.target.id==='intro'){$('#cnt').textContent=e.target.value.length+' / 2000'}});
document.addEventListener('submit',e=>{const f=e.target.dataset.form;if(!f)return;e.preventDefault();
if(f==='login'){const em=$('#em').value.trim(),pw=$('#pw').value;if(!/^\S+@\S+\.\S+$/.test(em)||pw.length<6)return toast(t('badLogin'));if(!S.user||S.user.email!==em){S.user={email:em,name:genName(),paused:false}}save();toast(t('welcome')+' '+S.user.name);const n=tmp.next||'#/profile';tmp.next='';location.hash=n}
if(f==='chat'){const v=$('#cm').value.trim();if(!v)return;const r=S.reqs.find(x=>x.id===e.target.dataset.v);r.msgs.push({from:S.user.name,text:v.slice(0,2000),ts:Date.now()});save();rerender()}});
window.addEventListener('hashchange',route);
route();
