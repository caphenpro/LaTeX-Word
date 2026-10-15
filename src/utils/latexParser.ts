import {
  ParsedBlock,
  TextSegment,
  TableCell,
  ConversionStats,
  DocSettings,
  ParagraphBlock,
  EquationBlock,
  ListBlock,
  TableBlock,
  CalloutBlock,
  TitleBlock,
  SectionBlock,
  GeometryBlock,
} from '../types';
import { latexToOmml } from './mathUtils';
import { renderTikzToSvg } from './tikzUtils';

/**
 * Strips comments from LaTeX code unless escaped
 */
function stripComments(latex: string): string {
  const lines = latex.split('\n');
  return lines
    .map(line => {
      let inComment = false;
      let cleaned = '';
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '%' && (i === 0 || line[i - 1] !== '\\')) {
          inComment = true;
          break;
        }
        cleaned += char;
      }
      return inComment ? cleaned : line;
    })
    .join('\n');
}

/**
 * Extracts metadata like \title, \author, \date
 */
export function extractMetadata(rawLatex: string): {
  title?: string;
  author?: string;
  date?: string;
  cleanBody: string;
} {
  let latex = stripComments(rawLatex);
  let title: string | undefined;
  let author: string | undefined;
  let date: string | undefined;

  const titleMatch = latex.match(/\\title\s*\{([^}]+)\}/);
  if (titleMatch) title = titleMatch[1].trim();

  const authorMatch = latex.match(/\\author\s*\{([^}]+)\}/);
  if (authorMatch) author = authorMatch[1].trim();

  const dateMatch = latex.match(/\\date\s*\{([^}]+)\}/);
  if (dateMatch) date = dateMatch[1].trim();

  // If document environment exists, take content between \begin{document} and \end{document}
  const docMatch = latex.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
  let cleanBody = docMatch ? docMatch[1] : latex;

  // Remove common preamble commands if remaining
  cleanBody = cleanBody
    .replace(/\\documentclass(\[[^\]]*\])?\{[^}]+\}/g, '')
    .replace(/\\usepackage(\[[^\]]*\])?\{[^}]+\}/g, '')
    .replace(/\\pagestyle\{[^}]+\}/g, '')
    .replace(/\\thispagestyle\{[^}]+\}/g, '')
    .replace(/\\title\{[^}]+\}/g, '')
    .replace(/\\author\{[^}]+\}/g, '')
    .replace(/\\date\{[^}]+\}/g, '');

  return { title, author, date, cleanBody };
}

/**
 * Parses inline string into TextSegments with math and formatting
 */
export function parseInlineSegments(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  if (!text || text.length === 0) return segments;

  const regex = /(\$([^\$]+)\$|\\\(([\s\S]*?)\\\)|\\textbf\{([^}]+)\}|\\textit\{([^}]+)\}|\\emph\{([^}]+)\}|\\underline\{([^}]+)\}|\\texttt\{([^}]+)\}|\\textcolor\{([^}]+)\}\{([^}]+)\}|\\sout\{([^}]+)\})/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Plain text before match
    if (matchStart > lastIndex) {
      const plainText = text.substring(lastIndex, matchStart);
      if (plainText.length > 0) {
        segments.push({ text: cleanEscapedChars(plainText) });
      }
    }

    const fullMatch = match[0];

    if (fullMatch.startsWith('$') || fullMatch.startsWith('\\(')) {
      // Inline Math
      const formula = match[2] ?? match[3] ?? '';
      const { omml, mathml, error } = latexToOmml(formula.trim(), false);
      segments.push({
        text: formula,
        isMath: true,
        isDisplay: false,
        latex: formula.trim(),
        omml,
        mathml,
        error,
      });
    } else if (fullMatch.startsWith('\\textbf')) {
      segments.push({
        text: cleanEscapedChars(match[4] || ''),
        bold: true,
      });
    } else if (fullMatch.startsWith('\\textit') || fullMatch.startsWith('\\emph')) {
      segments.push({
        text: cleanEscapedChars(match[5] || match[6] || ''),
        italic: true,
      });
    } else if (fullMatch.startsWith('\\underline')) {
      segments.push({
        text: cleanEscapedChars(match[7] || ''),
        underline: true,
      });
    } else if (fullMatch.startsWith('\\texttt')) {
      segments.push({
        text: cleanEscapedChars(match[8] || ''),
        code: true,
      });
    } else if (fullMatch.startsWith('\\textcolor')) {
      segments.push({
        text: cleanEscapedChars(match[10] || ''),
        color: match[9] || 'currentColor',
      });
    } else if (fullMatch.startsWith('\\sout')) {
      segments.push({
        text: cleanEscapedChars(match[11] || ''),
        strike: true,
      });
    }

    lastIndex = matchEnd;
  }

  // Trailing text
  if (lastIndex < text.length) {
    const trailing = text.substring(lastIndex);
    if (trailing.length > 0) {
      segments.push({ text: cleanEscapedChars(trailing) });
    }
  }

  return segments;
}

