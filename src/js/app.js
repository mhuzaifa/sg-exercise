
import googleMap from './modules/googleMap'

(($) => {
  // DOM selectors
  const $window = $(window);
  const $socialItems = $('.social');
  const $menu = $('section.menu');
  const $scrollItem = $('.scroll-wrapper');
  const $scrollUp = $('.scroll-up');
  const $scrollDown = $('.scroll-down');
  const $navigationTopLeft = $('.navigation__left a[href*="#"]')
  const $numberNav = $('.number-nav a')
  const $sections = $('section')
  const $updateSectionNumber = $('.section-number')
  const $movingNumber = $('.number-nav__number')

  // DOM Dimensions
  const scrollItemH = $scrollItem.outerHeight();
  let lastScrollTop = $window.scrollTop();
  let viewPortH = verge.viewportH();
  let viewPortW = verge.viewportW();

  // Smooth Scroll
  function smoothScrol($el) {
    $el.bind('click', function(e) {
      e.preventDefault();
      const $this = $(this);
      const target = $this.attr('href');
      const $targetSection = $(target);

    //  console.log($targetSection.length === 1);

      if ($targetSection.length === 1) {
        $('html, body').stop().animate({
          scrollTop : $targetSection.offset().top
        }, 600, function() {
          location.hash = target;
        })
      }

    });
  }

  //  number Nave item
  function numberNav() {

    $sections.each( function (el) {
      const $singleSection = $(this);

      if ($singleSection.offset().top <= lastScrollTop && $singleSection.offset().top + $singleSection.height() > lastScrollTop) {

        $updateSectionNumber.text(`0${el+1}`)
        let numberTopValue = el * 22;

        TweenMax.to($movingNumber, 0.4, {
          y: numberTopValue
        })
      }

    })


    $numberNav.each(function() {
      const $this = $(this);
      const target = $this.attr('href');
      const $targetSection = $(target);

      if ($targetSection.length === 1) {
        if ($targetSection.offset().top <= lastScrollTop && $targetSection.offset().top + $targetSection.height() > lastScrollTop) {
          $numberNav.removeClass('-active');
          $this.addClass('-active');
        } else {
          $this.removeClass('-active');
        }
      }
    })
  }

  function activeMenuItem($menuEl) {
    $menuEl.each(function() {
      const $this = $(this);
      const target = $this.attr('href');
      const $targetSection = $(target);
      if ($targetSection.length === 1) {
        if ($targetSection.offset().top <= lastScrollTop && $targetSection.offset().top + $targetSection.height() > lastScrollTop) {
          $menuEl.parent().removeClass('-active');
          $this.parent().addClass('-active');
        } else {
          $this.parent().removeClass('-active');
        }
      }
    })
  }

  // Animations
  // Community items slide up animation
  TweenMax.set($socialItems, { y: 200, autoAlpha: 0 });

  function communitySlideAnim() {
    $socialItems.each(function () {
      const $this = $(this);

      if (verge.inViewport($this, -50) && !$this.hasClass('js-inviewport')) {
        $this.addClass('js-inviewport');
        TweenMax.to($this, 1, {
          y: 0,
          autoAlpha: 1
        })
      }

    })
  }

  // menu items scrolling animation
  function menuAnimSet() {
    if (viewPortW >= 768) {
      TweenMax.set($scrollUp, { y: viewPortH });
      TweenMax.set($scrollDown, { y: -scrollItemH });
    } else if (viewPortW < 768 ) {
      TweenMax.set($scrollUp, { y: 100, autoAlpha: 0 });
      TweenMax.set($scrollDown, { y: -100, autoAlpha: 0 });
    }
  }

  function menuScrollAnim() {
    let resetScrollValue = Math.abs($menu.offset().top - viewPortH - lastScrollTop);
    let scrollUpValue = viewPortH - resetScrollValue;
    let scrollDownValue = -scrollItemH + resetScrollValue;

      if (verge.inViewport($menu) && viewPortW >= 768) {

        TweenMax.to($scrollUp, 0.5, {
          y: scrollUpValue,
          force3D: true
        })

        TweenMax.to($scrollDown, 0.5, {
          y: scrollDownValue,
          force3D: true
        })
      };

      if (verge.inViewport($scrollItem) && viewPortW < 768) {
        TweenMax.to($scrollUp, 0.5, {
          y: 0,
          autoAlpha: 1,
          force3D: true
        })

        TweenMax.to($scrollDown, 0.5, {
          y: 0,
          autoAlpha: 1,
          force3D: true
        })
      };
  }

  // init page functions
  smoothScrol($navigationTopLeft);
  menuAnimSet()

  // init scroll animtion functions
  const scroll = function () {
    numberNav()
    activeMenuItem($navigationTopLeft);
    communitySlideAnim();
    menuScrollAnim();
  };
  // Request animation Frame
  // credit: https://joji.me/en-us/blog/how-to-develop-high-performance-onscroll-event/

  var raf = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

  if (raf) {
    loop();
  }

  function loop() {
    var scrollTop = $window.scrollTop();

    if (lastScrollTop === scrollTop) {
      raf(loop);
      return;
    } else {
      lastScrollTop = scrollTop;

      // fire scroll function if scrolls vertically
      scroll();
      raf(loop);
    }
  }
})(jQuery);