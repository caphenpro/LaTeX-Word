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
      const viewBoxMatch = svg.match(/viewBox="([^"]+)"/);
      let width = 450;
      let height = 350;
      if (viewBoxMatch) {
        const parts = viewBoxMatch[1].trim().split(/\s+/).map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          width = Math.round(parts[2]);
          height = Math.round(parts[3]);
        }
      }

      // Ensure xmlns is present
      if (!svg.includes('xmlns="http://www.w3.org/2000/svg"')) {
        svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
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
 * Converts an SVG string into a PNG Uint8Array with guaranteed timeout and fallback
 */
export async function svgToPngData(svgStr: string, targetWidth = 600, targetHeight = 450): Promise<Uint8Array> {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !svgStr) {
    return new Uint8Array(0);
  }

  return new Promise((resolve) => {
    let resolved = false;

    // Safety timeout: Never hang more than 1200ms
    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve(new Uint8Array(0));
      }
    }, 1200);

    try {
      // Ensure SVG has clean dimensions for canvas
      let cleanSvg = svgStr;
      if (!cleanSvg.includes('xmlns="http://www.w3.org/2000/svg"')) {
        cleanSvg = cleanSvg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
      }

      const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        if (resolved) return;
        try {
          const canvas = document.createElement('canvas');
          const scale = 2; // High resolution
          const w = Math.min(Math.max(targetWidth || 400, 200), 1200);
          const h = Math.min(Math.max(targetHeight || 300, 150), 900);
          canvas.width = w * scale;
          canvas.height = h * scale;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }

          URL.revokeObjectURL(url);
          canvas.toBlob((blob) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timer);
            if (blob) {
              blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf))).catch(() => resolve(new Uint8Array(0)));
            } else {
              resolve(new Uint8Array(0));
            }
          }, 'image/png');
        } catch {
          if (!resolved) {
            resolved = true;
            clearTimeout(timer);
            URL.revokeObjectURL(url);
            resolve(new Uint8Array(0));
          }
        }
      };

      img.onerror = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timer);
          URL.revokeObjectURL(url);
          resolve(new Uint8Array(0));
        }
      };

      img.src = url;
    } catch {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        resolve(new Uint8Array(0));
      }
    }
  });
}
