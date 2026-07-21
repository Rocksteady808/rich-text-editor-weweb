<template>
  <div class="rich-text-display" data-capture>
    <template v-if="isTextEditionMode">
      <div class="rich-text-display__toolbar">
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertHeading(1)" title="Heading 1">H1</button>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertHeading(2)" title="Heading 2">H2</button>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertHeading(3)" title="Heading 3">H3</button>
        <span class="rte-divider"></span>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertBold" title="Bold"><strong>B</strong></button>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertItalic" title="Italic"><em>I</em></button>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertUnderline" title="Underline"><u>U</u></button>
        <span class="rte-divider"></span>
        <button type="button" class="rte-btn" @mousedown.prevent @click="openLinkModal" title="Insert link">Link</button>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertBulletList" title="Bullet list">&bull; List</button>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertNumberedList" title="Numbered list">1. List</button>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertImage" title="Image">Image</button>
        <button type="button" class="rte-btn" @mousedown.prevent @click="insertParagraph" title="Paragraph">P</button>
      </div>

      <div v-if="linkModal.visible" class="rte-modal-overlay" @mousedown.stop @click.stop>
        <div class="rte-modal">
          <label class="rte-modal-label">Link to</label>
          <select v-model="linkModal.type" class="rte-modal-select">
            <option value="url">Url</option>
            <option value="page">Page</option>
            <option value="email">Email</option>
            <option value="phone">Phone number</option>
          </select>

          <template v-if="linkModal.type === 'page'">
            <label class="rte-modal-label">Page</label>
            <select v-model="linkModal.value" class="rte-modal-select">
              <option value="" disabled>Select a page…</option>
              <option v-for="(page, index) in pages" :key="index" :value="page.path">{{ page.name }}</option>
            </select>

            <template v-if="linkModal.value">
              <label class="rte-modal-label">Section</label>
              <select v-model="linkModal.section" class="rte-modal-select">
                <option value="">Top of page</option>
                <option v-for="(section, index) in selectedPageSections" :key="index" :value="section.anchor">{{ section.name }}</option>
              </select>
            </template>
          </template>
          <template v-else-if="linkModal.type === 'email'">
            <label class="rte-modal-label">Email address</label>
            <input v-model="linkModal.value" class="rte-modal-input" placeholder="name@example.com" @focus="$event.target.select()" />
          </template>
          <template v-else-if="linkModal.type === 'phone'">
            <label class="rte-modal-label">Phone number</label>
            <input v-model="linkModal.value" class="rte-modal-input" placeholder="+1 555 555 5555" @focus="$event.target.select()" />
          </template>
          <template v-else>
            <label class="rte-modal-label">Url</label>
            <input v-model="linkModal.value" class="rte-modal-input" placeholder="https://example.com" @keydown.enter="applyLinkModal" @focus="$event.target.select()" />
          </template>

          <template v-if="linkModal.type === 'url' || linkModal.type === 'page'">
            <label class="rte-modal-label rte-modal-label--row">
              <span>Open in new tab</span>
              <input type="checkbox" v-model="linkModal.newTab" />
            </label>
          </template>

          <div class="rte-modal-actions">
            <button type="button" class="rte-modal-btn rte-modal-btn--cancel" @click="closeLinkModal">Cancel</button>
            <button type="button" class="rte-modal-btn rte-modal-btn--ok" @click="applyLinkModal">OK</button>
          </div>
        </div>
      </div>

    </template>
    <div
      v-if="isTextEditionMode"
      ref="editor"
      class="rich-text-display__content rich-text-display__content--editing"
      :style="contentStyle"
      contenteditable="true"
      draggable="false"
      @input="handleInput"
      @paste="handlePaste"
      @mousedown="handleMouseDown"
      @mouseup="captureSelection"
      @keyup="captureSelection"
      @dragstart.prevent
    ></div>
    <div
      v-else
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
  data() {
    return {
      linkModal: {
        visible: false,
        type: 'url',
        value: '',
        section: '',
        newTab: false,
      },
      savedRange: null,
      isInternalUpdate: false,
    };
  },
  watch: {
    'content.text'(newValue) {
      if (this.isInternalUpdate) {
        this.isInternalUpdate = false;
        return;
      }
      const editor = this.$refs.editor;
      if (editor && editor.innerHTML !== (newValue || '')) {
        editor.innerHTML = newValue || '';
      }
    },
    isTextEditionMode(editing) {
      if (editing) {
        this.$nextTick(() => {
          if (this.$refs.editor) {
            this.$refs.editor.innerHTML = this.content.text || '';
            this.$refs.editor.focus();
          }
        });
      }
    },
  },
  mounted() {
    if (this.isTextEditionMode && this.$refs.editor) {
      this.$refs.editor.innerHTML = this.content.text || '';
    }
  },
  computed: {
    isEditing() {
      let result = false;
      /* wwEditor:start */
      result = !!this.wwEditorState?.isEditing;
      /* wwEditor:end */
      return result;
    },
    isTextEditionMode() {
      let result = false;
      /* wwEditor:start */
      result = this.wwEditorState?.editMode === wwLib.wwEditorHelper.EDIT_MODES.EDITION;
      /* wwEditor:end */
      return result;
    },
    pages() {
      return this.content?.pages || [];
    },
    selectedPageSections() {
      const page = this.pages.find((p) => p.path === this.linkModal.value);
      return page?.sections || [];
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
        '--font-weight': this.content.fontWeight || undefined,
        '--heading1-color': this.content.heading1Color || this.content.textColor || '#000000',
        '--heading1-font-size': this.content.heading1FontSize || undefined,
        '--heading1-font-family': this.content.heading1FontFamily || this.content.fontFamily || 'inherit',
        '--heading1-font-weight': this.content.heading1FontWeight || undefined,
        '--heading1-line-height': this.content.heading1LineHeight || undefined,
        '--heading2-color': this.content.heading2Color || this.content.textColor || '#000000',
        '--heading2-font-size': this.content.heading2FontSize || undefined,
        '--heading2-font-family': this.content.heading2FontFamily || this.content.fontFamily || 'inherit',
        '--heading2-font-weight': this.content.heading2FontWeight || undefined,
        '--heading2-line-height': this.content.heading2LineHeight || undefined,
        '--heading3-color': this.content.heading3Color || this.content.textColor || '#000000',
        '--heading3-font-size': this.content.heading3FontSize || undefined,
        '--heading3-font-family': this.content.heading3FontFamily || this.content.fontFamily || 'inherit',
        '--heading3-font-weight': this.content.heading3FontWeight || undefined,
        '--heading3-line-height': this.content.heading3LineHeight || undefined,
        '--heading4-color': this.content.heading4Color || this.content.textColor || '#000000',
        '--heading4-font-size': this.content.heading4FontSize || undefined,
        '--heading4-font-family': this.content.heading4FontFamily || this.content.fontFamily || 'inherit',
        '--heading4-font-weight': this.content.heading4FontWeight || undefined,
        '--heading4-line-height': this.content.heading4LineHeight || undefined,
        '--heading5-color': this.content.heading5Color || this.content.textColor || '#000000',
        '--heading5-font-size': this.content.heading5FontSize || undefined,
        '--heading5-font-family': this.content.heading5FontFamily || this.content.fontFamily || 'inherit',
        '--heading5-font-weight': this.content.heading5FontWeight || undefined,
        '--heading5-line-height': this.content.heading5LineHeight || undefined,
        '--heading6-color': this.content.heading6Color || this.content.textColor || '#000000',
        '--heading6-font-size': this.content.heading6FontSize || undefined,
        '--heading6-font-family': this.content.heading6FontFamily || this.content.fontFamily || 'inherit',
        '--heading6-font-weight': this.content.heading6FontWeight || undefined,
        '--heading6-line-height': this.content.heading6LineHeight || undefined,
        '--paragraph-color': this.content.paragraphColor || this.content.textColor || '#000000',
        '--paragraph-font-size': this.content.paragraphFontSize || this.content.fontSize || '16px',
        '--paragraph-font-family': this.content.paragraphFontFamily || this.content.fontFamily || 'inherit',
        '--paragraph-font-weight': this.content.paragraphFontWeight || undefined,
        '--paragraph-line-height': this.content.paragraphLineHeight || undefined,
        '--link-color': this.content.linkColor || '#007bff',
        '--link-font-size': this.content.linkFontSize || this.content.fontSize || '16px',
        '--link-text-decoration': this.content.linkUnderline === false ? 'none' : 'underline',
        '--link-font-weight': this.content.linkFontWeight || undefined,
        '--list-color': this.content.listColor || this.content.textColor || '#000000',
        '--list-font-size': this.content.listFontSize || this.content.fontSize || '16px',
        '--list-font-family': this.content.listFontFamily || this.content.fontFamily || 'inherit',
        '--list-font-weight': this.content.listFontWeight || undefined,
        '--list-line-height': this.content.listLineHeight || undefined,
      };
    },
  },
  methods: {
    syncContent() {
      const editor = this.$refs.editor;
      if (!editor) return;
      this.isInternalUpdate = true;
      this.$emit('update:content', { text: editor.innerHTML });
    },
    handleInput() {
      this.syncContent();
    },
    handlePaste(event) {
      event.preventDefault();
      const html = event.clipboardData?.getData('text/html');
      const doc = wwLib.getFrontWindow().document;

      if (!html) {
        const text = event.clipboardData?.getData('text/plain') || '';
        doc.execCommand('insertText', false, text);
        this.syncContent();
        return;
      }

      const cleaned = cleanPastedHtml(html, doc);
      doc.execCommand('insertHTML', false, cleaned);
      this.syncContent();
    },
    focusEditor() {
      const editor = this.$refs.editor;
      if (editor) editor.focus();
    },
    captureSelection() {
      const win = wwLib.getFrontWindow();
      const selection = win.getSelection();
      if (selection && selection.rangeCount > 0) {
        this.savedRange = selection.getRangeAt(0).cloneRange();
      }
    },
    handleMouseDown(event) {
      // If mousedown lands inside an existing (non-collapsed) text selection,
      // browsers start a native "drag this selected text" gesture instead of
      // starting a new selection - which visually looks like the component
      // itself is being dragged. Collapse the old selection to the click
      // point first so the following drag always starts a fresh selection.
      const win = wwLib.getFrontWindow();
      const selection = win.getSelection();
      if (!selection || selection.isCollapsed) return;

      const doc = win.document;
      let range = null;
      if (doc.caretRangeFromPoint) {
        range = doc.caretRangeFromPoint(event.clientX, event.clientY);
      } else if (doc.caretPositionFromPoint) {
        const pos = doc.caretPositionFromPoint(event.clientX, event.clientY);
        if (pos) {
          range = doc.createRange();
          range.setStart(pos.offsetNode, pos.offset);
          range.collapse(true);
        }
      }
      if (!range) return;

      selection.removeAllRanges();
      selection.addRange(range);
    },
    restoreSelection() {
      const editor = this.$refs.editor;
      if (!editor) return;
      editor.focus();
      if (!this.savedRange) return;
      const win = wwLib.getFrontWindow();
      const selection = win.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.savedRange);
    },
    exec(command, value = null) {
      this.restoreSelection();
      const doc = wwLib.getFrontWindow().document;
      doc.execCommand(command, false, value);
      this.captureSelection();
      this.syncContent();
    },
    insertHeading(level) {
      this.exec('formatBlock', `H${level}`);
    },
    insertParagraph() {
      this.exec('formatBlock', 'P');
    },
    insertBold() {
      this.exec('bold');
    },
    insertItalic() {
      this.exec('italic');
    },
    insertUnderline() {
      this.exec('underline');
    },
    openLinkModal() {
      this.captureSelection();
      this.linkModal = { visible: true, type: 'url', value: '', section: '', newTab: false };
    },
    closeLinkModal() {
      this.linkModal.visible = false;
    },
    applyLinkModal() {
      const { type, value, section, newTab } = this.linkModal;
      const trimmed = (value || '').trim();
      if (!trimmed) {
        this.closeLinkModal();
        return;
      }

      let href = '';
      if (type === 'page') {
        href = trimmed + (section ? `#${section}` : '');
      } else if (type === 'email') {
        href = `mailto:${trimmed}`;
      } else if (type === 'phone') {
        href = `tel:${trimmed.replace(/[^0-9+]/g, '')}`;
      } else {
        if (trimmed.toLowerCase().startsWith('javascript:')) {
          this.closeLinkModal();
          return;
        }
        href = trimmed;
      }

      this.restoreSelection();
      const doc = wwLib.getFrontWindow().document;
      const win = wwLib.getFrontWindow();
      doc.execCommand('createLink', false, href);

      // execCommand createLink can't set target/rel directly — find the anchor(s)
      // just created within the restored selection and set them ourselves.
      if ((type === 'url' || type === 'page') && newTab) {
        const selection = win.getSelection();
        if (selection && selection.anchorNode) {
          let node = selection.anchorNode;
          const editor = this.$refs.editor;
          while (node && node !== editor) {
            if (node.nodeType === 1 && node.tagName === 'A') {
              node.setAttribute('target', '_blank');
              node.setAttribute('rel', 'noopener noreferrer');
              break;
            }
            node = node.parentNode;
          }
        }
      }

      this.syncContent();
      this.closeLinkModal();
    },
    insertImage() {
      const win = wwLib.getFrontWindow();
      const url = win.prompt('Image URL');
      if (!url || !url.trim() || url.trim().toLowerCase().startsWith('javascript:')) return;
      this.exec('insertHTML', `<img src="${url.trim()}" alt="" />`);
    },
    insertBulletList() {
      this.exec('insertUnorderedList');
    },
    insertNumberedList() {
      this.exec('insertOrderedList');
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

.rte-divider {
  width: 1px;
  height: 18px;
  background: #ddd;
  margin: 0 4px;
}

.rte-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.rte-modal {
  background: #1a1a1a;
  color: #fff;
  border-radius: 8px;
  padding: 20px;
  width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.rte-modal-label {
  display: block;
  font-size: 12px;
  color: #aaa;
  margin: 12px 0 4px;

  &:first-child {
    margin-top: 0;
  }

  &--row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    color: #ddd;
    cursor: pointer;

    input[type="checkbox"] {
      cursor: pointer;
    }
  }
}

.rte-modal-select,
.rte-modal-input {
  width: 100%;
  box-sizing: border-box;
  background: #2b2b2b;
  color: #fff;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
}

.rte-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 20px;
}

