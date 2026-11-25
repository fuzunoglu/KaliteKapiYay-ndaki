(function () {
    'use strict';

    var products = window.KAPI_CELIK_URUNLER || [];
    var grid = document.getElementById('celik-grid');
    var filters = document.getElementById('celik-filters');
    var count = document.getElementById('celik-count');
    var dialog = document.getElementById('celik-dialog');
    if (!grid || !dialog) return;

    var currentFilter = 'all';
    var visible = [];
    var activeIndex = 0;

    function esc(value) {
        return String(value).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function waLink(product) {
        var text = 'Merhaba, ' + product.title + ' (' + product.series + ') hakkında bilgi almak istiyorum.';
        return 'https://wa.me/mesutuzunoglu?text=' + encodeURIComponent(text);
    }

    function render() {
        visible = products.filter(function (p) {
            return currentFilter === 'all' || p.series === currentFilter;
        });
        count.textContent = visible.length + ' model listeleniyor';
        grid.innerHTML = visible.map(function (product, index) {
            return '<button type="button" class="celik-card" data-index="' + index + '">' +
                '<img src="' + esc(product.image) + '" alt="' + esc(product.title) + '" loading="lazy" decoding="async">' +
                '<span class="celik-card-body"><strong>' + esc(product.title) + '</strong>' +
                '<span>' + esc(product.series) + ' · Katalog s. ' + product.page + '</span></span>' +
                '</button>';
        }).join('');
    }

    function show(index) {
        if (!visible.length) return;
        activeIndex = (index + visible.length) % visible.length;
        var p = visible[activeIndex];
        document.getElementById('celik-dialog-image').src = p.image;
        document.getElementById('celik-dialog-image').alt = p.title;
        document.getElementById('celik-dialog-title').textContent = p.title;
        document.getElementById('celik-dialog-series').textContent = p.series + ' · Katalog sayfası ' + p.page;
        document.getElementById('celik-dialog-whatsapp').href = waLink(p);
        if (!dialog.open) dialog.showModal();
    }

    grid.addEventListener('click', function (e) {
        var card = e.target.closest('.celik-card');
        if (card) show(parseInt(card.dataset.index, 10));
    });

    if (filters) {
        filters.addEventListener('click', function (e) {
            var btn = e.target.closest('.celik-filter');
            if (!btn) return;
            currentFilter = btn.dataset.filter;
            filters.querySelectorAll('.celik-filter').forEach(function (b) {
                var active = b === btn;
                b.classList.toggle('active', active);
                b.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
            render();
        });
    }

    document.getElementById('celik-prev').addEventListener('click', function () { show(activeIndex - 1); });
    document.getElementById('celik-next').addEventListener('click', function () { show(activeIndex + 1); });
    document.getElementById('celik-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) {
        if (e.target === dialog) dialog.close();
    });
    document.addEventListener('keydown', function (e) {
        if (!dialog.open) return;
        if (e.key === 'ArrowLeft') show(activeIndex - 1);
        if (e.key === 'ArrowRight') show(activeIndex + 1);
    });

    render();
})();
