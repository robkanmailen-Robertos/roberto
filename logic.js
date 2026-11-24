/* Roberto — logica: drinkvensters en spijscombinaties (geen afhankelijkheden) */
(function (root) {
  'use strict';

  /* ---------- maanden ('YYYY-MM') ---------- */
  const pad = n => String(n).padStart(2, '0');
  const ymNow = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
  const ymToIdx = ym => { const [y, m] = ym.split('-').map(Number); return y * 12 + (m - 1); };
  const idxToYm = i => `${Math.floor(i / 12)}-${pad((i % 12) + 1)}`;
  const addMonths = (ym, n) => idxToYm(ymToIdx(ym) + Math.round(n));
  const MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  const MAANDEN = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
  const fmtYm = ym => { if (!ym) return '—'; const [y, m] = ym.split('-'); return `${MAANDEN[+m - 1]} ${y}`; };
  const meseIt = ym => { const [y, m] = ym.split('-'); return `${MESI[+m - 1]} ${y}`; };

  /* ---------- drinkvenster: regels ----------
     wijn: [van, piek, tot] in JAREN na de oogst
     bier: [van, piek, tot] in MAANDEN na bottelen/brouwen */
  const WIJN = [
    // rood — Italië
    [/langhe nebbiolo|nebbiolo d'alba/, [3, 6, 10], 'Langhe Nebbiolo'],
    [/barolo|barbaresco|nebbiolo|gattinara|ghemme/, [8, 15, 25], 'Nebbiolo (Barolo/Barbaresco)'],
    [/rosso di montalcino/, [2, 4, 7], 'Rosso di Montalcino'],
    [/brunello/, [8, 14, 22], 'Brunello di Montalcino'],
    [/amarone/, [5, 10, 20], 'Amarone'],
    [/ripasso/, [3, 5, 8], 'Valpolicella Ripasso'],
    [/valpolicella/, [1, 3, 5], 'Valpolicella'],
    [/gran selezione|chianti.*riserva|riserva.*chianti/, [5, 9, 15], 'Chianti Classico Riserva'],
    [/chianti|sangiovese|morellino/, [2, 4, 8], 'Sangiovese / Chianti'],
    [/bolgheri|super ?tuscan|sassicaia|tignanello|ornellaia|guado al tasso/, [6, 12, 20], 'Bolgheri / Super Tuscan'],
    [/vino nobile/, [4, 8, 14], 'Vino Nobile di Montepulciano'],
    [/montepulciano/, [2, 4, 7], "Montepulciano d'Abruzzo"],
    [/aglianico|taurasi/, [6, 12, 20], 'Aglianico / Taurasi'],
    [/primitivo|zinfandel/, [2, 4, 7], 'Primitivo / Zinfandel'],
    [/nero d'?avola/, [2, 4, 8], "Nero d'Avola"],
    [/etna|nerello/, [3, 6, 12], 'Etna Rosso'],
    [/barbera/, [2, 4, 8], 'Barbera'],
    [/dolcetto|lambrusco/, [1, 2, 4], 'Dolcetto / Lambrusco'],
    // rood — Frankrijk
    [/pauillac|margaux|saint-julien|st-julien|saint-est[eè]phe|st-est[eè]phe|pessac|grand cru class[eé]/, [8, 15, 25], 'Bordeaux (Médoc / cru classé)'],
    [/pomerol|saint-[eé]milion|st-[eé]milion/, [6, 12, 20], 'Pomerol / Saint-Émilion'],
    [/bordeaux/, [3, 6, 10], 'Bordeaux'],
    [/hermitage|c[oô]te-r[oô]tie|cornas/, [8, 14, 25], 'Noordelijke Rhône'],
    [/ch[aâ]teauneuf|gigondas|vacqueyras/, [5, 10, 18], 'Châteauneuf / zuidelijke Rhône cru'],
    [/c[oô]tes du rh[oô]ne|grenache|garnacha/, [2, 4, 7], 'Côtes du Rhône / Grenache'],
    [/beaujolais|gamay|morgon|fleurie|moulin-?[aà]-?vent/, [1, 3, 6], 'Beaujolais / Gamay'],
    [/gevrey|chambolle|vosne|nuits|volnay|pommard|clos de vougeot|corton/, [5, 10, 20], 'Bourgogne (village/cru)'],
    [/bourgogne|burgundy|pinot noir|sp[aä]tburgunder/, [3, 6, 12], 'Pinot Noir / Bourgogne'],
    [/cahors|madiran|tannat/, [5, 10, 18], 'Cahors / Madiran'],
    // rood — Spanje, Portugal, Nieuwe Wereld
    [/gran reserva/, [8, 14, 25], 'Gran Reserva'],
    [/priorat/, [5, 10, 18], 'Priorat'],
    [/reserva/, [5, 9, 15], 'Reserva'],
    [/rioja|ribera|crianza|tempranillo|toro/, [3, 6, 10], 'Tempranillo / Rioja'],
    [/douro|touriga/, [4, 8, 15], 'Douro'],
    [/syrah|shiraz/, [4, 8, 14], 'Syrah / Shiraz'],
    [/malbec/, [3, 6, 10], 'Malbec'],
    [/cabernet/, [5, 10, 18], 'Cabernet Sauvignon'],
    [/merlot/, [3, 6, 10], 'Merlot'],
    [/carm[eé]n[eè]re|pinotage/, [2, 4, 8], 'Carménère / Pinotage'],
    [/blaufr[aä]nkisch|zweigelt/, [3, 6, 10], 'Blaufränkisch / Zweigelt'],
  ];
  const WIT = [
    [/sp[aä]tlese|auslese|beerenauslese/, [5, 12, 30], 'Riesling Spätlese/Auslese'],
    [/riesling/, [2, 6, 15], 'Riesling'],
    [/chablis.*(grand|premier|1er)|(grand|premier|1er).*chablis/, [4, 8, 15], 'Chablis Premier/Grand Cru'],
    [/chablis/, [2, 4, 7], 'Chablis'],
    [/meursault|puligny|chassagne|corton-charlemagne|montrachet/, [4, 8, 15], 'Witte Bourgogne (village/cru)'],
    [/chardonnay|bourgogne|m[aâ]con|pouilly-fuiss[eé]/, [2, 4, 7], 'Chardonnay'],
    [/chenin|vouvray|savenni[eè]res|montlouis/, [3, 8, 20], 'Chenin Blanc'],
    [/s[eé]millon|graves|pessac|bordeaux/, [3, 7, 12], 'Witte Bordeaux / Sémillon'],
    [/sauvignon|sancerre|pouilly-fum[eé]/, [1, 2, 4], 'Sauvignon Blanc'],
    [/gr[uü]ner/, [1, 3, 6], 'Grüner Veltliner'],
    [/albari[nñ]o|alvarinho|verdejo|vinho verde|muscadet|picpoul/, [0, 1, 3], 'Frisse kustwijn'],
    [/alsace.*pinot gris|pinot gris.*alsace/, [2, 5, 10], 'Pinot Gris (Elzas)'],
    [/pinot grigio|pinot gris|grauburgunder/, [1, 2, 4], 'Pinot Grigio'],
    [/gew[uü]rz/, [2, 4, 8], 'Gewürztraminer'],
    [/soave|verdicchio|vermentino|fiano|greco|falanghina|lugana|timorasso/, [1, 3, 6], 'Italiaans wit'],
    [/viognier|condrieu/, [1, 3, 5], 'Viognier'],
  ];
  const BUBBELS = [
    [/prosecco/, [0, 1, 2], 'Prosecco'],
    [/champagne/, [6, 12, 20], 'Champagne millésime', true],
    [/franciacorta|cava|cr[eé]mant|sekt|trento/, [0, 1, 3], 'Mousserend'],
  ];
  const DESSERT = [
    [/vintage.*port|port.*vintage/, [15, 25, 50], 'Vintage Port'],
    [/tawny|lbv|colheita/, [0, 3, 10], 'Tawny / LBV Port', true],
    [/sauternes|barsac|tokaj|tokaji/, [5, 15, 40], 'Sauternes / Tokaji'],
    [/eiswein|ice ?wine/, [3, 10, 25], 'IJswijn'],
    [/port|porto/, [2, 8, 20], 'Port'],
    [/sherry|jerez|madeira|marsala/, [0, 5, 30], 'Sherry / Madeira', true],
    [/vin santo|passito|recioto/, [3, 8, 20], 'Vin Santo / Passito'],
  ];
  const BIER = [
    [/oude ?geuze|geuze|gueuze|lambiek|lambic/, [12, 48, 240], 'Oude geuze / lambiek'],
    [/kriek|framboise|frambozen|fruit ?lambi/, [6, 12, 48], 'Fruitlambiek'],
    [/barley ?wine|barleywine|old ale|wee heavy|scotch ale/, [12, 36, 180], 'Barley wine / old ale'],
    [/imperial stout|russian imperial|\bris\b|barrel[- ]aged|\bba\b|bourbon/, [6, 24, 96], 'Imperial stout / barrel aged'],
    [/quadrupel|\bquad\b|\babt\b|westvleteren 12|rochefort 10/, [6, 24, 96], 'Quadrupel'],
    [/eisbock|doppelbock/, [6, 24, 96], 'Doppelbock / Eisbock'],
    [/oud bruin|flemish|flanders red|rodenbach|wild ale|brett|sour/, [6, 24, 96], 'Oud bruin / wild ale'],
    [/tripel/, [2, 8, 30], 'Tripel'],
    [/dubbel|bruin|brown|bock/, [2, 8, 30], 'Dubbel / bruin'],
    [/stout|porter/, [1, 6, 24], 'Stout / porter'],
    [/neipa|new england|hazy|dipa|double ipa|\bipa\b|pale ale|\bapa\b|session/, [0, 1, 4], 'IPA / pale ale (vers drinken!)'],
    [/pils|pilsner|lager|helles|k[oö]lsch|witbier|\bwit\b|weizen|weiss|hefe/, [0, 2, 6], 'Pils / wit / weizen'],
    [/blond|saison|bi[eè]re de garde/, [1, 4, 18], 'Blond / saison'],
  ];
  const DEF = {
    rood: [[3, 5, 8], 'rode wijn'], wit: [[1, 3, 5], 'witte wijn'], rose: [[0, 1, 2], 'rosé'],
    mousserend: [[0, 2, 4], 'mousserende wijn (zonder jaartal)'], dessert: [[3, 8, 15], 'dessertwijn'],
    bier: [[0, 3, 12], 'bier'],
  };

  const bottleText = b => [b.naam, b.producent, b.regio, b.land, b.druif, b.stijl, b.categorie].filter(Boolean).join(' ').toLowerCase();

  function pick(rules, txt) { for (const r of rules) if (r[0].test(txt)) return r; return null; }

  /** Schat het drinkvenster. Geeft {van, piek, tot, uitleg} terug als 'YYYY-MM'. */
  function schatVenster(b, today = ymNow()) {
    const txt = bottleText(b);
    if (b.soort === 'bier') {
      const base = b.bottelDatum || b.aankoopDatum || today;
      const r = pick(BIER, txt);
      const [v, p, t] = r ? r[1] : DEF.bier[0];
      const label = r ? r[2] : DEF.bier[1];
      return {
        van: addMonths(base, v), piek: addMonths(base, p), tot: addMonths(base, t),
        uitleg: `${label}: op z'n best ${p < 12 ? p + ' mnd' : (p / 12).toFixed(p % 12 ? 1 : 0).replace('.', ',') + ' jr'} na bottelen` +
          (b.bottelDatum ? '' : ' (bottel­datum onbekend, gerekend vanaf aankoop)'),
      };
    }
    const cat = b.categorie || 'rood';
    let rules = cat === 'wit' ? WIT : cat === 'mousserend' ? BUBBELS : cat === 'dessert' ? DESSERT : cat === 'rose' ? [] : WIJN;
    let r = pick(rules, txt);
    let offs, label, fromPurchase = false;
    if (r) { offs = r[1].slice(); label = r[2]; if (r[3]) fromPurchase = !b.jaargang || r[2].includes('Tawny') || r[2].includes('Sherry'); }
    else { offs = DEF[cat] ? DEF[cat][0].slice() : DEF.rood[0].slice(); label = DEF[cat] ? DEF[cat][1] : 'wijn'; }
    // Champagne zonder jaartal = NV: kort houden
    if (cat === 'mousserend' && r && r[2].startsWith('Champagne') && !b.jaargang) { offs = [0, 2, 5]; label = 'Champagne (brut sans année)'; fromPurchase = true; }
    if (cat === 'mousserend' && !b.jaargang) fromPurchase = true;
    // prijs als kwaliteitsindicatie
    const prijs = parseFloat(b.prijs);
    let mod = '';
    if (prijs >= 45 && cat !== 'rose') { offs = [offs[0], offs[1] * 1.15, offs[2] * 1.25]; mod = ' · topcuvée, iets langer houdbaar'; }
    else if (prijs > 0 && prijs < 9) { offs = [offs[0] * 0.6, offs[1] * 0.7, offs[2] * 0.7]; mod = ' · instapwijn, liever jong drinken'; }
    let base;
    if (!fromPurchase && b.jaargang) base = `${b.jaargang}-10`; // oogst ~ oktober
    else base = b.aankoopDatum || today;
    const y = n => addMonths(base, n * 12);
    return {
      van: y(offs[0]), piek: y(offs[1]), tot: y(offs[2]),
      uitleg: `${label}: ${fromPurchase ? 'vanaf aankoop' : 'vanaf oogst ' + b.jaargang} ca. ${Math.round(offs[0])}–${Math.round(offs[2])} jaar, piek rond ${Math.round(offs[1])} jaar${mod}` +
        (!b.jaargang && !fromPurchase ? ' (geen jaargang ingevuld, gerekend vanaf aankoop)' : ''),
    };
  }

  /** Status ten opzichte van nu */
  function status(b, today = ymNow()) {
    const w = b.venster; if (!w || !w.van) return { key: 'none', label: '—' };
    const n = ymToIdx(today), v = ymToIdx(w.van), p = ymToIdx(w.piek), t = ymToIdx(w.tot);
    if (n > t) return { key: 'over', label: 'Over de top' };
    if (t - n <= 2) return { key: 'last', label: 'Laatste kans' };
    if (Math.abs(p - n) <= 1 || (p < n && n <= t)) return { key: 'peak', label: "Op z'n best" };
    if (n >= v) return { key: 'ready', label: 'Op dronk' };
    return { key: 'young', label: 'Te jong' };
  }

  /** Wat moet er komende maand op? (voor meldingen) */
  function tijdVoor(bottles, today = ymNow()) {
    const n = ymToIdx(today);
    const out = { piek: [], laatste: [], over: [] };
    for (const b of bottles) {
      if (b.deleted || !(b.aantal > 0) || !b.venster) continue;
      const p = ymToIdx(b.venster.piek), t = ymToIdx(b.venster.tot);
      if (n > t) out.over.push(b);
      else if (t - n <= 2) out.laatste.push(b);
      else if (p >= n && p <= n + 1) out.piek.push(b);
    }
    return out;
  }

  /* ---------- spijs & drank ---------- */
  const W = (re) => b => b.soort !== 'bier' && re.test(bottleText(b));
  const B = (re) => b => b.soort === 'bier' && re.test(bottleText(b));
  const R = (re) => b => b.soort !== 'bier' && (b.categorie || 'rood') === 'rood' && re.test(bottleText(b));
  const CAT = (c) => b => b.soort !== 'bier' && b.categorie === c;
  const BEER = b => b.soort === 'bier';

  const FULL_RED = /cabernet|bordeaux|pauillac|margaux|saint-julien|pomerol|[eé]milion|syrah|shiraz|malbec|nebbiolo|barolo|barbaresco|brunello|rioja|reserva|ribera|amarone|primitivo|zinfandel|aglianico|bolgheri|super ?tuscan|ch[aâ]teauneuf|hermitage|douro|priorat|cahors|tannat/;
  const LIGHT_RED = /pinot noir|bourgogne|gamay|beaujolais|valpolicella|dolcetto|barbera|sp[aä]tburgunder|etna|nerello|zweigelt|chianti|sangiovese/;

  const GERECHTEN = [
    { key: 'rund', naam: 'rundvlees', re: /biefstuk|steak|entrec[oô]te|rib-?eye|ribeye|rosbief|ossenhaas|tournedos|bistecca|tagliata|cote de boeuf|c[oô]te de b[oœ]uf|rund|beef|carpaccio|picanha|wagyu|chateaubriand/,
      prefs: [[R(FULL_RED), 6, 'stevige rode wijn met tannine voor rood vlees'], [CAT('rood'), 3, 'rode wijn bij rood vlees'], [B(/quadrupel|quad|dubbel|stout|porter|bruin/), 3, 'donker bier met moutige diepgang']] },
    { key: 'wild', naam: 'wild', re: /hert|\bree\b|reebout|reerug|everzwijn|wild|(?<![a-z])haas|hazenpeper|fazant|patrijs|parelhoen|cinghiale|venison|hertenbiefstuk/,
      prefs: [[R(/nebbiolo|barolo|barbaresco|pinot noir|bourgogne|gevrey|syrah|hermitage|c[oô]te-r[oô]tie|brunello|ch[aâ]teauneuf|amarone/), 7, 'aardse, rijpe rode wijn bij wild'], [CAT('rood'), 3, 'rode wijn bij wild'], [B(/oud bruin|quadrupel|quad|dubbel|flemish|rodenbach/), 4, 'zurig-donker bier bij wild']] },
    { key: 'lam', naam: 'lam', re: /(?<![a-z])lam\b|(?<![a-z])lams|agnello|\blamb\b/,
      prefs: [[R(/cabernet|bordeaux|pauillac|rioja|tempranillo|reserva|syrah|shiraz|ch[aâ]teauneuf|douro|malbec/), 6, 'klassieke partner voor lam'], [CAT('rood'), 3, 'rode wijn bij lam'], [B(/dubbel|bruin|saison/), 2, 'kruidig bier bij lam']] },
    { key: 'varken', naam: 'varkensvlees', re: /varken|spareribs|pulled pork|buikspek|porchetta|\bham\b|saucijs|worst|salsiccia|karbonade|schnitzel|pork|speklapjes|procureur/,
      prefs: [[W(/pinot noir|bourgogne|gamay|beaujolais|riesling|chenin|crianza|barbera|valpolicella|grenache|c[oô]tes du rh[oô]ne/), 5, 'fruitige wijn die varkensvlees niet overheerst'], [CAT('wit'), 2, 'volle witte wijn'], [B(/dubbel|saison|blond|tripel|bock/), 4, 'Belgisch bier bij varkensvlees']] },
    { key: 'kip', naam: 'gevogelte', re: /kip|kippen|kalkoen|pollo|chicken|poulet|haantje|parelhoen|kwartel/,
      prefs: [[W(/chardonnay|bourgogne|m[aâ]con|pinot noir|gamay|beaujolais|chianti|viognier|chenin|soave/), 5, 'zachte wijn bij gevogelte'], [CAT('wit'), 3, 'witte wijn bij gevogelte'], [R(LIGHT_RED), 2, 'lichte rode wijn'], [B(/tripel|blond|saison|witbier/), 4, 'blond Belgisch bier bij gevogelte']] },
    { key: 'eend', naam: 'eend', re: /eend|anatra|canard|duck|magret|confit/,
      prefs: [[R(/pinot noir|bourgogne|gevrey|nebbiolo|barbaresco|gew[uü]rz|ch[aâ]teauneuf/), 7, 'Pinot Noir of Nebbiolo: klassiek bij eend'], [CAT('rood'), 3, 'rode wijn bij eend'], [B(/kriek|framboise|oud bruin|rodenbach/), 5, 'kriek: kers bij eend']] },
    { key: 'vis', naam: 'witte vis', re: /kabeljauw|zeebaars|tong|schol|dorade|branzino|heilbot|tarbot|griet|snoekbaars|vis\b|vispan|pesce|fish|zeeduivel|skrei|forel/,
      prefs: [[W(/sauvignon|sancerre|albari[nñ]o|alvarinho|chablis|vermentino|verdicchio|gr[uü]ner|muscadet|soave|picpoul|vinho verde|riesling/), 6, 'frisse, mineralige witte wijn bij vis'], [CAT('wit'), 3, 'witte wijn bij vis'], [CAT('mousserend'), 2, 'bubbels bij vis'], [B(/witbier|wit|pils|saison|geuze/), 3, 'fris bier bij vis']] },
    { key: 'vetvis', naam: 'zalm/tonijn', re: /zalm|tonijn|makreel|salmon|tuna|haring|paling|forel/,
      prefs: [[W(/chardonnay|bourgogne|pinot noir|riesling|gr[uü]ner|ros[eé]/), 5, 'wijn met body voor vette vis'], [CAT('wit'), 3, 'witte wijn'], [CAT('rose'), 3, 'rosé bij zalm of tonijn'], [B(/saison|blond|witbier|geuze/), 3, 'fris bier bij vette vis']] },
    { key: 'schaal', naam: 'schaal- en schelpdieren', re: /garnal|kreeft|langoust|scampi|krab|coquille|sint-jakobs|oester|gamba|crevette|frutti di mare|zeevruchten|inktvis|calamar/,
      prefs: [[CAT('mousserend'), 6, 'bubbels zijn klassiek bij zeevruchten'], [W(/chablis|albari[nñ]o|sauvignon|muscadet|vermentino|riesling|picpoul/), 6, 'strakke witte wijn bij zeevruchten'], [CAT('wit'), 3, 'witte wijn'], [B(/witbier|wit|geuze|pils/), 3, 'fris bier bij zeevruchten']] },
    { key: 'mossel', naam: 'mosselen', re: /mossel|vongole|cozze|moules/,
      prefs: [[W(/muscadet|sauvignon|picpoul|albari[nñ]o|vermentino|verdicchio|gr[uü]ner/), 5, 'droge witte wijn bij mosselen'], [CAT('wit'), 3, 'witte wijn'], [B(/witbier|wit|blond|tripel|saison|geuze/), 5, 'Belgisch bier bij mosselen, een klassieker']] },
    { key: 'aziatisch', naam: 'Aziatisch', re: /sushi|sashimi|japans|ramen|dim sum|wok|chinees|teriyaki|gyoza|poke|vietnamees/,
      prefs: [[W(/riesling|gr[uü]ner|gew[uü]rz|champagne|albari[nñ]o/), 5, 'aromatische, frisse wijn bij Aziatisch'], [CAT('mousserend'), 3, 'bubbels'], [CAT('rose'), 2, 'rosé'], [B(/pils|lager|witbier|wit|ipa/), 3, 'fris bier bij Aziatisch']] },
    { key: 'pittig', naam: 'pittig', re: /curry|thai|chili|pittig|sambal|indiaas|indonesisch|rendang|mexicaans|taco|harissa|jalape|szechuan|sichuan|vindaloo|massaman|rijsttafel|kip tandoori|tandoori/,
      prefs: [[W(/riesling|gew[uü]rz|gr[uü]ner|ros[eé]|viognier/), 6, 'zachtzoete aromatische wijn dempt de pit'], [CAT('rose'), 3, 'rosé bij pittig eten'], [R(FULL_RED), -3, 'tannine + pit = bitter'], [B(/ipa|pale ale|witbier|wit|pils|lager|weizen/), 5, 'fris of hoppig bier bij pittig eten']] },
    { key: 'tomaat', naam: 'pasta/pizza met tomaat', re: /pizza|bolognese|arrabbiata|pomodoro|lasagne|lasagna|amatriciana|puttanesca|ragu|ragù|spaghetti|penne|rigatoni|parmigiana|marinara|caprese/,
      prefs: [[R(/chianti|sangiovese|barbera|montepulciano|primitivo|nero d'?avola|valpolicella|dolcetto|morellino|lambrusco/), 7, 'Italiaanse rode wijn met frisse zuren voor tomaat'], [CAT('rood'), 3, 'rode wijn'], [B(/pils|blond|lager|amber/), 2, 'fris bier bij pizza']] },
    { key: 'room', naam: 'romige pasta/risotto', re: /carbonara|alfredo|room|risotto|cacio e pepe|gnocchi|ravioli|tortellini|quiche|vol-au-vent|ragout/,
      prefs: [[W(/chardonnay|bourgogne|soave|verdicchio|fiano|lugana|chenin|viognier|champagne|franciacorta/), 6, 'volle witte wijn bij romige gerechten'], [CAT('wit'), 3, 'witte wijn'], [B(/blond|tripel|saison|witbier/), 3, 'blond bier bij romige gerechten']] },
    { key: 'paddenstoel', naam: 'paddenstoelen/truffel', re: /truffel|tartufo|paddenstoel|champignon|porcini|funghi|cantharel|eekhoorntjesbrood|shiitake/,
      prefs: [[R(/nebbiolo|barolo|barbaresco|pinot noir|bourgogne|gevrey|chambolle|volnay|brunello/), 7, 'aardse wijn bij paddenstoelen en truffel'], [W(/chardonnay|meursault/), 3, 'rijpe chardonnay'], [CAT('rood'), 2, 'rode wijn'], [B(/dubbel|oud bruin|bruin|quadrupel/), 3, 'donker bier met aardse tonen']] },
    { key: 'stoof', naam: 'stoofgerecht', re: /stoof|stoofpot|stoofvlees|hachee|osso ?buco|brasato|goulash|boeuf bourguignon|bourguignon|daube|stifado|peposo|carbonnade|sukade|klapstuk|draadjesvlees|rendang|chili con carne/,
      prefs: [[R(/syrah|shiraz|grenache|ch[aâ]teauneuf|c[oô]tes du rh[oô]ne|amarone|rioja|reserva|barolo|nebbiolo|malbec|bordeaux|bourgogne|primitivo|aglianico/), 6, 'krachtige rode wijn bij langzaam gegaard vlees'], [CAT('rood'), 3, 'rode wijn'], [B(/dubbel|quadrupel|quad|oud bruin|bruin|stout|porter|rodenbach/), 6, 'donker bier: stoofvlees en bier is een gouden combinatie']] },
    { key: 'bbq', naam: 'barbecue/grill', re: /bbq|barbecue|gegrild|grill|spareribs|pulled|brisket|hamburger|burger|smash/,
      prefs: [[R(/zinfandel|primitivo|malbec|shiraz|syrah|cabernet|carm[eé]n[eè]re|pinotage|tempranillo/), 6, 'rijpe, fruitige rode wijn bij de grill'], [CAT('rood'), 3, 'rode wijn'], [B(/ipa|pale ale|porter|stout|rauch|amber|bock/), 5, 'hoppig of geroosterd bier bij BBQ']] },
    { key: 'kaas_hard', naam: 'harde/oude kaas', re: /oude kaas|belegen|parmezaan|parmigiano|pecorino|comt[eé]|gruy[eè]re|manchego|grana|kaasplank|(?<![a-z])kaas\b/,
      prefs: [[W(/nebbiolo|barolo|brunello|amarone|rioja|reserva|port|bordeaux|ch[aâ]teauneuf/), 5, 'krachtige wijn bij gerijpte kaas'], [CAT('dessert'), 3, 'port of dessertwijn'], [CAT('rood'), 2, 'rode wijn'], [B(/quadrupel|quad|tripel|barley|dubbel|old ale/), 5, 'zwaar Belgisch bier bij oude kaas, vaak nog beter dan wijn']] },
    { key: 'kaas_blauw', naam: 'blauwe kaas', re: /gorgonzola|roquefort|stilton|blauwe kaas|bleu|dolcelatte|cashel/,
      prefs: [[W(/sauternes|barsac|tokaj|port|porto|recioto|passito|eiswein|auslese/), 8, 'zoet + zout: dessertwijn bij blauwe kaas'], [CAT('dessert'), 5, 'dessertwijn'], [B(/barley|imperial stout|quadrupel|quad|old ale/), 5, 'zwaar bier bij blauwe kaas']] },
    { key: 'kaas_zacht', naam: 'zachte kaas/geitenkaas', re: /brie|camembert|geitenkaas|ch[eè]vre|burrata|mozzarella|taleggio|reblochon/,
      prefs: [[W(/sauvignon|sancerre|chardonnay|champagne|chenin|bourgogne/), 5, 'frisse wijn bij zachte kaas'], [CAT('mousserend'), 3, 'bubbels'], [CAT('wit'), 2, 'witte wijn'], [B(/geuze|witbier|tripel|saison/), 4, 'zurig of fris bier bij zachte kaas']] },
    { key: 'groente', naam: 'groente/salade', re: /salade|groente|asperge|vegetarisch|vega|courgette|aubergine|pompoen|tomatensalade|insalata|risotto verde/,
      prefs: [[W(/sauvignon|gr[uü]ner|vermentino|albari[nñ]o|verdicchio|ros[eé]|riesling/), 5, 'frisse wijn bij groenten'], [CAT('rose'), 3, 'rosé'], [CAT('wit'), 3, 'witte wijn'], [B(/witbier|wit|saison|pils/), 3, 'licht bier bij groenten']] },
    { key: 'choco', naam: 'chocolade', re: /chocola|brownie|fondant|mousse au chocolat|cacao|tiramisu/,
      prefs: [[W(/port|porto|banyuls|maury|recioto|pedro xim[eé]nez|px/), 7, 'zoete versterkte wijn bij chocolade'], [CAT('dessert'), 4, 'dessertwijn'], [W(/amarone/), 2, 'amarone'], [B(/imperial stout|stout|porter|kriek|quadrupel|barley/), 6, 'imperial stout en chocolade: hemels']] },
    { key: 'dessert', naam: 'fruitdessert', re: /taart|(?<![a-z])appel|crumble|panna cotta|cr[eè]me br[uû]l[eé]e|dessert|ijs\b|sorbet|aardbei|citroen|tarte|cheesecake|zabaione/,
      prefs: [[W(/sauternes|barsac|tokaj|moscato|muscat|auslese|eiswein|vin santo|passito/), 7, 'zoete wijn bij dessert (wijn zoeter dan het toetje)'], [CAT('dessert'), 4, 'dessertwijn'], [B(/kriek|framboise|fruit|tripel/), 5, 'fruitbier bij dessert']] },
    { key: 'borrel', naam: 'borrel/aperitief', re: /borrel|aperitief|aperitivo|hapjes|tapas|antipasti|bitterbal|chips|nootjes|olijven|charcuterie|vleeswaren|salami|prosciutto|jamon|jamón|friet|frites|patat/,
      prefs: [[CAT('mousserend'), 6, 'bubbels openen de avond'], [CAT('rose'), 3, 'rosé bij hapjes'], [CAT('wit'), 3, 'frisse witte wijn'], [R(LIGHT_RED), 2, 'lichte rode wijn bij charcuterie'], [B(/pils|blond|geuze|ipa|pale ale|witbier|saison/), 4, 'een fris biertje bij de borrel']] },
  ];

  function herken(gerecht) {
    const t = (' ' + (gerecht || '').toLowerCase() + ' ');
    return GERECHTEN.filter(g => g.re.test(t));
  }

  /** Beste flessen uit de kast voor dit gerecht. */
  function koppel(gerecht, bottles, opts = {}) {
    const today = opts.today || ymNow();
    const feats = herken(gerecht);
    const filter = opts.filter || 'alles';
    const pool = bottles.filter(b => !b.deleted && b.aantal > 0 && (filter === 'alles' || (filter === 'bier' ? b.soort === 'bier' : b.soort !== 'bier')));
    const res = pool.map(b => {
      let score = 0; const why = [];
      for (const f of feats) {
        let best = null;
        for (const [m, pts, txt] of f.prefs) {
          if (!m(b)) continue;
          if (pts < 0) { score += pts; why.push({ neg: true, txt, f: f.naam }); }
          else if (!best || pts > best[0]) best = [pts, txt];
        }
        if (best) { score += best[0]; why.push({ txt: best[1], f: f.naam }); }
      }
      const st = status(b, today);
      const rb = { peak: 3, last: 3.5, ready: 1.5, over: 1, young: -4, none: 0 }[st.key];
      score += rb;
      if (b.vivinoScore) score += (parseFloat(b.vivinoScore) - 3.8) * 1.5;
      return { b, score, why, st };
    });
    res.sort((a, b) => b.score - a.score);
    return { feats, results: feats.length ? res.filter(r => r.why.some(w => !w.neg)).slice(0, 5) : res.slice(0, 3) };
  }

  const api = { ymNow, ymToIdx, idxToYm, addMonths, fmtYm, meseIt, schatVenster, status, tijdVoor, koppel, herken, bottleText };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RobertoLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
