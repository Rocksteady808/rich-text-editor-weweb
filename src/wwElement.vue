<template>
  <div class="rich-text-display" data-capture>
    <template v-if="isEditing">
      <div class="rich-text-display__toolbar">
        <button type="button" class="rte-btn" @click="insertHeading(1)" title="Heading 1">H1</button>
        <button type="button" class="rte-btn" @click="insertHeading(2)" title="Heading 2">H2</button>
        <button type="button" class="rte-btn" @click="insertHeading(3)" title="Heading 3">H3</button>
        <span class="rte-divider"></span>
        <button type="button" class="rte-btn" @click="insertBold" title="Bold"><strong>B</strong></button>
        <button type="button" class="rte-btn" @click="insertItalic" title="Italic"><em>I</em></button>
        <button type="button" class="rte-btn" @click="insertUnderline" title="Underline"><u>U</u></button>
        <span class="rte-divider"></span>
        <button type="button" class="rte-btn" @click="insertLink" title="Link to URL">Link</button>
        <select
          class="rte-select"
          title="Link to a page"
          :value="''"
          @change="insertPageLink($event.target.value); $event.target.value = ''"
        >
          <option value="" disabled>Link to page…</option>
          <option v-for="(page, index) in pages" :key="index" :value="page.path">{{ page.name }}</option>
        </select>
        <button type="button" class="rte-btn" @click="insertBulletList" title="Bullet list">&bull; List</button>
        <button type="button" class="rte-btn" @click="insertNumberedList" title="Numbered list">1. List</button>
        <button type="button" class="rte-btn" @click="insertImage" title="Image">Image</button>
        <button type="button" class="rte-btn" @click="insertParagraph" title="Paragraph">P</button>
      </div>
      <label class="rte-label">HTML Source</label>
      <p class="rte-hint">Click in the box, then select text with Shift+Arrow keys or Cmd/Ctrl+A, then click a button above.</p>
      <textarea
        ref="textarea"
        class="rich-text-display__source"
        :value="content.text"
        placeholder="Type or paste HTML here..."
        @input="handleInput"
        @paste="handlePaste"
      ></textarea>
      <label class="rte-label">Preview</label>
    </template>
    <div
      class="rich-text-display__content"
      :style="contentStyle"
      v-html="content.text"
    ></div>
  </div>
</template>

<script>
const ALLOWED_PASTE_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'strong', 'b', 'em', 'i', 'u', 's', 'a',
  'ul', 'ol', 'li', 'blockquote',
];

function cleanPastedHtml(html, doc) {
  const container = doc.createElement('div');
  container.innerHTML = html;

  const stripNode = (node) => {
    let child = node.firstChild;
    while (child) {
      if (child.nodeType !== 1) {
        child = child.nextSibling;
        continue;
      }

      const tag = child.tagName.toLowerCase();
      if (!ALLOWED_PASTE_TAGS.includes(tag)) {
        const firstMoved = child.firstChild;
        while (child.firstChild) {
          node.insertBefore(child.firstChild, child);
        }
        const originalNext = child.nextSibling;
        node.removeChild(child);
        child = firstMoved || originalNext;
        continue;
      }

      child.removeAttribute('style');
      child.removeAttribute('class');
      if (tag === 'a' && child.hasAttribute('href') && child.getAttribute('href').trim().toLowerCase().startsWith('javascript:')) {
        child.removeAttribute('href');
      } else if (tag !== 'a') {
        child.removeAttribute('href');
      }
      stripNode(child);
      child = child.nextSibling;
    }
  };

  stripNode(container);
  return container.innerHTML.trim();
}

