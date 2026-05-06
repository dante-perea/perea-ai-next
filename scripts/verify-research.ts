import { getResearch, listResearch } from "../lib/research";

async function main() {
  const list = listResearch();
  console.log("PAPERS:", list.map(p => p.slug));

  const paper = await getResearch("b2a-2026");
  if (!paper) {
    console.error("FAILED to load paper");
    process.exit(1);
  }

  console.log("TITLE:", paper.frontmatter.title);
  console.log("WORDS:", paper.wordCount);
  console.log("READ_MIN:", paper.readingTimeMinutes);
  console.log("TOC_ITEMS:", paper.toc.length);
  console.log("TOC_SAMPLE:");
  console.log(paper.toc.slice(0, 8).map((t) => `  [L${t.level}] ${t.text} (#${t.id})`).join("\n"));
  console.log("HTML_BYTES:", paper.html.length);
  console.log("HEADING_IDS:", (paper.html.match(/id="[^"]+"/g) || []).slice(0, 5));
  console.log("TABLE_PRESENT:", paper.html.includes('class="r-table"'));
  console.log("LIST_PRESENT:", paper.html.includes('class="r-list"'));
  console.log("QUOTE_PRESENT:", paper.html.includes('class="r-quote"'));
  console.log("ANCHOR_LINK_PRESENT:", paper.html.includes('class="r-anchor"'));
  console.log("DIVIDER_PRESENT:", paper.html.includes('class="r-divider"'));
}

main();
