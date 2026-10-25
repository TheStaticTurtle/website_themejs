# Turtle JS

Hugo theme implementing the **TheStaticTurtle design system**: flat, square-cornered, Bebas Neue headings, plain Roboto text, one green accent, a light palette, plus an opt-in dark one (`<html data-theme="dark">`, never picked automatically).

License: [CC BY-NC-SA 4.0](LICENSE.md).

## Layout

| Path | What |
| --- | --- |
| `assets/scss/main.scss` | Entry point; the folders below are pulled in with `@use`. |
| `assets/scss/abstracts/` | Variables (breakpoints, spacing, type), mixins, icon glyph map. |
| `assets/scss/base/` | Colour tokens (light/dark custom properties), fonts and icons, document defaults. |
| `assets/scss/layout/` | Container, header, footer. |
| `assets/scss/components/` | Buttons, tags, post cards, pagination, table of contents. |
| `assets/scss/article/` | Everything inside a `.markdown` element: prose, code, tables, task lists, callouts, figures, embeds. |
| `layouts/` | Home, lists, taxonomy index, post and page layouts; partials mirror the design system's components (`SiteHeader`, `PostCard`, `PageSelector`, `SiteFooter`, `EmbedCard`, `Figure`). |

Also provided: full-content RSS feed, `robots.txt`, a per-language sitemap with a root index (the `contributors` section is left out and marked `noindex`), canonical/hreflang links and OpenGraph/Twitter card tags (`partials/seo.html`), Umami analytics, a listmonk newsletter form (sent in the background with JavaScript, plain form without), giscus comments, Mermaid diagrams (with a no-JS fallback) and an image lightbox, and a table of contents of the post (two levels, current section highlighted) in the left gutter on screens wider than 1730px; `toc: false` in a post's front matter hides it.

Not included: language selector, dark mode switch, portfolio layouts.

## Building the styles

Styles are Sass, compiled by Hugo with `css.Sass` and the **Dart Sass** transpiler, so the `sass` executable must be on the PATH (`npm i -g sass`). Colours are CSS custom properties defined in `base/_tokens.scss`; to add an icon, add its code point to `abstracts/_icon-glyphs.scss`.

## Params

```yaml
params:
  description: ...
  header:
    links: [{ name: Blog, url: https://... }]
  pagination: { articleCount: 9 }
  comments: { enabled: true, repo: owner/repo, repoId: ..., category: General, categoryId: ... }  # giscus
  ssr: { user_agent: ... }   # User-Agent used when fetching pages for {{< og >}}
  opengraph: { enabled: false, skipImages: [host, ...] }   # {{< og >}} fetches the linked pages at build time when true; thumbnails hosted on skipImages are not downloaded
  umami: { url: ..., id: ... }    # analytics; add skipOnServer: true to leave `hugo server` out
  newsletter: { enabled: true, popup: true, url: https://listmonk.example.org, list: <list uuid> }  # listmonk form at the end of posts + slide-in panel
  fediverse: "@user@instance"   # fediverse:creator meta tag
  mermaid: { url: ... }           # build of mermaid to load (default: pinned jsdelivr ESM build)
```

Required site config:

```yaml
markup:
  highlight: { noClasses: false }                          # the theme styles the Chroma classes
  goldmark:
    parser: { wrapStandAloneImageWithinParagraph: false }  # images alone in a paragraph become figures
    renderer: { unsafe: true }                             # raw HTML in posts
outputs:
  home: [HTML, RSS]       # no SITEMAP: the theme ships its own sitemap templates
  section: [HTML]
  taxonomy: [HTML]
  term: [HTML]
enableRobotsTXT: true
```

Links to other sites open in a new tab (`render-link`). An image in the middle of a line of text stays an inline picture, without caption or lightbox. Posts use their `image` front matter as cover and social preview; other pages use the logo.

## Shortcodes

| Shortcode | Use |
| --- | --- |
| `{{< og "https://..." >}}` | Link-preview card. YouTube becomes a player, tweets use the official widget (with a card as fallback), anything else is a card built from the page's OpenGraph tags. A page that fails to load only affects its own card, which falls back to the plain URL. |
| `{{< gallery columns=2 >}}` (or `{{< gallery 2 >}}`) | One image per line, optional `"caption"`; `columns` is the number of images per row. Without it, rows hold up to 3 images and an incomplete row stretches to fill the width. |
| `{{< warn "Title" "Text" >}}details{{< /warn >}}` | Orange callout. |
| `{{< todo >}}notes{{< /todo >}}` | "Missing content" callout. |
| `{{< biglink "url" "Label" >}}` | Outlined button. |
| `{{< social-icon link="..." icon="mdi-github" >}}` | Square social icon. |
| `{{< mdi "mdi-name" >}}` | Inline icon (only the shipped subset has glyphs). |
| `{{< age >}}` | Years since `params.birthdate` (default 2001-12-17). |