.rte-modal-btn {
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;

  &--cancel {
    background: transparent;
    color: #ccc;

    &:hover {
      background: #2b2b2b;
    }
  }

  &--ok {
    background: #3b82f6;
    color: #fff;

    &:hover {
      background: #2563eb;
    }
  }
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
  color: var(--text-color) !important;
  font-size: var(--font-size) !important;
  font-family: var(--font-family) !important;
  font-weight: var(--font-weight, normal) !important;
  line-height: var(--line-height);
  text-align: var(--text-align);

  &--editing {
    min-height: 1.5em;
    cursor: text;
    outline: 1px dashed transparent;

    &:focus {
      outline: 1px dashed #3b82f6;
    }

    &:empty::before {
      content: 'Click to start typing…';
      color: #999;
      pointer-events: none;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0.75em 0 0.5em 0;
    line-height: 1.3;
  }

  h1 {
    font-size: var(--heading1-font-size, 2em) !important;
    color: var(--heading1-color) !important;
    font-family: var(--heading1-font-family) !important;
    font-weight: var(--heading1-font-weight, 600) !important;
    line-height: var(--heading1-line-height, 1.3) !important;
  }
  h2 {
    font-size: var(--heading2-font-size, 1.5em) !important;
    color: var(--heading2-color) !important;
    font-family: var(--heading2-font-family) !important;
    font-weight: var(--heading2-font-weight, 600) !important;
    line-height: var(--heading2-line-height, 1.3) !important;
  }
  h3 {
    font-size: var(--heading3-font-size, 1.25em) !important;
    color: var(--heading3-color) !important;
    font-family: var(--heading3-font-family) !important;
    font-weight: var(--heading3-font-weight, 600) !important;
    line-height: var(--heading3-line-height, 1.3) !important;
  }
  h4 {
    font-size: var(--heading4-font-size, 1.1em) !important;
    color: var(--heading4-color) !important;
    font-family: var(--heading4-font-family) !important;
    font-weight: var(--heading4-font-weight, 600) !important;
    line-height: var(--heading4-line-height, 1.3) !important;
  }
  h5 {
    font-size: var(--heading5-font-size, 1em) !important;
    color: var(--heading5-color) !important;
    font-family: var(--heading5-font-family) !important;
    font-weight: var(--heading5-font-weight, 600) !important;
    line-height: var(--heading5-line-height, 1.3) !important;
  }
  h6 {
    font-size: var(--heading6-font-size, 0.9em) !important;
    color: var(--heading6-color) !important;
    font-family: var(--heading6-font-family) !important;
    font-weight: var(--heading6-font-weight, 600) !important;
    line-height: var(--heading6-line-height, 1.3) !important;
  }

  p {
    margin: 0.5em 0;
    color: var(--paragraph-color) !important;
    font-size: var(--paragraph-font-size) !important;
    font-family: var(--paragraph-font-family) !important;
    font-weight: var(--paragraph-font-weight, normal) !important;
    line-height: var(--paragraph-line-height, var(--line-height)) !important;
  }

  ul, ol {
    margin: 0.5em 0;
    padding-left: 2em;
    color: var(--list-color) !important;
    font-size: var(--list-font-size) !important;
    font-family: var(--list-font-family) !important;
    font-weight: var(--list-font-weight, normal) !important;
    line-height: var(--list-line-height, var(--line-height)) !important;
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
    color: var(--link-color) !important;
    font-size: var(--link-font-size) !important;
    text-decoration: var(--link-text-decoration) !important;
    font-weight: var(--link-font-weight, normal) !important;

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
