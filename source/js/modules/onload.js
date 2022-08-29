export default () => {
  window.onload = () => {
    const body = document.querySelector(`body`);
    body.classList.add(`loaded`);
  };
};
