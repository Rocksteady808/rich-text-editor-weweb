# Rich Text Editor — WeWeb Custom Component

An in-canvas rich text editor for WeWeb, built with Vue 3 and Tiptap. Select text on the canvas
and style individual runs (bold, italic, underline, strikethrough, color, links), switch block
types (paragraph, H1-H3), toggle lists, and insert images — via a floating bubble menu that
appears on selection.

## Editing model

Editing is **design-time only**: the bubble menu and live editor only run inside the WeWeb
Editor. The published app never loads the editor — it renders the final HTML via a lightweight
`v-html` display, exactly like a static rich text block.

## Features

- **In-canvas editing**: click into the element and type directly; select text to reveal the
  bubble menu.
- **Per-run styling**: bold, italic, underline, strikethrough, and text color apply to the
  selected run only — other text is unaffected.
- **Structure**: headings (H1-H3), paragraphs, bullet and numbered lists, links, images.
- **Clean paste**: pasting from Word/Google Docs/webpages keeps structure (headings, bold,
  lists, links) but strips the source's inline styles/fonts, so pasted content matches this
  component's own styling.
- **Comprehensive container/typography styling**: unchanged from the previous version — full
  control via WeWeb's property panel (colors, padding, border, font, alignment, etc.).
- **Bindable content**: the underlying HTML stays in the bindable `text` property, so anything
  already consuming this component (variables, databases, APIs) keeps working unchanged.

## Development

This component was scaffolded using [@weweb/cli](https://www.npmjs.com/package/@weweb/cli).

### Installation

```bash
npm install
```

### Development Server

```bash
npm run serve
```

The component will be available at `https://localhost:8080/`

### Build

```bash
npm run build
```

## Usage in WeWeb

1. Start the development server (`npm run serve`)
2. Open the WeWeb Editor in development mode
3. Add the component using the localhost URL: `https://localhost:8080/`
4. Click into the element and type, or paste content
5. Select text to reveal the bubble menu and apply formatting
6. Configure container/typography styling via the right-hand properties panel

## Component Properties

### Content

- **Content (HTML)** (`text`): the rich text content, bindable, edited directly on the canvas.

### Container Styling

- **Background Color**, **Padding**, **Show Border** (+ **Border Width**, **Border Style**,
  **Border Color** when enabled), **Border Radius**.

### Typography Settings

- **Text Color**, **Font Size**, **Font Family**, **Line Height**, **Text Alignment**.

## Supported content

- **Headings**: H1, H2, H3 (via the bubble menu's block-type dropdown)
- **Paragraphs**
- **Lists**: bullet and numbered
- **Text formatting**: bold, italic, underline, strikethrough, text color
- **Links**: insert/edit/remove via the bubble menu
- **Images**: insert by URL via the bubble menu

## Technical Details

- Built with Vue 3, editor powered by [Tiptap](https://tiptap.dev/) (ProseMirror-based)
- All Tiptap code is wrapped in `/* wwEditor:start */.../* wwEditor:end */` blocks, which
  `@weweb/cli` strips from production builds — the published app's bundle contains no editor
  code
- Published/preview rendering uses `v-html`, scoped SCSS styling with `:deep()` selectors
- Fully responsive with word-wrap
- Hot-reload enabled for development
