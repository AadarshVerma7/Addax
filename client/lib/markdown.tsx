import React from "react";

// A custom inline parser to handle bold formatting (**text**) and inline code (`code`)
export const parseInline = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  let keyIdx = 0;
  let i = 0;
  let currentStr = "";

  while (i < text.length) {
    // Check for bold tag: **
    if (text.startsWith("**", i)) {
      if (currentStr) {
        parts.push(currentStr);
        currentStr = "";
      }
      // Find end bold
      const endIdx = text.indexOf("**", i + 2);
      if (endIdx !== -1) {
        const boldText = text.substring(i + 2, endIdx);
        parts.push(
          <strong key={`bold-${keyIdx++}`} className="font-bold text-white">
            {parseInline(boldText)}
          </strong>
        );
        i = endIdx + 2;
      } else {
        currentStr += "**";
        i += 2;
      }
    }
    // Check for inline code tag: `
    else if (text[i] === "`") {
      if (currentStr) {
        parts.push(currentStr);
        currentStr = "";
      }
      // Find end code
      const endIdx = text.indexOf("`", i + 1);
      if (endIdx !== -1) {
        const codeText = text.substring(i + 1, endIdx);
        parts.push(
          <code key={`code-${keyIdx++}`} className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-400 font-mono text-xs border border-zinc-700/50">
            {codeText}
          </code>
        );
        i = endIdx + 1;
      } else {
        currentStr += "`";
        i++;
      }
    } else {
      currentStr += text[i];
      i++;
    }
  }

  if (currentStr) {
    parts.push(currentStr);
  }

  return parts;
};

// Parses Markdown structure (headings, bullets, numbered lists, block code, paragraphs)
export const renderMarkdown = (markdownText: string): React.ReactNode[] => {
  if (!markdownText) return [];
  const lines = markdownText.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        elements.push(
          <pre key={`code-${i}`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 my-3 overflow-x-auto text-xs font-mono text-zinc-200 select-text">
            <code>{codeBlockLines.join("\n")}</code>
          </pre>
        );
        inCodeBlock = false;
        codeBlockLines = [];
      } else {
        // Start of code block
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Headers
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-md font-semibold text-zinc-100 mt-4 mb-2">
          {parseInline(line.slice(4))}
        </h3>
      );
      continue;
    }
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-lg font-bold text-zinc-100 mt-6 mb-3 border-b border-zinc-800/40 pb-1">
          {parseInline(line.slice(3))}
        </h2>
      );
      continue;
    }
    if (line.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-xl font-extrabold text-zinc-200 mt-8 mb-4">
          {parseInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    // Bullet points
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const cleanLine = line.trim();
      const bulletText = cleanLine.slice(2);
      elements.push(
        <ul key={`ul-${i}`} className="list-disc pl-5 my-1.5 text-zinc-300 text-[15px]">
          <li>{parseInline(bulletText)}</li>
        </ul>
      );
      continue;
    }

    // Numbered lists
    const numListMatch = line.trim().match(/^(\d+)\.\s(.*)/);
    if (numListMatch) {
      const numText = numListMatch[2];
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal pl-5 my-1.5 text-zinc-300 text-[15px]" start={parseInt(numListMatch[1], 10)}>
          <li>{parseInline(numText)}</li>
        </ol>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={`p-${i}`} className="text-[15px] leading-relaxed text-zinc-300 my-2">
        {parseInline(line)}
      </p>
    );
  }

  // If code block is open at EOF
  if (inCodeBlock && codeBlockLines.length > 0) {
    elements.push(
      <pre key={`code-eof`} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 my-3 overflow-x-auto text-xs font-mono text-zinc-200 select-text">
        <code>{codeBlockLines.join("\n")}</code>
      </pre>
    );
  }

  return elements;
};
