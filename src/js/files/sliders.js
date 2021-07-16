//BildSlider
let sliders = document.querySelectorAll('._swiper');
if (sliders) {
	for (let index = 0; index < sliders.length; index++) {
		let slider = sliders[index];
		if (!slider.classList.contains('swiper-bild')) {
			let slider_items = slider.children;
			if (slider_items) {
				for (let index = 0; index < slider_items.length; index++) {
					let el = slider_items[index];
					el.classList.add('swiper-slide');
				}
			}
			let slider_content = slider.innerHTML;
			let slider_wrapper = document.createElement('div');
			slider_wrapper.classList.add('swiper-wrapper');
			slider_wrapper.innerHTML = slider_content;
			slider.innerHTML = '';
			slider.appendChild(slider_wrapper);
			slider.classList.add('swiper-bild');

			if (slider.classList.contains('_swiper_scroll')) {
				let sliderScroll = document.createElement('div');
				sliderScroll.classList.add('swiper-scrollbar');
				slider.appendChild(sliderScroll);
			}
		}
		if (slider.classList.contains('_gallery')) {
			slider.data('lightGallery').destroy(true);
		}
	}
	sliders_bild_callback();
}

function sliders_bild_callback(params) { }

let sliderScrollItems = document.querySelectorAll('._swiper_scroll');
if (sliderScrollItems.length > 0) {
	for (let index = 0; index < sliderScrollItems.length; index++) {
		const sliderScrollItem = sliderScrollItems[index];
		const sliderScrollBar = sliderScrollItem.querySelector('.swiper-scrollbar');
		const sliderScroll = new Swiper(sliderScrollItem, {
			direction: 'vertical',
			slidesPerView: 'auto',
			freeMode: true,
			scrollbar: {
				el: sliderScrollBar,
				draggable: true,
				snapOnRelease: false
			},
			mousewheel: {
				releaseOnEdges: true,
			},
		});
		sliderScroll.scrollbar.updateSize();
	}
}


function sliders_bild_callback(params) { }

if (document.querySelector('.slider-main__body')) {
	let swiper = new Swiper('.slider-main__body', {
	observer: true,
	observeParents: true,
	slidesPerView: 1,
	watchOverflow: true,
	speed: 1500,
	loop: true,
	loopAdditionalSlides: 5,
	preloadImages: false,
	parallax: true,
	effect: 'fade',
	fadeEffect: {
		crossFade: true
	},
	grabCursor: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	autoplay: {
		delay: 8000,
		disableOnInteraction: false
	}
	});
}

let mySwiper = new Swiper(".swiper-container", {
	loop: true,
	slidesPerView: 1,
	grabCursor: true,
	slideToClickedSlide: false,
	navigation: {
	  nextEl: '.swiper-button-next',
	  prevEl: '.swiper-button-prev',
	},
	breakpoints: {
		700: {
		  	slidesPerView: 2,
		},
		900: {
		  	slidesPerView: 3,
		},
		1100: {
			slidesPerView: 4,
		}
	}
});

let swiperPartners = new Swiper(".sliders-partners__body", {
	loop: true,
	slidesPerView: 1,
	grabCursor: true,
	slideToClickedSlide: false,
	navigation: {
	  nextEl: '.sliders-partners__arrows .swiper-button-next',
	  prevEl: '.sliders-partners__arrows .swiper-button-prev',
	},
	autoplay: {
		delay: 5000,
		disableOnInteraction: false
	},
	breakpoints: {
		350: {
			slidesPerView: 2,
		},
		450: {
			slidesPerView: 3,
		},
		700: {
			slidesPerView: 4,
		},
		990: {
		  	slidesPerView: 5,
		}
	}
});

