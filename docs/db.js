'use strict';
/* Dataskiktet: all kommunikation med Supabase finns här. Appen litar aldrig på klienten –
   databasen validerar ägare, avsändare och behörighet. */
(function () {
  const cfg = window.DH_CONFIG;
  const sb = window.supabase.createClient(cfg.url, cfg.key);
  const BUCKET = 'pet-photos';
  const urlCache = new Map();
  const ok = (r) => { if (r.error) throw r.error; return r.data; };

  async function signed(paths) {
    const need = [...new Set(paths)].filter((p) => p && !urlCache.has(p));
    if (need.length) {
      const { data } = await sb.storage.from(BUCKET).createSignedUrls(need, 3600);
      (data || []).forEach((d) => { if (d && d.signedUrl) urlCache.set(d.path, d.signedUrl); });
    }
  }
  async function attach(list) {
    await signed(list.flatMap((p) => p.photos));
    list.forEach((p) => { p.imgs = p.photos.map((x) => urlCache.get(x)).filter(Boolean); });
    return list;
  }
  const fromLost = (r) => ({
    id: r.id, name: r.name, species: r.species, breed: r.breed || '', color: r.color || '', sex: r.sex,
    age: r.age_years, marks: r.marks || '', place: r.last_place, city: r.last_city, date: r.lost_on,
    circ: r.circumstances || '', owner: r.owner_username, photos: r.photo_paths || [], status: 'lost',
    score: r.score, common: r.common || []
  });
  function fromOwn(r) {
    const rep = (r.lost_reports || []).find((x) => x.status === 'active');
    const photos = (r.pet_photos || []).slice().sort((a, b) => a.sort - b.sort).map((x) => x.path);
    return {
      id: r.id, name: r.name, species: r.species, breed: r.breed || '', color: r.color || '', sex: r.sex,
      age: r.age_years, marks: r.marks || '', desc: r.description || '', chip: r.chip_number || '', status: r.status,
      place: rep ? rep.last_place : '', city: rep ? rep.last_city : '', date: rep ? rep.lost_on : '',
      circ: rep ? rep.circumstances : '', photos, owner: null, mineFlag: true
    };
  }

  const fromFound = (r) => ({
    id: r.id, kind: 'found', name: r.species, species: r.species, breed: '', color: r.color || '', place: r.place, city: r.city,
    date: r.found_on, desc: r.description || '', finder: r.finder_username, photos: r.photo_paths || [], status: 'found-post'
  });

  const DB = {
    sb,
    /* ----- konto ----- */
    async session() { return (await sb.auth.getSession()).data.session; },
    async profile() {
      const s = await DB.session(); if (!s) return null;
      let r = await sb.from('profiles').select('id,username,paused,home_country,avatar').eq('id', s.user.id).maybeSingle();
      if (r.error) r = await sb.from('profiles').select('id,username,paused,home_country').eq('id', s.user.id).maybeSingle();
      if (r.error) r = await sb.from('profiles').select('id,username,paused').eq('id', s.user.id).maybeSingle(); // databasen saknar ännu landsfunktionen
      const d = ok(r);
      return d ? { id: d.id, name: d.username, paused: d.paused, country: d.home_country || 'SE', avatar: d.avatar || '', email: s.user.email } : null;
    },
    onAuth(cb) { return sb.auth.onAuthStateChange((ev, session) => cb(ev, session)); },
    async signUp(email, password, country) { const r = await sb.auth.signUp({ email, password, options: { data: { home_country: country || 'SE' } } }); if (r.error) throw r.error; return r.data; },
    async signIn(email, password) { const r = await sb.auth.signInWithPassword({ email, password }); if (r.error) throw r.error; return r.data; },
    async signOut() { await sb.auth.signOut(); },
    async resetPassword(email) { const r = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname }); if (r.error) throw r.error; },
    async changeEmail(email) { const r = await sb.auth.updateUser({ email }, { emailRedirectTo: location.origin + location.pathname }); if (r.error) throw r.error; },
    async setPassword(pw) { const r = await sb.auth.updateUser({ password: pw }); if (r.error) throw r.error; },
    /* avatarer är offentliga (inga personuppgifter); hämtas per användarnamn och cachas */
    avCache: {},
    async avatarsOf(names) {
      const need = [...new Set((names || []).filter((n) => n && !(n in DB.avCache)))];
      if (need.length) {
        const r = await sb.from('profiles').select('username,avatar').in('username', need);
        if (!r.error) (r.data || []).forEach((x) => { DB.avCache[x.username] = x.avatar || ''; });
        need.forEach((n) => { if (!(n in DB.avCache)) DB.avCache[n] = ''; });
      }
      return DB.avCache;
    },
    async setAvatar(code, myName) { ok(await sb.rpc('set_avatar', { p_avatar: code })); if (myName) DB.avCache[myName] = code; },
    async changeUsername(n) { ok(await sb.rpc('change_username', { new_name: n })); },
    async setPaused(v) { ok(await sb.rpc('set_paused', { p_paused: v })); },
    async deleteAccount() {
      const own = ok(await sb.from('pet_photos').select('path'));
      const found = ok(await sb.from('found_reports').select('photo_paths'));
      const paths = own.map((x) => x.path).concat(found.flatMap((x) => x.photo_paths || []));
      for (let i = 0; i < paths.length; i += 100) await sb.storage.from(BUCKET).remove(paths.slice(i, i + 100));
      ok(await sb.rpc('delete_my_account'));
      await sb.auth.signOut();
    },
    /* ----- offentlig sökning (säkra funktioner) ----- */
    async searchLost(f, species, country) {
      f = f || {};
      const base = { p_species: species === 'all' ? null : species };
      const ext = { p_breed: f.breed || null, p_color: f.color || null, p_place: f.place || null };
      let r = await sb.rpc('search_lost_pets', { ...base, ...ext, p_country: country || null });
      let client = false;
      if (r.error) { r = await sb.rpc('search_lost_pets', { ...base, p_country: country || null }); client = true; }
      if (r.error) r = await sb.rpc('search_lost_pets', base); // gammal databas utan land
      let rows = ok(r);
      if (client) { // databasen saknar de nya filtren: filtrera här i stället
        const has = (v, q) => !q || String(v || '').toLowerCase().includes(q.trim().toLowerCase());
        rows = rows.filter((x) => has(x.breed, f.breed) && has(x.color, f.color) && has(x.last_place + ' ' + x.last_city, f.place));
      }
      return attach(rows.map(fromLost));
    },
    async getLost(id) {
      const rows = ok(await sb.rpc('get_lost_pet', { p_id: id }));
      return rows.length ? (await attach([fromLost(rows[0])]))[0] : null;
    },
    async match(f, scope, country) {
      const a = { p_species: f.species, p_place: f.place, p_scope: scope, p_description: f.desc || '' };
      let r = await sb.rpc('match_lost_pets', { ...a, p_country: country || null });
      if (r.error) r = await sb.rpc('match_lost_pets', a);
      const rows = ok(r);
      return attach(rows.map(fromLost));
    },
    /* ----- mina djur ----- */
    async myPets() {
      const rows = ok(await sb.from('pets').select('*, pet_photos(path,sort,angle), lost_reports(last_place,last_city,lost_on,circumstances,status)').order('created_at', { ascending: false }));
      return attach(rows.map(fromOwn));
    },
    async myPet(id) {
      const r = ok(await sb.from('pets').select('*, pet_photos(path,sort,angle), lost_reports(last_place,last_city,lost_on,circumstances,status)').eq('id', id).maybeSingle());
      return r ? (await attach([fromOwn(r)]))[0] : null;
    },
    async uploadBlob(uid, folder, blob) {
      const path = `${uid}/${folder}/${crypto.randomUUID()}.jpg`;
      const r = await sb.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg', upsert: false });
      if (r.error) throw r.error;
      return path;
    },
    async addPet(uid, f, blobs) {
      const pet = ok(await sb.from('pets').insert({ owner_id: uid, name: f.name, species: f.species, breed: f.breed || null, color: f.color,
        sex: f.sex || 'unknown', age_years: f.age === '' || f.age == null ? null : +f.age, marks: f.marks || null, description: f.desc || null, chip_number: f.chip || null }).select('id').single());
      try {
        const angles = ['front', 'left', 'right'];
        for (let i = 0; i < blobs.length; i++) {
          const path = await DB.uploadBlob(uid, pet.id, blobs[i]);
          ok(await sb.from('pet_photos').insert({ pet_id: pet.id, path, angle: angles[i] || 'other', sort: i }));
        }
      } catch (e) { await sb.from('pets').delete().eq('id', pet.id); throw e; }
      return pet.id;
    },
    async updatePet(id, f) {
      ok(await sb.from('pets').update({ name: f.name, species: f.species, breed: f.breed || null, color: f.color, sex: f.sex || 'unknown',
        age_years: f.age === '' || f.age == null ? null : +f.age, marks: f.marks || null, description: f.desc || null, chip_number: f.chip || null }).eq('id', id));
    },
    async deletePet(id) {
      const ph = ok(await sb.from('pet_photos').select('path').eq('pet_id', id));
      if (ph.length) await sb.storage.from(BUCKET).remove(ph.map((x) => x.path));
      ok(await sb.from('pets').delete().eq('id', id));
    },
    async reportLost(id, place, city, date, circ, country, deviceCountry) { ok(await sb.rpc('report_lost', { p_pet: id, p_place: place, p_city: city, p_date: date, p_circ: circ, p_country: country, p_device_country: deviceCountry })); },
    async setHomeCountry(c) { ok(await sb.rpc('set_home_country', { p_country: c })); },
    async markFound(id) { ok(await sb.rpc('mark_found', { p_pet: id })); },
    async setRegistered(id) { ok(await sb.from('pets').update({ status: 'registered' }).eq('id', id)); },
    /* ----- upphittade djur (publika anmälningar) ----- */
    async searchFound(f, species, country) {
      f = f || {};
      const rows = ok(await sb.rpc('search_found_pets', { p_species: species === 'all' ? null : species, p_country: country || null, p_color: f.color || null, p_place: f.place || null }));
      return attach(rows.map(fromFound));
    },
    async getFound(id) {
      const rows = ok(await sb.rpc('get_found_pet', { p_id: id }));
      return rows.length ? (await attach([fromFound(rows[0])]))[0] : null;
    },
    async myFound() {
      const rows = ok(await sb.from('found_reports').select('id,species,color,place,city,created_at,photo_paths,closed_at').eq('is_public', true).order('created_at', { ascending: false }));
      return attach(rows.map((r) => ({ id: r.id, kind: 'found', species: r.species, color: r.color || '', place: r.place, city: r.city, date: String(r.created_at).slice(0, 10), photos: r.photo_paths || [], closed: !!r.closed_at })));
    },
    async publishFound(uid, f, blobs, country, deviceCountry) {
      const paths = [];
      for (const b of blobs) paths.push(await DB.uploadBlob(uid, 'found', b));
      try {
        return ok(await sb.rpc('publish_found', { p_species: f.species, p_color: f.color || null, p_place: f.place, p_city: f.city, p_country: country, p_device_country: deviceCountry, p_desc: f.desc || null, p_paths: paths }));
      } catch (e) { await sb.storage.from(BUCKET).remove(paths); throw e; }
    },
    async closeFound(id) { ok(await sb.rpc('close_found', { p_id: id })); },
    async deleteFound(id) {
      const r = ok(await sb.from('found_reports').select('photo_paths').eq('id', id).maybeSingle());
      if (r && r.photo_paths && r.photo_paths.length) await sb.storage.from(BUCKET).remove(r.photo_paths);
      ok(await sb.from('found_reports').delete().eq('id', id));
    },
    async sendFoundRequest(id, text) { return ok(await sb.rpc('create_found_contact_request', { p_found: id, p_intro: text })); },
    /* ----- fyndrapporter (privata) ----- */
    async saveFind(uid, f, blobs) {
      const paths = [];
      for (const b of blobs) paths.push(await DB.uploadBlob(uid, 'found', b));
      ok(await sb.from('found_reports').insert({ finder_id: uid, species: f.species, place: f.place, description: f.desc || null, photo_paths: paths }));
    },
    /* ----- kontakt och chatt ----- */
    async requests() {
      let r = await sb.from('contact_requests').select('id,pet_id,found_id,pet_name,finder_id,owner_id,intro,status,created_at,finder:profiles!finder_id(username,avatar),owner:profiles!owner_id(username,avatar)').order('created_at', { ascending: false });
      if (r.error) r = await sb.from('contact_requests').select('id,pet_id,pet_name,finder_id,owner_id,intro,status,created_at,finder:profiles!finder_id(username),owner:profiles!owner_id(username)').order('created_at', { ascending: false });
      return ok(r);
    },
    async sendRequest(petId, text) { return ok(await sb.rpc('create_contact_request', { p_pet: petId, p_intro: text })); },
    async respond(id, accept) { ok(await sb.rpc('respond_request', { p_request: id, p_accept: accept })); },
    async revoke(id) { ok(await sb.rpc('revoke_request', { p_request: id })); },
    async messages(reqId) { return ok(await sb.from('messages').select('id,sender_id,body,created_at').eq('request_id', reqId).order('created_at', { ascending: true })); },
    async send(reqId, body) { ok(await sb.rpc('send_message', { p_request: reqId, p_body: body })); },
    async markRead(reqId) { ok(await sb.rpc('mark_read', { p_request: reqId })); },
    async block(reqId) { ok(await sb.rpc('block_user', { p_request: reqId })); },
    async blockedIds() { return ok(await sb.from('blocks').select('blocked_id')).map((x) => x.blocked_id); },
    async blockedList() { return ok(await sb.from('blocks').select('blocked_id,created_at,blocked:profiles!blocked_id(username,avatar)').order('created_at', { ascending: false })); },
    async unblock(userId) { ok(await sb.rpc('unblock_user', { p_user: userId })); },
    async notifications() { return ok(await sb.from('notifications').select('id,type,request_id,pet_name,created_at,read_at').order('created_at', { ascending: false }).limit(50)); },
    async markAllNotifs() { ok(await sb.from('notifications').update({ read_at: new Date().toISOString() }).is('read_at', null)); },
    async unreadCount() {
      const r = await sb.from('notifications').select('id', { count: 'exact', head: true }).is('read_at', null);
      return r.error ? 0 : (r.count || 0);
    },
    /* ----- realtid med reservuppdatering ----- */
    subscribe(uid, onChange, onReconnect) {
      let wasDown = false;
      const ch = sb.channel('dh-' + uid)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, onChange)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_requests' }, onChange)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: 'user_id=eq.' + uid }, onChange)
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') { if (wasDown) onReconnect(); wasDown = false; }
          else if (status === 'CHANNEL_ERROR' || status === 'CLOSED' || status === 'TIMED_OUT') wasDown = true;
        });
      return () => { sb.removeChannel(ch); };
    }
  };
  window.DB = DB;
})();