export default {
  name: 'RichTextDisplay',
  props: {
    content: { type: Object, required: true },
    uid: { type: String, required: true },
    /* wwEditor:start */
    wwEditorState: { type: Object, required: true },
    /* wwEditor:end */
  },
  emits: ['update:content'],
  computed: {
    isEditing() {
      let result = false;
      /* wwEditor:start */
      result = !!this.wwEditorState?.isEditing;
      /* wwEditor:end */
      return result;
    },
    pages() {
      return this.content?.pages || [];
    },
    contentStyle() {
      return {
        '--text-color': this.content.textColor || '#000000',
        '--font-size': this.content.fontSize || '16px',
        '--font-family': this.content.fontFamily || 'inherit',
        '--line-height': this.content.lineHeight || '1.6',
        '--text-align': this.content.textAlign || 'left',
        '--bg-color': this.content.backgroundColor || 'transparent',
        '--padding': this.content.padding || '8px',
        '--border-radius': this.content.borderRadius || '0px',
        '--border': this.content.showBorder
          ? `${this.content.borderWidth || '1px'} ${this.content.borderStyle || 'solid'} ${this.content.borderColor || '#ddd'}`
          : 'none',
        '--heading1-color': this.content.heading1Color || this.content.textColor || '#000000',
        '--heading1-font-size': this.content.heading1FontSize || undefined,
        '--heading1-font-family': this.content.heading1FontFamily || this.content.fontFamily || 'inherit',
        '--heading2-color': this.content.heading2Color || this.content.textColor || '#000000',
        '--heading2-font-size': this.content.heading2FontSize || undefined,
        '--heading2-font-family': this.content.heading2FontFamily || this.content.fontFamily || 'inherit',
        '--heading3-color': this.content.heading3Color || this.content.textColor || '#000000',
        '--heading3-font-size': this.content.heading3FontSize || undefined,
        '--heading3-font-family': this.content.heading3FontFamily || this.content.fontFamily || 'inherit',
        '--heading4-color': this.content.heading4Color || this.content.textColor || '#000000',
        '--heading4-font-size': this.content.heading4FontSize || undefined,
        '--heading4-font-family': this.content.heading4FontFamily || this.content.fontFamily || 'inherit',
        '--heading5-color': this.content.heading5Color || this.content.textColor || '#000000',
        '--heading5-font-size': this.content.heading5FontSize || undefined,
        '--heading5-font-family': this.content.heading5FontFamily || this.content.fontFamily || 'inherit',
        '--heading6-color': this.content.heading6Color || this.content.textColor || '#000000',
        '--heading6-font-size': this.content.heading6FontSize || undefined,
        '--heading6-font-family': this.content.heading6FontFamily || this.content.fontFamily || 'inherit',
        '--paragraph-color': this.content.paragraphColor || this.content.textColor || '#000000',
        '--paragraph-font-size': this.content.paragraphFontSize || this.content.fontSize || '16px',
        '--paragraph-font-family': this.content.paragraphFontFamily || this.content.fontFamily || 'inherit',
        '--link-color': this.content.linkColor || '#007bff',
        '--link-font-size': this.content.linkFontSize || this.content.fontSize || '16px',
        '--link-text-decoration': this.content.linkUnderline === false ? 'none' : 'underline',
        '--list-color': this.content.listColor || this.content.textColor || '#000000',
        '--list-font-size': this.content.listFontSize || this.content.fontSize || '16px',
        '--list-font-family': this.content.listFontFamily || this.content.fontFamily || 'inherit',
      };
    },
  },
  methods: {
    handleInput(event) {
      this.$emit('update:content', { text: event.target.value });
    },
    handlePaste(event) {
      const html = event.clipboardData?.getData('text/html');
      if (!html) return;

      event.preventDefault();
      const doc = wwLib.getFrontWindow().document;
      const cleaned = cleanPastedHtml(html, doc);
      this.insertAtCursor(cleaned);
    },
    wrapSelection(before, after) {
      const textarea = this.$refs.textarea;
      const value = this.content.text || '';
      if (!textarea) {
        this.$emit('update:content', { text: value + before + after });
        return;
      }
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.slice(start, end);
      const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
      this.$emit('update:content', { text: newValue });
      this.$nextTick(() => {
        textarea.focus();
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + selected.length;
      });
    },
    insertAtCursor(snippet) {
      const textarea = this.$refs.textarea;
      const value = this.content.text || '';
      if (!textarea) {
        this.$emit('update:content', { text: value + snippet });
        return;
      }
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.slice(0, start) + snippet + value.slice(end);
      this.$emit('update:content', { text: newValue });
      this.$nextTick(() => {
        textarea.focus();
        const cursor = start + snippet.length;
        textarea.selectionStart = cursor;
        textarea.selectionEnd = cursor;
      });
    },
    insertHeading(level) {
      this.wrapSelection(`<h${level}>`, `</h${level}>`);
    },
    insertParagraph() {
      this.wrapSelection('<p>', '</p>');
    },
    insertBold() {
      this.wrapSelection('<strong>', '</strong>');
    },
    insertItalic() {
      this.wrapSelection('<em>', '</em>');
    },
    insertUnderline() {
      this.wrapSelection('<u>', '</u>');
    },
    insertLink() {
      const win = wwLib.getFrontWindow();
      const url = win.prompt('Link URL');
      if (!url || !url.trim() || url.trim().toLowerCase().startsWith('javascript:')) return;
      this.wrapSelection(`<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">`, '</a>');
    },
    insertPageLink(path) {
      if (!path) return;
      this.wrapSelection(`<a href="${path}">`, '</a>');
    },
    insertImage() {
      const win = wwLib.getFrontWindow();
      const url = win.prompt('Image URL');
      if (!url || !url.trim() || url.trim().toLowerCase().startsWith('javascript:')) return;
      this.insertAtCursor(`<img src="${url.trim()}" alt="" />`);
    },
    insertBulletList() {
      this.insertList('ul');
    },
    insertNumberedList() {
      this.insertList('ol');
    },
    insertList(tag) {
      const textarea = this.$refs.textarea;
      const value = this.content.text || '';
      const start = textarea ? textarea.selectionStart : value.length;
      const end = textarea ? textarea.selectionEnd : value.length;
      const selected = value.slice(start, end);
      const lines = selected
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const items = (lines.length > 0 ? lines : ['List item']).map((line) => `  <li>${line}</li>`).join('\n');
      const snippet = `<${tag}>\n${items}\n</${tag}>`;
      const newValue = value.slice(0, start) + snippet + value.slice(end);
      this.$emit('update:content', { text: newValue });
    },
  },
};
</script>

