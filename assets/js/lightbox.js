// Lightbox: click an article image to see it large in a modal. Without JS the image is a
// plain link that opens in a new tab, so nothing depends on this file.
//
//   Esc / click outside / close button   close
//   Left / Right, the arrow buttons, swipe   previous / next image of the page

(function () {
  'use strict';

  var LINKS = '.markdown .fig-im a';

  var links = [];       // every image link of the page, in reading order
  var current = -1;     // index into `links` of the image being shown
  var dialog, image, caption, counter, previousButton, nextButton;

  // ---- Building the modal ------------------------------------------------------------

  function element(tag, className, attributes) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    Object.keys(attributes || {}).forEach(function (name) {
      node.setAttribute(name, attributes[name]);
    });
    return node;
  }

  function button(className, label, content) {
    var node = element('button', 'lightbox-button ' + className, { type: 'button', 'aria-label': label });
    node.innerHTML = content;
    return node;
  }

  function build() {
    dialog = element('dialog', 'lightbox', { 'aria-label': 'Image viewer' });

    // Plain divs, not <figure>/<figcaption>: the article's figure styles (collapsed one-line
    // captions) would apply to those elements and cut a long caption.
    var figure = element('div', 'lightbox-figure');
    image = element('img', 'lightbox-image', { alt: '' });
    caption = element('div', 'lightbox-caption');
    figure.append(image, caption);

    var closeButton = button('lightbox-close', 'Close',
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>');
    previousButton = button('lightbox-previous', 'Previous image', '<i class="mdi mdi-chevron-left" aria-hidden="true"></i>');
    nextButton = button('lightbox-next', 'Next image', '<i class="mdi mdi-chevron-right" aria-hidden="true"></i>');
    counter = element('span', 'lightbox-counter');

    dialog.append(figure, closeButton, previousButton, nextButton, counter);
    document.body.appendChild(dialog);

    closeButton.addEventListener('click', function () { dialog.close(); });
    previousButton.addEventListener('click', function () { show(current - 1); });
    nextButton.addEventListener('click', function () { show(current + 1); });

    // A click on the dark area around the picture closes it
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target === figure) dialog.close();
    });

    dialog.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') show(current - 1);
      if (event.key === 'ArrowRight') show(current + 1);
    });

    enableSwipe(dialog);
  }

  // ---- Showing an image -------------------------------------------------------------

  function show(index) {
    if (index < 0 || index >= links.length) return;
    current = index;

    var link = links[index];
    var thumbnail = link.querySelector('img');
    var text = link.closest('figure').querySelector('figcaption');

    image.src = link.href;
    image.alt = thumbnail ? thumbnail.alt : '';
    caption.textContent = text ? text.textContent.trim() : '';
    caption.hidden = !caption.textContent;
    counter.textContent = links.length > 1 ? (index + 1) + ' / ' + links.length : '';

    previousButton.hidden = nextButton.hidden = links.length < 2;
    previousButton.disabled = index === 0;
    nextButton.disabled = index === links.length - 1;

    preload(index - 1);
    preload(index + 1);
  }

  function preload(index) {
    if (index >= 0 && index < links.length) new Image().src = links[index].href;
  }

  function open(index) {
    if (!dialog) build();
    links = Array.prototype.slice.call(document.querySelectorAll(LINKS));
    show(index);
    if (!dialog.open) dialog.showModal();
  }

  // ---- Touch: swipe left / right ------------------------------------------------------

  function enableSwipe(target) {
    var startX = null;

    target.addEventListener('touchstart', function (event) {
      startX = event.changedTouches[0].clientX;
    }, { passive: true });

    target.addEventListener('touchend', function (event) {
      if (startX === null) return;
      var distance = event.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(distance) < 50) return;
      show(current + (distance < 0 ? 1 : -1));
    });
  }

  // ---- Wiring --------------------------------------------------------------------------

  if (typeof HTMLDialogElement === 'undefined') return; // very old browser: links keep working

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; // keep "open in new tab"

    var link = event.target.closest(LINKS);
    if (!link) return;

    event.preventDefault();
    open(Array.prototype.indexOf.call(document.querySelectorAll(LINKS), link));
  });
})();