/**
 * Cleans standard LaTeX escape sequences like \% \$ \&
 */
function cleanEscapedChars(str: string): string {
  return str
    .replace(/\\%/g, '%')
    .replace(/\\\$/g, '$')
    .replace(/\\&/g, '&')
    .replace(/\\_/g, '_')
    .replace(/\\#/g, '#')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    .replace(/\\newline\b/g, '\n')
    .replace(/\\\\/g, '\n');
}

/**
 * Main parser that parses full or partial LaTeX into structured document blocks
 */
export function parseLatexDocument(rawLatex: string, settings?: Partial<DocSettings>): {
  blocks: ParsedBlock[];
  stats: ConversionStats;
  docTitle?: string;
  author?: string;
  date?: string;
} {
  const { title, author, date, cleanBody } = extractMetadata(rawLatex);

  const blocks: ParsedBlock[] = [];
  let equationCounter = 0;
  let inlineEquationCount = 0;
  let displayEquationCount = 0;
  let geometryCount = 0;
  let errorCount = 0;

  // Add Title block if \maketitle or title/author/date exists
  const hasMaketitle = /\\maketitle/.test(cleanBody) || (title && title.length > 0);
  const effectiveTitle = title || settings?.docTitle;

  if (hasMaketitle && effectiveTitle) {
    blocks.push({
      id: 'title-block',
      type: 'title',
      title: effectiveTitle,
      author: author || settings?.author,
      date: date || settings?.date,
    } as TitleBlock);
  }

  const bodyText = cleanBody.replace(/\\maketitle/g, '');
  const lines = bodyText.split('\n');
  let i = 0;

  while (i < lines.length) {
    let line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      i++;
      continue;
    }

    // Check TikZ Geometry Diagram: \begin{tikzpicture} or \begin{figure}...\begin{tikzpicture}
    if (line.includes('\\begin{tikzpicture}')) {
      let tikzCode = '';
      let caption: string | undefined;

      while (i < lines.length) {
        const curLine = lines[i];
        const capMatch = curLine.match(/\\caption\s*\{([^}]+)\}/);
        if (capMatch) {
          caption = capMatch[1];
        }
        tikzCode += curLine + '\n';
        if (curLine.includes('\\end{tikzpicture}')) {
          i++;
          break;
        }
        i++;
      }

      // Check if wrapped in \end{figure} on next line
      if (i < lines.length && lines[i].includes('\\end{figure}')) {
        const capMatch = lines[i].match(/\\caption\s*\{([^}]+)\}/);
        if (capMatch) caption = capMatch[1];
        i++;
      }

      geometryCount++;
      const { svg, error, width, height } = renderTikzToSvg(tikzCode);
      if (error) errorCount++;

      blocks.push({
        id: `geom-${blocks.length}`,
        type: 'geometry',
        code: tikzCode.trim(),
        svg,
        width,
        height,
        caption,
        error,
      } as GeometryBlock);
      continue;
    }

    // Check Section / Subsection / Subsubsection
    const sectionMatch = line.match(/^\\(section|subsection|subsubsection)\*?\s*\{([^}]+)\}/);
    if (sectionMatch) {
      const level = sectionMatch[1] as 'section' | 'subsection' | 'subsubsection';
      const text = sectionMatch[2].trim();
      blocks.push({
        id: `sec-${blocks.length}`,
        type: level,
        text,
      } as SectionBlock);
      i++;
      continue;
    }

    // Check Horizontal Rule
    if (/^\\(hrule|hrulefill)\b/.test(line) || /^---+$/.test(line)) {
      blocks.push({
        id: `hr-${blocks.length}`,
        type: 'divider',
      });
      i++;
      continue;
    }

    // Check Display Math environments: \begin{equation}, \begin{align}, \begin{gather}, \begin{multline}
    const mathEnvStart = line.match(/^\\begin\{(equation\*?|align\*?|gather\*?|multline\*?)\}/);
    if (mathEnvStart) {
      const envName = mathEnvStart[1];
      const endTag = `\\end{${envName}}`;
      let mathContent = '';
      let foundEnd = false;

      const sameLineEnd = line.indexOf(endTag);
      if (sameLineEnd !== -1) {
        mathContent = line.substring(mathEnvStart[0].length, sameLineEnd).trim();
        foundEnd = true;
        i++;
      } else {
        mathContent = line.substring(mathEnvStart[0].length) + '\n';
        i++;
        while (i < lines.length) {
          const current = lines[i];
          const endIndex = current.indexOf(endTag);
          if (endIndex !== -1) {
            mathContent += current.substring(0, endIndex);
            foundEnd = true;
            i++;
            break;
          } else {
            mathContent += current + '\n';
            i++;
          }
        }
      }

      equationCounter++;
      displayEquationCount++;

      const isNumbered = !envName.includes('*') && (settings?.equationNumbering !== false);
      const cleanFormula = mathContent.trim();
      const { omml, mathml, error } = latexToOmml(cleanFormula, true);
      if (error) errorCount++;

      blocks.push({
        id: `eq-${blocks.length}`,
        type: 'equation',
        latex: cleanFormula,
        omml,
        mathml,
        equationNumber: isNumbered ? equationCounter : undefined,
        error,
      } as EquationBlock);
      continue;
    }

    // Check $$ ... $$ or \[ ... \]
    if (line.startsWith('$$') || line.startsWith('\\[')) {
      const isDollar = line.startsWith('$$');
      const startTag = isDollar ? '$$' : '\\[';
      const endTag = isDollar ? '$$' : '\\]';

      let mathContent = '';
      if (line.endsWith(endTag) && line.length > (startTag.length + endTag.length)) {
        mathContent = line.substring(startTag.length, line.length - endTag.length).trim();
        i++;
      } else {
        mathContent = line.substring(startTag.length) + '\n';
        i++;
        while (i < lines.length) {
          const current = lines[i];
          const endIdx = current.indexOf(endTag);
          if (endIdx !== -1) {
            mathContent += current.substring(0, endIdx);
            i++;
            break;
          } else {
            mathContent += current + '\n';
            i++;
          }
        }
      }

      equationCounter++;
      displayEquationCount++;
      const cleanFormula = mathContent.trim();
      const { omml, mathml, error } = latexToOmml(cleanFormula, true);
      if (error) errorCount++;

      blocks.push({
        id: `eq-${blocks.length}`,
        type: 'equation',
        latex: cleanFormula,
        omml,
        mathml,
        equationNumber: settings?.equationNumbering ? equationCounter : undefined,
        error,
      } as EquationBlock);
      continue;
    }

    // Check Lists: \begin{enumerate} or \begin{itemize}
    const listMatch = line.match(/^\\begin\{(enumerate|itemize)\}/);
    if (listMatch) {
      const isOrdered = listMatch[1] === 'enumerate';
      const endTag = `\\end{${listMatch[1]}}`;
      const listLines: string[] = [];
      i++;

      while (i < lines.length) {
        if (lines[i].includes(endTag)) {
          i++;
          break;
        }
        listLines.push(lines[i]);
        i++;
      }

      const items: Array<{ id: string; segments: TextSegment[] }> = [];
      const itemBlocks = listLines.join('\n').split(/\\item\s*/).filter(Boolean);

      for (let k = 0; k < itemBlocks.length; k++) {
        const itemText = itemBlocks[k].trim();
        if (itemText) {
          const segments = parseInlineSegments(itemText);
          segments.forEach(s => {
            if (s.isMath) inlineEquationCount++;
            if (s.error) errorCount++;
          });
          items.push({
            id: `item-${k}`,
            segments,
          });
        }
      }

      blocks.push({
        id: `list-${blocks.length}`,
        type: 'list',
        ordered: isOrdered,
        items,
      } as ListBlock);
      continue;
    }

    // Check Tables: \begin{tabular} or \begin{table}
    if (line.includes('\\begin{tabular}') || line.includes('\\begin{table}')) {
      let tableContent = '';
      let caption: string | undefined;
      const endTag = line.includes('\\begin{table}') ? '\\end{table}' : '\\end{tabular}';

      while (i < lines.length) {
        const curLine = lines[i];
        const capMatch = curLine.match(/\\caption\s*\{([^}]+)\}/);
        if (capMatch) {
          caption = capMatch[1];
        }
        tableContent += curLine + '\n';
        if (curLine.includes(endTag)) {
          i++;
          break;
        }
        i++;
      }

      const tabMatch = tableContent.match(/\\begin\{tabular\}\s*\{([^}]+)\}([\s\S]*?)\\end\{tabular\}/);
      if (tabMatch) {
        const innerContent = tabMatch[2];
        const rawRows = innerContent.split('\\\\');
        const rows: TableCell[][] = [];

        rawRows.forEach((rowStr, rIdx) => {
          const cleanRow = rowStr.replace(/\\hline/g, '').trim();
          if (!cleanRow) return;

          const rawCells = cleanRow.split('&');
          const rowCells: TableCell[] = rawCells.map(c => {
            const trimmed = c.trim();
            const segments = parseInlineSegments(trimmed);
            segments.forEach(s => {
              if (s.isMath) inlineEquationCount++;
              if (s.error) errorCount++;
            });
            return {
              segments,
              isHeader: rIdx === 0 && rawRows.length > 1,
            };
          });

          if (rowCells.length > 0) {
            rows.push(rowCells);
          }
        });

        if (rows.length > 0) {
          blocks.push({
            id: `table-${blocks.length}`,
            type: 'table',
            rows,
            caption,
          } as TableBlock);
          continue;
        }
      }
    }

    // Check Theorem / Proof / Definition / Quote environments
    const calloutMatch = line.match(/^\\begin\{(theorem|definition|lemma|example|proof|quote|note)\}/);
    if (calloutMatch) {
      const variant = calloutMatch[1] as 'theorem' | 'definition' | 'lemma' | 'example' | 'proof' | 'quote' | 'note';
      const endTag = `\\end{${variant}}`;
      let content = '';
      i++;

      while (i < lines.length) {
        if (lines[i].includes(endTag)) {
          i++;
          break;
        }
        content += lines[i] + '\n';
        i++;
      }

      const segments = parseInlineSegments(content.trim());
      segments.forEach(s => {
        if (s.isMath) inlineEquationCount++;
        if (s.error) errorCount++;
      });

      blocks.push({
        id: `callout-${blocks.length}`,
        type: 'callout',
        variant,
        title: variant.charAt(0).toUpperCase() + variant.slice(1),
        segments,
      } as CalloutBlock);
      continue;
    }

    // Regular Paragraph
    let paragraphText = line;
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (!nextLine) break;
      if (
        nextLine.startsWith('\\section') ||
        nextLine.startsWith('\\subsection') ||
        nextLine.startsWith('\\subsubsection') ||
        nextLine.startsWith('\\begin{') ||
        nextLine.startsWith('$$') ||
        nextLine.startsWith('\\[') ||
        nextLine.startsWith('\\hrule') ||
        nextLine.startsWith('---')
      ) {
        break;
      }
      paragraphText += ' ' + nextLine;
      i++;
    }

    const segments = parseInlineSegments(paragraphText);
    segments.forEach(s => {
      if (s.isMath) inlineEquationCount++;
      if (s.error) errorCount++;
    });

    blocks.push({
      id: `p-${blocks.length}`,
      type: 'paragraph',
      segments,
    } as ParagraphBlock);
  }

  // Calculate statistics
  const totalEquations = displayEquationCount + inlineEquationCount;
  const wordCount = rawLatex
    .replace(/\\[a-zA-Z]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const stats: ConversionStats = {
    equationCount: totalEquations,
    inlineEquationCount,
    displayEquationCount,
    geometryCount,
    wordCount,
    charCount: rawLatex.length,
    blockCount: blocks.length,
    errorCount,
  };

  return {
    blocks,
    stats,
    docTitle: effectiveTitle,
    author,
    date,
  };
}
