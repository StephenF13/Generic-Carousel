'use strict';

var Carousel = function (element, slidesToScroll, slidesVisible) {
    var children;

    this.element = element;
    this.slidesToScroll = slidesToScroll;
    this.slidesVisible = slidesVisible;
    children = [].slice.call(element.children);
    this.currentItem = 0;
    this.isMobile = false;

    //Options
    this.pagination = true;

    // Modif du DOM
    this.root = createDivWithClass('carousel');
    this.container = createDivWithClass('carouselContainer');
    this.root.setAttribute('tabindex', '0');

    this.root.appendChild(this.container);
    this.element.appendChild(this.root);
    this.items = children.map(function (child) {
        var item;
        item = createDivWithClass('carouselItem');
        item.appendChild(child);
        this.container.appendChild(item);
        return item;
    }.bind(this));

    this.setStyle();
    this.createNavigation();
    this.createPagination();
    this.onWindowResize();

    // Evenements
    this.root.addEventListener('keyup', this.onKeyUpCarousel.bind(this));
    window.addEventListener('resize', this.onWindowResize.bind(this));
};

function createDivWithClass(className) {
    var div;

    div = document.createElement('div');
    div.setAttribute('class', className);
    return div;
}

Carousel.prototype.createNavigation = function () {
    var nextButton = createDivWithClass('carouselNext');
    var prevButton = createDivWithClass('carouselPrev');
    this.root.appendChild(nextButton);
    this.root.appendChild(prevButton);

    nextButton.addEventListener('click', this.onClickNext.bind(this));
    prevButton.addEventListener('click', this.onClickPrev.bind(this));
};

Carousel.prototype.createPagination = function () {
    var pagination;
    var buttons = [];
    pagination = createDivWithClass('carouselPagination');
    this.root.appendChild(pagination);

    for (var i = 0; i < this.items.length; i = i + this.slidesToScroll) {
        var button;
        button = createDivWithClass('carouselPaginationButton');
        button.addEventListener('click', this.gotoItem.bind(this, i));
        pagination.appendChild(button);
        buttons.push(button);
    }
};

Carousel.prototype.getSlidesToScroll = function () {
    return this.isMobile ? 1 : this.slidesToScroll;
};

Carousel.prototype.getSlidesVisible = function () {
    return this.isMobile ? 1 : this.slidesVisible;
};

Carousel.prototype.gotoItem = function (index) {
    if (index < 0) {
        index = this.items.length - this.getSlidesVisible();
    } else if (index >= this.items.length || (this.items[this.currentItem + this.slidesVisible] === undefined && index > this.currentItem)) {
        index = 0;
    }
    var translateX = index * (-100 / this.items.length);
    this.container.style.transform = 'translate3d(' + translateX + '%, 0 ,0)';
    this.currentItem = index;
};

Carousel.prototype.onClickNext = function () {
    this.gotoItem(this.currentItem + this.getSlidesToScroll());
};

Carousel.prototype.onClickPrev = function () {
    this.gotoItem(this.currentItem - this.getSlidesToScroll());
};

Carousel.prototype.onKeyUpCarousel = function (event) {
    if (event.key === 'ArrowRight' || event.key === 'Right') {
        this.onClickNext();
    } else if (event.key === 'ArrowLeft' || event.key === 'Left') {
        this.onClickPrev();
    }
};

Carousel.prototype.onWindowResize = function () {
    var mobile;
    mobile = window.innerWidth;

    if (mobile < 800) {
        this.isMobile = true;
        this.setStyle();
    } else {
        this.isMobile = false;
        this.setStyle();
    }
};

// Permet d'appliquer les bonnes dimensions aux éléments du carousel
Carousel.prototype.setStyle = function () {
    var ratio;

    ratio = this.items.length / this.getSlidesVisible();
    this.container.style.width = (ratio * 100) + "%";
    this.items.forEach(function (item) {
        item.style.width = ((100 / this.getSlidesVisible()) / ratio) + '%';
    }.bind(this))
};

document.addEventListener('DOMContentLoaded', function () {
    new Carousel(document.querySelector('#carousel1'), 2, 2);
    new Carousel(document.querySelector('#carousel2'), 1, 3);
    new Carousel(document.querySelector('#carousel3'), 1, 1);
});

