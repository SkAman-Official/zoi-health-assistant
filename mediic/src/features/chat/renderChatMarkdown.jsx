// A deliberately small Markdown subset rendered as React nodes, never raw HTML.
function safeLink(value) {
  if (/[\s\\]/u.test(value) || [...value].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return null;
  if (/^\/(?!\/)/u.test(value)) return value;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
function inline(text, depth = 0) {
  if (depth > 5) return text;
  const pattern = /(`[^`\n]+`|\*\*[^*\n]+\*\*|\*[^*\n]+\*|\[[^\]\n]+\]\([^\s)]+\))/gu;
  const nodes = [];
  let offset = 0;
  for (const match of text.matchAll(pattern)) {
    nodes.push(text.slice(offset, match.index));
    const token = match[0];
    const key = match.index;
    if (token.startsWith("`")) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith("**")) {
      nodes.push(<strong key={key}>{inline(token.slice(2, -2), depth + 1)}</strong>);
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key}>{inline(token.slice(1, -1), depth + 1)}</em>);
    } else {
      const separator = token.indexOf("](");
      const label = token.slice(1, separator);
      const href = safeLink(token.slice(separator + 2, -1));
      nodes.push(href ? <a key={key} href={href} target={href.startsWith("/") ? undefined : "_blank"} rel="noopener noreferrer">{inline(label, depth + 1)}</a> : label);
    }
    offset = match.index + token.length;
  }
  nodes.push(text.slice(offset));
  return nodes;
}
export default function renderChatMarkdown(text) {
  const blocks = [];
  let paragraph = [];
  let list = [];
  let listType = null;
  let start = 1;
  function flush() {
    if (paragraph.length) blocks.push(<p key={blocks.length}>{inline(paragraph.join("\n"))}</p>);
    if (list.length) {
      const Tag = listType;
      blocks.push(<Tag key={blocks.length} start={listType === "ol" ? start : undefined}>{list.map((item, index) => <li key={index}>{inline(item)}</li>)}</Tag>);
    }
    paragraph = [];
    list = [];
    listType = null;
  }
  for (const line of text.replace(/\r\n?/gu, "\n").split("\n")) {
    const item = line.match(/^\s*(?:([-+*])|(\d+)\.)\s+(.+)$/u);
    if (!line.trim()) {
      flush();
    } else if (item) {
      const type = item[1] ? "ul" : "ol";
      if (paragraph.length || listType && listType !== type) flush();
      if (!list.length) start = Number(item[2]) || 1;
      listType = type;
      list.push(item[3]);
    } else {
      if (list.length) flush();
      paragraph.push(line);
    }
  }
  flush();
  return <div className="zoi-chat-markdown">{blocks}</div>;
}
