/* Kalite Kapı • Kapı koleksiyonu ve renk önizlemesi
   Referans düzenek: kapı kartına tıkla -> ürün modalı -> renk/kaplama seç -> SVG ile yüzeyi önizle.
   Veriler: assets/koleksiyon/products.js ve surfaces.js (yerel). */
(function () {
  'use strict';

  var products = window.KK_PRODUCTS || [];
  var surfaces = window.KK_SURFACES || {};
  if (!products.length) return;

  var SERIES = [
    { key: 'premium',  name: 'Lake Kabartma', sample: 'premium-010', text: 'Klasik panellerden zarif çerçevelere; Lake Kabartma serisinin detaylarını keşfedin.' },
    { key: 'lake',     name: 'Lake',           sample: 'lake-001',    text: 'Farklı çizgi ve renklerle Lake koleksiyonunu keşfedin. Mekânınız için düşündüğünüz detayları birlikte değerlendirelim.' },
    { key: 'pvc',      name: 'PVC',            sample: 'pvc-009',     text: 'Ahşap desenlerinden sade yüzeylere; PVC serisindeki farklı tasarımları keşfedin.' },
    { key: 'melamin',  name: 'Melamin',        sample: 'melamin-008', text: 'Melamin koleksiyonundaki çizgileri inceleyin, yaşam alanınız için beğendiğiniz görünümü bizimle paylaşın.' },
    { key: 'amerikan', name: 'Amerikan Panel', sample: 'amerikan-002', text: 'Amerikan serisindeki panel ve camlı görünümleri keşfedin. Seçtiğiniz modelin seçeneklerini birlikte konuşalım.' }
  ];

  var FINISHES = [
    { id: 'ral1013', name: 'RAL 1013 · İnci Beyazı', color: '#E9E5CE' },
    { id: 'ral7035', name: 'RAL 7035 · Açık Gri', color: '#CBD0CC' },
    { id: 'ral7044', name: 'RAL 7044 · İpek Gri', color: '#CAC4B0' },
    { id: 'ral6021', name: 'RAL 6021 · Pastel Yeşil', color: '#89A78B' },
    { id: 'ral9001', name: 'RAL 9001 · Krem', color: '#E9E0D2' },
    { id: 'white', name: 'Beyaz', color: '#EEEAE3' },
    { id: 'ivory', name: 'Kırık Beyaz', color: '#DDD5C3' },
    { id: 'sand', name: 'Kum Beji', color: '#B9AA8E' },
    { id: 'mink', name: 'Vizon', color: '#958A7B' },
    { id: 'grey', name: 'Açık Gri', color: '#AFB2B0' },
    { id: 'anthracite', name: 'Antrasit', color: '#45494A' },
    { id: 'sage', name: 'Adaçayı', color: '#8A9B8B' },
    { id: 'olive', name: 'Zeytin', color: '#7C8068' },
    { id: 'blue', name: 'Duman Mavisi', color: '#788B9C' },
    { id: 'plum', name: 'Mürdüm', color: '#70627E' },
    { id: 'walnut', name: 'Ceviz', color: '#8B6143', wood: true, grain: '#352115', seed: 2 },
    { id: 'bamboo', name: 'Bambu', color: '#C7A36A', wood: true, grain: '#806036', seed: 4 },
    { id: 'oak', name: 'Meşe', color: '#B89A70', wood: true, grain: '#665036', seed: 8 },
    { id: 'mahogany', name: 'Maun', color: '#90543D', wood: true, grain: '#44231E', seed: 11 },
    { id: 'birch', name: 'Huş', color: '#DCC8A2', wood: true, grain: '#A18C65', seed: 16 }
  ];

  var PAGE_SIZE = 12;
  var WHATSAPP = 'https://wa.me/mesutuzunoglu';

  var grid = document.getElementById('kk-grid');
  var dialog = document.getElementById('kk-dialog');
  if (!grid || !dialog) return;

  var search = document.getElementById('kk-search');
  var resultCount = document.getElementById('kk-result-count');
  var empty = document.getElementById('kk-empty');
  var pagination = document.getElementById('kk-pagination');
  var visual = dialog.querySelector('.kk-visual');
  var productImage = document.getElementById('kk-image');
  var originalLink = document.getElementById('kk-original-image');
  var stage = document.getElementById('kk-stage');
  var copy = dialog.querySelector('.kk-copy');

  var currentFilter = 'all';
  var currentPage = 1;
  var activeProduct = null;
  var selectedFinish = null;
  var baseMessage = '';
  var previousFocus = null;

  var NS = 'http://www.w3.org/2000/svg';
  function svgNode(name, attrs) {
    var el = document.createElementNS(NS, name);
    Object.keys(attrs || {}).forEach(function (key) { el.setAttribute(key, String(attrs[key])); });
    return el;
  }
  function normalize(value) {
    return String(value).toLocaleLowerCase('tr-TR').normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i');
  }
  function seriesInfo(product) {
    return SERIES.find(function (s) { return s.key === product.category; }) || { name: product.label, text: '' };
  }
  function messageFor(product) {
    return 'Merhaba, ' + product.label + ' serisindeki ' + product.number +
      ' numaralı görsel hakkında bilgi almak istiyorum.\nGörsel referansı: ' + product.ref +
      '\n\nİsim:\nÖlçü / proje bilgisi:';
  }
  function waLink(product, finish) {
    var text = messageFor(product);
    if (finish) {
      text += '\nTercih edilen önizleme: ' + finish.name +
        (finish.wood ? ' (ahşap kaplama görünümü)' : '') +
        '\nBu seçeneğin üretim uygunluğu hakkında bilgi rica ederim.';
    }
    return WHATSAPP + '?text=' + encodeURIComponent(text);
  }

  /* ---------- Renk önizlemesi (orijinal görsel değiştirilmez; üstüne SVG maskeli katman) ---------- */
  function grainPattern(finish) {
    var pattern = svgNode('pattern', { id: 'kk-grain', width: 240, height: 1000, patternUnits: 'userSpaceOnUse' });
    var seed = finish.seed;
    function rand() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    for (var i = 0; i < 100; i++) {
      var x = rand() * 240;
      var amp = finish.id === 'bamboo' ? 1 : 3 + rand() * 9;
      var d = 'M ' + x.toFixed(2) + ' -20';
      for (var y = 0; y <= 1040; y += 40) {
        var shift = Math.sin(y / (90 + finish.seed * 5) + i) * amp + Math.sin(y / 200 + i * .6) * amp * .5;
        d += ' L ' + (x + shift).toFixed(2) + ' ' + y;
      }
      pattern.appendChild(svgNode('path', {
        d: d, fill: 'none', stroke: finish.grain,
        'stroke-width': (.35 + rand() * 1.3).toFixed(2), opacity: (.12 + rand() * .25).toFixed(2)
      }));
    }
    if (finish.id === 'bamboo') {
      for (var bx = 25; bx < 240; bx += 45) {
        pattern.appendChild(svgNode('path', {
          d: 'M' + bx + ' 0V1000 M' + bx + ' ' + (160 + bx) + 'h42 M' + bx + ' ' + (660 - bx) + 'h42',
          stroke: finish.grain, 'stroke-width': 1, opacity: .23
        }));
      }
    } else {
      for (var j = 0; j < 3; j++) {
        var cx = 35 + j * 74, cy = 160 + j * 310;
        for (var k = 1; k < 8; k++) {
          pattern.appendChild(svgNode('ellipse', {
            cx: cx, cy: cy, rx: k * 2.5, ry: k * 17, fill: 'none', stroke: finish.grain,
            'stroke-width': .65, opacity: finish.id === 'birch' ? .07 : .14
          }));
        }
      }
    }
    return pattern;
  }
  function drawFinish(finish) {
    if (!activeProduct) return;
    var s = surfaces[activeProduct.id] || { width: 1000, height: 1500, baseLight: .75 };
    var svg = svgNode('svg', {
      viewBox: '0 0 ' + s.width + ' ' + s.height, role: 'img',
      'aria-label': activeProduct.label + ', ' + finish.name + ' renk önizlemesi'
    });
    var group = svgNode('g', { transform: 'scale(' + (s.width / 1000) + ' ' + (s.height / 1000) + ')' });
    svg.appendChild(group);
    var defs = svgNode('defs');
    group.appendChild(defs);

    var mask = svgNode('mask', { id: 'kk-surface', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1000, height: 1000 });
    mask.appendChild(svgNode('image', { href: activeProduct.mask, width: 1000, height: 1000, preserveAspectRatio: 'none' }));
    defs.appendChild(mask);

    var filter = svgNode('filter', { id: 'kk-tone', x: 0, y: 0, width: 1, height: 1, 'color-interpolation-filters': 'sRGB' });
    filter.appendChild(svgNode('feColorMatrix', {
      type: 'matrix',
      values: '.2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0'
    }));
    var transfer = svgNode('feComponentTransfer');
    var channels = finish.color.match(/[0-9a-f]{2}/gi).map(function (v) { return parseInt(v, 16) / 255; });
    var base = Math.max(.12, Math.min(.94, s.baseLight || .75));
    channels.forEach(function (target, index) {
      var values = [];
      for (var i = 0; i < 33; i++) {
        var lum = i / 32;
        var mapped = lum <= base
          ? target * Math.pow(lum / base, .82)
          : target + (1 - target) * (lum - base) / (1 - base) * .7;
        values.push(mapped.toFixed(4));
      }
      transfer.appendChild(svgNode(['feFuncR', 'feFuncG', 'feFuncB'][index], { type: 'table', tableValues: values.join(' ') }));
    });
    filter.appendChild(transfer);
    defs.appendChild(filter);

    group.appendChild(svgNode('image', { href: activeProduct.image, width: 1000, height: 1000, preserveAspectRatio: 'none' }));
    var recolored = svgNode('g', { mask: 'url(#kk-surface)' });
    recolored.appendChild(svgNode('image', {
      href: activeProduct.image, width: 1000, height: 1000, preserveAspectRatio: 'none', filter: 'url(#kk-tone)'
    }));
    if (finish.wood) {
      defs.appendChild(grainPattern(finish));
      recolored.appendChild(svgNode('rect', { width: 1000, height: 1000, fill: 'url(#kk-grain)' }));
    }
    group.appendChild(recolored);
    stage.replaceChildren(svg);
  }
  function selectFinish(finish) {
    selectedFinish = finish;
    productImage.hidden = !!finish;
    stage.hidden = !finish;
    document.getElementById('kk-selected-name').textContent = finish
      ? finish.name + (finish.wood ? ' · Ahşap görünümü' : '')
      : 'Orijinal görsel';
    var status = document.getElementById('kk-selected');
    status.style.setProperty('--selected-finish', finish ? finish.color : 'linear-gradient(135deg,#e7dfd0,#a99b80)');
    document.getElementById('kk-original').setAttribute('aria-pressed', String(!finish));
    document.querySelectorAll('.kk-swatch').forEach(function (button) {
      button.setAttribute('aria-pressed', String(!!finish && button.dataset.finish === finish.id));
    });
    if (finish) drawFinish(finish);
    document.getElementById('kk-whatsapp').href = waLink(activeProduct, finish);
  }

  /* ---------- Renk panelini modal içine bir kez kur ---------- */
  (function buildFinishPanel() {
    var panel = document.createElement('section');
    panel.className = 'kk-finish';
    panel.setAttribute('aria-label', 'Kapı renk ve kaplama önizlemesi');
    panel.innerHTML =
      '<div class="kk-finish-head"><h3><span class="kk-finish-kicker">SİZİN KAPINIZ, SİZİN TARZINIZ</span>Renginizi keşfedin.</h3>' +
      '<button type="button" class="kk-original" id="kk-original" aria-pressed="true">Orijinale dön ↺</button></div>' +
      '<p class="kk-selected" id="kk-selected" aria-live="polite">Seçim: <strong id="kk-selected-name">Orijinal görsel</strong></p>' +
      '<fieldset><legend>Düz renkler · 15 seçenek</legend><div class="kk-swatches" id="kk-solids"></div></fieldset>' +
      '<fieldset><legend>Ahşabın dokusu · 5 seçenek</legend><div class="kk-swatches" id="kk-woods"></div></fieldset>' +
      '<p class="kk-disclaimer">Renk ve ahşap dokuları temsili önizlemedir. Ekran, mevcut yüzey ve modele göre görünüm değişebilir; üretim seçeneklerini bizimle teyit edin.</p>';
    copy.insertBefore(panel, document.getElementById('kk-specs'));

    FINISHES.forEach(function (finish) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'kk-swatch';
      button.dataset.finish = finish.id;
      button.title = finish.name;
      button.setAttribute('aria-label', finish.name + (finish.wood ? ' ahşap kaplama' : ' renk'));
      button.setAttribute('aria-pressed', 'false');
      var chip = document.createElement('span');
      chip.className = 'kk-chip' + (finish.wood ? ' wood' : '');
      chip.style.setProperty('--chip', finish.color);
      chip.style.setProperty('--grain', finish.grain || finish.color);
      var label = document.createElement('span');
      label.textContent = finish.name;
      button.appendChild(chip);
      button.appendChild(label);
      button.addEventListener('click', function () { selectFinish(finish); });
      panel.querySelector(finish.wood ? '#kk-woods' : '#kk-solids').appendChild(button);
    });
    panel.querySelector('#kk-original').addEventListener('click', function () { selectFinish(null); });
  })();

  /* ---------- liste, filtre, arama, sayfalama ---------- */
  function matchingProducts() {
    var term = normalize(search.value.trim());
    var list = products.filter(function (product) {
      if (currentFilter !== 'all' && product.category !== currentFilter) return false;
      return !term || normalize(product.label + ' görsel ' + product.number + ' ' + product.id + ' ' + product.ref).includes(term);
    });
    return currentFilter === 'all'
      ? list.sort(function (a, b) { return Number(a.number) - Number(b.number); })
      : list;
  }
  function renderSeries() {
    var container = document.getElementById('kk-series');
    if (!container) return;
    SERIES.forEach(function (item) {
      var product = products.find(function (p) { return p.id === item.sample; }) || products[0];
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'kk-series-card';
      card.innerHTML = '<img alt="" loading="lazy"><strong></strong><small></small><span class="kk-series-arrow" aria-hidden="true">↗</span>';
      card.querySelector('img').src = product.image;
      card.querySelector('strong').textContent = item.name;
      card.querySelector('small').textContent = products.filter(function (p) { return p.category === item.key; }).length + ' görsel';
      card.addEventListener('click', function () {
        search.value = '';
        setFilter(item.key);
        document.getElementById('Koleksiyon').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      container.appendChild(card);
    });
  }
  function renderPagination(pageCount) {
    pagination.replaceChildren();
    pagination.hidden = pageCount <= 1;
    if (pageCount <= 1) return;
    function pageButton(label, page, disabled, current) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = disabled;
      button.setAttribute('aria-label', typeof label === 'number' ? label + '. sayfa' : (label === '←' ? 'Önceki sayfa' : 'Sonraki sayfa'));
      if (current) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', function () {
        currentPage = page;
        render();
        document.getElementById('Koleksiyon').scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      pagination.appendChild(button);
    }
    pageButton('←', currentPage - 1, currentPage === 1, false);
    for (var i = 1; i <= pageCount; i++) pageButton(i, i, false, i === currentPage);
    pageButton('→', currentPage + 1, currentPage === pageCount, false);
  }
  function render() {
    var visible = matchingProducts();
    var pageCount = Math.ceil(visible.length / PAGE_SIZE) || 1;
    currentPage = Math.max(1, Math.min(currentPage, pageCount));
    grid.replaceChildren();

    visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE).forEach(function (product) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'kk-card';
      card.setAttribute('aria-label', product.label + ', görsel ' + product.number + ': incele');
      var photo = document.createElement('div');
      photo.className = 'kk-card-photo';
      var img = document.createElement('img');
      img.src = product.image;
      img.alt = product.label + ' kapı, görsel ' + product.number;
      img.loading = 'lazy';
      img.decoding = 'async';
      var number = document.createElement('span');
      number.className = 'kk-number';
      number.textContent = product.number;
      var arrow = document.createElement('span');
      arrow.className = 'kk-arrow';
      arrow.textContent = '↗';
      arrow.setAttribute('aria-hidden', 'true');
      photo.append(img, number, arrow);
      var meta = document.createElement('div');
      meta.className = 'kk-meta';
      var title = document.createElement('strong');
      title.textContent = product.label;
      var subtitle = document.createElement('small');
      subtitle.textContent = 'Görsel ' + product.number;
      meta.append(title, subtitle);
      card.append(photo, meta);
      card.addEventListener('click', function () { openProduct(product, card); });
      grid.appendChild(card);
    });

    resultCount.textContent = visible.length
      ? visible.length + ' görsel · ' + ((currentPage - 1) * PAGE_SIZE + 1) + '–' + Math.min(currentPage * PAGE_SIZE, visible.length) + ' arası gösteriliyor'
      : '0 görsel';
    empty.hidden = visible.length !== 0;
    renderPagination(pageCount);
  }
  function setFilter(filter) {
    currentFilter = filter;
    currentPage = 1;
    document.querySelectorAll('.kk-filter').forEach(function (button) {
      var active = button.dataset.filter === filter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    render();
  }

  /* ---------- ürün modalı ---------- */
  function updateDetail(product) {
    activeProduct = product;
    visual.classList.remove('zoomed');
    var zoom = document.getElementById('kk-zoom');
    zoom.textContent = 'Yakınlaştır +';
    zoom.setAttribute('aria-pressed', 'false');
    document.getElementById('kk-image').src = product.image;
    document.getElementById('kk-image').alt = product.label + ' kapı, görsel ' + product.number;
    originalLink.href = product.image;
    document.getElementById('kk-title').textContent = product.label;
    document.getElementById('kk-index').textContent = 'Görsel ' + product.number;
    document.getElementById('kk-description').textContent = seriesInfo(product).text;
    document.getElementById('kk-category').textContent = product.label;
    document.getElementById('kk-ref').textContent = product.ref;
    baseMessage = waLink(product, null);
    document.getElementById('kk-whatsapp').href = baseMessage;

    var visible = matchingProducts();
    var index = visible.findIndex(function (p) { return p.id === product.id; });
    document.getElementById('kk-prev').disabled = index <= 0;
    document.getElementById('kk-next').disabled = index >= visible.length - 1;
    selectFinish(null);
  }
  function openProduct(product, card) {
    previousFocus = card || document.activeElement;
    updateDetail(product);
    dialog.showModal();
    document.body.classList.add('kk-modal-open');
  }
  function navigate(direction) {
    var visible = matchingProducts();
    var index = visible.findIndex(function (p) { return p.id === activeProduct.id; });
    if (visible[index + direction]) updateDetail(visible[index + direction]);
  }

  /* ---------- olaylar ---------- */
  renderSeries();
  document.querySelectorAll('.kk-filter').forEach(function (button) {
    button.addEventListener('click', function () { setFilter(button.dataset.filter); });
  });
  search.addEventListener('input', function () { currentPage = 1; render(); });
  document.getElementById('kk-clear').addEventListener('click', function () { search.value = ''; setFilter('all'); search.focus(); });
  document.querySelector('.kk-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', function () {
    document.body.classList.remove('kk-modal-open');
    if (previousFocus) previousFocus.focus({ preventScroll: true });
  });
  document.getElementById('kk-zoom').addEventListener('click', function (event) {
    var zoomed = visual.classList.toggle('zoomed');
    event.currentTarget.setAttribute('aria-pressed', String(zoomed));
    event.currentTarget.textContent = zoomed ? 'Uzaklaştır −' : 'Yakınlaştır +';
  });
  document.getElementById('kk-prev').addEventListener('click', function () { navigate(-1); });
  document.getElementById('kk-next').addEventListener('click', function () { navigate(1); });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') { event.preventDefault(); navigate(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); navigate(1); }
  });

  // Filtre sayılarını veriden üret (HTML'de sabit yazmak gerekmesin).
  document.querySelectorAll('.kk-filter').forEach(function (button) {
    var filter = button.dataset.filter;
    var count = filter === 'all' ? products.length : products.filter(function (p) { return p.category === filter; }).length;
    button.querySelector('span').textContent = count;
  });

  var requested = new URLSearchParams(location.search).get('seri');
  if (SERIES.some(function (item) { return item.key === requested; })) setFilter(requested);
  else render();
})();