<style lang="scss" scoped>
.rich-text-display {
  width: 100%;
  box-sizing: border-box;
}

.rich-text-display__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  padding: 6px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
}

.rte-btn {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }
}

.rte-select {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 4px 6px;
  font-size: 13px;
  cursor: pointer;
  max-width: 140px;
}

.rte-divider {
  width: 1px;
  height: 18px;
  background: #ddd;
  margin: 0 4px;
}

.rte-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 6px 0 2px;
}

.rte-hint {
  font-size: 11px;
  color: #999;
  margin: 0 0 4px;
}

.rich-text-display__source {
  width: 100%;
  min-height: 160px;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  resize: vertical;
}
</style>

<style lang="scss">
.rich-text-display__content {
  width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
  display: block;

  background-color: var(--bg-color);
  padding: var(--padding);
  border-radius: var(--border-radius);
  border: var(--border);
  color: var(--text-color);
  font-size: var(--font-size);
  font-family: var(--font-family);
  line-height: var(--line-height);
  text-align: var(--text-align);

  h1, h2, h3, h4, h5, h6 {
    margin: 0.75em 0 0.5em 0;
    font-weight: 600;
    line-height: 1.3;
  }

  h1 {
    font-size: var(--heading1-font-size, 2em);
    color: var(--heading1-color);
    font-family: var(--heading1-font-family);
  }
  h2 {
    font-size: var(--heading2-font-size, 1.5em);
    color: var(--heading2-color);
    font-family: var(--heading2-font-family);
  }
  h3 {
    font-size: var(--heading3-font-size, 1.25em);
    color: var(--heading3-color);
    font-family: var(--heading3-font-family);
  }
  h4 {
    font-size: var(--heading4-font-size, 1.1em);
    color: var(--heading4-color);
    font-family: var(--heading4-font-family);
  }
  h5 {
    font-size: var(--heading5-font-size, 1em);
    color: var(--heading5-color);
    font-family: var(--heading5-font-family);
  }
  h6 {
    font-size: var(--heading6-font-size, 0.9em);
    color: var(--heading6-color);
    font-family: var(--heading6-font-family);
  }

  p {
    margin: 0.5em 0;
    color: var(--paragraph-color);
    font-size: var(--paragraph-font-size);
    font-family: var(--paragraph-font-family);
  }

  ul, ol {
    margin: 0.5em 0;
    padding-left: 2em;
    color: var(--list-color);
    font-size: var(--list-font-size);
    font-family: var(--list-font-family);
  }

  ul li, ol li {
    margin: 0.25em 0;
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  strong, b {
    font-weight: 700;
  }

  em, i {
    font-style: italic;
  }

  u {
    text-decoration: underline;
  }

  a {
    color: var(--link-color);
    font-size: var(--link-font-size);
    text-decoration: var(--link-text-decoration);

    &:hover {
      filter: brightness(0.85);
    }
  }

  blockquote {
    margin: 1em 0;
    padding-left: 1em;
    border-left: 4px solid #ddd;
    color: #666;
  }

  code {
    background-color: #f4f4f4;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: #f4f4f4;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1em 0;

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0.5em 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;

    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    th {
      background-color: #f4f4f4;
      font-weight: 600;
    }
  }
}
</style>
