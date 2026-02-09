import { useMemo } from 'react';
import { marked } from 'marked';

marked.setOptions({
  gfm: true,
  breaks: false,
});

export default function MarkdownRenderer({ content }) {
  const html = useMemo(() => marked.parse(content || ''), [content]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
