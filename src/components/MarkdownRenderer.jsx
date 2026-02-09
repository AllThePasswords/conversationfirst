import { useMemo } from 'react';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

marked.use({
  renderer: {
    code(token) {
      if (token.lang === 'cf-preview') {
        return `<div class="cf-preview">${token.text}</div>`;
      }
      return false;
    }
  }
});

export default function MarkdownRenderer({ content }) {
  const html = useMemo(() => marked.parse(content || ''), [content]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
