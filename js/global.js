$(function() {
	"use strict";

    //VARIABLES
    var tabFinish = 0, enableScroll = 0, swipers = [],winW, winH, xsPoint = 767, smPoint = 991, mdPoint = 1199, initIterator = 0, is_visible = $('.menu-button').is(':visible');
    winW = $(window).width();
    winH  =  $(window).height();


    //WINDOW LOAD
	$(window).load(function(){
		$('body').addClass('loaded');
		$('#loader-wrapper').fadeOut();
        isotopFn();
        var $container = $('.isotope');
        $container.isotope({
            itemSelector: '.work-img',
            masonry: '.work-img'
        });
        filterHeight();
        window.scrollTo(0, 0);

        if(window.location.hash) {
            var index = $('.scroll-to-link[href="'+window.location.hash+'"]').index('.scroll-to-link');
            $('body, html').animate({'scrollTop':$('.scroll-to-block').eq(index).offset().top}, 10, function(){enableScroll = 1;});

        }else enableScroll = 1;
    });


    //SCROLL FUNCTIONS
    $(window).scroll(function(){
        scrollCall();
        if($('.time-line').length) {

        $('.time-line').not('.animated').each(function(){
            if($(window).scrollTop() + $(window).height() > $(this).offset().top){
                $(this).addClass('animated').find('.timer').countTo();
                $('.skill').each(function() {
                    var toHeight = $(this).find('h3').data('to') ;
                    $(this).find('.timer-wrapper').height(toHeight + '%');
                });
                $('.our-progress').each(function(){
                    var toW = $(this).find('.timer').data('to') ;
                    $(this).find('.line-active').width(toW + '%');
                });

            }
        });
        };

        if(!is_visible) {
            template8placeHeader();
        }
    });


    //SCROLL MENU
    function scrollCall(){
        var winScroll = $(window).scrollTop();
        if($('.scroll-to-block').length && enableScroll){
            $('.scroll-to-block').each(function( index, element ) {
                if($(element).offset().top<=(winScroll + 2) && ($(element).offset().top+$(element).height()) > (winScroll) ){
                    $('.scroll-to-link').parent().removeClass('active');
                    $('.scroll-to-link').eq(index).parent().addClass('active');
                    if(window.location.hash!=$('.scroll-to-link').eq(index).attr('href')) window.location.hash = $('.scroll-to-link').eq(index).attr('href');
                }
            });
        }
    }

    $('.scroll-to-link').on('click',function(){
        var index = $(this).parent().parent().find('.scroll-to-link').index(this);

        $('body, html').animate({'scrollTop':$('.scroll-to-block').eq(index).offset().top}, 800);
        return false;
    });

    $('.process').on('click',  function(){
        var $t = $(this);
        if(tabFinish || $t.hasClass('active')) return false;
        tabFinish = 1;
        $t.closest('.work-process').find('.process').removeClass('active-process');
        $t.addClass('active-process');
        var index = $t.parent().parent().find('.process').index(this);
        $t.closest('.work-process').find('.process-info:visible').fadeOut(500, function(){
            $t.closest('.work-process').find('.process-info').eq(index).fadeIn(500, function() {
                tabFinish = 0;

            });
        });
    });



    function initSwiper(){
        var initIterator = 0;
        $('.swiper-container').each(function(){
            var $t = $(this);

            var index = 'unique-id-'+initIterator;
            var slideMode = $(this).attr('data-mode');
            $t.attr('data-init', index).addClass('initialized');
            $t.find('.pagination').addClass('pagination-'+index);

            var loopVar = parseInt($t.attr('data-loop')),
                slidesPerViewVar = $t.attr('data-slides-per-view'),
                xsValue, smValue, mdValue, lgValue;
            var centeredSlidesVar = ($t.closest('.history').length)?1:0;
            if(slidesPerViewVar == 'responsive'){
                slidesPerViewVar = 1;
                xsValue = $t.attr('data-xs-slides');
                smValue = $t.attr('data-sm-slides');
                mdValue = $t.attr('data-md-slides');
                lgValue = $t.attr('data-lg-slides');
            }

            swipers[index] = new Swiper(this,{
                pagination: '.pagination-'+index,
                loop: loopVar,
                paginationClickable: true,
                calculateHeight: true,
                slidesPerView: slidesPerViewVar,
                roundLengths: true,
                mode:slideMode,
                centeredSlides: centeredSlidesVar,
                onInit: function(swiper){
                    if($t.attr('data-slides-per-view')=='responsive') updateSlidesPerView(xsValue, smValue, mdValue, lgValue, swiper);
                },
                onSlideChangeEnd:function(swiper){

                    var activeIndex = (loopVar===true)?swiper.activeIndex:swiper.activeLoopIndex;
                    if($t.next().find('.slider-index').length) {
                        $t.next().find(".start_index").html(activeIndex+1);
                    }
                    if($t.find('.slider-index').length) {
                        $t.find(".start_index").html(activeIndex+1);
                    }
                    if($t.hasClass('swiper-project')) {
                        var activeSlide = $t.find('.swiper-slide-active'),
                            activePrev =  activeSlide.prev().data('name'),
                            activeNext =  activeSlide.next().data('name');

                        $('.v-project-prev span').text(activePrev);
                        $('.v-project-next span').text(activeNext);

                        if(!activeSlide.next().hasClass('swiper-slide')) {
                            $('.v-project-next').fadeOut();
                        }
                        else{
                            $('.v-project-next').fadeIn();
                        }

                        if(!activeSlide.prev().hasClass('swiper-slide')) {
                            $('.v-project-prev').fadeOut();
                        }
                        else{
                            $('.v-project-prev').fadeIn();
                        }
                    }s
                },
                onSlideChangeStart: function(swiper){

                    if($t.closest('.w-banner').length){
                        $('.banner-navigation').removeClass('active-nav');
                        $('.banner-navigation').eq(activeIndex).addClass('active-nav');
                    }
                }
            });
            swipers[index].reInit();
            if($t.find('.default-active').length) swipers[index].swipeTo($t.find('.swiper-slide').index($t.find('.default-active')), 0);
            initIterator++;
        });
    };

    //SWIPER ARROWS
    $('.arrow-left').on('click', function(){
        swipers[$(this).parent().prev().attr('data-init')].swipePrev();
    });

    $('.arrow-right').on('click', function(){
        swipers[$(this).parent().prev().attr('data-init')].swipeNext();
    });

    $('.swiper-arrow-left, .a-arrow-left').on('click',function(){
        swipers[$(this).parents('.swiper-container').attr('data-init')].swipePrev();
    });

    $('.swiper-arrow-right, .a-arrow-right').on('click', function(){
        swipers[$(this).parents('.swiper-container').attr('data-init')].swipeNext();
    });


    $('.banner-nav-left, .banner-l').on('click', function(){
        swipers[$(this).parent().parent().attr('data-init')].swipePrev();
    });

    $('.banner-nav-right, .banner-r').on('click', function(){
        swipers[$(this).parent().parent().attr('data-init')].swipeNext();
    });





    function updateSlidesPerView(xsValue, smValue, mdValue, lgValue, swiper){

        if(winW>mdPoint) swiper.params.slidesPerView = lgValue;
        else if(winW>smPoint) swiper.params.slidesPerView = mdValue;
        else if(winW>xsPoint) swiper.params.slidesPerView = smValue;
        else {swiper.params.slidesPerView = xsValue;}
    }



    //FUNCTIONS OF PAGE RESIZE
    function resizeCall(){
        winW = $(window).width();
        winH  =  $(window).height();
        $('.swiper-container[data-slides-per-view="responsive"]').each(function(){
            swipers[$(this).attr('data-init')].reInit();
        });
        is_visible = $('.menu-button').is(':visible');
        if(is_visible) {
            $('.s-header').addClass('fixed').removeClass('fixed-bottom fixed-top');
        }
        filterHeight();
    }
    $(window).resize(function(){
        resizeCall();
    });
    window.addEventListener("orientationchange", function() {
        resizeCall();
    }, false);


    initSwiper();

    //SLIDE IN TAB CLICK
    $('.member-slide').on('click', function () {
      var $t =  $(this),
            index =  $t.closest('.team-nav').find('.member-slide').index(this);
        if(tabFinish || $t.hasClass('active')) return false;
        tabFinish = 1;
        $t.closest('.team-nav').find('.member-slide').removeClass('active');
        $t.addClass('active');
        $t.closest('.team-container').find('.team-info').find('.d101-service-container:visible').animate({'opacity': '0'},500, function(){
            $(this).hide();
            var newTab = $t.closest('.team-container').find('.team-info').find('.d101-service-container').eq(index);
            newTab.show().css({'opacity' : '0'});
            if(newTab.find('.swiper-container').length){
                newTab.find('.swiper-container').each(function() {
                    swipers[$(this).attr('data-init')].reInit();
                    swipers[$(this).attr('data-init')].resizeFix();
                });

            }
            newTab.animate({'opacity': '1'},500,function() {
                tabFinish = 0;
            });
        });
    });

    // BACKGROUND IMG
    $('.center-image').each(function(){
        var bgSrc = $(this).attr('src');
        $(this).parent().css({'background-image':'url('+bgSrc+')'});
        $(this).remove();
    });

    //SWIPER BANNER NAVIGATION
    $('.banner-navigation').on('click', function(){
        var $t = $(this);
        if($t.hasClass('active')) return false;
        $t.closest('.w-banner').find('.banner-navigation').removeClass('active');
        $t.addClass('active');
        var nine = $t.parent().parent().find('.banner-navigation').index(this);
        swipers[$t.closest('.w-banner').find('.swiper-container').attr('data-init')].swipeTo(nine);
    });

    $('.h-banner-nav-item').on('click', function(){
        var $t = $(this);
        if($t.hasClass('active')) return false;
        $t.closest('.h-banner').find('.h-banner-nav-item').removeClass('active');
        $t.addClass('active');
        var nine = $t.parent().parent().find('.h-banner-nav-item ').index(this);
        swipers[$t.closest('.h-banner').find('.swiper-container').attr('data-init')].swipeTo(nine);
    });


    $('.travel-click').on('click', function () {
        if(tabFinish) return false;
        tabFinish = 1;
        var $t = $(this),
            srcImg = $t.data('src'),
            index = $t.closest('.swiper-slide').find('.travel-click').index(this);
        $t.closest('.swiper-slide').css({'background-image':'url('+srcImg+')'});
        $t.closest('.swiper-slide').find('.banner-info:visible').fadeOut(200, function(){
            $t.closest('.swiper-slide').find('.banner-info').eq(index).fadeIn(200, function() {
                tabFinish = 0;
            });
        });

    });

    $('body').on('click', function () {
        if( $('#gallery-box').find('.swiper-container').length){
            var sw =  $('#gallery-box').find('.swiper-container');
                swipers[sw.attr('data-init')].reInit();
                swipers[sw.attr('data-init')].resizeFix();
        }
    });

    //HISTORY SLIDER CLICK
    $('.story-date').on('click', function(){
        var $t = $(this);
        if($t.hasClass('active')) return false;
        $t.closest('.history').find('.story-date').removeClass('active');
        $t.addClass('active');
        var story = $('.story-date').index(this);
        swipers[$t.closest('.history').find('.swiper-container').attr('data-init')].swipeTo(story);
    });




    //TAB
    $('.nav-tab-item').on('click', function(){
        var $t = $(this);
        if(tabFinish || $t.hasClass('active')) return false;
        tabFinish = 1;
        $t.closest('.nav-tab').find('.nav-tab-item').removeClass('active');
        $t.addClass('active');
        var index = $t.parent().parent().find('.nav-tab-item').index(this);
        $t.closest('.tab-wrapper').find('.tabs-content').find('.tab-info:visible').animate({'opacity': '0'},500, function(){
            $(this).hide();
            var newTab = $t.closest('.tab-wrapper').find('.tabs-content').find('.tab-info').eq(index);
            newTab.show().css({'opacity' : '0'});
            if(newTab.find('.swiper-container').length){
                newTab.find('.swiper-container').each(function() {
                    swipers[$(this).attr('data-init')].reInit();
                    swipers[$(this).attr('data-init')].resizeFix();
                });
            }
            newTab.animate({'opacity': '1'},500,function() {
                tabFinish = 0;
            });
        });
    });


    $('.nav-tab-item-proc').on('click', function () {
        var $t = $(this),
            index = $t.parent().parent().find('.nav-tab-item-proc').index(this),
            numElem =  $t.closest('.nav-tab').next('.tab-line-container').find('.tab-num');
        numElem.parent().find('.active').removeClass('active');
        numElem.eq(index).addClass('active').prevAll().addClass('active');

    });

    //RIGHT FIXED MENU
    function template8placeHeader() {
        if ($('.nav').hasClass('s-nav')) {
            var menuH = $('.header .container').outerHeight();
            if (menuH > winH) {
                $('.s-header').removeClass('fixed-top');
                if ($(window).scrollTop() + winH >= menuH) {
                    $('.s-header').addClass('fixed-bottom');
                }
                else {
                    $('.s-header').removeClass('fixed-bottom');
                }
            } else $('.s-header').removeClass('fixed-bottom').addClass('fixed-top');
        }
    }

    if(!is_visible) {
        template8placeHeader();
    }

    if(is_visible) {
        $('.s-header').addClass('fixed');
    }

    //COLLECTIONS TAB
    $('.collect-but').on('click', function(){
        var $t = $(this);
        if($t.hasClass('active')) return false;
        $t.closest('.collections').find('.collect-but').removeClass('active-col');
        $t.addClass('active-col');
        var index = $t.parent().parent().parent().find('.collect-but').index(this);
        $t.closest('.collections').find('.collection-info:visible').animate({'opacity':'0'},500, function(){
            $(this).hide();
            var newObjAppear = $t.closest('.collections').find('.collection-info').eq(index);
            newObjAppear.css({'opacity':'0', 'display':'block'});
            swipers[newObjAppear.find('.swiper-container').attr('data-init')].reInit();
            newObjAppear.animate({'opacity':'1'}, 500);
        });
    });



    //AMAZING TEAM CLICK
    $('.team-but').on('click',function(){
        var $t = $(this);
        if($t.hasClass('act-team')) return false;
        $t.closest('.am-team').find('.team-but').removeClass('act-team');
        $t.addClass('act-team');
        var index = $t.parent().parent().find('.team-but').index(this);
        $t.closest('.amazing-team').find('.teamers:visible').animate({'opacity':'0'},500, function(){
            $(this).hide();
            var newObjAppear = $t.closest('.amazing-team').find('.teamers').eq(index);
            newObjAppear.css({'opacity':'0', 'display':'block'});
            swipers[newObjAppear.find('.swiper-container').attr('data-init')].reInit();
            swipers[newObjAppear.find('.swiper-container').attr('data-init')].resizeFix();

            newObjAppear.animate({'opacity':'1'}, 500);
        });

    });

    //HEADER FIXED ON SCROLL
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 10) {
            $('.b-header').addClass("b-header-active");
            $('.a-header').addClass("a-header-active");
            $('.r-header').addClass("r-header-active");
            $('.m-header ').addClass("m-header-bg");

        } else {
            $('.b-header').removeClass("b-header-active");
            $('.a-header').removeClass("a-header-active");
            $('.m-header ').removeClass("m-header-bg");
        }
    });


    //MENU RESPONSIVE SHOW
    $('.menu-button').on('click', function () {
        var menu = $('.nav').slideToggle(400);
        $(this).toggleClass('active');

        $(window).resize(function(){
            var w = $(window).width();
            if(w > 320 && menu.is(':hidden')) {
                menu.removeAttr('style');
            }
        });
    });

    //MENU RESPONSIVE SHOW TYPE2
    $('.m-menu-button').on('click', function () {
        $(this).toggleClass('active');
        $('.m-header').toggleClass('m-header-active');
        $('.m-nav').toggleClass('m-nav-active');

    });

    if(is_visible){
        $('.nav a').on('click', function () {
            $('.nav').slideUp(300);
            $('.menu-button').removeClass('active');
        });
    }

    $('.m-nav a').on('click', function () {
        if(winW < 992 ) {
            $('.m-nav').removeClass('m-nav-active');
        }
    });


    //CALCULATE HEIGHT FILTER BLOCK
    function filterHeight () {
        var imgH = $('.corner-stamp').next('.work-img').find('img').height();
        $('.corner-stamp').height(imgH - 30);
    };
    filterHeight();

    //ARROW DOWN
    $('.arrow-down').on('click', function (e) {
        $('html,body').stop().animate({ scrollTop: $('.demo-info').offset().top }, 800);
        e.preventDefault();
    });

    $('.to-gallery').on('click', function (e) {
        $('html,body').stop().animate({ scrollTop: $('.gallery-food').offset().top }, 800);
        e.preventDefault();
    });

    //FILTER FUNCTIONS
    function isotopFn(){
        var $container = $('.isotope');
        $container.isotope({
            itemSelector: '.work-img',
            masonry: '.work-img'
        });

// make <div class="item width# height#" />
        function getItemElement() {
            var $item = $('.work-img').clone();
            // add width and height class
            return $item;
        }

        $('#filters').on( 'click', 'button', function() {
            $('#filters button').removeClass('actual');
            $(this).addClass('actual');
            var filterValue = $(this).attr('data-filter');
            $container.isotope({filter: filterValue});
        });

        $('#filters').on('click','button', function() {
            $('#filters button').removeClass('actual');
            $(this).addClass('actual');
            var selector = $(this).data('filter');
            if ( selector !== '*' ) {
                selector = selector + ', .corner-stamp'
            }
            $container.isotope({ filter: selector });
        });

    }


    // Inline popups
    if($('#gallery-popap').length) {
        $('#gallery-popap').magnificPopup({
            delegate: 'a',
            removalDelay: 500, //delay removal by X to allow out-animation
            callbacks: {
                beforeOpen: function() {
                    this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
            midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
        });
    }

    //GALLERY POPUP
    if($('.gallery-parent').length) {
        $('.gallery-parent').magnificPopup({
            delegate: 'a', // child items selector, by clicking on it popup will open
            type: 'image',
            gallery: {enabled: true},
            removalDelay: 500, //delay removal by X to allow out-animation
            callbacks: {
                beforeOpen: function () {
                    this.st.mainClass = this.st.el.attr('data-effect');
                }
            },
            midClick: true

        });
    };

});







