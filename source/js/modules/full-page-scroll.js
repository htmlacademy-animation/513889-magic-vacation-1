import throttle from 'lodash/throttle';
import {animationArr} from "./onload";

export default class FullPageScroll {
  constructor() {
    this.THROTTLE_TIMEOUT = 1000;
    this.scrollFlag = true;
    this.timeout = null;

    this.screenElements = document.querySelectorAll(`.screen:not(.screen--result)`);
    this.menuElements = document.querySelectorAll(`.page-header__menu .js-menu-link`);
    this.overlay = document.querySelector(`.overlay`);
    this.footers = document.querySelectorAll(`.screen__footer`);
    this.disclaimer = document.querySelector(`.screen__disclaimer`);

    this.activeScreen = 0;
    this.onScrollHandler = this.onScroll.bind(this);
    this.onUrlHashChengedHandler = this.onUrlHashChanged.bind(this);
  }

  init() {
    document.addEventListener(`wheel`, throttle(this.onScrollHandler, this.THROTTLE_TIMEOUT, {trailing: true}));
    window.addEventListener(`popstate`, this.onUrlHashChengedHandler);

    this.onUrlHashChanged();
  }

  onScroll(evt) {
    if (this.scrollFlag) {
      this.reCalculateActiveScreenPosition(evt.deltaY);
      const currentPosition = this.activeScreen;
      if (currentPosition !== this.activeScreen) {
        this.changePageDisplay();
      }
    }
    this.scrollFlag = false;
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.scrollFlag = true;
    }, this.THROTTLE_TIMEOUT);
  }

  onUrlHashChanged() {
    const newIndex = Array.from(this.screenElements).findIndex((screen) => location.hash.slice(1) === screen.id);
    const currentPosition = this.activeScreen;
    this.activeScreen = (newIndex < 0) ? 0 : newIndex;
    if (currentPosition === 1) {
      this.overlay.classList.add(`overlay--active`);
      this.footers.forEach((item) => item.classList.add(`screen__footer--hidden`));
      this.disclaimer.classList.add(`screen__disclaimer--hidden`);
      setTimeout(() => {
        this.overlay.classList.remove(`overlay--active`);
        this.changePageDisplay();
        this.runAnimation(50);
      }, 400);
    } else if (currentPosition === 4) {
      this.changePageDisplay();
      this.runFooterAnimation();
    } else {
      this.changePageDisplay();
      this.runAnimation();
    }
  }

  changePageDisplay() {
    this.changeVisibilityDisplay();
    this.changeActiveMenuItem();
    this.emitChangeDisplayEvent();
  }

  changeVisibilityDisplay() {
    this.screenElements.forEach((screen) => {
      screen.classList.add(`screen--hidden`);
      screen.classList.remove(`active`);
    });
    this.screenElements[this.activeScreen].classList.remove(`screen--hidden`);
    setTimeout(() => {
      this.screenElements[this.activeScreen].classList.add(`active`);
    }, 100);
  }

  changeActiveMenuItem() {
    const activeItem = Array.from(this.menuElements).find((item) => item.dataset.href === this.screenElements[this.activeScreen].id);
    if (activeItem) {
      this.menuElements.forEach((item) => item.classList.remove(`active`));
      activeItem.classList.add(`active`);
    }
  }

  emitChangeDisplayEvent() {
    const event = new CustomEvent(`screenChanged`, {
      detail: {
        'screenId': this.activeScreen,
        'screenName': this.screenElements[this.activeScreen].id,
        'screenElement': this.screenElements[this.activeScreen]
      }
    });

    document.body.dispatchEvent(event);
  }

  reCalculateActiveScreenPosition(delta) {
    if (delta > 0) {
      this.activeScreen = Math.min(this.screenElements.length - 1, ++this.activeScreen);
    } else {
      this.activeScreen = Math.max(0, --this.activeScreen);
    }
  }

  runFooterAnimation() {
    this.footers.forEach((item) => item.classList.add(`screen__footer--hidden`));
    this.disclaimer.classList.add(`screen__disclaimer--hidden`);
    setTimeout(() => {
      this.footers.forEach((item) => item.classList.remove(`screen__footer--hidden`));
      this.disclaimer.classList.remove(`screen__disclaimer--hidden`);
    }, 0);
  }

  runAnimation(timeout = 0) {
    const isLoaded = document.querySelector(`body`).classList.contains(`loaded`);
    if (isLoaded) {
      animationArr.forEach((item) => item.destroyAnimation());
      setTimeout(() => {
        animationArr[this.activeScreen].runAnimation();
        this.footers.forEach((item) => item.classList.remove(`screen__footer--hidden`));
        this.disclaimer.classList.remove(`screen__disclaimer--hidden`);
      }, timeout);
    }
  }
}
