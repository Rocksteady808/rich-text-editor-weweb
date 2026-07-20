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
        <button type="button" class="rte-btn" @click="insertLink" title="Link">Link</button>
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
      };
    },
  },
  methods: {
    handleInput(event) {
      this.$emit('update:content', { text: event.target.value });
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

  h1 { font-size: 2em; }
  h2 { font-size: 1.5em; }
  h3 { font-size: 1.25em; }
  h4 { font-size: 1.1em; }
  h5 { font-size: 1em; }
  h6 { font-size: 0.9em; }

  p {
    margin: 0.5em 0;
  }

  ul, ol {
    margin: 0.5em 0;
    padding-left: 2em;
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
    color: #007bff;
    text-decoration: underline;

    &:hover {
      color: #0056b3;
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
