// Diagrams: turns the ```mermaid blocks of an article into SVG, coloured with the theme's tokens.
//
// Without JavaScript (or if the library cannot be loaded) nothing here runs and the diagram's
// source stays visible in the fallback box styled by article/_diagram.scss.

(function () {
  'use strict';

  var DIAGRAMS = 'pre.mermaid';
  var script = document.currentScript;
  var libraryUrl = script && script.dataset.mermaidUrl;

  if (!libraryUrl || !document.querySelector(DIAGRAMS)) return;

  // The theme's colours, read from the CSS custom properties so the light and dark
  // palettes both work and nothing is duplicated here.
  function token(name) {
    return getComputedStyle(document.documentElement).getPropertyValue('--' + name).trim();
  }

  function themeVariables() {
    return {
      fontFamily: '"Roboto", sans-serif',
      fontSize: '15px',

      background: token('main-bg-color'),
      textColor: token('text-color'),
      lineColor: token('text-color-important'),

      // boxes: the faint surface tone, an accent outline, dark text
      primaryColor: token('surface-color'),
      primaryTextColor: token('text-color-important'),
      primaryBorderColor: token('main-accent-color'),

      secondaryColor: token('main-light-color'),
      secondaryTextColor: token('text-color-important'),
      secondaryBorderColor: token('post-list-icon-color'),

      tertiaryColor: token('main-bg-color'),
      tertiaryTextColor: token('text-color'),
      tertiaryBorderColor: token('post-list-icon-color'),

      // clusters, notes, sequence actors and activations
      clusterBkg: token('main-bg-color'),
      clusterBorder: token('post-list-icon-color'),
      noteBkgColor: token('surface-color'),
      noteTextColor: token('text-color-important'),
      noteBorderColor: token('post-list-icon-color'),
      actorBkg: token('text-color-important'),
      actorTextColor: token('main-bg-color'),
      actorBorder: token('text-color-important'),
      actorLineColor: token('post-list-icon-color'),
      signalColor: token('text-color-important'),
      signalTextColor: token('text-color-important'),
      activationBkgColor: token('surface-color'),
      activationBorderColor: token('main-accent-color'),
      labelBoxBkgColor: token('surface-color'),
      labelBoxBorderColor: token('main-accent-color'),
      labelTextColor: token('text-color-important'),
      loopTextColor: token('text-color-important'),
      edgeLabelBackground: token('main-bg-color'),
      errorBkgColor: token('post-content-todo-border'),
      errorTextColor: token('on-accent-color')
    };
  }

  function showSourceAgain() {
    // the diagrams stay unprocessed: the stylesheet shows their source as a code box
    document.documentElement.classList.add('diagrams-failed');
  }

  import(libraryUrl)
    .then(function (module) {
      var mermaid = module.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: themeVariables()
      });
      return mermaid.run({ querySelector: DIAGRAMS });
    })
    .catch(function (error) {
      console.error('Diagrams could not be drawn:', error);
      showSourceAgain();
    });
})();
