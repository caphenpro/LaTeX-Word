import katex from 'katex';
import { mml2omml } from 'mathml2omml';

/**
 * Converts a LaTeX formula into clean MathML string
 */
export function latexToMathml(latex: string, displayMode = false): { mathml: string; error?: string } {
  try {
    const rawHtml = katex.renderToString(latex, {
      output: 'mathml',
      displayMode,
      throwOnError: false,
      strict: false,
      trust: true,
    });

    const mathMatch = rawHtml.match(/<math[\s\S]*?<\/math>/i);
    if (!mathMatch) {
      return {
        mathml: `<math xmlns="http://www.w3.org/1998/Math/MathML"><mtext>${escapeXml(latex)}</mtext></math>`,
      };
    }

    const cleaned = mathMatch[0].replace(/<annotation[\s\S]*?<\/annotation>/gi, '');
    return { mathml: cleaned };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      mathml: `<math xmlns="http://www.w3.org/1998/Math/MathML"><mtext>${escapeXml(latex)}</mtext></math>`,
      error: errorMessage,
    };
  }
}

/**
 * Converts MathML to Word native OMML (Office Open XML Math)
 */
export function mathmlToOmml(mathml: string): { omml: string; error?: string } {
  try {
    const ommlString = mml2omml(mathml);
    if (!ommlString || ommlString.trim().length === 0) {
      throw new Error('Chuyển đổi OMML rỗng');
    }
    return { omml: ommlString };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const fallbackText = mathml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const fallbackOmml = `<m:oMath xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><m:r><m:t xml:space="preserve">${escapeXml(fallbackText)}</m:t></m:r></m:oMath>`;
    return { omml: fallbackOmml, error: errorMsg };
  }
}

/**
 * Direct conversion pipeline from LaTeX to OMML
 */
export function latexToOmml(latex: string, displayMode = false): {
  omml: string;
  mathml: string;
  error?: string;
} {
  const { mathml, error: mmlError } = latexToMathml(latex, displayMode);
  const { omml, error: ommlError } = mathmlToOmml(mathml);

  return {
    omml,
    mathml,
    error: mmlError || ommlError,
  };
}

/**
 * Helper to escape XML special entities and strip illegal XML control characters
 */
export function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Copies math string to clipboard with rich feedback
 */
export async function copyToClipboard(content: string, type: 'omml' | 'mathml' | 'latex'): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      if (type === 'omml' || type === 'mathml') {
        try {
          const blobText = new Blob([content], { type: 'text/plain' });
          const blobXml = new Blob([content], { type: 'text/html' });
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/plain': blobText,
              'text/html': blobXml,
            }),
          ]);
          return true;
        } catch {
          await navigator.clipboard.writeText(content);
          return true;
        }
      } else {
        await navigator.clipboard.writeText(content);
        return true;
      }
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
