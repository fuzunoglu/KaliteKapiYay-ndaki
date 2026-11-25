(function () {
            var form = document.getElementById('teklifForm');
            if (!form) return;
            form.addEventListener('submit', function (e) {
                e.preventDefault();
                var ad = form.adSoyad.value.trim();
                var konum = form.konum.value.trim();
                var mesaj = form.mesaj.value.trim();
                if (!ad || !konum || !mesaj) return;
                var text = 'Merhaba, ben ' + ad + '.\n' + konum + ' bölgesindeyim.\nİstek: ' + mesaj;
                window.open('https://wa.me/mesutuzunoglu?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
            });
        })();

// Lightbox ayarları
        lightbox.option({
            'resizeDuration': 200,
            'wrapAround': true,
            'albumLabel': "Görsel %1 / %2",
            'fadeDuration': 200,
            'imageFadeDuration': 200,
            'positionFromTop': 50,
            'disableScrolling': true
            
        });

        // Haritaları sadece kullanıcı yaklaştığında yükle (ilk açılışı hızlandırır)
        (function () {
            var frames = [].slice.call(document.querySelectorAll('iframe[data-src]'));
            if (!frames.length) return;
            function loadMap(frame) {
                var src = frame.getAttribute('data-src');
                if (!src) return;
                frame.src = src;
                frame.removeAttribute('data-src');
            }
            function checkMap() {
                frames.forEach(function (frame) {
                    if (!frame.hasAttribute('data-src')) return;
                    if (frame.getBoundingClientRect().top < window.innerHeight + 300) loadMap(frame);
                });
                if (frames.every(function (frame) { return !frame.hasAttribute('data-src'); })) {
                    window.removeEventListener('scroll', checkMap);
                    window.removeEventListener('resize', checkMap);
                }
            }
            window.addEventListener('scroll', checkMap, { passive: true });
            window.addEventListener('resize', checkMap);
            checkMap();
        })();

// Menü butonu - tüm ekran boyutlarında çalışan sade toggle
        (function () {
            var trigger = document.querySelector('.menu-trigger');
            if (!trigger) return;
            if (window.jQuery) jQuery(trigger).off('click');
            function setActive(state) {
                trigger.classList.toggle('active', state);
                trigger.setAttribute('aria-expanded', state ? 'true' : 'false');
            }
            function closeMenus() {
                document.body.classList.remove('menu-open', 'menu-collapsed');
                setActive(false);
            }
            trigger.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var desktop = window.innerWidth > 991;
                if (desktop) {
                    var collapsed = !document.body.classList.contains('menu-collapsed');
                    document.body.classList.remove('menu-open');
                    document.body.classList.toggle('menu-collapsed', collapsed);
                    setActive(collapsed);
                } else {
                    var open = !document.body.classList.contains('menu-open');
                    document.body.classList.remove('menu-collapsed');
                    document.body.classList.toggle('menu-open', open);
                    setActive(open);
                }
            });
            [].forEach.call(document.querySelectorAll('.header-area .main-nav .nav a'), function (a) {
                a.addEventListener('click', function () {
                    if (window.innerWidth <= 991) closeMenus();
                });
            });
            document.addEventListener('click', function (e) {
                if (window.innerWidth <= 991 && !e.target.closest('.header-area .main-nav')) closeMenus();
            });
            window.addEventListener('resize', function () {
                if (window.innerWidth > 991) document.body.classList.remove('menu-open');
                else document.body.classList.remove('menu-collapsed');
                if (window.innerWidth > 991 && !document.body.classList.contains('menu-collapsed')) setActive(false);
            });
            setActive(false);
        })();

        $(document).ready(function(){
            // Carousel kodlarını buraya ekleyin
            // Lake kapı yon tusları islevi
            var owlLake = $('#Lake .owl-men-item');
            
            owlLake.trigger('destroy.owl.carousel'); // <-- BU SATIRI EKLEYİN
            
            owlLake.owlCarousel({
                items: 3,
                loop: true,
                margin: 10,
                nav: false,
                dots: false,
                responsive: {
                    0: {
                        items: 3
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 3
                    }
                }
            });
            $('#Lake .ileri_tus').click(function() {
                owlLake.trigger('next.owl.carousel');
            });
            $('#Lake .geri_tus').click(function() {
                owlLake.trigger('prev.owl.carousel');
            });

            // PVC yon tusları islevi
            var owlPVC = $('#PVC .owl-women-item');
            
            owlPVC.trigger('destroy.owl.carousel'); // <-- BU SATIRI EKLEYİN

            owlPVC.owlCarousel({
                items: 3,
                loop: true,
                margin: 10,
                nav: false,
                dots: false,
                responsive: {
                    0: {
                        items: 3
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 3
                    }
                }
            });
            $('#PVC .ileri_tus').click(function() {
                owlPVC.trigger('next.owl.carousel');
            });
            $('#PVC .geri_tus').click(function() {
                owlPVC.trigger('prev.owl.carousel');
            });

            // Celik yon tuslari islevi
            var owlCelik = $('#Celik .owl-celik-item');
            owlCelik.owlCarousel({
                items: 3,
                loop: true,
                margin: 10,
                nav: false,
                dots: false
            });
            $('#Celik .ileri_tus').click(function() {
                owlCelik.trigger('next.owl.carousel');
            });
            $('#Celik .geri_tus').click(function() {
                owlCelik.trigger('prev.owl.carousel');
            });

            // Mutfak yon tuslari islevi
            var owlMutfak = $('#Mutfak .owl-mutfak-item');
            owlMutfak.owlCarousel({
                items: 3,
                loop: true,
                margin: 10,
                nav: false,
                dots: false
            });
            $('#Mutfak .ileri_tus').click(function() {
                owlMutfak.trigger('next.owl.carousel');
            });
            $('#Mutfak .geri_tus').click(function() {
                owlMutfak.trigger('prev.owl.carousel');
            });

            // TeslimEttiklerimiz yon tuslari islevi
            var owlTeslim = $('#TeslimEttiklerimiz .owl-teslim-item');
            owlTeslim.owlCarousel({
                items: 3,
                loop: true,
                margin: 10,
                nav: false,
                dots: false
            });
            $('#TeslimEttiklerimiz .ileri_tus').click(function() {
                owlTeslim.trigger('next.owl.carousel');
            });
            $('#TeslimEttiklerimiz .geri_tus').click(function() {
                owlTeslim.trigger('prev.owl.carousel');
            });
        });

/* Sayfa bazlı aktif menü işareti */
(function () {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.header-area .main-nav .nav a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').split('/').pop().split('?')[0].split('#')[0];
        if (href === path) {
            a.classList.add('active');
            if (a.parentElement) a.parentElement.classList.add('active');
        }
    });
})();