let initPhotoSwipeFromDOM = (gallerySelector) => {
	let parseThumbnailElements = function(el) {
		let thumbElements = el.childNodes,
			numNodes = thumbElements.length,
			items = [],
			figureEl,
			linkEl,
			size,
			item;
		for (var i = 0; i < numNodes; i++) {
			figureEl = thumbElements[i];
			if (figureEl.nodeType !== 1) {
				continue;
			}
			linkEl = figureEl.children[0];
			size = linkEl.getAttribute("data-size").split("x");
			item = {
				src: linkEl.getAttribute("href"),
				w: parseInt(size[0], 10),
				h: parseInt(size[1], 10)
			};
			if (figureEl.children.length > 1) {
				item.title = figureEl.children[1].innerHTML;
			}
			if (linkEl.children.length > 0) {
				item.msrc = linkEl.children[0].getAttribute("src");
			}
			item.el = figureEl;
			items.push(item);
		}
		return items;
	};
	let closest = function closest(el, fn) {
		return el && (fn(el) ? el : closest(el.parentNode, fn));
	};
	let onThumbnailsClick = function(e) {
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		let eTarget = e.target || e.srcElement;
		let clickedListItem = closest(eTarget, function(el) {
			return el.tagName && el.tagName.toUpperCase() === "LI";
		});
		if (!clickedListItem) {
			return;
		}
		let clickedGallery = clickedListItem.parentNode,
			childNodes = clickedListItem.parentNode.childNodes,
			numChildNodes = childNodes.length,
			nodeIndex = 0,
			index;
		for (var i = 0; i < numChildNodes; i++) {
			if (childNodes[i].nodeType !== 1) {
				continue;
			}
			if (childNodes[i] === clickedListItem) {
				index = nodeIndex;
				break;
			}
			nodeIndex++;
		}
		if (index >= 0) {
			openPhotoSwipe(index, clickedGallery);
		}
		return false;
	};
	let photoswipeParseHash = function() {
		let hash = window.location.hash.substring(1),
			params = {};
		if (hash.length < 5) {
			return params;
		}
		let vars = hash.split("&");
		for (var i = 0; i < vars.length; i++) {
			if (!vars[i]) {
				continue;
			}
			let pair = vars[i].split("=");
			if (pair.length < 2) {
				continue;
			}
			params[pair[0]] = pair[1];
		}
		if (params.gid) {
			params.gid = parseInt(params.gid, 10);
		}
		return params;
	};
	let openPhotoSwipe = function(
		index,
		galleryElement,
		disableAnimation,
		fromURL
	) {
		let pswpElement = document.querySelectorAll(".pswp")[0],
			gallery,
			options,
			items;
		items = parseThumbnailElements(galleryElement);
		options = {
			closeEl: true,
			captionEl: true,
			fullscreenEl: true,
			zoomEl: true,
			shareEl: true,
			counterEl: false,
			arrowEl: true,
			preloaderEl: true,
			galleryUID: galleryElement.getAttribute("data-pswp-uid"),
			getThumbBoundsFn: function(index) {
				let thumbnail = items[index].el.getElementsByTagName("img")[0],
					pageYScroll =window.pageYOffset || document.documentElement.scrollTop,
					rect = thumbnail.getBoundingClientRect();
				return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
			}
		};
		if (fromURL) {
			if (options.galleryPIDs) {
				for (var j = 0; j < items.length; j++) {
					if (items[j].pid == index) {
						options.index = j;
						break;
					}
				}
			} else {
				options.index = parseInt(index, 10) - 1;
			}
		} else {
			options.index = parseInt(index, 10);
		}
		if (isNaN(options.index)) {
			return;
		}
		if (disableAnimation) {
			options.showAnimationDuration = 0;
		}
		gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
		gallery.listen("unbindEvents", function() {
			let getCurrentIndex = gallery.getCurrentIndex();
			mySwiper.slideTo(getCurrentIndex, 0, false);
			// mySwiper.autoplay.start();
		});
		gallery.listen('initialZoomIn', function() {
			if (mySwiper.autoplay.running){
				mySwiper.autoplay.stop();
			}
		});
	};
	let galleryElements = document.querySelectorAll(gallerySelector);
	for (var i = 0, l = galleryElements.length; i < l; i++) {
		galleryElements[i].setAttribute("data-pswp-uid", i + 1);
		galleryElements[i].onclick = onThumbnailsClick;
	}
	let hashData = photoswipeParseHash();
	if (hashData.pid && hashData.gid) {
		openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
	}
};
initPhotoSwipeFromDOM(".my-gallery");