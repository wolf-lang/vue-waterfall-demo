(function () {
  function setRem() {
    const baseSize = 16; // 1rem = 16px
    const designWidth = 375; // 设计稿宽度
    const html = document.documentElement;
    const clientWidth = html.clientWidth;
    html.style.fontSize = (clientWidth / designWidth) * baseSize + 'px';
  }
  setRem();
  window.addEventListener('resize', setRem);
})();
