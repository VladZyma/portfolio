'use strict';
const mobileNavBtnEl = document.querySelector('.mobile-nav-btn');
const navListEl = document.querySelector('.nav__list');

const headerBoxEl = document.querySelector('.header__box');
const headerBoxHeight = headerBoxEl.getBoundingClientRect().height;
const sectionHero = document.querySelector('.hero');

// MOBILE NAV
mobileNavBtnEl.addEventListener('click', function (e) {
  e.stopPropagation();

  this.classList.toggle('mobile-nav-btn--active');
  navListEl.classList.toggle('nav__list--mobile');
  document.body.classList.toggle('_no-scroll');
});

// STICKY HEADER
function headerObsCallback(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) {
    headerBoxEl.classList.add('header__box--sticky');
  } else {
    headerBoxEl.classList.remove('header__box--sticky');
  }
}

const headerObsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${headerBoxHeight}px`,
};

const headerObserver = new IntersectionObserver(
  headerObsCallback,
  headerObsOptions
);

headerObserver.observe(sectionHero);

// PAGE NAVIGATION
navListEl.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    // for mobile nav
    mobileNavBtnEl.classList.remove('mobile-nav-btn--active');
    navListEl.classList.remove('nav__list--mobile');
    document.body.classList.remove('_no-scroll');

    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
