((root, factory) => {
	if (typeof exports === 'object' ) {
    module.exports = factory(root);
  }

  window.vanillaToast = factory(root);
})(typeof global !== 'undefined' ? global : this.window || this.global, (root) => {
  const containerId = 'vanilla-toast-container';
  const styleId = 'vanilla-toast-stylesheet';
  const contentClass = 'vanilla-toast-content';
  const fadeTime = 500;
  const defaultDuration = 2000;

  const createContainer = () => {
    const container = document.createElement('div');

    container.setAttribute('id', containerId);
    document.body.appendChild(container);

    return container;
  };

  const addStylesheet = () => {
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    const css = `
      #${containerId} {
        width: 322px;
        position: fixed;
        right: 10px;
        bottom: 0;
        cursor: default;
        color: #fff;
        font-size: 14px;
        z-index: 9999;
        line-height: 20px;
        font-family: 'Roboto', 'Open sans', arial, sans-serif;
      }

      .${contentClass} {
        padding: 14px 10px;
        margin-bottom: 10px;
        background: #323232;
        border-radius: 2px;
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.26);
      }`;

    style.type = 'text/css';
    style.id = styleId;
    style.appendChild(document.createTextNode(css));
    head.appendChild(style);
  };

  const isStylesheetAdded = () => document.getElementById(containerId) !== null;

  const getContainer = () => {
    const container = document.getElementById(containerId);

    if (!isStylesheetAdded()) {
      addStylesheet();
    }

    if (container === null) {
      return createContainer();
    } else {
      return container;
    }
  };

  const fadeIn = (el, timeout, callback) => {
    el.style.opacity = 0;

    let lastTime = +new Date();

    const tick = () => {
      el.style.opacity = +el.style.opacity + (new Date() - lastTime) / timeout;
      lastTime = +new Date();

      if (+el.style.opacity < 1) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
      } else {
        el.style.opacity = 1;
        if (typeof callback === 'function') {
          callback();
        }
      }
    };

    tick();
  };

  const fadeOut = (el, timeout, callback) => {
    el.style.opacity = 1;

    let lastTime = +new Date();

    const tick = () => {
      el.style.opacity = +el.style.opacity - (new Date() - lastTime) / timeout;
      lastTime = +new Date();

      if (+el.style.opacity > 0) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
      } else {
        el.style.opacity = 0;
        if (typeof callback === 'function') {
          callback();
        }
      }
    };

    tick();
  };

  const createToast = (text) => {
    const toast = document.createElement('div');

    toast.classList.add(contentClass);
    toast.textContent = text;

    return toast;
  };

  const showToast = (text, duration = defaultDuration) => {
    const toast = createToast(text);
    const container = getContainer();

    container.appendChild(toast);

    const closeToast = () => {
      closeAndRemoveToast(toast);
    };

    let timeout;

    fadeIn(toast, fadeTime, () => {
      timeout = setTimeout(closeToast, duration);
    });

    toast.addEventListener('click', () => {
      clearTimeout(timeout);
      closeToast(toast);
    });

    return {
      close: closeToast,
    };
  };

  const closeAndRemoveToast = (toast) => {
    fadeOut(toast, fadeTime, () => {
      toast.remove();
    });
  };

  const vanillaToast = {
    showToast,
  };

  return vanillaToast;
});
