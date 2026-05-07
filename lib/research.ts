import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { Marked } from "marked";
import markedFootnote from "marked-footnote";
import { getTranslation, listTranslatedSlugs } from "./research-translations";

const RESEARCH_DIR = path.join(process.cwd(), "content", "whitepapers");

export function researchDir(locale = "en"): string {
  return locale === "en" ? RESEARCH_DIR : path.join(RESEARCH_DIR, locale);
}

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
  // GEO/AEO + retrievability metadata
  profile?: "authority-survey" | "field-manual" | "technical-playbook" | "failure-mode" | "hedged";
  dateModified?: string;
  keywords?: string[];
  topical_entities?: string[];
  version_history?: { version: string; date: string; note?: string }[];
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

  m.use(markedFootnote({
    refMarkers: true,
    description: "References",
  }));

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

export async function getResearch(slug: string, locale = "en"): Promise<ResearchPaper | null> {
  let raw: string;

  if (locale !== "en") {
    // Check Neon DB first, fall back to filesystem
    let dbContent = await getTranslation(slug, locale).catch(() => null);
    if (dbContent) {
      // Strip any LLM preamble before the YAML frontmatter delimiter
      const fmIdx = dbContent.indexOf("---");
      if (fmIdx > 0) dbContent = dbContent.slice(fmIdx);
      raw = dbContent;
    } else {
      const filePath = path.join(researchDir(locale), `${slug}.md`);
      if (!fs.existsSync(filePath)) return null;
      raw = fs.readFileSync(filePath, "utf8");
    }
  } else {
    const filePath = path.join(researchDir("en"), `${slug}.md`);
    if (!fs.existsSync(filePath)) return null;
    raw = fs.readFileSync(filePath, "utf8");
  }
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

export function listResearch(locale = "en"): { slug: string; frontmatter: ResearchFrontmatter }[] {
  const dir = researchDir(locale);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return { slug, frontmatter: data as ResearchFrontmatter };
    })
    .sort((a, b) => (b.frontmatter.date || "").localeCompare(a.frontmatter.date || ""));
}

export function listResearchSlugs(locale = "en"): string[] {
  return listResearch(locale).map((p) => p.slug);
}

// For ES pages: slugs from DB (translations generated on Vercel)
export async function listTranslatedResearchSlugs(locale: string): Promise<string[]> {
  return listTranslatedSlugs(locale).catch(() => []);
}
