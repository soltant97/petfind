/* Djuravatarer: ritas som SVG i webbläsaren. Koden sparas som text 'djur:bakgrund:tillbehör' (t.ex. 'fox:3:1'). */
(function () {
  const ANIMALS = ['cat', 'dog', 'rabbit', 'fox', 'bear', 'panda', 'mouse', 'bird'];
  const COLORS = ['#FFD770', '#FFF3C9', '#F4806B', '#FFE3DC', '#F6EDE0', '#E9DCC8', '#FFC4B8', '#CFE0F2'];
  const D = '#3A2A1E';
  const FUR = { cat: '#D9955A', dog: '#C69463', rabbit: '#F5EADB', fox: '#E5763F', bear: '#946447', panda: '#FFFCF5', mouse: '#C4BAB0', bird: '#FFD23F' };
  const re = /^(cat|dog|rabbit|fox|bear|panda|mouse|bird):[0-7]:[0-3]$/;
  const ok = (c) => re.test(c || '');
  const random = () => ANIMALS[Math.floor(Math.random() * 8)] + ':' + Math.floor(Math.random() * 8) + ':' + Math.floor(Math.random() * 4);
  const parse = (c) => { const p = (ok(c) ? c : 'cat:0:0').split(':'); return { a: p[0], b: +p[1], x: +p[2] }; };
  const face = (a) => {
    const f = FUR[a];
    const eyes = `<circle cx="39" cy="54" r="3.4" fill="${D}"/><circle cx="61" cy="54" r="3.4" fill="${D}"/>`;
    const mouth = `<path d="M44 66q6 5 12 0" fill="none" stroke="${D}" stroke-width="2.4" stroke-linecap="round"/>`;
    const nose = `<ellipse cx="50" cy="62" rx="4" ry="3" fill="${D}"/>`;
    const head = `<ellipse cx="50" cy="56" rx="30" ry="27" fill="${f}"/>`;
    switch (a) {
      case 'cat': return `<path d="M22 44L26 14L46 30Z M78 44L74 14L54 30Z" fill="${f}"/><path d="M28 36L29 22L39 31Z M72 36L71 22L61 31Z" fill="#F4A9A0"/>${head}${eyes}${nose}${mouth}<path d="M18 58h13M18 64l12-3M82 58H69M82 64L70 61" stroke="${D}" stroke-width="1.6" stroke-linecap="round"/>`;
      case 'dog': return `<ellipse cx="22" cy="52" rx="11" ry="20" fill="#7A5236" transform="rotate(12 22 52)"/><ellipse cx="78" cy="52" rx="11" ry="20" fill="#7A5236" transform="rotate(-12 78 52)"/>${head}<ellipse cx="50" cy="66" rx="14" ry="11" fill="#F3DFC6"/>${eyes}${nose}${mouth}`;
      case 'rabbit': return `<ellipse cx="38" cy="26" rx="8" ry="22" fill="${f}"/><ellipse cx="62" cy="26" rx="8" ry="22" fill="${f}"/><ellipse cx="38" cy="27" rx="4" ry="15" fill="#F4A9A0"/><ellipse cx="62" cy="27" rx="4" ry="15" fill="#F4A9A0"/>${head}${eyes}<ellipse cx="50" cy="62" rx="3.5" ry="2.8" fill="#E8838A"/>${mouth}`;
      case 'fox': return `<path d="M20 46L24 12L46 30Z M80 46L76 12L54 30Z" fill="${f}"/><path d="M27 36L28 22L38 31Z M73 36L72 22L62 31Z" fill="${D}"/>${head}<path d="M22 62Q50 92 78 62Q64 58 50 66Q36 58 22 62Z" fill="#FFFCF5"/>${eyes}<ellipse cx="50" cy="63" rx="4" ry="3" fill="${D}"/>`;
      case 'bear': return `<circle cx="24" cy="32" r="11" fill="${f}"/><circle cx="76" cy="32" r="11" fill="${f}"/><circle cx="24" cy="32" r="5.5" fill="#C99A78"/><circle cx="76" cy="32" r="5.5" fill="#C99A78"/>${head}<ellipse cx="50" cy="65" rx="12" ry="9.5" fill="#E8C9A8"/>${eyes}${nose}${mouth}`;
      case 'panda': return `<circle cx="24" cy="32" r="11" fill="${D}"/><circle cx="76" cy="32" r="11" fill="${D}"/>${head}<ellipse cx="38" cy="54" rx="8" ry="10" fill="${D}" transform="rotate(-18 38 54)"/><ellipse cx="62" cy="54" rx="8" ry="10" fill="${D}" transform="rotate(18 62 54)"/><circle cx="38.5" cy="54" r="2.6" fill="#FFFCF5"/><circle cx="61.5" cy="54" r="2.6" fill="#FFFCF5"/>${nose}${mouth}`;
      case 'mouse': return `<circle cx="24" cy="34" r="14" fill="${f}"/><circle cx="76" cy="34" r="14" fill="${f}"/><circle cx="24" cy="34" r="8" fill="#F4A9A0"/><circle cx="76" cy="34" r="8" fill="#F4A9A0"/>${head}${eyes}<ellipse cx="50" cy="61" rx="3.6" ry="2.8" fill="#E8838A"/>${mouth}<path d="M18 58h13M18 64l12-3M82 58H69M82 64L70 61" stroke="${D}" stroke-width="1.4" stroke-linecap="round"/>`;
      default: return `<path d="M44 26Q50 10 56 26Z" fill="${f}"/><circle cx="50" cy="55" r="29" fill="${f}"/><path d="M42 60L58 60L50 72Z" fill="#F4A24D"/>${eyes}`;
    }
  };
  const acc = (x) => {
    if (x === 1) return `<path d="M62 84L74 77L74 91Z M62 84L50 77L50 91Z" fill="#F4806B"/><circle cx="62" cy="84" r="4" fill="#A8402D"/>`;
    if (x === 2) return `<circle cx="39" cy="54" r="9" fill="none" stroke="${D}" stroke-width="2.4"/><circle cx="61" cy="54" r="9" fill="none" stroke="${D}" stroke-width="2.4"/><path d="M48 54h4" stroke="${D}" stroke-width="2.4"/>`;
    if (x === 3) return `<path d="M24 78Q50 94 76 78L78 90Q50 104 22 90Z" fill="#F4806B"/><path d="M60 88l4 14h9l-3-14Z" fill="#E3604B"/>`;
    return '';
  };
  /* Rund profilbild. size i px. */
  function svg(code, size, label) {
    const p = parse(code), s = size || 40;
    return `<span class="av" style="width:${s}px;height:${s}px" role="img" aria-label="${label || 'Avatar'}"><svg viewBox="0 0 100 100" width="${s}" height="${s}" aria-hidden="true"><rect width="100" height="100" fill="${COLORS[p.b]}"/>${face(p.a)}${acc(p.x)}</svg></span>`;
  }
  window.AVATAR = { ANIMALS, COLORS, random, parse, ok, svg };
})();
