(function ($) {
	
	"use strict";
	$('.owl-men-item').owlCarousel({
		items:5,
		loop:true,
		dots: true,
		nav: true,
		margin:30,
		  responsive:{
			  0:{
				  items:1
			  },
			  600:{
				  items:2
			  },
			  1000:{
				  items:3
			  }
		 }
	})

	$('.owl-women-item').owlCarousel({
		items:5,
		loop:true,
		dots: true,
		nav: true,
		margin:30,
		  responsive:{
			  0:{
				  items:1
			  },
			  600:{
				  items:2
			  },
			  1000:{
				  items:3
			  }
		 }
	 })

	$('.owl-kid-item').owlCarousel({
		items:5,
		loop:true,
		dots: true,
		nav: true,
		margin:30,
		  responsive:{
			  0:{
				  items:1
			  },
			  600:{
				  items:2
			  },
			  1000:{
				  items:3
			  }
		 }
	 })

	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('#top').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	

	// Window Resize Mobile Menu Fix
	mobileNav();


	// Menu Dropdown Toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}


	// Menu elevator animation
	$('.scroll-to-section a[href*=\\#]:not([href=\\#])').on('click', function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				var width = $(window).width();
				if(width < 991) {
					$('.menu-trigger').removeClass('active');
					$('.header-area .nav').slideUp(200);	
				}				
				$('html,body').animate({
					scrollTop: (target.offset().top) - 80
				}, 700);
				return false;
			}
		}
	});

	$(document).ready(function () {
	    $(document).on("scroll", onScroll);
	    
	    //smoothscroll
	    $('.scroll-to-section a[href^="#"]').on('click', function (e) {
	        e.preventDefault();
	        $(document).off("scroll");
	        
	        $('.scroll-to-section a').each(function () {
	            $(this).removeClass('active');
	        })
	        $(this).addClass('active');
	      
	        var target = this.hash,
	        menu = target;
	       	var target = $(this.hash);
	        $('html, body').stop().animate({
	            scrollTop: (target.offset().top) - 79
	        }, 500, 'swing', function () {
	            window.location.hash = target;
	            $(document).on("scroll", onScroll);
	        });
	    });
	});
	// SEO ve Performans iyileştirmelerini başlat
		initLazyLoading();
		initScrollOptimization();
		initImageErrorHandling();
		initMobileMenuPerformance();
		initAdvancedPerformance();
		initServiceWorker();
    
    console.log('Kalite Kapı - SEO ve Performans iyileştirmeleri aktif');

	function onScroll(event){
	    var scrollPos = $(document).scrollTop();
	    $('.nav a').each(function () {
	        var currLink = $(this);
	        var refElement = $(currLink.attr("href"));
	        if (!refElement.length) return;
	        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
	            $('.nav ul li a').removeClass("active");
	            currLink.addClass("active");
	        }
	        else{
	            currLink.removeClass("active");
	        }
	    });
	}


	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});


	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}


})(window.jQuery);

// ==========================================
// SEO ve Performans İyileştirmeleri
// ==========================================

// Lazy loading için JavaScript
function initLazyLoading() {
    const lazyImages = [].slice.call(document.querySelectorAll("img[loading='lazy']"));
    
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;
                    // Resim yüklendikten sonra loaded class'ını ekle
                    lazyImage.addEventListener('load', function() {
                        lazyImage.classList.add("loaded");
                    });
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    }
}

// Scroll performance optimization
function initScrollOptimization() {
    let scrollTimeout;
    $(window).on('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                scrollTimeout = null;
                // Scroll optimizasyonu buraya eklenebilir
            }, 100);
        }
    });
}

// Resim yükleme hata kontrolü
function initImageErrorHandling() {
    $('img').on('error', function() {
        console.log('Resim yüklenemedi:', $(this).attr('src'));
        $(this).hide(); // Bozuk resimleri gizle
    });
}

// Mobil menü performans iyileştirmesi
function initMobileMenuPerformance() {
    if ($(window).width() < 768) {
        $('.menu-trigger').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.header-area .main-nav .nav').slideToggle(200);
            $(this).toggleClass('active');
        });
    }
}

// Performans: kritik görsel HTML'de preload ediliyor, burada tekrar preload yapılmıyor.
function initAdvancedPerformance() {
    // Veri tasarrufu modunda görseller zaten "lazy" olarak yüklenir.
    if (navigator.connection && navigator.connection.saveData) {
        document.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            img.loading = 'lazy';
        });
    }
}

// Service Worker Registration (site alt dizine kurulsa da çalışır)
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(function() {
            // Service worker desteklenmiyorsa site normal çalışmaya devam eder.
        });
    }
}
