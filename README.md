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

Not included (the design system has no component for them): newsletter, analytics, `og:` meta tags, language selector, portfolio layouts, custom RSS/sitemap templates (Hugo's built-ins apply).

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
  opengraph: { enabled: false }   # {{< og >}} fetches the linked pages at build time when true
  umami: { url: ..., id: ... }    # analytics; add skipOnServer: true to leave `hugo server` out
  mermaid: { url: ... }           # build of mermaid to load (default: pinned jsdelivr ESM build)
```

Set `markup.highlight.noClasses: false` so code-block line numbers and `hl_lines` can be styled.

## Shortcodes

| Shortcode | Use |
| --- | --- |
| `{{< og "https://..." >}}` | Link-preview card (YouTube becomes a player). Tweets render as a generic card. |
| `{{< gallery columns=2 >}}` (or `{{< gallery 2 >}}`) | One image per line, optional `"caption"`; `columns` is the number of images per row, default 3. |
| `{{< warn "Title" "Text" >}}details{{< /warn >}}` | Orange callout. |
| `{{< todo >}}notes{{< /todo >}}` | "Missing content" callout. |
| `{{< biglink "url" "Label" >}}` | Outlined button. |
| `{{< social-icon link="..." icon="mdi-github" >}}` | Square social icon. |
| `{{< mdi "mdi-name" >}}` | Inline icon (only the shipped subset has glyphs). |
| `{{< age >}}` | Years since `params.birthdate` (default 2001-12-17). |
