'use strict';
const mobileNavBtnEl = document.querySelector('.mobile-nav-btn');
const navListEl = document.querySelector('.nav__list');
const logoLinkEl = document.querySelector('.nav__logo');

const headerBoxEl = document.querySelector('.header__box');
const headerBoxHeight = headerBoxEl.getBoundingClientRect().height;
const sectionHero = document.querySelector('.hero');

const allSections = document.querySelectorAll('.section');

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
logoLinkEl.addEventListener('click', function (e) {
  e.preventDefault();

  const target = e.target.parentElement.classList.contains('nav__logo')
    ? e.target.parentElement
    : e.target;

  if (target.classList.contains('nav__logo')) {
    const id = target.getAttribute('href');

    // for mobile nav
    mobileNavBtnEl.classList.remove('mobile-nav-btn--active');
    navListEl.classList.remove('nav__list--mobile');
    document.body.classList.remove('_no-scroll');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

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

// REVEAL SECTIONS
function revealSection(entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.5,
});

allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});
