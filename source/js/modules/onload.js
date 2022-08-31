import {AccentTypographyBuild} from "./animation-builder";

export const introAnimation = new AccentTypographyBuild(`.intro__title`, 500, `animate`, `transform`);
export const sliderAnimation = new AccentTypographyBuild(`.slider__item-title`, 500, `animate`, `transform`);
export const prizesAnimation = new AccentTypographyBuild(`.prizes__title`, 500, `animate`, `transform`);
export const rulesAnimation = new AccentTypographyBuild(`.rules__title`, 500, `animate`, `transform`);
export const gameAnimation = new AccentTypographyBuild(`.game__title`, 500, `animate`, `transform`);

export const animationArr = [introAnimation, sliderAnimation, prizesAnimation, rulesAnimation, gameAnimation];

export default () => {
  window.onload = () => {
    const body = document.querySelector(`body`);
    body.classList.add(`loaded`);
    animationArr.forEach((item) => item.runAnimation());
  };
};
