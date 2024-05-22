'use strict';
const mobileNavBtnEl = document.querySelector('.mobile-nav-btn');
const navListEl = document.querySelector('.nav__list');

// MOBILE NAV
mobileNavBtnEl.addEventListener('click', function (e) {
  e.stopPropagation();

  this.classList.toggle('mobile-nav-btn--active');
  navListEl.classList.toggle('nav__list--mobile');
  document.body.classList.toggle('_no-scroll');
});
