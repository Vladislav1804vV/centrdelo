window.onload = function () {
    document.addEventListener('click', documentActions);
    function documentActions(e) {
        const targetElement = e.target;
        if (window.innerWidth > 992 && isMobile.any()) {
            if (targetElement.classList.contains('menu__arrow')) {
                targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
                _removeClasses(document.querySelectorAll('.menu__item._hover'), '_hover');
            }
        }
    } 
    const headerElement = document.querySelector('.header');
    const callback = function(entries, observer) {
        if (entries[0].isIntersecting) {
            headerElement.classList.remove('_scroll');
        } else {
            headerElement.classList.add('_scroll');
        }
    }
    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerElement);
    // $('.menu__item').on('mouseover', () => {
    //     let $this = $(this);
    //     if ($this.is('._menu__item_block')) {
    //         alert('!!!');
    //         $this.find('.menu__sub-list').css('display', 'block');
    //     } else if ($this.is('._menu__item_grid')) {
    //         $this.find('.menu__sub-list').css('display', 'grid');
    //     }
    // });
};

let $iconsBlockPage = $('.icons-block-page__item, .icons-block-page__main, .icons-block-page__list');
$('.icons-block-page__main').on('click', () => {
    if ($iconsBlockPage.is('._hover')) {
        $iconsBlockPage.removeClass('_hover');
        $('.icons-block-page__main').addClass('_icon-envelope');
        $('.icons-block-page__main').removeClass('_icon-close');
    } else {
        $iconsBlockPage.addClass('_hover');
        $('.icons-block-page__main').removeClass('_icon-envelope');
        $('.icons-block-page__main').addClass('_icon-close');
    }
});

// const options = {
//   duration: 5,
// };
// let number_500 = new countUp.CountUp('numeral_500', 500, options);
// let number_30 = new countUp.CountUp('numeral_30', 30, options);
// let number_60 = new countUp.CountUp('numeral_60', 60, options);
// let number_80 = new countUp.CountUp('numeral_80', 80, options);
// number_500.start();
// number_30.start();
// number_60.start();
// number_80.start();


let $window = $(window);
let lastScrollTop = 0;
let headerFooter = $('.header__footer');

$(function() {
    // при нажатии на кнопку scrollup
    $('.header__scroll-up').click(function() {
      // переместиться в верхнюю часть страницы
      $("html, body").animate({
        scrollTop: 0
      },1000);
    })

    $('.menu__icon').on('click', () => {
        if ($('.menu__body').is('._active')) {
            $('.header__scroll-up').fadeOut();
        } else if($(window).scrollTop()>200) {
            $('.header__scroll-up').fadeIn();
        }
        if ($('.menu__body').is('._active')) {
            $('.icons-block-page__list').fadeOut();
            if ($iconsBlockPage.is('._hover')) {
                $('.icons-block-page__main').click();
            }
        } else {
            $('.icons-block-page__list').fadeIn();
        }
    });

    lastScrollTop = 0;
})

// при прокрутке окна (window)
$window.scroll(function() {
    // если пользователь прокрутил страницу более чем на 200px
    if ($window.scrollTop()>200) {
        // то сделать кнопку scrollup видимой
        $('.header__scroll-up').css('display', 'flex');
        $('.header__scroll-up').fadeIn();
    }
    // иначе скрыть кнопку scrollup
    else {
        $('.header__scroll-up').fadeOut();
    }

    let top = $window.scrollTop();
    
    if (lastScrollTop > top) {
        if (window.innerWidth < 992) {
            headerFooter.fadeIn();
        }
    } else if (lastScrollTop < top) {
        headerFooter.fadeOut();
    }
    lastScrollTop = top;
});

$('#pagination-demo').twbsPagination({
    contents: 'gallery-photogallery__pagination',
    totalPages: 35,
    visiblePages: 7,
    first: 'В начало',
    next: 'Вперёд',
    prev: 'Назад',
    last: 'В конец',
    onPageClick: function (event, page) {
        $('#page-content').text('Page ' + page);
    }
});

// var $pagination = $('selector');
//     var defaultOpts = {
//         totalPages: 20
//     };
//     $pagination.twbsPagination(defaultOpts);
//     $.ajax({
//         ...,
//         success: function (data) {
//             var totalPages = data.newTotalPages;
//             var currentPage = $pagination.twbsPagination('getCurrentPage');
//             $pagination.twbsPagination('destroy');
//             $pagination.twbsPagination($.extend({}, defaultOpts, {
//                 startPage: currentPage,
//                 totalPages: totalPages
//             }));
//         }
//     });

if ($('.contacts-about__map').is('#map')) {
    let mapTitle = document.createElement('div'); mapTitle.className = 'mapTitle';
    mapTitle.textContent = 'Для активации карты нажмите по ней';
    map.appendChild(mapTitle);
    map.onclick = function() {
        this.children[0].removeAttribute('style');
        mapTitle.parentElement.removeChild(mapTitle);
    }
    map.onmousemove = function(event) {
        mapTitle.style.display = 'block';
        if(event.offsetY > 10) mapTitle.style.top = event.offsetY + 20 + 'px';
        if(event.offsetX > 10) mapTitle.style.left = event.offsetX + 20 + 'px';
    }
    map.onmouseleave = function() {
        mapTitle.style.display = 'none';
        this.children[0].setAttribute('style', "pointer-events: none;");
        mapTitle = document.createElement('div'); mapTitle.className = 'mapTitle';
        mapTitle.textContent = 'Для активации карты нажмите по ней';
        map.appendChild(mapTitle);
    }
}