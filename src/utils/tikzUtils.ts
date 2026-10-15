import { convertTikzToSvg } from '@gezhi-io/tikzkit';

export interface TikzRenderResult {
  svg?: string;
  error?: string;
  width?: number;
  height?: number;
}

/**
 * Converts TikZ code snippet into SVG string
 */
export function renderTikzToSvg(tikzCode: string): TikzRenderResult {
  try {
    let cleanCode = tikzCode.trim();
    if (!cleanCode.startsWith('\\begin{tikzpicture}')) {
      cleanCode = `\\begin{tikzpicture}\n${cleanCode}\n\\end{tikzpicture}`;
    }

    const res = convertTikzToSvg(cleanCode);
    if (res && res.svg) {
      let svg = res.svg;
      // Extract width & height or viewBox
      const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
      let width = 400;
      let height = 300;
      if (viewBoxMatch) {
        const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          width = Math.round(parts[2]);
          height = Math.round(parts[3]);
        }
      }

      // Ensure SVG has proper styling and responsive attributes
      if (!svg.includes('style="max-width:')) {
        svg = svg.replace('<svg ', '<svg style="max-width: 100%; height: auto;" ');
      }

      return { svg, width, height };
    }

    return { error: 'Không thể tạo SVG từ mã TikZ' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { error: errorMsg };
  }
}

/**
 * Converts an SVG string into a high-resolution PNG Uint8Array for Word .docx embedding
 */
export async function svgToPngData(svgStr: string, targetWidth = 600, targetHeight = 450): Promise<Uint8Array> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return new Uint8Array(0);
  }

  return new Promise((resolve) => {
    try {
      const img = new Image();
      const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const scale = 2; // 2x for sharp 300dpi printing
          canvas.width = (targetWidth || 500) * scale;
          canvas.height = (targetHeight || 380) * scale;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            // White background so transparency won't turn black in older Word
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }

          URL.revokeObjectURL(url);
          canvas.toBlob((blob) => {
            if (blob) {
              blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
            } else {
              resolve(new Uint8Array(0));
            }
          }, 'image/png');
        } catch {
          URL.revokeObjectURL(url);
          resolve(new Uint8Array(0));
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(new Uint8Array(0));
      };

      img.src = url;
    } catch {
      resolve(new Uint8Array(0));
    }
  });
}
