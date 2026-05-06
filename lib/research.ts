import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";

const RESEARCH_DIR = path.join(process.cwd(), "content", "whitepapers");

export interface ResearchFrontmatter {
  title: string;
  subtitle?: string;
  publication?: string;
  authors?: string[];
  version?: string;
  status?: string;
  date?: string;
  audience?: string;
  length?: string;
  license?: string;
  description?: string;
}

export interface ResearchTocItem {
  id: string;
  text: string;
  level: number;
}

export interface ResearchPaper {
  slug: string;
  frontmatter: ResearchFrontmatter;
  html: string;
  toc: ResearchTocItem[];
  readingTimeMinutes: number;
  wordCount: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function ensureUniqueId(id: string, used: Set<string>): string {
  let candidate = id || "section";
  let i = 2;
  while (used.has(candidate)) {
    candidate = `${id}-${i++}`;
  }
  used.add(candidate);
  return candidate;
}

function buildMarked(toc: ResearchTocItem[]) {
  const used = new Set<string>();
  const m = new Marked({
    gfm: true,
    breaks: false,
  });

  m.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = tokens
          .map((t) => ("text" in t && typeof t.text === "string" ? t.text : ""))
          .join("");
        const id = ensureUniqueId(slugify(plain), used);
        if (depth === 1 || depth === 2 || depth === 3) {
          toc.push({ id, text: plain, level: depth });
        }
        return `<h${depth} id="${id}" class="r-h r-h${depth}"><a href="#${id}" class="r-anchor" aria-label="Link to section">#</a>${text}</h${depth}>\n`;
      },
      table({ header, rows }) {
        const headerHtml = header
          .map((cell) => `<th>${this.parser.parseInline(cell.tokens)}</th>`)
          .join("");
        const bodyHtml = rows
          .map(
            (row) =>
              `<tr>${row
                .map((cell) => `<td>${this.parser.parseInline(cell.tokens)}</td>`)
                .join("")}</tr>`
          )
          .join("");
        return `<div class="r-table-wrap"><table class="r-table"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
      },
      blockquote({ tokens }) {
        return `<blockquote class="r-quote">${this.parser.parse(tokens)}</blockquote>`;
      },
      hr() {
        return `<hr class="r-divider" />`;
      },
      code({ text, lang }) {
        const safe = text
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<pre class="r-code"><code data-lang="${lang || ""}">${safe}</code></pre>`;
      },
      list({ ordered, items }) {
        const tag = ordered ? "ol" : "ul";
        const inner = items
          .map((item) => {
            const content = this.parser.parse(item.tokens);
            return `<li>${content}</li>`;
          })
          .join("");
        return `<${tag} class="r-list">${inner}</${tag}>`;
      },
    },
  });

  return m;
}

export async function getResearch(slug: string): Promise<ResearchPaper | null> {
  const filePath = path.join(RESEARCH_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const toc: ResearchTocItem[] = [];
  const m = buildMarked(toc);
  const html = await m.parse(content);

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 220));

  return {
    slug,
    frontmatter: data as ResearchFrontmatter,
    html,
    toc,
    readingTimeMinutes,
    wordCount,
  };
}

export function listResearch(): { slug: string; frontmatter: ResearchFrontmatter }[] {
  if (!fs.existsSync(RESEARCH_DIR)) return [];
  return fs
    .readdirSync(RESEARCH_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(RESEARCH_DIR, file), "utf8");
      const { data } = matter(raw);
      return { slug, frontmatter: data as ResearchFrontmatter };
    })
    .sort((a, b) => (b.frontmatter.date || "").localeCompare(a.frontmatter.date || ""));
}
